import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Result = () => {
    const { attemptId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchResult = async () => {
        try {
            const response = await axios.get(`/api/quiz/result/${attemptId}`);
            setResult(response.data.attempt);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load result');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResult();
    }, [attemptId]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    };

    const getScoreMessage = (score) => {
        if (score >= 90) return 'Excellent! Outstanding performance!';
        if (score >= 80) return 'Great job! Well done!';
        if (score >= 70) return 'Good work! Keep it up!';
        if (score >= 60) return 'Not bad! Room for improvement.';
        return 'Keep practicing! You can do better!';
    };

    if (loading) {
        return (
            <div className="container">
                <div className="card">
                    <div className="loading">Loading result...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="card">
                    <div className="error">{error}</div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="container">
                <div className="card">
                    <div className="error">Result not found</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="header">
                <div className="header-content">
                    <div className="logo">Quiz App</div>
                    <div className="user-info">
                        <span>{user?.username}</span>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="card result-card">
                    <h1 style={{ marginBottom: '20px', color: '#333' }}>Quiz Results</h1>

                    <div
                        className="result-score"
                        style={{ color: getScoreColor(result.score) }}
                    >
                        {result.score}%
                    </div>

                    <p style={{
                        fontSize: '18px',
                        color: '#6c757d',
                        marginBottom: '30px',
                        fontStyle: 'italic'
                    }}>
                        {getScoreMessage(result.score)}
                    </p>

                    <div className="result-stats">
                        <div className="stat-item">
                            <div className="stat-value">{result.totalQuestions}</div>
                            <div className="stat-label">Total Questions</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#28a745' }}>
                                {result.correctAnswers}
                            </div>
                            <div className="stat-label">Correct Answers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#dc3545' }}>
                                {result.wrongAnswers}
                            </div>
                            <div className="stat-label">Wrong Answers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#667eea' }}>
                                {formatTime(result.timeSpent)}
                            </div>
                            <div className="stat-label">Time Spent</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ marginBottom: '20px', color: '#333' }}>Question Review</h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {result.answers.map((answer, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '15px',
                                        margin: '10px 0',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        backgroundColor: answer.isCorrect ? '#d4edda' : '#f8d7da'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                        Question {index + 1}: {answer.questionId.question}
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <strong>Your Answer:</strong> {answer.questionId.options[answer.selectedOption]}
                                        {answer.isCorrect ? (
                                            <span style={{ color: '#28a745', marginLeft: '10px' }}>✓ Correct</span>
                                        ) : (
                                            <span style={{ color: '#dc3545', marginLeft: '10px' }}>✗ Incorrect</span>
                                        )}
                                    </div>
                                    {!answer.isCorrect && (
                                        <div style={{ color: '#28a745' }}>
                                            <strong>Correct Answer:</strong> {answer.questionId.options[answer.questionId.correctAnswer]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center',
                        marginTop: '40px',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => navigate('/quiz')}
                            className="btn btn-primary"
                        >
                            Take Another Quiz
                        </button>
                        <button
                            onClick={() => navigate('/history')}
                            className="btn btn-secondary"
                        >
                            View History
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-success"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
