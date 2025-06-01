import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APISettings from '../components/Sidebar/APISettings';
import ModelSettings from '../components/Sidebar/ModelSettings';
import ToolSettings from '../components/Sidebar/ToolSettings';
import Button from '../components/Common/Button';

function SettingsPage() {
  const [activeSection, setActiveSection] = useState('api');
  const navigate = useNavigate();

  const sections = [
    { id: 'api', label: 'API Configuration', icon: '🔑', component: APISettings },
    { id: 'model', label: 'Model Settings', icon: '🤖', component: ModelSettings },
    { id: 'tools', label: 'Tool Settings', icon: '🛠️', component: ToolSettings }
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || APISettings;

  const goToChat = () => {
    navigate('/');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-left">
          <h1>Settings</h1>
          <p className="page-description">
            Configure your Computer Use Demo preferences and API settings
          </p>
        </div>
        
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={goToChat}
          >
            ← Back to Chat
          </Button>
        </div>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          <div className="nav-title">Settings</div>
          <div className="nav-sections">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </button>
            ))}
          </div>
          
          <div className="nav-footer">
            <div className="app-info">
              <h4>Computer Use Demo</h4>
              <p>Version 1.0.0</p>
              <p>React Frontend for Anthropic Computer Use</p>
            </div>
          </div>
        </nav>

        <main className="settings-main">
          <div className="settings-content">
            <div className="content-header">
              <h2>
                <span className="content-icon">
                  {sections.find(s => s.id === activeSection)?.icon}
                </span>
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
            </div>
            
            <div className="content-body">
              <ActiveComponent />
            </div>
          </div>
        </main>
      </div>

      <div className="settings-footer">
        <div className="footer-content">
          <div className="footer-info">
            <span>Computer Use Demo Settings</span>
            <span>•</span>
            <span>All settings are saved automatically</span>
          </div>
          
          <div className="footer-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                if (window.confirm('Reset all settings to defaults?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Reset All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;