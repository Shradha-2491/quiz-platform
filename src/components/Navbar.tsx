import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Close sidebar when clicking outside
    const closeSidebar = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).classList.contains("sidebar-overlay")) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="logo">FlashQuiz</div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/quiz">Start Quiz</Link></li>
                    <li><Link to="/history">History</Link></li>
                </ul>
                <div className="hamburger" onClick={toggleSidebar}>
                    ☰
                </div>
            </nav>


            {isOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}>
                    <div className="sidebar">
                        <button className="close-btn" onClick={toggleSidebar}>✖</button>
                        <ul>
                            <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
                            <li><Link to="/quiz" onClick={toggleSidebar}>Start Quiz</Link></li>
                            <li><Link to="/history" onClick={toggleSidebar}>History</Link></li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
