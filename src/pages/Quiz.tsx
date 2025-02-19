import React, { useState, useEffect, useRef } from "react";
import { saveQuizAttempt } from "../utils/indexedDB.ts";
import { useNavigate } from "react-router-dom";
import "../styles/Quiz.css";
import { sampleQuestions } from "../data/questions.ts";

const Quiz = () => {
    const feedbackRef = useRef<HTMLParagraphElement | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
    const [natAnswer, setNAtAnswer] = useState<string | number | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizEndTime, setQuizEndTime] = useState<number | null>(null);
    const [quizStartedAt] = useState(Date.now());
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const navigate = useNavigate();

    //  Progress percentage for the progress bar
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

    // Timer countdown effect
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            nextQuestion(); // Auto move to the next question when timer hits 0
        }
    }, [timeLeft]);

    useEffect(() => {
        if (selectedAnswer !== null && feedbackRef.current) {
            feedbackRef.current.focus(); // Set focus for accessibility
            feedbackRef.current.scrollIntoView({ behavior: "smooth", block: "center" }); // Auto-scroll
        }
    }, [selectedAnswer]);

    // Handles MCQ answer selection
    const handleMCQClick = (option: string) => {
        setSelectedAnswer(option);
        if (option === sampleQuestions[currentQuestion].answer) {
            setScore(score + 1);
            setIsAnswerCorrect(true);
        } else {
            setIsAnswerCorrect(false);
        }
    };

    // Handles changes in NAT input field
    const handleNATChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNAtAnswer(event.target.value);
    };

    // Submits the NAT answer and checks correctness
    const submitNATAnswer = () => {
        setSelectedAnswer(natAnswer);
        if (Number(natAnswer) === sampleQuestions[currentQuestion].answer) {
            setScore(score + 1);
            setIsAnswerCorrect(true);
        } else {
            setIsAnswerCorrect(false);
        }
    };

    //  Moves to the next question or finishes the quiz
    const nextQuestion = () => {
        if (currentQuestion + 1 < sampleQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setNAtAnswer(null);
            setIsAnswerCorrect(null);
            setTimeLeft(30); // Reset timer for the next question
        } else {
            finishQuiz();
        }
    };

    // Finishes the quiz and stores attempt history
    const finishQuiz = () => {
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - quizStartedAt) / 1000); // Calculate total time spent
        setQuizEndTime(timeTaken);
        saveQuizAttempt(score, sampleQuestions.length); // Save attempt in IndexedDB
    };

    // Restarts the quiz from the beginning
    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setNAtAnswer(null);
        setScore(0);
        setTimeLeft(30);
        setQuizEndTime(null);
        setIsAnswerCorrect(null);
    };

    // Determines which medal to award based on the score
    const getMedal = () => {
        const percentage = (score / sampleQuestions.length) * 100;
        if (percentage === 100) return "🥇 Gold Medal";
        if (percentage >= 70) return "🥈 Silver Medal";
        if (percentage >= 40) return "🥉 Bronze Medal";
        return "🎭 Keep Practicing!";
    };

    return (
        <div className="quiz-container">
            {/* Display Quiz if Not Completed */}
            {quizEndTime === null ? (
                <div className="quiz-box">

                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>

                    <h2>Question {currentQuestion + 1} / {sampleQuestions.length}</h2>
                    <p className="question-text">{sampleQuestions[currentQuestion].question}</p>

                    {sampleQuestions[currentQuestion].type === "MCQ" ? (
                        <div className="options-container">
                            {sampleQuestions[currentQuestion].options?.map((option) => (
                                <button
                                    key={option}
                                    className={`option-btn  ${selectedAnswer === option
                                        ? option === sampleQuestions[currentQuestion].answer
                                            ? "correct"
                                            : "wrong"
                                        : ""}`}
                                    onClick={() => handleMCQClick(option)}
                                    disabled={!!selectedAnswer}
                                >
                                    {option}
                                </button>
                            ))}

                        </div>
                    ) : (
                        <div className="nat-container">
                            <input
                                type="number"
                                className="nat-input"
                                placeholder="Enter your answer"
                                value={natAnswer ?? ""}
                                onChange={handleNATChange}
                            />
                            <button className="submit-btn" onClick={submitNATAnswer} disabled={natAnswer === null}>
                                Submit
                            </button>

                            {selectedAnswer !== null && (
                                <p
                                    ref={feedbackRef}
                                    tabIndex={-1} // Make it focusable for accessibility
                                    className={`feedback ${isAnswerCorrect ? "correct-text" : "wrong-text"}`}
                                >
                                    {isAnswerCorrect ? "✅ Correct!" : "❌ Incorrect"}
                                </p>
                            )}
                        </div>
                    )}

                    <p className="timer">⏳ {timeLeft}s remaining</p>

                    {selectedAnswer && <button className="next-btn" onClick={nextQuestion}>Next Question</button>}
                </div>
            ) : (
                <div className="scoreboard animate-fade-in">
                    <h2>🎉 Quiz Completed!</h2>
                    <p>✅ Score: <strong>{score} / {sampleQuestions.length}</strong></p>
                    <p>⏳ Time Taken: <strong>{quizEndTime} seconds</strong></p>
                    <h3 className="medal">{getMedal()}</h3>
                    <button className="restart-btn" onClick={restartQuiz}>Restart Quiz</button>
                    <button className="history-btn" onClick={() => navigate("/history")}>View History</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
