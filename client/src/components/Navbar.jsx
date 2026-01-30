import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🚀 ATS Checker
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/analyzer" className="nav-link">Analyze JD</Link>
          </li>
          <li>
            <Link to="/compare" className="nav-link">Compare</Link>
          </li>
          <li>
            <Link to="/tips" className="nav-link">Tips</Link>
          </li>
          <li>
            <Link to="/templates" className="nav-link">Templates</Link>
          </li>
          <li>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li>
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
