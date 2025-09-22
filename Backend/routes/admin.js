const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');

const router = express.Router();

router.use(auth);
router.use(roleAuth(['admin']));

router.get('/dashboard', async (req, res) => {
    try {
        const totalQuestions = await Question.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAttempts = await QuizAttempt.countDocuments();

        const recentAttempts = await QuizAttempt.find()
            .populate('userId', 'username email')
            .sort({ completedAt: -1 })
            .limit(10)
            .lean();

        const averageScore = await QuizAttempt.aggregate([
            { $group: { _id: null, avgScore: { $avg: '$score' } } }
        ]);

        res.json({
            message: 'Admin dashboard data retrieved successfully',
            stats: {
                totalQuestions,
                totalUsers,
                totalAttempts,
                averageScore: averageScore[0]?.avgScore || 0
            },
            recentAttempts
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/questions', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, difficulty, search } = req.query;
        const query = {};

        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;
        if (search) query.question = { $regex: search, $options: 'i' };

        const questions = await Question.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Question.countDocuments(query);

        res.json({
            message: 'Questions retrieved successfully',
            questions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalQuestions: total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/questions', [
    body('question').notEmpty().withMessage('Question is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Exactly 4 options required'),
    body('correctAnswer').isInt({ min: 0, max: 3 }).withMessage('Correct answer must be 0-3'),
    body('category').optional().isString(),
    body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard'])
], async (req, res) => {
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

router.get('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({
            message: 'Question retrieved successfully',
            question
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/questions/:id', [
    body('question').optional().notEmpty(),
    body('options').optional().isArray({ min: 4, max: 4 }),
    body('correctAnswer').optional().isInt({ min: 0, max: 3 }),
    body('category').optional().isString(),
    body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard'])
], async (req, res) => {
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

router.delete('/questions/:id', async (req, res) => {
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

router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await User.countDocuments({ role: 'user' });

        res.json({
            message: 'Users retrieved successfully',
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/attempts', async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;
        const query = {};

        if (userId) query.userId = userId;

        const attempts = await QuizAttempt.find(query)
            .populate('userId', 'username email')
            .sort({ completedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await QuizAttempt.countDocuments(query);

        res.json({
            message: 'Quiz attempts retrieved successfully',
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
