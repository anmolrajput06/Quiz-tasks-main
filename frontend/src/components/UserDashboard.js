import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import axios from 'axios';

const UserDashboard = () => {
    const { user } = useAuth();
    const { startQuiz } = useQuiz();
    const [stats, setStats] = useState(null);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/user/dashboard');
            setStats(response.data.stats);
            setRecentAttempts(response.data.recentAttempts);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = async () => {
        try {
            await startQuiz();
        } catch (error) {
            console.error('Failed to start quiz:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="user-dashboard">
            <h2>Welcome, {user.username}!</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Attempts</h3>
                    <p className="stat-number">{stats?.totalAttempts || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Best Score</h3>
                    <p className="stat-number">{stats?.bestScore || 0}%</p>
                </div>
                <div className="stat-card">
                    <h3>Average Score</h3>
                    <p className="stat-number">{stats?.averageScore || 0}%</p>
                </div>
            </div>

            <div className="quiz-actions">
                <button
                    className="btn btn-primary btn-large"
                    onClick={handleStartQuiz}
                >
                    Start New Quiz
                </button>
            </div>

            <div className="recent-attempts">
                <h3>Recent Quiz Attempts</h3>
                <div className="attempts-list">
                    {recentAttempts.map((attempt, index) => (
                        <div key={index} className="attempt-item">
                            <div className="attempt-info">
                                <span className="score">{attempt.score}%</span>
                                <span className="date">{new Date(attempt.completedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="attempt-details">
                                <span>{attempt.correctAnswers}/{attempt.totalQuestions} correct</span>
                                <span>Time: {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
