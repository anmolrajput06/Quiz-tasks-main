import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const QuizContext = createContext();

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};

export const QuizProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startQuiz = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/user/quiz');
            setQuestions(response.data.questions);
            const initialAnswers = new Array(response.data.questions.length).fill(null);
            setAnswers(initialAnswers);
            setCurrentQuestionIndex(0);
            setTimeLeft(600);
            setQuizStarted(true);
            setQuizCompleted(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to start quiz');
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = (questionIndex, selectedOption) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = selectedOption;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const submitQuiz = async () => {
        setLoading(true);
        setError(null);

        try {
            const timeSpent = 600 - timeLeft;
            const answersData = questions.map((question, index) => ({
                questionId: question.id,
                selectedOption: answers[index] !== null ? answers[index] : -1
            }));

            const response = await axios.post('/api/user/quiz/submit', {
                answers: answersData,
                timeSpent
            });

            setQuizCompleted(true);
            return { success: true, attemptId: response.data.attemptId };
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit quiz');
            return { success: false, message: error.response?.data?.message || 'Failed to submit quiz' };
        } finally {
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setTimeLeft(600);
        setQuizStarted(false);
        setQuizCompleted(false);
        setError(null);
    };

    const updateTimer = (newTimeLeft) => {
        setTimeLeft(newTimeLeft);
    };

    const value = {
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
        resetQuiz,
        updateTimer
    };

    return (
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    );
};
