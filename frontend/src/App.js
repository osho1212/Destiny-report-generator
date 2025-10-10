import React from 'react';
import './App.css';
import ReportForm from './components/ReportForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Destiny Report Generator</h1>
        <p>Fill in the form below to generate your custom report</p>
      </header>
      <main className="App-main">
        <ReportForm />
      </main>
    </div>
  );
}

export default App;
