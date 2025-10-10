import React, { useState, useEffect } from 'react';
import './App.css';
import ReportForm from './components/ReportForm';

function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  // Apply dark theme class to body
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className={`App ${darkTheme ? 'dark-theme' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme} type="button">
        {darkTheme ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Destiny Report Generator</h1>
          <p className="hero-subtitle">Fill in the form below to generate your custom report</p>
        </div>
      </div>

      <main className="App-main">
        <ReportForm darkTheme={darkTheme} />
      </main>
    </div>
  );
}

export default App;
