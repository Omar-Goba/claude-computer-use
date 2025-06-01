# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the React frontend for the Anthropic Computer Use Demo, designed to replace the existing Streamlit interface. It provides a modern web interface for interacting with Claude's computer use capabilities including screenshots, mouse/keyboard control, bash commands, and file editing.

## Development Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### Component Structure
The application follows a modular React architecture:

- **Context Providers** (`src/context/`): Global state management
  - `ChatContext.js`: Chat messages and conversation state
  - `SettingsContext.js`: User preferences and API configuration
  - `AuthContext.js`: Authentication and API key management

- **Services Layer** (`src/services/`): External integrations
  - `anthropic.js`: Anthropic API communication and streaming
  - `websocket.js`: Real-time communication for tool execution
  - `storage.js`: Local storage persistence

- **Custom Hooks** (`src/hooks/`): Reusable logic
  - `useChat.js`: Chat functionality and message handling
  - `useAPI.js`: API call management with error handling
  - `useSettings.js`: Settings persistence and validation
  - `useStorage.js`: Local storage abstraction

- **UI Components** (`src/components/`):
  - `Chat/`: Message bubbles, input, and conversation display
  - `Sidebar/`: API settings, model configuration, tool settings
  - `Tool/`: Specialized renderers for bash output, file editing, screenshots
  - `Common/`: Reusable UI elements (buttons, inputs, modals, toggles)

### Page Components
- `ChatPage.jsx`: Main chat interface integrating all components
- `SettingsPage.jsx`: Configuration and preferences management

### Tool Integration
The frontend must handle three core computer use tools:
- **Computer Tool**: Display screenshots, handle coordinate scaling for different resolutions
- **Bash Tool**: Render command output with proper formatting and error handling
- **Edit Tool**: File viewing and editing interface with syntax highlighting

### State Management
- Chat history and conversation state managed through React Context
- Settings and API keys persisted to localStorage
- Real-time tool execution updates via WebSocket connections
- Message streaming handled through custom hooks

## Critical Implementation Requirements

### API Integration
- Support for multiple providers (Anthropic API, Bedrock, Vertex)
- Streaming message responses for real-time chat experience
- Proper error handling for API failures and rate limiting
- API key validation and secure storage

### Tool Result Rendering
- Screenshots: Base64 image display with optional hiding
- Bash output: Formatted code blocks with proper syntax highlighting
- File operations: Diff view for edits with error handling
- Thinking blocks: Special formatting for Claude 4 model reasoning

### Coordinate Scaling
Screenshots are taken at high resolution but should be displayed at XGA (1024x768) for optimal model performance. The frontend must handle bidirectional coordinate scaling between display and actual execution.

### Session Persistence
- Message history persistence across browser sessions
- Settings and preferences saved to localStorage
- Interrupted conversation recovery
- Tool execution state tracking

### Security Considerations
- Never expose API keys in console logs or error messages
- Implement proper warnings about computer use risks
- Validate all user inputs before API submission
- Sanitize tool outputs for safe HTML rendering