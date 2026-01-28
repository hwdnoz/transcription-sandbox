import React from 'react';
import './App.css';
import SlackMessageForm from './components/SlackMessageForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Slack Message Submission</h1>
      </header>
      <main>
        <SlackMessageForm />
      </main>
    </div>
  );
}

export default App;
