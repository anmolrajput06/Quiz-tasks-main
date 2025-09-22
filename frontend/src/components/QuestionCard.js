import React from 'react';

const QuestionCard = ({ question, questionIndex, selectedAnswer, onAnswerSelect }) => {
    if (!question) return null;

    const handleOptionClick = (optionIndex) => {
        onAnswerSelect(optionIndex);
    };

    return (
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{
                marginBottom: '25px',
                color: '#333',
                fontSize: '20px',
                lineHeight: '1.5'
            }}>
                {questionIndex + 1}. {question.question}
            </h3>

            <div style={{ marginBottom: '20px' }}>
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(index)}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '15px',
                            margin: '10px 0',
                            border: selectedAnswer === index ? '2px solid #667eea' : '2px solid #e9ecef',
                            borderRadius: '8px',
                            background: selectedAnswer === index ? '#e3f2fd' : 'white',
                            color: selectedAnswer === index ? '#667eea' : '#333',
                            fontWeight: selectedAnswer === index ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'left',
                            fontSize: '16px'
                        }}
                    >
                        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                            {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                    </button>
                ))}
            </div>

            {question.category && (
                <div style={{
                    fontSize: '14px',
                    color: '#6c757d',
                    marginTop: '15px',
                    padding: '8px 12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    display: 'inline-block'
                }}>
                    Category: {question.category} | Difficulty: {question.difficulty}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
