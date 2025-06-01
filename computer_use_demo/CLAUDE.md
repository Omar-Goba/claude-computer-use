# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Anthropic Computer Use Demo repository with a dual architecture:

1. **Python Backend** (`computer_use_demo/`): Original Streamlit-based demo with computer use tools
2. **React Frontend** (`frontend/`): New React frontend being developed to replace Streamlit interface

The core functionality centers around Claude's computer use capabilities - allowing the model to take screenshots, control mouse/keyboard, execute bash commands, and edit files through specialized tools.

## Development Commands

### Python Backend
```bash
# Setup Python environment (requires Python ≤3.12 and Rust/Cargo)
./setup.sh

# Run Python tests
pytest

# Run linting and formatting
ruff check
ruff format

# Run Streamlit demo
streamlit run computer_use_demo/streamlit.py
```

### React Frontend
```bash
cd frontend/

# Development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Lint React code
npm run lint
```

### Docker Operations
```bash
# Build Docker container
docker build . -t computer-use-demo:local

# Run with Anthropic API
export ANTHROPIC_API_KEY=your_key
docker run -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY -p 8080:8080 -it computer-use-demo:local

# For development (with live reload)
docker run -v $(pwd)/computer_use_demo:/home/computeruse/computer_use_demo/ -p 8501:8501 -it computer-use-demo:local
```

## Architecture

### Computer Use Tools
The system implements three core tool types through versioned APIs:
- **Computer Tool**: Screenshots, mouse clicks, keyboard input, coordinate scaling
- **Bash Tool**: Command execution with persistent sessions and timeout handling  
- **Edit Tool**: File viewing, creation, and string-based replacements

Tool versions are managed in `computer_use_demo/tools/groups.py` with different capabilities:
- `computer_use_20241022`: Basic functionality
- `computer_use_20250124`: Extended with scroll, hold_key, wait, triple_click actions
- `computer_use_20250429`: Streamlined edit tool without undo functionality

### API Integration
The `computer_use_demo/loop.py` implements the core sampling loop that:
- Manages conversation state and message history
- Handles multiple API providers (Anthropic, Bedrock, Vertex)
- Implements prompt caching and image truncation for efficiency
- Provides real-time callbacks for UI updates

### Frontend Migration Strategy
The React frontend (`frontend/src/`) is structured to replicate Streamlit features:
- **Context providers**: Global state management for chat, settings, auth
- **Services layer**: API communication, storage, WebSocket handling
- **Component architecture**: Modular UI with Chat, Sidebar, Tool visualization components
- **Hook pattern**: Custom hooks for chat logic, API calls, settings persistence

## Critical Implementation Details

### Computer Tool Coordinate Scaling
The computer tool automatically scales coordinates between high-resolution displays and the recommended XGA (1024x768) resolution for optimal model performance. This scaling is bidirectional - API coordinates are scaled up for actual execution, display screenshots are scaled down for transmission.

### Tool Result Rendering
Different tool outputs require specialized rendering:
- **CLI results**: Formatted as code blocks
- **Screenshots**: Base64 image display with optional hiding
- **File operations**: Text output with error handling
- **Thinking blocks**: Special formatting for Claude 4 model reasoning

### Session Management
The Streamlit implementation uses session state for persistence, while the React version should implement:
- Local storage for API keys and settings
- Message history persistence across browser sessions
- Tool execution state tracking
- Interruption handling for long-running operations

### Security Considerations
Both frontends must implement proper warnings about computer use risks and avoid exposing sensitive information in logs or state persistence.

## Testing

### Python Tests
- Tests are located in `tests/` directory
- Run with `pytest` from the root directory
- Test configuration in `pyproject.toml`
- Tests cover tool functionality, API integration, and core loop logic

### Key Test Files
- `tests/tools/computer_test.py`: Computer tool functionality
- `tests/tools/bash_test.py`: Bash tool execution and session management
- `tests/tools/edit_test.py`: File editing operations
- `tests/loop_test.py`: Core sampling loop and API integration
- `tests/streamlit_test.py`: Streamlit interface components

## Tool Versions and Compatibility

### Model Compatibility
- **Claude 3.5 Sonnet**: Uses `computer_use_20241022` tool version
- **Claude 3.7 Sonnet**: Uses `computer_use_20250124` tool version with thinking support
- **Claude 4 Models**: Uses `computer_use_20250124` tool version with thinking support

### API Provider Configuration
- **Anthropic API**: Direct API access with prompt caching
- **Bedrock**: AWS integration with credential management
- **Vertex**: Google Cloud integration with service account auth

## Environment Variables

### Required for API Providers
- `ANTHROPIC_API_KEY`: For Anthropic API access
- `AWS_PROFILE`, `AWS_REGION`: For Bedrock integration  
- `CLOUD_ML_REGION`, `ANTHROPIC_VERTEX_PROJECT_ID`: For Vertex integration

### Optional Configuration
- `API_PROVIDER`: Set to "anthropic", "bedrock", or "vertex"
- `WIDTH`, `HEIGHT`: Set screen resolution for Docker environment
- `HIDE_WARNING`: Hide security warning in Streamlit interface