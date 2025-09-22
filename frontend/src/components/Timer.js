import React from 'react';

const Timer = ({ timeLeft }) => {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimerClass = () => {
        if (timeLeft <= 60) return 'timer danger';
        if (timeLeft <= 180) return 'timer warning';
        return 'timer';
    };

    const getProgressPercentage = () => {
        return ((600 - timeLeft) / 600) * 100;
    };

    return (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className={getTimerClass()}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {formatTime(timeLeft)}
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                    Time Remaining
                </div>
            </div>

            <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e9ecef',
                borderRadius: '3px',
                marginTop: '15px',
                overflow: 'hidden'
            }}>
                <div
                    style={{
                        height: '100%',
                        backgroundColor: timeLeft <= 60 ? '#dc3545' : timeLeft <= 180 ? '#ffc107' : '#28a745',
                        width: `${getProgressPercentage()}%`,
                        transition: 'width 1s ease, background-color 0.3s ease'
                    }}
                />
            </div>

            {timeLeft <= 60 && timeLeft > 0 && (
                <div style={{
                    color: '#dc3545',
                    fontSize: '14px',
                    marginTop: '10px',
                    fontWeight: 'bold',
                    animation: 'pulse 1s infinite'
                }}>
                    ⚠️ Less than 1 minute remaining!
                </div>
            )}
        </div>
    );
};

export default Timer;
