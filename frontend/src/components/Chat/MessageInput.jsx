import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import Button from '../Common/Button';

function MessageInput() {
  const { sendMessage, isLoading, error, clearError, interruptExecution } = useChat();
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef(null);

  const maxRows = 10;
  const minRows = 1;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24; // Approximate line height in pixels
      const newRows = Math.min(Math.max(Math.ceil(scrollHeight / lineHeight), minRows), maxRows);
      setRows(newRows);
      textareaRef.current.style.height = `${newRows * lineHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage('');
      setRows(1);
      clearError();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const handleInterrupt = () => {
    interruptExecution();
  };

  const insertSamplePrompt = (prompt) => {
    setMessage(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const samplePrompts = [
    "Take a screenshot of my desktop",
    "List the files in the current directory",
    "Help me create a new text file",
    "Show me the system information"
  ];

  return (
    <div className="message-input-container">
      {error && (
        <div className="input-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button
            className="error-dismiss"
            onClick={clearError}
            title="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {message === '' && !isLoading && (
        <div className="sample-prompts-inline">
          <span className="sample-prompts-label">Try:</span>
          {samplePrompts.map((prompt, index) => (
            <button
              key={index}
              className="sample-prompt-button"
              onClick={() => insertSamplePrompt(prompt)}
              title={`Insert: ${prompt}`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Claude is responding..." : "Type your message... (Enter to send, Shift+Enter for new line)"}
            disabled={isLoading}
            rows={rows}
            className="message-textarea"
          />
          
          <div className="input-actions">
            {isLoading ? (
              <Button
                type="button"
                variant="danger"
                onClick={handleInterrupt}
                title="Stop generation"
              >
                ⏹️ Stop
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={!message.trim() || isLoading}
                title="Send message"
              >
                ➤ Send
              </Button>
            )}
          </div>
        </div>

        <div className="input-footer">
          <div className="input-hints">
            <span className="hint">Enter to send • Shift+Enter for new line</span>
            {message.length > 0 && (
              <span className="character-count">
                {message.length} characters
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;