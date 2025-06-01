import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { ChatProvider } from "./context/ChatContext";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

function App() {
  return (
    <SettingsProvider>
      <ChatProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* <Route path="/" element={<ChatPage />} /> */}
              <Route path="/settings" element={<SettingsPage />} />
              {/* <Route path="*" element={<ChatPage />} /> */}
            </Routes>
          </div>
        </Router>
      </ChatProvider>
    </SettingsProvider>
  );
}

export default App;
