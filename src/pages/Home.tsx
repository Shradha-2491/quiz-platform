import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import HeroImage from "../assets/quiz-image.jpg";

const Home = () => {
    return (
        <>
            <div className="home-container">
                <div className="home-content">
                    <h1>Challenge Yourself with <span className="highlight">FlashQuiz</span>!</h1>
                    <p>Test your knowledge, get instant feedback, and track your progress with fun and engaging quizzes.</p>
                    <Link to="/quiz" className="start-button">Start Quiz</Link>
                </div>

                <div className="home-image">
                    <img src={HeroImage} alt="Quiz Illustration" />
                </div>
            </div>
        </>
    );
};

export default Home;
