'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  status: 'online' | 'away' | 'offline';
  unreadCount: number;
  username: string;
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Alice Doe',
      username: 'alice_doe',
      avatar: 'https://via.placeholder.com/50',
      lastMessage: 'Last message preview that shows what was sent...',
      timestamp: '2 min ago',
      status: 'online',
      unreadCount: 0
    },
    {
      id: 2,
      name: 'Bob Smith',
      username: 'bob_smith',
      avatar: 'https://via.placeholder.com/50',
      lastMessage: 'Hey, how are you?',
      timestamp: '1 hour ago',
      status: 'offline',
      unreadCount: 0
    },
    {
      id: 3,
      name: 'Charlie Brown',
      username: 'charlie_brown',
      avatar: 'https://via.placeholder.com/50',
      lastMessage: 'Meeting tomorrow at 3pm',
      timestamp: 'Yesterday',
      status: 'away',
      unreadCount: 2
    },
    {
      id: 4,
      name: 'Diana Prince',
      username: 'diana_prince',
      avatar: 'https://via.placeholder.com/50',
      lastMessage: 'Thanks for the update!',
      timestamp: '3 days ago',
      status: 'offline',
      unreadCount: 1
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
        <button className="mr-3 text-gray-600 dark:text-gray-400">
          <span className="text-xl">⬅️</span>
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
      </div>

      {/* Search */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="block w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1">
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            {/* Avatar */}
            <div className="relative mr-3">
              <img
                src={conv.avatar}
                alt={conv.name}
                className="w-12 h-12 rounded-full"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(conv.status)} border-2 border-white dark:border-gray-900 rounded-full`}></div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {conv.name}
                </h3>
                <div className="flex items-center space-x-2 ml-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {conv.timestamp}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • {getStatusText(conv.status)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate mt-1">
                {conv.lastMessage}
              </p>
            </div>

            {/* Unread Count */}
            {conv.unreadCount > 0 && (
              <div className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                {conv.unreadCount}
              </div>
            )}
          </div>
        ))}

        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No conversations found
            </h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search terms' : 'Start a conversation to see messages here'}
            </p>
          </div>
        )}
      </div>

      {/* Empty State for no conversations initially */}
      {conversations.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Your Messages
          </h3>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
            Send private messages with end-to-end encryption using the latest Signal protocol
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 w-full max-w-sm">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">🔒</span>
              <span className="text-green-800 dark:text-green-200 text-sm">
                End-to-end encrypted • Zero-trust architecture • Perfect forward secrecy
              </span>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
