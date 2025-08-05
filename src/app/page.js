'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';

const LIMIT = 5;

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  const { user, token, logout } = useAuth();
  const router = useRouter();

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/posts?limit=${LIMIT}&skip=${skip}`);
      const data = await res.json();

      if (res.ok) {
        setPosts((prev) => {
          const allPosts = [...prev, ...data.posts];
          const uniquePosts = Array.from(
            new Map(allPosts.map((p) => [p._id, p])).values()
          );
          return uniquePosts;
        });
        setSkip((prev) => prev + data.posts.length);
        if (data.posts.length < LIMIT) setHasMore(false);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef, hasMore, loading]);

  const [content, setContent] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content) return;

    const res = await fetch('/api/posts/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    if (res.ok) {
      setContent('');
      setPosts([]);
      setSkip(0);
      setHasMore(true);
      fetchPosts(); // Reload fresh
    } else {
      alert(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between px-6 sticky top-0 z-10">
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600">LinkedIn Lite</span>
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link href="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Register</Link>
            </>
          )}
          {user && (
            <>
              <button
                onClick={() => router.push(`/profile/${user._id}`)}
                className="bg-blue-500 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-blue-600"
              >
                {user.name?.[0].toUpperCase() || 'U'}
              </button>
              <button
                onClick={logout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {/* New Post Form */}
        {user && (
          <div className="bg-white p-3 rounded shadow-md mb-6">
            <form onSubmit={handlePost}>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 resize-none p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 transition"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        )}


        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, index) => (
  <PostCard key={post._id} post={post} />
))}
        </div>

        {/* Loading + Observer */}
        <div ref={loaderRef} className="text-center py-4">
          {loading && <p>Loading more...</p>}
          {!hasMore && <p className="text-gray-400">No more posts.</p>}
        </div>
      </main>
    </div>
  );
}
