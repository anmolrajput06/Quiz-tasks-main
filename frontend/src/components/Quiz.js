import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import Navigation from './Navigation';

const Quiz = () => {
    const {
        questions,
        currentQuestionIndex,
        answers,
        timeLeft,
        quizStarted,
        quizCompleted,
        loading,
        error,
        startQuiz,
        submitAnswer,
        nextQuestion,
        previousQuestion,
        submitQuiz,
        updateTimer
    } = useQuiz();

    const { user } = useAuth();
    const navigate = useNavigate();
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    useEffect(() => {
        if (!quizStarted && questions.length === 0) {
            startQuiz();
        }
    }, [quizStarted, questions.length, startQuiz]);

    const handleAutoSubmit = async () => {
        const result = await submitQuiz();
        if (result.success) {
            navigate(`/result/${result.attemptId}`);
        }
    };

    useEffect(() => {
        let interval = null;

        if (quizStarted && !quizCompleted && timeLeft > 0) {
            interval = setInterval(() => {
                updateTimer(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
            // Auto-submit when time runs out
            handleAutoSubmit();
        }

        return () => clearInterval(interval);
    }, [timeLeft, quizStarted, quizCompleted, updateTimer, handleAutoSubmit]);

    const handleAnswerSelect = (selectedOption) => {
        submitAnswer(currentQuestionIndex, selectedOption);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            nextQuestion();
        } else {
            setShowConfirmSubmit(true);
        }
    };

    const handlePrevious = () => {
        previousQuestion();
    };

    const handleSubmit = async () => {
        setShowConfirmSubmit(false);
        const result = await submitQuiz();
        if (result.success) {
            navigate(`/result/${result.attemptId}`);
        }
    };

    const handleCancelSubmit = () => {
        setShowConfirmSubmit(false);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="card">
                    <div className="loading">
                        <div>Loading quiz questions...</div>
                    </div>
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

    if (!quizStarted || questions.length === 0) {
        return (
            <div className="container">
                <div className="card">
                    <div className="loading">
                        <div>Preparing quiz...</div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredQuestions = answers.filter(answer => answer !== null).length;

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
                <div className="card">
                    <Timer timeLeft={timeLeft} />

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="question-counter">
                        Question {currentQuestionIndex + 1} of {questions.length}
                        ({answeredQuestions} answered)
                    </div>

                    <QuestionCard
                        question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        selectedAnswer={answers[currentQuestionIndex]}
                        onAnswerSelect={handleAnswerSelect}
                    />

                    <Navigation
                        currentIndex={currentQuestionIndex}
                        totalQuestions={questions.length}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        isLastQuestion={currentQuestionIndex === questions.length - 1}
                    />
                </div>
            </div>

            {showConfirmSubmit && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', margin: '20px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Submit Quiz?</h3>
                        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#6c757d' }}>
                            You have answered {answeredQuestions} out of {questions.length} questions.
                            Are you sure you want to submit your quiz?
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button onClick={handleCancelSubmit} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="btn btn-success">
                                Submit Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
