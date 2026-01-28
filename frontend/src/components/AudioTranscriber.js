import React, { useState } from 'react';

function AudioTranscriber({ onTranscription }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'audio/mpeg') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid MP3 file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setTranscription('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5002';
      const response = await fetch(`${apiUrl}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setTranscription(data.transcription);
        if (onTranscription) {
          onTranscription(data.transcription);
        }
      } else {
        setError(data.error || 'Transcription failed');
      }
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>MP3 Audio Transcription</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={handleFileChange}
            disabled={loading}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          {file && <p style={{ color: 'green' }}>Selected: {file.name}</p>}
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {transcription && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          <h3>Transcription:</h3>
          <p>{transcription}</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>✓ Transcription loaded into message form below</p>
        </div>
      )}
    </div>
  );
}

export default AudioTranscriber;
