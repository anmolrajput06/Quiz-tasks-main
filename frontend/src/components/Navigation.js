import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Quiz App</Link>
            </div>

            <div className="nav-links">
                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <>
                                <Link
                                    to="/admin/dashboard"
                                    className={isActive('/admin/dashboard') ? 'active' : ''}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/questions"
                                    className={isActive('/admin/questions') ? 'active' : ''}
                                >
                                    Questions
                                </Link>
                                <Link
                                    to="/admin/users"
                                    className={isActive('/admin/users') ? 'active' : ''}
                                >
                                    Users
                                </Link>
                                <Link
                                    to="/admin/attempts"
                                    className={isActive('/admin/attempts') ? 'active' : ''}
                                >
                                    Attempts
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={isActive('/dashboard') ? 'active' : ''}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/quiz"
                                    className={isActive('/quiz') ? 'active' : ''}
                                >
                                    Take Quiz
                                </Link>
                                <Link
                                    to="/history"
                                    className={isActive('/history') ? 'active' : ''}
                                >
                                    History
                                </Link>
                            </>
                        )}
                        <div className="nav-user">
                            <span className="user-info">
                                {user.username} ({user.role})
                            </span>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                            Login
                        </Link>
                        <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;