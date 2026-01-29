import React, { useState } from 'react';
import './App.css';
import SlackMessageForm from './components/SlackMessageForm';
import AudioTranscriber from './components/AudioTranscriber';

function App() {
  const [transcription, setTranscription] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transcription Service</h1>
      </header>
      <main>
        <AudioTranscriber onTranscription={setTranscription} />
        <SlackMessageForm transcription={transcription} />
      </main>
    </div>
  );
}

export default App;
