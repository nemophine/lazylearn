'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Simulate receiving messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), text: `Bot message ${Date.now()}` },
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    setMessages([...messages, { id: Date.now(), text: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="p-4 border rounded-md">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button type="submit" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
      </form>
    </div>
  );
}
