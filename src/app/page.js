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
    if (skip === 0) {
      fetchPosts();
    }
  }, [skip]);

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
      setHasMore(true);
      setSkip(0); // This triggers fetch via useEffect
    } else {
      alert(data.error || 'Something went wrong');
    }
  };


  return (
    <div className="min-h-screen bg-fixed bg-center bg-cover"
      style={{
      backgroundImage: 'linear-gradient(to bottom right, #d1d5db, #ffffff, #9CA3AF)',
    }}>
      {/* Header */}
      <header className="bg-white shadow-sm py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight text-shadow-lg/10">
          <span className="text-blue-600">LinkedIn</span>
          <span className="text-gray-700 ml-1">Lite</span>
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link href="/login" className="text-blue-600 font-bold hover:underline text-shadow-lg/10">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 shadow-lg/20">Register</Link>
            </>
          )}
          {user && (
            <>
              <button
                onClick={() => router.push(`/profile/${user._id}`)}
                className="bg-blue-500 text-white size-8 md:size-9 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-blue-600 shadow-lg/20"
              >
                {user.name?.[0].toUpperCase() || 'U'}
              </button>
              <button
                onClick={logout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 shadow-lg/20"
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
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg shadow-lg/20">
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
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 transition shadow-lg/20"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        )}


        {/* Posts Feed */}
        <div className="space-y-4">
          {loading && posts.length === 0 ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>


        {/* Loading + Observer */}
        <div ref={loaderRef} className="text-center py-4">
          {loading && <p>Loading more...</p>}
          {!hasMore && <p className="text-white">No more posts.</p>}
        </div>
      </main>
    </div>
  );
}