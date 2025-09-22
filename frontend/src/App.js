import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import Navigation from './components/Navigation';
import AdminLayout from './components/AdminLayout';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import QuestionManagement from './components/QuestionManagement';
import Quiz from './components/Quiz';
import Result from './components/Result';
import History from './components/History';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <QuizProvider>
                <Router>
                    <div className="App">
                        <Navigation />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['user']}>
                                            <UserDashboard />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['admin']}>
                                            <AdminLayout>
                                                <AdminDashboard />
                                            </AdminLayout>
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/questions"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['admin']}>
                                            <AdminLayout>
                                                <QuestionManagement />
                                            </AdminLayout>
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/quiz"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['user', 'admin']}>
                                            <Quiz />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/result/:attemptId"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['user', 'admin']}>
                                            <Result />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/history"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['user', 'admin']}>
                                            <History />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </Router>
            </QuizProvider>
        </AuthProvider>
    );
}

export default App;
