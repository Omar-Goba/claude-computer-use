import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SettingsContext = createContext();

const initialState = {
  apiProvider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 8192,
  temperature: 0.1,
  toolVersion: 'computer_use_20250429',
  hideImages: false,
  screenResolution: '1024x768',
  enablePromptCaching: true,
  enableSystemPrompt: true,
  customSystemPrompt: '',
  theme: 'light',
  autoSave: true,
  soundEnabled: false,
  notifications: true
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_SETTING':
      return {
        ...state,
        [action.key]: action.value
      };
    case 'UPDATE_MULTIPLE_SETTINGS':
      return {
        ...state,
        ...action.settings
      };
    case 'RESET_SETTINGS':
      return initialState;
    case 'LOAD_SETTINGS':
      return {
        ...state,
        ...action.settings
      };
    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    const savedSettings = localStorage.getItem('computer-use-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', settings: parsed });
      } catch (error) {
        console.warn('Failed to load settings from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('computer-use-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    dispatch({ type: 'UPDATE_SETTING', key, value });
  };

  const updateMultipleSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_MULTIPLE_SETTINGS', settings: newSettings });
  };

  const resetSettings = () => {
    dispatch({ type: 'RESET_SETTINGS' });
    localStorage.removeItem('computer-use-settings');
  };

  const getModelOptions = () => {
    const modelsByProvider = {
      anthropic: [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229'
      ],
      bedrock: [
        'anthropic.claude-3-5-sonnet-20241022-v2:0',
        'anthropic.claude-3-5-haiku-20241022-v1:0',
        'anthropic.claude-3-opus-20240229-v1:0'
      ],
      vertex: [
        'claude-3-5-sonnet@20241022',
        'claude-3-5-haiku@20241022',
        'claude-3-opus@20240229'
      ]
    };
    return modelsByProvider[settings.apiProvider] || modelsByProvider.anthropic;
  };

  const getToolVersionOptions = () => {
    return [
      'computer_use_20241022',
      'computer_use_20250124', 
      'computer_use_20250429'
    ];
  };

  const value = {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    getModelOptions,
    getToolVersionOptions
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}