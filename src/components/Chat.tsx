import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { apiService } from "../services/api";
import { webSocketService } from "../services/websocket";

interface ChatProps {
  userId: string;
}

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const response = await apiService.getMessages();
      if (response.success && response.data) {
        setMessages(response.data);
      }
    };

    loadMessages();
  }, []);

  // Set up WebSocket connection for real-time chat
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        const response = await apiService.getWebSocketURL("chat");
        if (response.success && response.data) {
          await webSocketService.connectChat(response.data.websocketUrl);
          setIsConnected(true);

          webSocketService.onChatMessage((message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
          });
        }
      } catch (error) {
        console.error("Failed to setup chat WebSocket:", error);
        setIsConnected(false);
      }
    };

    setupWebSocket();

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await apiService.sendMessage({
        userId,
        message: newMessage.trim(),
      });

      if (response.success) {
        setNewMessage("");
      } else {
        console.error("Failed to send message:", response.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-96 bg-white border border-gray-300 rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800">Chat</h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-xs text-gray-600">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.userId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.userId === userId
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="text-sm">{message.message}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.userId === userId
                      ? "text-primary-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.time)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
