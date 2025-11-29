'use client';

import { useState, useEffect } from 'react';

interface UserResult {
  id: number;
  name: string;
  username: string;
  avatar: string;
  followers: string;
  bio: string;
  isFollowing: boolean;
}

interface PostResult {
  id: number;
  title: string;
  content: string;
  author: { name: string; avatar: string };
  likes: string;
  comments: string;
  timestamp: string;
  media?: string;
}

interface TagResult {
  name: string;
  count: string;
  trending: boolean;
}

type TabType = 'all' | 'users' | 'posts' | 'tags';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [trendingTags] = useState(['#spark', '#motivation', '#technology']);
  const [recentSearches] = useState(['React development', 'Alice Johnson']);

  // Mock data for different tabs
  const [userResults] = useState<UserResult[]>([
    {
      id: 1,
      name: 'Alice Johnson',
      username: 'alice_dev',
      avatar: 'https://via.placeholder.com/60',
      followers: '12.3K followers',
      bio: 'Full-stack developer & tech enthusiast',
      isFollowing: false
    },
    {
      id: 2,
      name: 'Bob Smith',
      username: 'bob_ui',
      avatar: 'https://via.placeholder.com/60',
      followers: '8.7K followers',
      bio: 'UI/UX designer creating beautiful experiences',
      isFollowing: true
    }
  ]);

  const [postResults] = useState<PostResult[]>([
    {
      id: 1,
      title: 'How to build great apps',
      content: 'Amazing tutorial on UI/UX design principles that every developer should know...',
      author: { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/40' },
      likes: '2.1K likes',
      comments: '89 comments',
      timestamp: '2 hours ago',
      media: 'https://via.placeholder.com/120x80'
    }
  ]);

  const [tagResults] = useState<TagResult[]>([
    { name: 'spark', count: '152K posts', trending: true },
    { name: 'motivation', count: '89K posts', trending: false },
    { name: 'technology', count: '67K posts', trending: true }
  ]);

  const tabs = [
    { id: 'all' as TabType, label: 'All' },
    { id: 'users' as TabType, label: 'Users' },
    { id: 'posts' as TabType, label: 'Posts' },
    { id: 'tags' as TabType, label: 'Tags' }
  ];

  const renderTrending = () => (
    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">🔥</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending:</span>
        <div className="flex space-x-2 overflow-x-auto">
          {trendingTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap"
              onClick={() => setSearchQuery(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-lg">🕕</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Recent:</span>
        <div className="flex space-x-2 overflow-x-auto">
          {recentSearches.map((search) => (
            <span
              key={search}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
              onClick={() => setSearchQuery(search)}
            >
              {search}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const hasQuery = searchQuery.trim().length > 0;

    if (!hasQuery) {
      // Show suggestions when no search
      return (
        <div className="p-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-1">Suggested for you</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Users you might like, trending content, and popular discussions in your network.
                </p>
                <div className="mt-3 space-y-1">
                  <div className="text-sm text-blue-800 dark:text-blue-200">• Popular creators in tech</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">• Trending posts about innovation</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">• Communities discussing future of AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Filter results based on active tab
    let results = [];

    if (activeTab === 'all' || activeTab === 'users') {
      results.push(...userResults.map(user => ({ type: 'user', data: user })));
    }
    if (activeTab === 'all' || activeTab === 'posts') {
      results.push(...postResults.map(post => ({ type: 'post', data: post })));
    }
    if (activeTab === 'all' || activeTab === 'tags') {
      results.push(...tagResults.map(tag => ({ type: 'tag', data: tag })));
    }

    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or check for typos.
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {results.map((result, index) => {
          if (result.type === 'user') {
            const user = result.data as UserResult;
            return (
              <div key={`user-${user.id}`} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full mr-4" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.bio}</p>
                </div>
                <div className="text-right mr-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.followers}</p>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  user.isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          }

          if (result.type === 'post') {
            const post = result.data as PostResult;
            return (
              <div key={`post-${post.id}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center mb-3">
                  <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>
                {post.media && (
                  <img src={post.media} alt="Post media" className="w-full h-20 object-cover rounded-lg mb-3" />
                )}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex space-x-4">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                  <button className="text-red-600 hover:text-red-700">View Details</button>
                </div>
              </div>
            );
          }

          if (result.type === 'tag') {
            const tag = result.data as TagResult;
            return (
              <div key={`tag-${tag.name}`} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center">
                  {tag.trending && <span className="mr-2">🔥</span>}
                  <span className="text-blue-600 dark:text-blue-400 font-medium">#{tag.name}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">{tag.count}</span>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
        <button className="mr-3 text-gray-600 dark:text-gray-400">
          <span className="text-xl">⬅️</span>
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Search</h1>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search users, posts & tags..."
            className="block w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery('')}
            >
              <span className="text-gray-400 text-lg">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Trending & Recent */}
      {renderTrending()}

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {renderResults()}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">🏠</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Главная</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">🔍</span>
            <span className="text-xs text-red-600">Поиск</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">➕</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Создать</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">💬</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Сообщения</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">👤</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Профиль</span>
          </div>
        </div>
      </div>
    </div>
  );
}
