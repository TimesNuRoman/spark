'use client';

import { useState } from 'react';

type PostTab = 'compose' | 'filters' | 'edit' | 'tags';

export default function CreatePostPage() {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<PostTab>('compose');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tags] = useState(['Nature', 'Sunset', 'Portrait']);
  const [attachments] = useState({
    location: null as string | null,
    taggedFriends: [] as string[],
    music: null as string | null
  });

  const [formatting] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const characterLimit = 2200;
  const charactersUsed = text.length;
  const charactersLeft = characterLimit - charactersUsed;

  const mockMedia = [
    'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Beautiful+Landscape',
    'https://via.placeholder.com/400x300/4ecdc4/000000?text=City+Skyline',
    'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Ocean+View'
  ];

  const renderComposeTab = () => (
    <div className="p-4 space-y-4">
      {/* Text Input */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          maxLength={characterLimit}
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {charactersLeft}
        </div>
      </div>

      {/* Media Preview */}
      {selectedImage && (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Selected media"
            className="w-full rounded-lg"
          />
          <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600">
            ✕
          </button>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex space-x-2 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
        <button className={`p-2 rounded ${formatting.bold ? 'bg-red-100 dark:bg-red-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <span className="font-bold">B</span>
        </button>
        <button className={`p-2 rounded ${formatting.italic ? 'bg-red-100 dark:bg-red-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <span className="italic">I</span>
        </button>
        <button className={`p-2 rounded ${formatting.underline ? 'bg-red-100 dark:bg-red-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <span className="underline">U</span>
        </button>
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <span>🔗</span>
        </button>
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <span>😀</span>
        </button>
      </div>

      {/* Attachment Options */}
      <div className="space-y-3">
        <button className="flex items-center space-x-3 w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="text-xl">📍</span>
          <span className="text-gray-700 dark:text-gray-300">Add location</span>
        </button>

        <button className="flex items-center space-x-3 w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="text-xl">👥</span>
          <span className="text-gray-700 dark:text-gray-300">Tag friends</span>
        </button>

        <button className="flex items-center space-x-3 w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="text-xl">🎵</span>
          <span className="text-gray-700 dark:text-gray-300">Add music</span>
        </button>
      </div>

      {/* Quick Media Selection */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setSelectedImage(mockMedia[i-1])}
          >
            <span className="text-2xl">
              {i === 1 ? '📷' : i === 2 ? '🎥' : '🎵'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFiltersTab = () => (
    <div className="p-4">
      {selectedImage ? (
        <div className="space-y-4">
          <img src={selectedImage} alt="Filtered media" className="w-full rounded-lg" />
          <div className="grid grid-cols-3 gap-2">
            {['Nature', 'Sunset', 'Portrait', 'Vintage', 'Mono', 'Dramatic'].map((filter) => (
              <button
                key={filter}
                className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-gray-600 dark:text-gray-400">Add media to apply filters</p>
        </div>
      )}
    </div>
  );

  const renderEditTab = () => (
    <div className="p-4">
      {selectedImage ? (
        <div className="space-y-6">
          <img src={selectedImage} alt="Edited media" className="w-full rounded-lg" />

          {/* Brightness */}
          <div>
            <label className="block text-sm font-medium mb-2">Brightness</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="block text-sm font-medium mb-2">Contrast</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          {/* Saturation */}
          <div>
            <label className="block text-sm font-medium mb-2">Saturation</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Reset
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-700 transition-colors">
              Apply
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-gray-600 dark:text-gray-400">Add media to edit</p>
        </div>
      )}
    </div>
  );

  const renderTagsTab = () => (
    <div className="p-4">
      {selectedImage ? (
        <div className="space-y-4">
          <div className="relative">
            <img src={selectedImage} alt="Tagged media" className="w-full rounded-lg" />
            {/* Mock tags on image */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs">
              Alice
            </div>
            <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
              Bob
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Tag people in this post</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {['Alice Johnson', 'Bob Smith', 'Charlie Brown'].map((name) => (
                <div key={name} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span>{name}</span>
                  <button className="text-red-600 hover:text-red-700">Tag</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏷️</div>
          <p className="text-gray-600 dark:text-gray-400">Add media to tag people</p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'compose': return renderComposeTab();
      case 'filters': return renderFiltersTab();
      case 'edit': return renderEditTab();
      case 'tags': return renderTagsTab();
      default: return renderComposeTab();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <button className="text-gray-600 dark:text-gray-400">
          <span className="text-xl">✕</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Create Post</h1>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          text.trim() || selectedImage
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
        }`}>
          Post
        </button>
      </div>

      {/* Content Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'compose' as PostTab, label: 'Compose', icon: '✏️' },
          { id: 'filters' as PostTab, label: 'Filters', icon: '🎨' },
          { id: 'edit' as PostTab, label: 'Edit', icon: '📷' },
          { id: 'tags' as PostTab, label: 'Tags', icon: '🏷️' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.id
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">🏠</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Главная</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">🔍</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Поиск</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">➕</span>
            <span className="text-xs text-red-600">Создать</span>
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
