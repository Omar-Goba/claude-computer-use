import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useChat } from '../../context/ChatContext';
import Toggle from '../Common/Toggle';
import Button from '../Common/Button';

function ToolSettings() {
  const { settings, updateSetting, getToolVersionOptions } = useSettings();
  const { resetChat, newSession } = useChat();

  const toolVersions = getToolVersionOptions();

  const getVersionInfo = (version) => {
    const info = {
      'computer_use_20241022': {
        description: 'Basic computer use capabilities',
        features: ['Screenshot', 'Click', 'Type', 'Key press'],
        date: 'October 22, 2024'
      },
      'computer_use_20250124': {
        description: 'Extended computer use with advanced actions',
        features: ['Screenshot', 'Click', 'Type', 'Key press', 'Scroll', 'Hold key', 'Wait', 'Triple click'],
        date: 'January 24, 2025'
      },
      'computer_use_20250429': {
        description: 'Streamlined edit tool without undo functionality',
        features: ['Screenshot', 'Click', 'Type', 'Key press', 'Scroll', 'Hold key', 'Wait', 'Triple click', 'Streamlined editing'],
        date: 'April 29, 2025'
      }
    };
    
    return info[version] || {
      description: 'Version information not available',
      features: [],
      date: 'Unknown'
    };
  };

  const currentVersionInfo = getVersionInfo(settings.toolVersion);

  const handleVersionChange = (version) => {
    updateSetting('toolVersion', version);
  };

  const handleResetConversation = () => {
    if (window.confirm('Are you sure you want to reset the conversation? This will clear all messages.')) {
      resetChat();
    }
  };

  const handleNewSession = () => {
    if (window.confirm('Start a new session? This will clear the current conversation.')) {
      newSession();
    }
  };

  return (
    <div className="tool-settings">
      <div className="settings-section">
        <h3>Tool Version</h3>
        <p className="section-description">
          Select the computer use tool version with different capabilities
        </p>
        
        <div className="version-selector">
          <select
            value={settings.toolVersion}
            onChange={(e) => handleVersionChange(e.target.value)}
            className="version-dropdown"
          >
            {toolVersions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>

        <div className="version-info">
          <h4>Version Information</h4>
          <p className="version-description">{currentVersionInfo.description}</p>
          <div className="version-details">
            <div className="detail-item">
              <strong>Release Date:</strong> {currentVersionInfo.date}
            </div>
            <div className="detail-item">
              <strong>Features:</strong>
              <ul className="feature-list">
                {currentVersionInfo.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Tool Behavior</h3>
        
        <div className="behavior-setting">
          <label className="setting-label">
            Screenshot Quality
            <span className="setting-description">
              Balance between image quality and token usage
            </span>
          </label>
          <select
            value={settings.screenshotQuality || 'medium'}
            onChange={(e) => updateSetting('screenshotQuality', e.target.value)}
            className="quality-dropdown"
          >
            <option value="low">Low (Faster, fewer tokens)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="high">High (Better quality, more tokens)</option>
          </select>
        </div>

        <Toggle
          label="Auto-hide screenshots"
          description="Automatically hide screenshots after displaying them"
          checked={settings.autoHideScreenshots || false}
          onChange={(value) => updateSetting('autoHideScreenshots', value)}
        />

        <Toggle
          label="Coordinate scaling"
          description="Scale coordinates between display resolution and XGA"
          checked={settings.coordinateScaling || true}
          onChange={(value) => updateSetting('coordinateScaling', value)}
        />

        <Toggle
          label="Bash session persistence"
          description="Maintain bash session state between commands"
          checked={settings.bashPersistence || true}
          onChange={(value) => updateSetting('bashPersistence', value)}
        />
      </div>

      <div className="settings-section">
        <h3>Safety & Warnings</h3>
        
        <Toggle
          label="Show computer use warnings"
          description="Display safety warnings before computer use actions"
          checked={settings.showWarnings || true}
          onChange={(value) => updateSetting('showWarnings', value)}
        />

        <Toggle
          label="Confirm destructive actions"
          description="Ask for confirmation before potentially harmful commands"
          checked={settings.confirmDestructive || true}
          onChange={(value) => updateSetting('confirmDestructive', value)}
        />

        <Toggle
          label="Log tool execution"
          description="Keep detailed logs of tool execution for debugging"
          checked={settings.toolLogging || false}
          onChange={(value) => updateSetting('toolLogging', value)}
        />

        <div className="warning-box">
          <h4>⚠️ Computer Use Safety</h4>
          <p>
            Computer use tools can perform actions on your system. Always review 
            commands before execution and avoid running untrusted code.
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Session Management</h3>
        
        <div className="session-actions">
          <Button
            variant="secondary"
            onClick={handleResetConversation}
          >
            Reset Conversation
          </Button>
          
          <Button
            variant="primary"
            onClick={handleNewSession}
          >
            New Session
          </Button>
        </div>

        <p className="session-info">
          Reset conversation clears all messages but keeps settings. 
          New session starts fresh with a new session ID.
        </p>
      </div>
    </div>
  );
}

export default ToolSettings;