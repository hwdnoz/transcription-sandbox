import React, { useState, useEffect } from 'react';
import '../styles/SlackMessageForm.css';

const SlackMessageForm = ({ transcription }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Update text when transcription is received
  useEffect(() => {
    if (transcription) {
      setText(transcription);
    }
  }, [transcription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/slack-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Message sent to Slack successfully!');
        setText(''); // Clear input on success
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    setError(null); // Clear error when user starts typing
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="slack-form">
        <div className="form-group">
          <label htmlFor="messageInput">Message:</label>
          <textarea
            id="messageInput"
            value={text}
            onChange={handleInputChange}
            placeholder="Enter your message here..."
            rows="6"
            disabled={loading}
            className="message-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="submit-button"
        >
          {loading ? 'Sending...' : 'Send to Slack'}
        </button>
      </form>

      {message && (
        <div className="success-message">
          <span className="icon">✓</span>
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="icon">✕</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default SlackMessageForm;
