import React, { useState } from 'react';

function AudioTranscriber({ onTranscription }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');

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
        const rawTranscription = data.transcription;
        setTranscription(rawTranscription);

        // Format with title and speaker if provided
        let formattedText = rawTranscription;
        if (title || speaker) {
          const header = speaker ? `\`${title}\` from ${speaker}:` : `\`${title}\`:`;
          formattedText = `${header}\n\n\`\`\`${rawTranscription}\`\`\``;
        }

        if (onTranscription) {
          onTranscription(formattedText);
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
    <div style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      height: 'fit-content'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '1.5rem',
        borderBottom: '3px solid #4ECDC4',
        paddingBottom: '0.5rem'
      }}>MP3 Audio Transcription</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2d3748',
            fontSize: '0.95rem'
          }}>
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4ECDC4'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2d3748',
            fontSize: '0.95rem'
          }}>
            Speaker:
          </label>
          <input
            type="text"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            placeholder="Enter speaker name"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4ECDC4'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2d3748',
            fontSize: '0.95rem'
          }}>
            Audio File:
          </label>
          <input
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={handleFileChange}
            disabled={loading}
            style={{
              display: 'block',
              marginBottom: '10px',
              width: '100%',
              padding: '10px',
              border: '2px dashed #e2e8f0',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          />
          {file && <p style={{
            color: '#4ECDC4',
            fontWeight: '600',
            fontSize: '14px',
            marginTop: '8px'
          }}>✓ Selected: {file.name}</p>}
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          style={{
            padding: '14px 28px',
            background: loading || !file ? '#cbd5e0' : 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '700',
            boxShadow: loading || !file ? 'none' : '0 4px 15px rgba(255, 107, 107, 0.3)',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseOver={(e) => {
            if (!loading && file) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = loading || !file ? 'none' : '0 4px 15px rgba(255, 107, 107, 0.3)';
          }}
        >
          {loading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>
      </form>

      {error && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#FED7D7',
          color: '#C53030',
          borderRadius: '12px',
          borderLeft: '4px solid #FC8181',
          fontWeight: '500'
        }}>
          ✕ {error}
        </div>
      )}

      {transcription && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: '#C6F6D5',
          borderRadius: '12px',
          borderLeft: '4px solid #4ECDC4'
        }}>
          <h3 style={{
            color: '#22543D',
            fontSize: '1.2rem',
            marginBottom: '0.75rem',
            fontWeight: '700'
          }}>Transcription:</h3>
          <p style={{
            color: '#2D3748',
            lineHeight: '1.6',
            fontSize: '0.95rem'
          }}>{transcription}</p>
          <p style={{
            fontSize: '13px',
            marginTop: '1rem',
            color: '#38A169',
            fontWeight: '600'
          }}>✓ Transcription loaded into message form</p>
        </div>
      )}
    </div>
  );
}

export default AudioTranscriber;
