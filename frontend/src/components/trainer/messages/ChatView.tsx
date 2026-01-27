import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Circle
} from 'lucide-react';

const ChatView: React.FC = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { learners } = useTrainer();

  const [message, setMessage] = useState('');

  // Mock conversation data
  const conversation = {
    id: conversationId,
    participant: learners[0], // Mock participant
    messages: [
      {
        id: '1',
        sender: 'learner',
        content: 'Hi! I have a question about the React Hooks module.',
        timestamp: '2024-03-15T10:30:00Z',
        read: true
      },
      {
        id: '2',
        sender: 'trainer',
        content: 'Hello! I\'d be happy to help. What specific part of React Hooks are you having trouble with?',
        timestamp: '2024-03-15T10:32:00Z',
        read: true
      },
      {
        id: '3',
        sender: 'learner',
        content: 'I\'m confused about the useEffect hook and when to use the dependency array.',
        timestamp: '2024-03-15T10:35:00Z',
        read: true
      }
    ]
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message via API
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter'] flex flex-col">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/messages')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-medium">
                    {conversation.participant?.name?.charAt(0) || 'L'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-white dark:border-darkMode-surface rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">
                    {conversation.participant?.name || 'Learner'}
                  </h1>
                  <p className="text-sm text-success dark:text-darkMode-success">Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'trainer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'trainer'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text border border-neutral-gray dark:border-darkMode-border'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'trainer'
                      ? 'text-white/70'
                      : 'text-forest-sage dark:text-darkMode-textSecondary'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-neutral-white dark:bg-darkMode-surface border-t dark:border-darkMode-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end gap-4">
            <button className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar">
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>

            <button className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar">
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
