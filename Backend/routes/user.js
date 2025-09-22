const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');

const router = express.Router();

router.use(auth);
router.use(roleAuth(['user', 'admin']));

router.get('/dashboard', async (req, res) => {
    try {
        const userStats = {
            totalAttempts: req.user.totalAttempts,
            bestScore: req.user.bestScore,
            averageScore: req.user.averageScore
        };

        const recentAttempts = await QuizAttempt.find({ userId: req.user._id })
            .sort({ completedAt: -1 })
            .limit(5)
            .select('-answers')
            .lean();

        res.json({
            message: 'User dashboard data retrieved successfully',
            stats: userStats,
            recentAttempts
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/quiz', async (req, res) => {
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

router.post('/quiz/submit', [
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

router.get('/quiz/result/:attemptId', async (req, res) => {
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

router.get('/quiz/history', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const attempts = await QuizAttempt.find({ userId: req.user._id })
            .sort({ completedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-answers')
            .lean();

        const total = await QuizAttempt.countDocuments({ userId: req.user._id });

        res.json({
            message: 'Quiz history retrieved successfully',
            attempts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalAttempts: total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
