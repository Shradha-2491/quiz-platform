import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Navbar from "./components/Navbar.tsx";
import Quiz from "./pages/Quiz.tsx";
import QuizHistory from "./pages/QuizHistory.tsx";

function App() {

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/history" element={<QuizHistory />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

