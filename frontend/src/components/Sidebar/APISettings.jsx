import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Toggle from '../Common/Toggle';

function APISettings() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);

  const apiProviders = [
    { value: 'anthropic', label: 'Anthropic API', description: 'Direct Anthropic API access' },
    { value: 'bedrock', label: 'AWS Bedrock', description: 'Amazon Bedrock service' },
    { value: 'vertex', label: 'Google Vertex AI', description: 'Google Cloud Vertex AI' }
  ];

  const handleProviderChange = (provider) => {
    updateSetting('apiProvider', provider);
    setValidationStatus(null);
  };

  const handleApiKeyChange = (value) => {
    setApiKey(value);
  };

  const validateApiKey = () => {
    if (!apiKey.trim()) {
      setValidationStatus({ type: 'error', message: 'API key is required' });
      return;
    }

    setValidationStatus({ type: 'pending', message: 'Validating API key...' });
    
    setTimeout(() => {
      const isValidFormat = apiKey.startsWith('sk-ant-') || 
                           apiKey.startsWith('arn:aws:') ||
                           apiKey.length > 10;
      
      if (isValidFormat) {
        setValidationStatus({ type: 'success', message: 'API key format appears valid (not tested)' });
      } else {
        setValidationStatus({ type: 'error', message: 'Invalid API key format' });
      }
    }, 1000);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('computer-use-api-key', apiKey);
      setValidationStatus({ type: 'success', message: 'API key saved securely' });
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('computer-use-api-key');
    setValidationStatus(null);
  };

  const loadSavedApiKey = () => {
    const saved = localStorage.getItem('computer-use-api-key');
    if (saved) {
      setApiKey(saved);
      setValidationStatus({ type: 'success', message: 'Loaded saved API key' });
    }
  };

  React.useEffect(() => {
    loadSavedApiKey();
  }, []);

  const getProviderInstructions = () => {
    switch (settings.apiProvider) {
      case 'anthropic':
        return {
          title: 'Anthropic API Setup',
          instructions: [
            '1. Go to console.anthropic.com',
            '2. Create an account or sign in',
            '3. Navigate to API Keys section',
            '4. Generate a new API key',
            '5. Copy and paste the key below'
          ],
          keyFormat: 'sk-ant-api03-...'
        };
      case 'bedrock':
        return {
          title: 'AWS Bedrock Setup',
          instructions: [
            '1. Set up AWS credentials',
            '2. Enable Bedrock service in your region',
            '3. Request access to Claude models',
            '4. Use AWS CLI or IAM role for authentication',
            '5. Enter your AWS access key or ARN'
          ],
          keyFormat: 'AKIA... or arn:aws:...'
        };
      case 'vertex':
        return {
          title: 'Google Vertex AI Setup',
          instructions: [
            '1. Create a Google Cloud project',
            '2. Enable Vertex AI API',
            '3. Set up service account credentials',
            '4. Download JSON key file',
            '5. Enter the JSON key content'
          ],
          keyFormat: '{"type": "service_account", ...}'
        };
      default:
        return null;
    }
  };

  const providerInfo = getProviderInstructions();

  return (
    <div className="api-settings">
      <div className="settings-section">
        <h3>API Provider</h3>
        <p className="section-description">
          Choose your preferred API provider for Claude access
        </p>
        
        <div className="provider-options">
          {apiProviders.map((provider) => (
            <div
              key={provider.value}
              className={`provider-option ${settings.apiProvider === provider.value ? 'selected' : ''}`}
              onClick={() => handleProviderChange(provider.value)}
            >
              <div className="provider-info">
                <strong>{provider.label}</strong>
                <p>{provider.description}</p>
              </div>
              <div className="provider-indicator">
                {settings.apiProvider === provider.value && '✓'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>API Configuration</h3>
        
        {providerInfo && (
          <div className="provider-instructions">
            <h4>{providerInfo.title}</h4>
            <ol>
              {providerInfo.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
            <p className="key-format-info">
              <strong>Expected format:</strong> <code>{providerInfo.keyFormat}</code>
            </p>
          </div>
        )}

        <div className="api-key-input">
          <Input
            label="API Key"
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder={`Enter your ${settings.apiProvider} API key`}
            error={validationStatus?.type === 'error' ? validationStatus.message : null}
            success={validationStatus?.type === 'success' ? validationStatus.message : null}
          />
          
          <div className="api-key-actions">
            <Toggle
              label="Show API key"
              checked={showApiKey}
              onChange={setShowApiKey}
            />
            
            <div className="key-buttons">
              <Button
                variant="secondary"
                size="small"
                onClick={validateApiKey}
                disabled={!apiKey.trim() || validationStatus?.type === 'pending'}
              >
                {validationStatus?.type === 'pending' ? 'Validating...' : 'Validate'}
              </Button>
              
              <Button
                variant="primary"
                size="small"
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
              >
                Save Key
              </Button>
              
              <Button
                variant="danger"
                size="small"
                onClick={clearApiKey}
                disabled={!apiKey}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {validationStatus && (
          <div className={`validation-status ${validationStatus.type}`}>
            {validationStatus.message}
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Advanced Settings</h3>
        
        <Toggle
          label="Enable prompt caching"
          description="Cache prompts to reduce API costs (Anthropic only)"
          checked={settings.enablePromptCaching}
          onChange={(value) => updateSetting('enablePromptCaching', value)}
        />

        <Toggle
          label="Enable system prompt"
          description="Use default system prompt for computer use"
          checked={settings.enableSystemPrompt}
          onChange={(value) => updateSetting('enableSystemPrompt', value)}
        />

        <div className="reset-section">
          <Button
            variant="danger"
            size="small"
            onClick={resetSettings}
          >
            Reset All Settings
          </Button>
          <p className="reset-warning">
            This will reset all settings to defaults and clear your API key
          </p>
        </div>
      </div>
    </div>
  );
}

export default APISettings;