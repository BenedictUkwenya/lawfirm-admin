'use client'; // 1. This is now officially a Client Component

import Link from 'next/link';
import { useState, useEffect } from 'react'; // 2. Import hooks for state and effects
import { supabase } from '@/lib/supabaseClient';
import PostsList from '@/components/PostList';
import { Plus } from 'lucide-react';

// Define the Post type here as well for our state
type Post = {
  id: number;
  created_at: string;
  title: string;
  category: string;
  content: string | null;
};

// This is no longer an 'async' function in the signature
export default function ManagePostsPage() {
  // 3. Create state for posts and loading status
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. Use useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } else {
        setPosts(data);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []); // The empty array ensures this runs only once on mount

  // 5. Render UI based on the state (loading, error, or success)
  return (
    <div className="animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Posts</h1>
          <p className="text-slate-500 mt-1">Create, edit, and manage all articles for the firm's blog.</p>
        </div>
        <Link 
          href="/posts/create" 
          className="flex items-center justify-center gap-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-500 transition-all duration-200"
        >
          <Plus size={18} />
          Create New Post
        </Link>
      </header>

      {/* Conditional rendering */}
      {isLoading ? (
        <div className="text-center py-20">Loading posts...</div>
      ) : error ? (
        <div className="p-8 bg-red-100 text-red-700 rounded-lg">Error fetching posts: {error}</div>
      ) : (
        <PostsList initialPosts={posts} />
      )}
    </div>
  );
}