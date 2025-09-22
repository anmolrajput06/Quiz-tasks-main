import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const History = () => {
    const { user, logout } = useAuth();
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/quiz/history/${user.id}`);
            const allAttempts = response.data.attempts;

            // Simple pagination
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedAttempts = allAttempts.slice(startIndex, endIndex);

            setAttempts(paginatedAttempts);
            setTotalPages(Math.ceil(allAttempts.length / itemsPerPage));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [currentPage]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="card">
                    <div className="loading">Loading history...</div>
                </div>
            </div>
        );
    }

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
                            <span>{user?.username}</span>
                            <button onClick={logout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="container">
                <div className="card">
                    <h1 style={{ marginBottom: '30px', color: '#333' }}>Quiz History</h1>

                    {error && <div className="error">{error}</div>}

                    {attempts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                            <h3>No quiz attempts found</h3>
                            <p style={{ marginBottom: '30px' }}>Start taking quizzes to see your history here!</p>
                            <Link to="/quiz" className="btn btn-primary">
                                Take Your First Quiz
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Score</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Correct</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Wrong</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Time</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((attempt, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                <td style={{ padding: '12px' }}>{formatDate(attempt.completedAt)}</td>
                                                <td style={{
                                                    padding: '12px',
                                                    fontWeight: 'bold',
                                                    color: getScoreColor(attempt.score)
                                                }}>
                                                    {attempt.score}%
                                                </td>
                                                <td style={{ padding: '12px', color: '#28a745' }}>
                                                    {attempt.correctAnswers}
                                                </td>
                                                <td style={{ padding: '12px', color: '#dc3545' }}>
                                                    {attempt.wrongAnswers}
                                                </td>
                                                <td style={{ padding: '12px' }}>{formatTime(attempt.timeSpent)}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <Link
                                                        to={`/result/${attempt._id}`}
                                                        className="btn btn-primary"
                                                        style={{ padding: '6px 12px', fontSize: '14px' }}
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginTop: '20px'
                                }}>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="btn btn-secondary"
                                        style={{ padding: '8px 16px' }}
                                    >
                                        Previous
                                    </button>

                                    <span style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        color: '#6c757d'
                                    }}>
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-secondary"
                                        style={{ padding: '8px 16px' }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Link to="/dashboard" className="btn btn-primary">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
