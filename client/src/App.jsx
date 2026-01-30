import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import ResultsEnhanced from './pages/ResultsEnhanced';
import Tips from './pages/Tips';
import JobAnalyzer from './pages/JobAnalyzer';
import CompareResumes from './pages/CompareResumes';
import Templates from './pages/Templates';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/results-enhanced/:id" element={<ResultsEnhanced />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/analyzer" element={<JobAnalyzer />} />
          <Route path="/compare" element={<CompareResumes />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
