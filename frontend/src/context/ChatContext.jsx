import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Configuration constants
const MAX_MESSAGES_PER_SESSION = 50;
const MAX_MESSAGE_AGE_DAYS = 7;
const MAX_TOOL_RESULTS_PER_MESSAGE = 5;
const MAX_BASE64_IMAGE_SIZE = 500 * 1024; // 500 KB

// Utility function to prune messages
const pruneMessages = (messages) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - MAX_MESSAGE_AGE_DAYS);

  return messages
    .filter(msg => new Date(msg.timestamp) >= sevenDaysAgo)
    .slice(-MAX_MESSAGES_PER_SESSION)
    .map(msg => {
      // Prune large base64 images
      if (msg.toolResults) {
        msg.toolResults = msg.toolResults.map(toolResult => {
          if (
            toolResult.type === 'computer' && 
            toolResult.result?.base64_image && 
            toolResult.result.base64_image.length > MAX_BASE64_IMAGE_SIZE
          ) {
            delete toolResult.result.base64_image;
          }
          return toolResult;
        }).slice(0, MAX_TOOL_RESULTS_PER_MESSAGE);
      }
      return msg;
    });
};

const initialState = {
  messages: [],
  isLoading: false,
  currentSession: null,
  error: null,
  isStreaming: false,
  pendingMessage: '',
  toolExecutionState: null,
  scrollToBottom: false
};

const sampleMessages = [
  {
    id: uuidv4(),
    type: 'user',
    content: 'Hello! Can you help me take a screenshot of my desktop?',
    timestamp: new Date().toISOString()
  },
  {
    id: uuidv4(),
    type: 'assistant',
    content: 'I\'d be happy to help you take a screenshot! Let me capture what\'s currently on your screen.',
    timestamp: new Date().toISOString(),
    toolResults: [
      {
        type: 'computer',
        action: 'screenshot',
        result: {
          base64_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          coordinate: [512, 384]
        }
      }
    ]
  }
];

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        scrollToBottom: true
      };
    case 'UPDATE_LAST_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, index) => 
          index === state.messages.length - 1 
            ? { ...msg, ...action.updates }
            : msg
        )
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.streaming };
    case 'SET_PENDING_MESSAGE':
      return { ...state, pendingMessage: action.message };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false,
        isStreaming: false
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_TOOL_EXECUTION_STATE':
      return { ...state, toolExecutionState: action.state };
    case 'RESET_CHAT':
      return {
        ...initialState,
        currentSession: uuidv4()
      };
    case 'LOAD_SAMPLE_MESSAGES':
      return {
        ...state,
        messages: sampleMessages
      };
    case 'SCROLL_HANDLED':
      return { ...state, scrollToBottom: false };
    case 'NEW_SESSION':
      return {
        ...initialState,
        currentSession: uuidv4()
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    currentSession: uuidv4()
  });

  // Persist messages with pruning
  const persistMessages = useCallback((messages) => {
    const prunedMessages = pruneMessages(messages);
    
    try {
      // Store messages for current session
      localStorage.setItem(
        `computer-use-messages-${state.currentSession}`, 
        JSON.stringify(prunedMessages)
      );
    } catch (error) {
      console.warn('Failed to save messages to localStorage:', error);
      // If storage is full, try clearing some older sessions
      Object.keys(localStorage)
        .filter(key => key.startsWith('computer-use-messages-'))
        .sort((a, b) => {
          const getTimestamp = (key) => {
            const sessionMessages = JSON.parse(localStorage.getItem(key) || '[]');
            return sessionMessages.length > 0 
              ? new Date(sessionMessages[0].timestamp).getTime() 
              : 0;
          };
          return getTimestamp(a) - getTimestamp(b);
        })
        .slice(0, -5) // Keep the 5 most recent sessions
        .forEach(key => localStorage.removeItem(key));
    }
  }, [state.currentSession]);

  // Load messages on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`computer-use-messages-${state.currentSession}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          parsed.forEach(message => {
            dispatch({ type: 'ADD_MESSAGE', message });
          });
        } else {
          dispatch({ type: 'LOAD_SAMPLE_MESSAGES' });
        }
      } catch (error) {
        console.warn('Failed to load messages from localStorage:', error);
        dispatch({ type: 'LOAD_SAMPLE_MESSAGES' });
      }
    } else {
      dispatch({ type: 'LOAD_SAMPLE_MESSAGES' });
    }
  }, [state.currentSession]);

  // Save messages whenever they change
  useEffect(() => {
    if (state.messages.length > 0) {
      persistMessages(state.messages);
    }
  }, [state.messages, persistMessages]);

  const addMessage = (message) => {
    const newMessage = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...message
    };
    dispatch({ type: 'ADD_MESSAGE', message: newMessage });
    return newMessage.id;
  };

  const sendMessage = (content) => {
    if (!content.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: content.trim()
    };
    
    const messageId = addMessage(userMessage);
    
    dispatch({ type: 'SET_LOADING', loading: true });
    
    setTimeout(() => {
      const mockResponse = {
        type: 'assistant',
        content: `Mock response to: "${content}". This is a placeholder response for UI testing.`,
        toolResults: content.toLowerCase().includes('screenshot') ? [
          {
            type: 'computer',
            action: 'screenshot',
            result: {
              base64_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              coordinate: [512, 384]
            }
          }
        ] : content.toLowerCase().includes('ls') || content.toLowerCase().includes('command') ? [
          {
            type: 'bash',
            command: 'ls',
            result: {
              stdout: 'file1.txt\nfile2.js\ndirectory/\nREADME.md',
              stderr: '',
              exit_code: 0
            }
          }
        ] : undefined
      };
      
      addMessage(mockResponse);
      dispatch({ type: 'SET_LOADING', loading: false });
    }, 1500);
    
    return messageId;
  };

  const resetChat = () => {
    localStorage.removeItem(`computer-use-messages-${state.currentSession}`);
    dispatch({ type: 'RESET_CHAT' });
    dispatch({ type: 'LOAD_SAMPLE_MESSAGES' });
  };

  const newSession = () => {
    dispatch({ type: 'NEW_SESSION' });
    localStorage.removeItem(`computer-use-messages-${state.currentSession}`);
  };

  const updateLastMessage = (updates) => {
    dispatch({ type: 'UPDATE_LAST_MESSAGE', updates });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setToolExecutionState = (state) => {
    dispatch({ type: 'SET_TOOL_EXECUTION_STATE', state });
  };

  const handleScrollComplete = () => {
    dispatch({ type: 'SCROLL_HANDLED' });
  };

  const interruptExecution = () => {
    dispatch({ type: 'SET_LOADING', loading: false });
    dispatch({ type: 'SET_STREAMING', streaming: false });
    dispatch({ type: 'SET_TOOL_EXECUTION_STATE', state: null });
    setError('Execution interrupted by user');
  };

  const value = {
    ...state,
    addMessage,
    sendMessage,
    resetChat,
    newSession,
    updateLastMessage,
    setError,
    clearError,
    setToolExecutionState,
    handleScrollComplete,
    interruptExecution
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}