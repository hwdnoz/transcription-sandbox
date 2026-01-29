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

  // Function to render Slack preview
  const renderSlackPreview = () => {
    if (!text.trim()) return null;

    // Parse the message format: `title` from speaker:\n\n```transcription```
    const parts = text.split('```');

    return (
      <div style={{
        background: '#f8f8f8',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1rem',
        fontFamily: 'Slack-Lato, Lato, appleLogo, sans-serif'
      }}>
        <div style={{ fontSize: '12px', color: '#616061', marginBottom: '8px', fontWeight: 600 }}>
          Preview (as it appears in Slack):
        </div>
        <div style={{
          background: 'white',
          border: '1px solid #e1e1e1',
          borderRadius: '8px',
          padding: '12px 16px'
        }}>
          {parts.map((part, index) => {
            if (index % 2 === 0) {
              // Regular text - look for inline backticks
              return part.split('`').map((segment, i) => {
                if (i % 2 === 0) {
                  return <span key={`${index}-${i}`}>{segment}</span>;
                } else {
                  // Inline code (single backtick)
                  return (
                    <code key={`${index}-${i}`} style={{
                      background: '#f8f8f8',
                      border: '1px solid #e1e1e1',
                      borderRadius: '3px',
                      padding: '2px 4px',
                      fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
                      fontSize: '12px',
                      color: '#e01e5a'
                    }}>
                      {segment}
                    </code>
                  );
                }
              });
            } else {
              // Code block (triple backticks)
              return (
                <pre key={index} style={{
                  background: '#f8f8f8',
                  border: '1px solid #e1e1e1',
                  borderRadius: '4px',
                  padding: '12px',
                  margin: '8px 0 0 0',
                  fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
                  fontSize: '13px',
                  color: '#1d1c1d',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  lineHeight: '1.5'
                }}>
                  {part}
                </pre>
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="form-container">
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '1.5rem',
        borderBottom: '3px solid #FF6B6B',
        paddingBottom: '0.5rem'
      }}>Send to Slack</h2>
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
          {renderSlackPreview()}
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
          <small style={{ display: 'block', marginTop: '8px', color: '#718096', fontSize: '13px' }}>
            Don't have a webhook? <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer" style={{ color: '#4ECDC4', fontWeight: '600', textDecoration: 'none' }}>Get one here</a>
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
