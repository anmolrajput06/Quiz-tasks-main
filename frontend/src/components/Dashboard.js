import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`/api/quiz/history/${user.id}`);
            setHistory(response.data.attempts.slice(0, 5)); // Show last 5 attempts
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // const handleStartQuiz = async () => {
    //   await startQuiz();
    // };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <header className="header">
                <div className="header-content">
                    <Link to="/dashboard" className="logo">
                        Quiz App
                    </Link>
                    <nav className="nav">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/history" className="nav-link">History</Link>
                        <div className="user-info">
                            <span>Welcome, {user?.username}</span>
                            <button onClick={logout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="container">
                <div className="card">
                    <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
                        Welcome to Quiz App
                    </h1>

                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#6c757d', marginBottom: '30px' }}>
                            Test your knowledge with our interactive quiz platform!
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div className="stat-item">
                                <div className="stat-value">{user?.totalAttempts || 0}</div>
                                <div className="stat-label">Total Attempts</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{user?.bestScore || 0}%</div>
                                <div className="stat-label">Best Score</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{user?.averageScore || 0}%</div>
                                <div className="stat-label">Average Score</div>
                            </div>
                        </div>

                        <Link to="/quiz" className="btn btn-primary" style={{ fontSize: '18px', padding: '15px 30px' }}>
                            Start New Quiz
                        </Link>
                    </div>
                </div>

                {history.length > 0 && (
                    <div className="card">
                        <h2 style={{ marginBottom: '20px', color: '#333' }}>Recent Quiz Attempts</h2>
                        {loading ? (
                            <div className="loading">Loading history...</div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Score</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Correct</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((attempt, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                <td style={{ padding: '12px' }}>{formatDate(attempt.completedAt)}</td>
                                                <td style={{ padding: '12px', fontWeight: 'bold', color: attempt.score >= 70 ? '#28a745' : attempt.score >= 50 ? '#ffc107' : '#dc3545' }}>
                                                    {attempt.score}%
                                                </td>
                                                <td style={{ padding: '12px' }}>{attempt.correctAnswers}/{attempt.totalQuestions}</td>
                                                <td style={{ padding: '12px' }}>{Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Link to="/history" className="btn btn-secondary">
                                View All History
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
