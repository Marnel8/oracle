# Oracle - AI Web Assistant

Oracle is a Chrome extension that brings an AI assistant directly into your browser, helping you find information, understand web pages, and navigate the internet more effectively. It supports both OpenAI's GPT models and local Llama models (via Ollama), offering privacy and flexibility.

---

## Features

- **Chat Interface**: Seamless chat overlay on any web page.
- **Context Awareness**: Oracle analyzes the current page content to provide relevant, helpful answers.
- **Model Flexibility**: Choose between OpenAI's GPT (API key required) or a local Llama model (via Ollama backend).
- **Customizable UI**: Move the chat button to the left or right side of your screen.
- **Popup & Options**: Quick access to settings and assistant via the extension popup.
- **Privacy First**: Local Llama mode keeps all data on your machine.
- **No Data Collection**: Oracle does not store or collect your data beyond what's needed for functionality.

---

## Project Structure

```
.
├── content.js         # Main content script (chat UI, page analysis, messaging)
├── styles.css         # Extension styles
├── popup.html/js      # Extension popup UI and logic
├── options.html/js    # Settings/options page
├── manifest.json      # Chrome extension manifest
├── icons/             # Extension icons
├── server/            # Node.js backend proxy for local Llama (Ollama)
│   ├── server.js      # Express server for proxying chat requests
│   ├── package.json   # Backend dependencies
│   └── ...
└── README.md          # This file
```

---

## Installation

### 1. Chrome Extension

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" (toggle in the top right).
4. Click "Load unpacked" and select the project folder.
5. The Oracle icon should now appear in your browser toolbar.

---

## Configuration

### OpenAI API (Default)

1. Click the Oracle extension icon in your toolbar to open the settings.
2. Enter your OpenAI API key (get one at [platform.openai.com](https://platform.openai.com)).
3. Choose your preferred position (left or right).
4. Click "Save Settings".

### Local Llama Model (Ollama, Self-hosted)

Oracle can connect to a locally running Llama model via [Ollama](https://ollama.com/) for privacy and no usage costs.

#### Requirements
- Node.js 16 or higher
- npm
- [Ollama](https://ollama.com/) installed and running (`ollama serve`)
- Llama model pulled (e.g., `ollama pull llama3.2`)

#### Setup
1. **Start Ollama**:
   ```
   ollama serve
   ollama pull llama3.2
   ```
2. **Start the Oracle backend server:**
   ```
   cd server
   npm install
   npm start
   ```
   The server will run at `http://localhost:5001` by default and proxy requests to Ollama at `http://localhost:11434`.

3. **Configure Oracle Extension:**
   - In the settings, select "Llama (Local)" as the model type (if available) or ensure the extension is set to use the local backend.
   - Enter the backend server URL (default: `http://localhost:5001/api/chat`).
   - Save settings.

---

## Backend (Ollama Proxy Server)

The backend server (in `server/`) acts as a bridge between the Chrome extension and your local Ollama instance. It:
- Accepts chat requests from the extension
- Adds page context to the prompt
- Forwards the request to Ollama (Llama 3.2 by default)
- Returns the AI's response

**Endpoints:**
- `POST /api/chat` — Main chat endpoint
- `GET /health` — Health check (verifies Ollama is running)

**Environment:**
- Configure port and other settings in `.env` (see `env.example` if present)
- `.gitIgnore` excludes `node_modules` and `.env` by default

---

## Usage

1. Click the Oracle icon (bottom right of any web page) to open the chat.
2. Type your question about the current page or site.
3. Oracle will analyze the page and provide a helpful, context-aware response.
4. Use the popup for quick access or to open settings.

---

## Customization & Settings

- **Enable/Disable**: Toggle Oracle on/off for all sites.
- **API Key**: Store your OpenAI API key locally (never sent anywhere except OpenAI).
- **Button Position**: Choose left or right side of the screen.
- **Model Selection**: Switch between OpenAI and local Llama (if supported in UI).

---

## Privacy

- **OpenAI Mode**: Your query and page content are sent to OpenAI's API.
- **Local Llama Mode**: All data stays on your machine; nothing is sent to third parties.
- **No Data Collection**: Oracle does not store or collect your data beyond what's needed for functionality.

---

## Development & Contribution

1. Clone the repo and install dependencies as needed.
2. For backend development, work in the `server/` directory.
3. For extension development, edit the main files and reload the unpacked extension in Chrome.
4. Pull requests and issues are welcome!

---

## Troubleshooting

- **Ollama server is not running**: Start it with `ollama serve`.
- **Llama model not found**: Run `ollama pull llama3.2`.
- **No response from backend**: Ensure the backend server is running and accessible.
- **Extension not working**: Reload the extension in Chrome and check permissions.

---

## License

This project is licensed under the MIT License. 
