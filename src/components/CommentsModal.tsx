'use client';

import { useState, useEffect } from 'react';
import { api, Comment } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface CommentsModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  initialComments: Comment[];
}

export default function CommentsModal({ postId, isOpen, onClose, postTitle, initialComments }: CommentsModalProps) {
  const { getToken, user: currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredComments, setFilteredComments] = useState<Comment[]>(comments);

  useEffect(() => {
    setComments(initialComments);
    setFilteredComments(initialComments);
  }, [initialComments]);

  if (!isOpen) return null;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = getToken();
    if (!token) {
      alert('Необходимо войти в систему');
      return;
    }

    setLoading(true);
    try {
      const response = await api.addComment({
        post_id: postId,
        content: replyTo ? `@${replyTo.user.username} ${newComment}` : newComment
      }, token);

      if (response.success || response.comment) {
        // Add the new comment to the list
        const newCommentObj: Comment = {
          id: Date.now(), // Temporary ID, should use server response ID
          content: replyTo ? `@${replyTo.user.username} ${newComment}` : newComment,
          created_at: new Date().toISOString(),
          user: { username: 'You', fullname: 'You' } // Should get from auth context
        };

        setComments(prev => [...prev, newCommentObj]);
        setFilteredComments(prev => [...prev, newCommentObj]);
        setNewComment('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filter: 'all' | 'recent') => {
    if (filter === 'recent') {
      // Show comments from last 24 hours
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);
      setFilteredComments(comments.filter(c => new Date(c.created_at) > yesterday));
    } else {
      setFilteredComments(comments);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg max-h-[85vh] sm:max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            💬 {comments.length} Comments
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        {/* Post Title */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {postTitle}
          </p>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[40vh] sm:max-h-[35vh]">
          {filteredComments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No comments yet. Be the first!
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                {/* Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">
                    {comment.user.fullname.charAt(0)}
                  </span>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.user.fullname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 mt-2 ml-3">
                    <button className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                      ❤️Like
                    </button>
                    <button
                      onClick={() => setReplyTo(comment)}
                      className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      💬 Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Filters */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">🔍 Filters:</span>
            <button
              onClick={() => handleFilter('all')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              All
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => handleFilter('recent')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Recent
            </button>
          </div>
        </div>

        {/* Reply Indicator */}
        {replyTo && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Replying to <span className="font-medium">{replyTo.user.fullname}</span>
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Comment Composer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-3">
            {/* Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">Y</span>
            </div>

            {/* Input */}
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? `Reply to ${replyTo.user.fullname}...` : "Add your comment..."}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
            </div>

            {/* Media Buttons */}
            <div className="flex space-x-1">
              {['📷', '😊', 'GIF'].map((emoji) => (
                <button
                  key={emoji}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center text-lg"
                >
                  {emoji === 'GIF' ? '🎁' : emoji}
                </button>
              ))}
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || loading}
                className="px-4 bg-red-600 text-white rounded-2xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
              >
                {loading ? '⏳' : '🚀'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
