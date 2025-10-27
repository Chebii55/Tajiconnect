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
      // Handle sending message
      console.log('Sending message:', message);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter'] flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/messages')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-light to-secondary rounded-full flex items-center justify-center text-white font-medium">
                    {conversation.participant?.name?.charAt(0) || 'L'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {conversation.participant?.name || 'Learner'}
                  </h1>
                  <p className="text-sm text-green-600 dark:text-green-400">Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
                    ? 'bg-primary-light text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'trainer' 
                      ? 'text-primary-light/70' 
                      : 'text-gray-500 dark:text-gray-400'
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
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-3 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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