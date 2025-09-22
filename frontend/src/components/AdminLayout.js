import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', description: 'Overview & Statistics' },
        { path: '/admin/questions', icon: '❓', label: 'Questions', description: 'Manage Quiz Questions' },
        { path: '/admin/users', icon: '👥', label: 'Users', description: 'User Management' },
        { path: '/admin/attempts', icon: '📈', label: 'Attempts', description: 'Quiz Attempts & Results' },
    ];

    return (
        <div className="admin-layout">
            <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">🎯</span>
                        <span className="logo-text">Quiz Admin</span>
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ✕
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <div className="nav-content">
                                <span className="nav-label">{item.label}</span>
                                <span className="nav-description">{item.description}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            <span>{user?.username?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.username}</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </div>

            <div className="admin-main">
                <header className="admin-header">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>
                    <div className="header-title">
                        <h1>Admin Panel</h1>
                        <p>Manage your quiz application</p>
                    </div>
                    <div className="header-actions">
                        <div className="notification-bell">
                            🔔
                            <span className="notification-badge">3</span>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    {children}
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
