import React, { useState } from 'react';
import { useTrainer } from '../../contexts/TrainerContext';
import { 
  Send, 
  Search, 
  Filter, 
  Users, 
  User,
  Clock,
  CheckCircle,
  Circle,
  Paperclip,
  Smile,
  MoreVertical
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'trainer' | 'learner';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const TrainerMessages: React.FC = () => {
  const { learners } = useTrainer();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);

  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participantId: 'learner-1',
      participantName: 'John Smith',
      lastMessage: 'Thank you for the feedback on my assignment!',
      lastMessageTime: '2024-03-15T10:30:00Z',
      unreadCount: 0,
      messages: [
        {
          id: 'msg-1',
          senderId: 'learner-1',
          senderName: 'John Smith',
          senderType: 'learner',
          content: 'Hi, I have a question about the React hooks assignment.',
          timestamp: '2024-03-15T09:00:00Z',
          isRead: true
        },
        {
          id: 'msg-2',
          senderId: 'trainer-1',
          senderName: 'Dr. Sarah Johnson',
          senderType: 'trainer',
          content: 'Hi John! I\'d be happy to help. What specific part are you having trouble with?',
          timestamp: '2024-03-15T09:15:00Z',
          isRead: true
        },
        {
          id: 'msg-3',
          senderId: 'learner-1',
          senderName: 'John Smith',
          senderType: 'learner',
          content: 'I\'m struggling with useEffect dependencies. When should I include them?',
          timestamp: '2024-03-15T09:30:00Z',
          isRead: true
        },
        {
          id: 'msg-4',
          senderId: 'trainer-1',
          senderName: 'Dr. Sarah Johnson',
          senderType: 'trainer',
          content: 'Great question! You should include any value from component scope that\'s used inside useEffect. This includes props, state, and functions defined in the component.',
          timestamp: '2024-03-15T10:00:00Z',
          isRead: true
        },
        {
          id: 'msg-5',
          senderId: 'learner-1',
          senderName: 'John Smith',
          senderType: 'learner',
          content: 'Thank you for the feedback on my assignment!',
          timestamp: '2024-03-15T10:30:00Z',
          isRead: true
        }
      ]
    },
    {
      id: 'conv-2',
      participantId: 'learner-2',
      participantName: 'Emily Davis',
      lastMessage: 'Could you review my project submission?',
      lastMessageTime: '2024-03-14T16:45:00Z',
      unreadCount: 2,
      messages: [
        {
          id: 'msg-6',
          senderId: 'learner-2',
          senderName: 'Emily Davis',
          senderType: 'learner',
          content: 'Hi! I just submitted my final project. Could you review it when you have time?',
          timestamp: '2024-03-14T16:30:00Z',
          isRead: false
        },
        {
          id: 'msg-7',
          senderId: 'learner-2',
          senderName: 'Emily Davis',
          senderType: 'learner',
          content: 'Could you review my project submission?',
          timestamp: '2024-03-14T16:45:00Z',
          isRead: false
        }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'trainer-1',
      senderName: 'Dr. Sarah Johnson',
      senderType: 'trainer',
      content: messageText,
      timestamp: new Date().toISOString(),
      isRead: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageText,
          lastMessageTime: new Date().toISOString()
        };
      }
      return conv;
    }));

    setMessageText('');
  };

  const handleNewMessage = () => {
    if (selectedLearners.length === 0 || !messageText.trim()) return;

    // Create new conversations or add to existing ones
    selectedLearners.forEach(learnerId => {
      const learner = learners.find(l => l.id === learnerId);
      if (!learner) return;

      const existingConv = conversations.find(conv => conv.participantId === learnerId);
      
      const newMessage: Message = {
        id: `msg-${Date.now()}-${learnerId}`,
        senderId: 'trainer-1',
        senderName: 'Dr. Sarah Johnson',
        senderType: 'trainer',
        content: messageText,
        timestamp: new Date().toISOString(),
        isRead: true
      };

      if (existingConv) {
        setConversations(prev => prev.map(conv => {
          if (conv.id === existingConv.id) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageText,
              lastMessageTime: new Date().toISOString()
            };
          }
          return conv;
        }));
      } else {
        const newConv: Conversation = {
          id: `conv-${Date.now()}-${learnerId}`,
          participantId: learnerId,
          participantName: learner.name,
          lastMessage: messageText,
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          messages: [newMessage]
        };
        setConversations(prev => [newConv, ...prev]);
      }
    });

    setMessageText('');
    setSelectedLearners([]);
    setShowNewMessage(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">
                Communicate with your learners and provide support
              </p>
            </div>
            <button 
              onClick={() => setShowNewMessage(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              New Message
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-indigo-50 border-indigo-200' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {conversation.participantName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.participantName}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {selectedConv.participantName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedConv.participantName}</p>
                          <p className="text-sm text-gray-500">Online</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'trainer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderType === 'trainer'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderType === 'trainer' ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <Smile className="w-5 h-5" />
                        </button>
                      </div>
                      <button 
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">New Message</h2>
                  <button 
                    onClick={() => setShowNewMessage(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Learners</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                    {learners.map((learner) => (
                      <label key={learner.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLearners.includes(learner.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLearners([...selectedLearners, learner.id]);
                            } else {
                              setSelectedLearners(selectedLearners.filter(id => id !== learner.id));
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {learner.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{learner.name}</p>
                          <p className="text-xs text-gray-500">{learner.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Type your message..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewMessage(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleNewMessage}
                  disabled={selectedLearners.length === 0 || !messageText.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerMessages;