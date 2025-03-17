import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, [messages]);

  return (
    <div className="chat-stream" ref={chatRef}>
      <div className="chat-header">
        <h3>ruzzian cope stream.</h3>
        <span className="chat-status">🔴 LIVE</span>
      </div>
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
    </div>
  );
};

export default ChatStream; 