import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';

function MessageList() {
  const { messages, scrollToBottom, handleScrollComplete, isLoading, error } = useChat();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (scrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
      handleScrollComplete();
    }
  }, [scrollToBottom, handleScrollComplete]);

  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      const container = containerRef.current;
      if (container) {
        const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;
        if (isScrolledToBottom) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end'
          });
        }
      }
    }
  }, [messages.length]);

  const scrollToBottomManually = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  return (
    <div className="message-list-container">
      <div 
        ref={containerRef}
        className="message-list"
      >
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3>Welcome to Computer Use Demo</h3>
              <p>Start a conversation with Claude to explore computer use capabilities including screenshots, bash commands, and file editing.</p>
              <div className="sample-prompts">
                <p>Try asking:</p>
                <ul>
                  <li>"Take a screenshot of my desktop"</li>
                  <li>"List the files in the current directory"</li>
                  <li>"Help me edit a text file"</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {isLoading && (
          <div className="loading-indicator">
            <div className="message-bubble assistant">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="loading-text">Claude is thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-content">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length > 3 && (
        <button 
          className="scroll-to-bottom-btn"
          onClick={scrollToBottomManually}
          title="Scroll to bottom"
        >
          ↓
        </button>
      )}
    </div>
  );
}

export default MessageList;