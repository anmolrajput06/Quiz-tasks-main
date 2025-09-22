const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (options) {
                return options.length === 4;
            },
            message: 'Question must have exactly 4 options'
        }
    },
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

questionSchema.statics.getRandomQuestions = async function (count = 10) {
    return this.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: count } }
    ]);
};

module.exports = mongoose.model('Question', questionSchema);