import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import ScreenshotViewer from '../Tool/ScreenshotViewer';
import BashOutput from '../Tool/BashOutput';
import FileEditor from '../Tool/FileEditor';

function MessageBubble({ message }) {
  const { settings } = useSettings();
  const [toolResultsVisible, setToolResultsVisible] = useState(true);
  const [thinkingVisible, setThinkingVisible] = useState(false);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const renderToolResult = (toolResult, index) => {
    const key = `${message.id}-tool-${index}`;
    
    switch (toolResult.type) {
      case 'computer':
        return (
          <ScreenshotViewer
            key={key}
            result={toolResult.result}
            action={toolResult.action}
            hidden={settings.hideImages}
          />
        );
      case 'bash':
        return (
          <BashOutput
            key={key}
            command={toolResult.command}
            result={toolResult.result}
          />
        );
      case 'edit':
        return (
          <FileEditor
            key={key}
            result={toolResult.result}
            operation={toolResult.operation}
          />
        );
      default:
        return (
          <div key={key} className="tool-result unknown">
            <div className="tool-header">
              <span className="tool-type">Unknown Tool: {toolResult.type}</span>
            </div>
            <pre>{JSON.stringify(toolResult, null, 2)}</pre>
          </div>
        );
    }
  };

  return (
    <div className={`message-bubble ${message.type}`}>
      <div className="message-header">
        <span className="message-sender">
          {message.type === 'user' ? 'You' : 'Claude'}
        </span>
        <span className="message-timestamp">
          {formatTimestamp(message.timestamp)}
        </span>
        {message.content && (
          <button
            className="copy-button"
            onClick={() => copyToClipboard(message.content)}
            title="Copy message"
          >
            📋
          </button>
        )}
      </div>

      {message.content && (
        <div className="message-content">
          <div className="message-text">
            {message.content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {message.toolResults && message.toolResults.length > 0 && (
        <div className="tool-results-section">
          <div className="tool-results-header">
            <span className="tool-results-title">
              Tool Results ({message.toolResults.length})
            </span>
            <button
              className="toggle-tool-results"
              onClick={() => setToolResultsVisible(!toolResultsVisible)}
              title={toolResultsVisible ? 'Hide tool results' : 'Show tool results'}
            >
              {toolResultsVisible ? '▼' : '▶'}
            </button>
          </div>
          
          {toolResultsVisible && (
            <div className="tool-results">
              {message.toolResults.map((toolResult, index) => 
                renderToolResult(toolResult, index)
              )}
            </div>
          )}
        </div>
      )}

      {message.type === 'assistant' && message.thinking && (
        <div className="thinking-section">
          <div className="thinking-header">
            <span className="thinking-title">Claude's Thinking</span>
            <button
              className="toggle-thinking"
              onClick={() => setThinkingVisible(!thinkingVisible)}
              title={thinkingVisible ? 'Hide thinking' : 'Show thinking'}
            >
              {thinkingVisible ? '▼' : '▶'}
            </button>
          </div>
          
          {thinkingVisible && (
            <div className="thinking-content">
              <pre>{message.thinking}</pre>
            </div>
          )}
        </div>
      )}

      {message.error && (
        <div className="message-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{message.error}</span>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;