import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        category: 'General',
        difficulty: 'Medium'
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('/api/admin/questions');
            setQuestions(response.data.questions);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingQuestion) {
                await axios.put(`/api/admin/questions/${editingQuestion._id}`, formData);
            } else {
                await axios.post('/api/admin/questions', formData);
            }
            setShowForm(false);
            setEditingQuestion(null);
            setFormData({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                category: 'General',
                difficulty: 'Medium'
            });
            fetchQuestions();
        } catch (error) {
            console.error('Failed to save question:', error);
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setFormData({
            question: question.question,
            options: [...question.options],
            correctAnswer: question.correctAnswer,
            category: question.category,
            difficulty: question.difficulty
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await axios.delete(`/api/admin/questions/${id}`);
                fetchQuestions();
            } catch (error) {
                console.error('Failed to delete question:', error);
            }
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || question.category === filterCategory;
        const matchesDifficulty = !filterDifficulty || question.difficulty === filterDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading questions...</p>
            </div>
        );
    }

    return (
        <div className="question-management">
            <div className="page-header">
                <div className="header-content">
                    <h1>Question Management</h1>
                    <p>Create, edit, and manage quiz questions</p>
                </div>
                <button
                    className="btn btn-primary btn-large"
                    onClick={() => setShowForm(true)}
                >
                    <span>➕</span>
                    Add New Question
                </button>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-controls">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="General">General</option>
                        <option value="Science">Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Geography">Geography</option>
                        <option value="History">History</option>
                        <option value="Technology">Technology</option>
                    </select>
                    <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
            </div>

            {showForm && (
                <div className="question-form">
                    <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Question:</label>
                            <textarea
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                required
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Options:</label>
                            {formData.options.map((option, index) => (
                                <div key={index} className="option-input">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={formData.correctAnswer === index}
                                        onChange={() => setFormData({ ...formData, correctAnswer: index })}
                                    />
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category:</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Difficulty:</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingQuestion ? 'Update Question' : 'Add Question'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingQuestion(null);
                                    setFormData({
                                        question: '',
                                        options: ['', '', '', ''],
                                        correctAnswer: 0,
                                        category: 'General',
                                        difficulty: 'Medium'
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="questions-grid">
                {filteredQuestions.map((question) => (
                    <div key={question._id} className="question-card">
                        <div className="question-header">
                            <div className="question-content">
                                <h4>{question.question}</h4>
                                <div className="question-meta">
                                    <span className={`category ${question.category.toLowerCase()}`}>
                                        {question.category}
                                    </span>
                                    <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                                        {question.difficulty}
                                    </span>
                                </div>
                            </div>
                            <div className="question-actions">
                                <button
                                    className="action-btn edit"
                                    onClick={() => handleEdit(question)}
                                    title="Edit Question"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDelete(question._id)}
                                    title="Delete Question"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <div className="question-options">
                            {question.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`option ${index === question.correctAnswer ? 'correct' : ''}`}
                                >
                                    <span className="option-number">{index + 1}.</span>
                                    <span className="option-text">{option}</span>
                                    {index === question.correctAnswer && <span className="correct-badge">✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredQuestions.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">❓</div>
                    <h3>No questions found</h3>
                    <p>Try adjusting your search or filters, or create a new question.</p>
                </div>
            )}
        </div>
    );
};

export default QuestionManagement;
