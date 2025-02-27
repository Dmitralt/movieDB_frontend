import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import "./styles/global.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </div>

        { }
        <footer className="footer">
          Ukrainian Movie Catalog © 2025 <br />
          <div className="footer-links">
            <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

