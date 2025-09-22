const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const questions = await Question.getRandomQuestions(10);

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions available' });
        }

        const formattedQuestions = questions.map(question => ({
            id: question._id,
            question: question.question,
            options: question.options,
            category: question.category,
            difficulty: question.difficulty
        }));

        res.json({
            message: 'Questions retrieved successfully',
            questions: formattedQuestions
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/submit', auth, [
    body('answers').isArray({ min: 1 }).withMessage('Answers array is required'),
    body('timeSpent').isNumeric().withMessage('Time spent must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { answers, timeSpent } = req.body;
    const userId = req.user._id;

    try {
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'Invalid answers format' });
        }

        const validAnswers = answers.filter(answer => answer.selectedOption !== -1);

        if (validAnswers.length === 0) {
            return res.status(400).json({ message: 'No answers provided' });
        }

        const questionIds = validAnswers.map(answer => answer.questionId);
        const questions = await Question.find({
            _id: { $in: questionIds },
            isActive: true
        });

        if (questions.length !== validAnswers.length) {
            return res.status(400).json({ message: 'Invalid question IDs' });
        }

        let correctAnswers = 0;
        let wrongAnswers = 0;
        const processedAnswers = [];

        for (const answer of validAnswers) {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            const isCorrect = question.correctAnswer === answer.selectedOption;

            if (isCorrect) {
                correctAnswers++;
            } else {
                wrongAnswers++;
            }

            processedAnswers.push({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect
            });
        }

        const totalQuestions = validAnswers.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);

        const quizAttempt = new QuizAttempt({
            userId,
            answers: processedAnswers,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            score,
            timeSpent: timeSpent || 0
        });

        await quizAttempt.save();
        await QuizAttempt.updateUserStats(userId);

        res.json({
            message: 'Quiz submitted successfully',
            attemptId: quizAttempt._id,
            result: {
                totalQuestions,
                correctAnswers,
                wrongAnswers,
                score,
                timeSpent
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/result/:attemptId', auth, async (req, res) => {
    try {
        const attempt = await QuizAttempt.findById(req.params.attemptId)
            .populate('answers.questionId', 'question options correctAnswer')
            .lean();

        if (!attempt) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }

        if (attempt.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({
            message: 'Quiz result retrieved successfully',
            attempt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/history/:userId', auth, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const attempts = await QuizAttempt.find({ userId: req.params.userId })
            .sort({ completedAt: -1 })
            .select('-answers')
            .lean();

        res.json({
            message: 'Quiz history retrieved successfully',
            attempts
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/question', auth, [
    body('question').notEmpty().withMessage('Question is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Exactly 4 options required'),
    body('correctAnswer').isInt({ min: 0, max: 3 }).withMessage('Correct answer must be 0-3'),
    body('category').optional().isString(),
    body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard'])
], async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const question = new Question(req.body);
        await question.save();

        res.status(201).json({
            message: 'Question created successfully',
            question
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/question/:id', auth, [
    body('question').optional().notEmpty(),
    body('options').optional().isArray({ min: 4, max: 4 }),
    body('correctAnswer').optional().isInt({ min: 0, max: 3 }),
    body('category').optional().isString(),
    body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard'])
], async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({
            message: 'Question updated successfully',
            question
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/question/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;