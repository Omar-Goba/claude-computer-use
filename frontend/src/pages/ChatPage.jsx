import React, { useState } from 'react';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import APISettings from '../components/Sidebar/APISettings';
import ModelSettings from '../components/Sidebar/ModelSettings';
import ToolSettings from '../components/Sidebar/ToolSettings';
import Button from '../components/Common/Button';
import { useChat } from '../context/ChatContext';

function ChatPage() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('api');
  const { currentSession, error, isLoading } = useChat();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'api':
        return <APISettings />;
      case 'model':
        return <ModelSettings />;
      case 'tools':
        return <ToolSettings />;
      default:
        return <APISettings />;
    }
  };

  const tabs = [
    { id: 'api', label: 'API', icon: '🔑' },
    { id: 'model', label: 'Model', icon: '🤖' },
    { id: 'tools', label: 'Tools', icon: '🛠️' }
  ];

  return (
    <div className="chat-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Computer Use Demo</h1>
          {currentSession && (
            <span className="session-id">Session: {currentSession.slice(0, 8)}</span>
          )}
        </div>
        
        <div className="header-actions">
          <Button
            variant="secondary"
            size="small"
            onClick={toggleSidebar}
            title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarVisible ? '◀' : '▶'} Settings
          </Button>
        </div>
      </div>

      <div className="chat-layout">
        <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
          <div className="sidebar-header">
            <div className="sidebar-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
            
            <button
              className="sidebar-close"
              onClick={toggleSidebar}
              title="Close sidebar"
            >
              ✕
            </button>
          </div>
          
          <div className={`sidebar-content ${isLoading ? 'loading' : ''}`}>
            {renderActiveTab()}
          </div>
        </div>

        <div className="chat-container">
          {error && (
            <div className="global-error">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <span className="error-message">{error}</span>
              </div>
            </div>
          )}
          
          <div className={`chat-area ${isLoading ? 'loading' : ''}`}>
            <MessageList />
          </div>
          
          <div className="input-area">
            <MessageInput />
          </div>
        </div>
      </div>

      <div className="page-footer">
        <div className="footer-content">
          <span className="footer-text">
            Computer Use Demo - Powered by Claude
          </span>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); }}>
              Safety Guidelines
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); }}>
              About
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;