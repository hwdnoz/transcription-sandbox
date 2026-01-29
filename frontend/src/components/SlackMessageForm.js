import React, { useState, useEffect } from 'react';
import '../styles/SlackMessageForm.css';

const SlackMessageForm = ({ transcription }) => {
  const [text, setText] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
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

    if (!webhookUrl.trim()) {
      setError('Please enter a Slack webhook URL');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5002';
      const response = await fetch(`${apiUrl}/api/slack-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, webhook_url: webhookUrl }),
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
      setError('Failed to connect to server. Make sure the backend is running.');
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

        <div className="form-group">
          <label htmlFor="webhookInput">Slack Webhook URL:</label>
          <input
            id="webhookInput"
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            disabled={loading}
            className="message-input"
            style={{ fontFamily: 'monospace', fontSize: '13px' }}
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Don't have a webhook? <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer">Get one here</a>
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || !text.trim() || !webhookUrl.trim()}
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
