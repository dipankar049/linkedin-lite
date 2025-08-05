'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostCard from '@/components/PostCard';

export default function ProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
          setUserPosts(data.posts);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [id]);

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  const nameInitial = userData.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center text-2xl font-bold rounded-full">
            {nameInitial}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
            <p className="text-gray-600 text-sm mt-1">{userData.bio || 'No bio added.'}</p>
            <p className="text-sm text-gray-500 mt-2">
              📝 {userPosts.length} {userPosts.length === 1 ? 'Post' : 'Posts'}
            </p>
          </div>
        </div>

        {/* Post Feed Header */}
        <h2 className="text-xl font-semibold text-gray-800">Recent Posts</h2>

        {/* Posts List */}
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">No posts yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
