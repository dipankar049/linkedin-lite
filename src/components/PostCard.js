'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PostCard({ post }) {
  const { user: currentUser, token } = useAuth();
  const nameInitial = post.author?.name?.[0]?.toUpperCase() || 'U';
  const formattedDate = new Date(post.createdAt).toLocaleString();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (post.likes?.includes(currentUser?._id)) {
      setLiked(true);
    }
  }, [post.likes, currentUser]);

  const handleLike = async () => {
  if (!currentUser) {
    window.location.href = '/login';
    return;
  }

  try {
    const res = await fetch(`/api/posts/${post._id}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLiked(data.liked);
    setLikeCount(data.totalLikes);
  } catch (err) {
    console.error('Like failed:', err);
  }
};

const handleComment = async (e) => {
  e.preventDefault();

  if (!currentUser) {
    window.location.href = '/login';
    return;
  }

  if (!commentText.trim()) return;

  try {
    const res = await fetch(`/api/posts/${post._id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });

    const data = await res.json();
    setComments((prev) => [
      ...prev,
      data.comment, // use the populated one from backend
    ]);
    setCommentText('');
  } catch (err) {
    console.error('Comment failed:', err);
  }
};

  return (
    <div className="bg-white p-4 rounded shadow-md space-y-3">
      {/* Post Header */}
      <div className="flex items-center gap-3">
        <Link href={`/profile/${post.author?._id}`} className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
          {nameInitial}
        </Link>
        <div>
          <Link href={`/profile/${post.author?._id}`} className="text-blue-700 font-semibold hover:underline">
            {post.author?.name || 'Unknown'}
          </Link>
          <div className="text-xs text-gray-500">{formattedDate}</div>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 text-sm md:text-base whitespace-pre-wrap">{post.content}</p>

      {/* Actions */}
      <div className="flex gap-6 text-sm text-gray-600">
        <button onClick={handleLike} className={liked ? 'text-blue-600' : 'hover:text-blue-600'}>
          👍 Like {likeCount > 0 && `(${likeCount})`}
        </button>
        <button onClick={() => setShowComments((prev) => !prev)} className="hover:text-blue-600">
          💬 Comment ({comments.length})
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <>
          {/* Form */}
          <form onSubmit={handleComment} className="flex items-center gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border rounded text-sm text-gray-800"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Send
            </button>
          </form>

          {/* Comments */}
          <div className="mt-2 space-y-3">
            {comments.map((c, idx) => {
              const initial = c.user?.name?.[0]?.toUpperCase() || 'U';
              const date = new Date(c.createdAt).toLocaleString();

              return (
                <div key={idx} className="flex items-start gap-2">
                  <Link href={`/profile/${c.user?._id}`} className="w-9 h-9 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {initial}
                  </Link>
                  <div className="bg-gray-100 rounded p-2 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-gray-800">
                        {c.user?.name || 'User'}
                      </span>
                      <span className="text-xs text-gray-500">{date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{c.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
