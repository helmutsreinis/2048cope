import React, { useEffect, useRef, useState } from 'react';
import '../styles/ChatStream.css';

interface ChatMessage {
  id: number;
  message: string;
  timestamp: Date;
}

interface ChatStreamProps {
  messages: ChatMessage[];
}

const ChatStream: React.FC<ChatStreamProps> = ({ messages }) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, [messages]);

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <div className={`chat-stream ${minimized ? 'minimized' : ''}`} ref={chatRef}>
      <div className="chat-header">
        <h3>Kitchen Chat</h3>
        <div className="chat-controls">
          <span className="chat-status">🔴 LIVE</span>
          <button className="minimize-btn" onClick={toggleMinimize}>
            {minimized ? '↗' : '↘'}
          </button>
        </div>
      </div>
      {!minimized && (
        <div className="chat-messages">
          {[...messages].reverse().map((msg) => (
            <div key={msg.id} className="chat-message">
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="message-text">{msg.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatStream; 