'use client';

import { useEffect, useState } from 'react';
import { api, Post } from '@/lib/api';
import CommentsModal from '@/components/CommentsModal';
import Layout from '@/components/Layout';

export default function SparkFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mindReadingLoading, setMindReadingLoading] = useState(true);
  const [commentsModal, setCommentsModal] = useState<{
    isOpen: boolean;
    postId: number;
    postTitle: string;
    comments: any[];
  }>({
    isOpen: false,
    postId: 0,
    postTitle: '',
    comments: []
  });

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setMindReadingLoading(true);
        // Simulate mind-reading loading
        setTimeout(() => setMindReadingLoading(false), 2000);

        const response = await api.getFeed();
        setPosts(response.posts);
      } catch (error) {
        console.error('Failed to fetch feed:', error);
        // Use empty array if API fails
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Культурный мост': return '🌍';
      case 'Новый талант': return '🎵';
      case 'Научный прогресс': return '🔬';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Культурный мост': return 'border-blue-500';
      case 'Новый талант': return 'border-purple-500';
      case 'Научный прогресс': return 'border-green-500';
      default: return 'border-orange-500';
    }
  };

  const openComments = async (postId: number, postTitle: string) => {
    try {
      const response = await api.getComments(postId);
      setCommentsModal({
        isOpen: true,
        postId,
        postTitle,
        comments: response.comments || []
      });
    } catch (error) {
      console.error('Failed to load comments:', error);
      // Open modal with empty comments
      setCommentsModal({
        isOpen: true,
        postId,
        postTitle,
        comments: []
      });
    }
  };

  const closeComments = () => {
    setCommentsModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <Layout>
      {/* Mind-reading banner */}
      {mindReadingLoading && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Spark читает вашу душу...</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Мы создаем мир, где вы еще не думали существовать</p>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Загружаем персонализированную ленту...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Нет постов для отображения</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">

              {/* Post Header with Category */}
              <div className="flex justify-between items-center p-4 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-blue-500 rounded-full flex items-center justify-center">
                    <img
                      src={post.user.avatar}
                      alt={post.user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                    <span>{getCategoryEmoji(post.category)}</span>
                    <span>{post.category}</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="px-4 pb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Mind-reading Hook */}
              {post.mindReadingHook && (
                <div className="px-4 pb-3">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 rounded">
                    <div className="flex items-center space-x-2">
                      <span>💡</span>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        {post.mindReadingHook}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Carousel */}
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="px-4 pb-3">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={post.media_urls[0]}
                      alt="Post media"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className={`flex items-center space-x-1 transition-colors ${post.userLiked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400 hover:text-red-600'}`}>
                      <span className="text-xl">{post.userLiked ? '❤️' : '🤍'}</span>
                      <span className="text-sm font-medium">{post.likeCount}</span>
                    </button>
                    <button
                      onClick={() => openComments(post.id, post.title)}
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-xl">💬</span>
                      <span className="text-sm font-medium">{post.commentCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <span className="text-xl">↗️</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {post.engagementCount} вовлечено
                  </div>
                </div>
              </div>

              {/* Comments Preview */}
              {post.commentCount > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Посмотреть {post.commentCount} комментариев</span>
                    </div>
                    {/* Sample comments */}
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">user1</span> Потрясающе! 👍
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>



      {/* Comments Modal */}
      <CommentsModal
        postId={commentsModal.postId}
        isOpen={commentsModal.isOpen}
        onClose={closeComments}
        postTitle={commentsModal.postTitle}
        initialComments={commentsModal.comments}
      />
    </Layout>
  );
}
