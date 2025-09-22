import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/admin/dashboard');
            setStats(response.data.stats);
            setRecentAttempts(response.data.recentAttempts);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {user.username}! 👋</h1>
                    <p>Here's what's happening with your quiz application today.</p>
                </div>
                <div className="quick-actions">
                    <button className="quick-action-btn">
                        <span>📊</span>
                        View Reports
                    </button>
                    <button className="quick-action-btn">
                        <span>➕</span>
                        Add Question
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">❓</div>
                    <div className="stat-content">
                        <h3>Total Questions</h3>
                        <p className="stat-number">{stats?.totalQuestions || 0}</p>
                        <span className="stat-change positive">+12% from last month</span>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats?.totalUsers || 0}</p>
                        <span className="stat-change positive">+8% from last month</span>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>Total Attempts</h3>
                        <p className="stat-number">{stats?.totalAttempts || 0}</p>
                        <span className="stat-change positive">+15% from last month</span>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <h3>Average Score</h3>
                        <p className="stat-number">{Math.round(stats?.averageScore || 0)}%</p>
                        <span className="stat-change positive">+3% from last month</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-attempts">
                    <div className="section-header">
                        <h2>Recent Quiz Attempts</h2>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="attempts-table">
                        <div className="table-header">
                            <span>User</span>
                            <span>Score</span>
                            <span>Correct</span>
                            <span>Time</span>
                            <span>Date</span>
                        </div>
                        {recentAttempts.map((attempt, index) => (
                            <div key={index} className="table-row">
                                <div className="user-cell">
                                    <div className="user-avatar-small">
                                        {attempt.userId?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{attempt.userId?.username}</span>
                                </div>
                                <div className={`score-cell ${attempt.score >= 80 ? 'excellent' : attempt.score >= 60 ? 'good' : 'poor'}`}>
                                    {attempt.score}%
                                </div>
                                <div className="correct-cell">
                                    {attempt.correctAnswers}/{attempt.totalQuestions}
                                </div>
                                <div className="time-cell">
                                    {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                                </div>
                                <div className="date-cell">
                                    {new Date(attempt.completedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-stats">
                    <div className="quick-stat-card">
                        <h3>Top Performers</h3>
                        <div className="top-performers">
                            <div className="performer">
                                <span className="rank">1</span>
                                <span className="name">John Doe</span>
                                <span className="score">95%</span>
                            </div>
                            <div className="performer">
                                <span className="rank">2</span>
                                <span className="name">Jane Smith</span>
                                <span className="score">92%</span>
                            </div>
                            <div className="performer">
                                <span className="rank">3</span>
                                <span className="name">Mike Johnson</span>
                                <span className="score">88%</span>
                            </div>
                        </div>
                    </div>

                    <div className="quick-stat-card">
                        <h3>System Status</h3>
                        <div className="status-items">
                            <div className="status-item">
                                <span className="status-indicator online"></span>
                                <span>Database</span>
                                <span className="status-text">Online</span>
                            </div>
                            <div className="status-item">
                                <span className="status-indicator online"></span>
                                <span>API Server</span>
                                <span className="status-text">Online</span>
                            </div>
                            <div className="status-item">
                                <span className="status-indicator online"></span>
                                <span>Frontend</span>
                                <span className="status-text">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
