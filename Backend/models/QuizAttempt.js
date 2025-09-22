const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        selectedOption: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    totalQuestions: {
        type: Number,
        required: true,
        default: 10
    },
    correctAnswers: {
        type: Number,
        required: true,
        default: 0
    },
    wrongAnswers: {
        type: Number,
        required: true,
        default: 0
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    timeSpent: {
        type: Number,
        required: true,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

quizAttemptSchema.statics.updateUserStats = async function (userId) {
    const attempts = await this.find({ userId });

    const totalAttempts = attempts.length;
    const bestScore = Math.max(...attempts.map(attempt => attempt.score), 0);
    const averageScore = totalAttempts > 0
        ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts)
        : 0;

    await mongoose.model('User').findByIdAndUpdate(userId, {
        totalAttempts,
        bestScore,
        averageScore
    });
};

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);