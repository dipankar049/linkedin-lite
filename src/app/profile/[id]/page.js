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
    <div className="min-h-screen bg-gray-100">
      
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-10 sm:py-16 shadow-md">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-6 text-white">
          <div className="w-24 h-24 bg-white text-blue-600 flex items-center justify-center text-4xl font-bold rounded-full shadow-lg/20 border-4 border-white">
            {nameInitial}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-shadow-lg/10">{userData.name}</h1>
            <p className="text-sm mt-1 text-shadow-lg/10">{userData.bio || 'No bio added.'}</p>
            <p className="text-xs opacity-90 mt-2">
              📝 {userPosts.length} {userPosts.length === 1 ? 'Post' : 'Posts'}
            </p>
          </div>
        </div>
      </div>

      {/* Post Feed Section */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:py-10 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Posts</h2>

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
