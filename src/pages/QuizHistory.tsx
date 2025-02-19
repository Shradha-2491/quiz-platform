import React, { useState, useEffect } from "react";
import { getQuizHistory } from "../utils/indexedDB.ts";
import "../styles/QuizHistory.css";

const QuizHistory = () => {
    const [history, setHistory] = useState<{ score: number; totalQuestions: number; timestamp: string }[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getQuizHistory();
            setHistory(data.reverse());
            console.log(data)
        };
        fetchHistory();
    }, []);

    return (
        <div className="history-container">
            <h2>📜 Quiz History</h2>
            {history.length === 0 ? (
                <p>No past attempts yet. Take a quiz!</p>
            ) : (
                <ul className="history-list">
                    {history.map((attempt, index) => (
                        <li key={index} className="history-item">
                            <span>📅 {attempt.timestamp}</span>
                            <span>✅ Score: {attempt.score} / {attempt.totalQuestions}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QuizHistory;
