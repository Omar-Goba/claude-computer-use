import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import Input from '../Common/Input';
import Toggle from '../Common/Toggle';

function ModelSettings() {
  const { settings, updateSetting, getModelOptions } = useSettings();

  const handleModelChange = (model) => {
    updateSetting('model', model);
  };

  const handleSliderChange = (key, value) => {
    updateSetting(key, parseFloat(value));
  };

  const handleTextChange = (key, value) => {
    updateSetting(key, value);
  };

  const modelOptions = getModelOptions();

  const getModelInfo = (modelName) => {
    const info = {
      'claude-3-5-sonnet-20241022': {
        description: 'Most capable model, best for complex tasks',
        contextWindow: '200K tokens',
        capabilities: ['Advanced reasoning', 'Computer use', 'Code generation']
      },
      'claude-3-5-haiku-20241022': {
        description: 'Fastest model, good for simple tasks',
        contextWindow: '200K tokens',
        capabilities: ['Fast responses', 'Basic computer use', 'Text processing']
      },
      'claude-3-opus-20240229': {
        description: 'Most powerful model for complex reasoning',
        contextWindow: '200K tokens',
        capabilities: ['Complex reasoning', 'Research', 'Analysis']
      }
    };
    
    return info[modelName] || {
      description: 'Model information not available',
      contextWindow: 'Unknown',
      capabilities: []
    };
  };

  const currentModelInfo = getModelInfo(settings.model);

  return (
    <div className="model-settings">
      <div className="settings-section">
        <h3>Model Selection</h3>
        <p className="section-description">
          Choose the Claude model for your conversations
        </p>
        
        <div className="model-selector">
          <select
            value={settings.model}
            onChange={(e) => handleModelChange(e.target.value)}
            className="model-dropdown"
          >
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="model-info">
          <h4>Model Information</h4>
          <p className="model-description">{currentModelInfo.description}</p>
          <div className="model-specs">
            <div className="spec-item">
              <strong>Context Window:</strong> {currentModelInfo.contextWindow}
            </div>
            <div className="spec-item">
              <strong>Capabilities:</strong>
              <ul>
                {currentModelInfo.capabilities.map((capability, index) => (
                  <li key={index}>{capability}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Generation Parameters</h3>
        
        <div className="parameter-control">
          <label className="parameter-label">
            Temperature: {settings.temperature}
            <span className="parameter-description">
              Controls randomness (0.0 = deterministic, 1.0 = creative)
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => handleSliderChange('temperature', e.target.value)}
            className="parameter-slider"
          />
          <div className="slider-labels">
            <span>Deterministic</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="parameter-control">
          <label className="parameter-label">
            Max Tokens: {settings.maxTokens}
            <span className="parameter-description">
              Maximum tokens to generate in response
            </span>
          </label>
          <input
            type="range"
            min="1024"
            max="8192"
            step="256"
            value={settings.maxTokens}
            onChange={(e) => handleSliderChange('maxTokens', e.target.value)}
            className="parameter-slider"
          />
          <div className="slider-labels">
            <span>1K</span>
            <span>8K</span>
          </div>
        </div>

        <Input
          label="Custom System Prompt"
          type="textarea"
          value={settings.customSystemPrompt}
          onChange={(value) => handleTextChange('customSystemPrompt', value)}
          placeholder="Enter custom system prompt (optional)"
          rows={4}
          disabled={!settings.enableSystemPrompt}
        />
      </div>

      <div className="settings-section">
        <h3>Response Settings</h3>
        
        <Toggle
          label="Hide images in responses"
          description="Don't display screenshots and images from tool results"
          checked={settings.hideImages}
          onChange={(value) => updateSetting('hideImages', value)}
        />

        <div className="screen-resolution-setting">
          <label className="parameter-label">
            Screen Resolution
            <span className="parameter-description">
              Resolution for screenshots (higher = more detail, more tokens)
            </span>
          </label>
          <select
            value={settings.screenResolution}
            onChange={(e) => updateSetting('screenResolution', e.target.value)}
            className="resolution-dropdown"
          >
            <option value="1024x768">1024x768 (XGA - Recommended)</option>
            <option value="1280x720">1280x720 (HD)</option>
            <option value="1920x1080">1920x1080 (Full HD)</option>
            <option value="2560x1440">2560x1440 (QHD)</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Performance Settings</h3>
        
        <Toggle
          label="Sound notifications"
          description="Play sound when responses complete"
          checked={settings.soundEnabled}
          onChange={(value) => updateSetting('soundEnabled', value)}
        />

        <Toggle
          label="Desktop notifications"
          description="Show browser notifications for completed responses"
          checked={settings.notifications}
          onChange={(value) => updateSetting('notifications', value)}
        />

        <Toggle
          label="Auto-save conversations"
          description="Automatically save conversation history"
          checked={settings.autoSave}
          onChange={(value) => updateSetting('autoSave', value)}
        />
      </div>
    </div>
  );
}

export default ModelSettings;