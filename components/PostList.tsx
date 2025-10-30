'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { MoreHorizontal, Trash2, Edit, Calendar, Tag } from 'lucide-react';

// Define the type for a post, matching our database schema
type Post = {
  id: number;
  created_at: string;
  title: string;
  category: string;
  content: string | null;
};

// We add a default value `initialPosts = []` to the props.
// This is a robust way to prevent crashes if the prop is ever undefined.
export default function PostsList({ initialPosts = [] }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase.from('posts').delete().match({ id });
      if (error) {
        toast.error(`Error deleting post: ${error.message}`);
      } else {
        setPosts(posts.filter(post => post.id !== id));
        toast.success('Post deleted successfully!');
      }
    }
  };

  // A more visually appealing "empty state" for when there are no posts
  if (posts.length === 0) {
    return (
        <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-700">No Posts Yet</h3>
            <p className="text-slate-500 mt-2">Click "Create New Post" to get started.</p>
        </div>
    );
  }

  // We are no longer using a <table>. We use <div>s with a CSS Grid for flexibility.
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      {/* 1. DESKTOP-ONLY HEADER */}
      {/* This header is hidden on mobile (`hidden`) and appears as a grid on medium screens and up (`md:grid`) */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-1 text-right">Actions</div>
      </div>
      
      {/* 2. LIST OF POSTS */}
      <div className="divide-y divide-slate-200">
        {posts.map((post) => (
          // On mobile, this is a single column block. On desktop, it's a 12-column grid.
          <div key={post.id} className="grid grid-cols-1 md:grid-cols-12 p-4 md:px-6 md:py-4 items-center gap-y-4 gap-x-6 hover:bg-slate-50 transition-colors">
            
            {/* Title - Takes up most of the space */}
            <div className="md:col-span-5">
              <Link href={`/posts/edit/${post.id}`} className="font-semibold text-slate-800 hover:text-indigo-600 text-base">
                {post.title}
              </Link>
            </div>
            
            {/* Category - with a nice icon */}
            <div className="md:col-span-3 flex items-center gap-x-2">
              <Tag className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-600">{post.category}</span>
            </div>

            {/* Date - with a nice icon */}
            <div className="md:col-span-3 flex items-center gap-x-2">
                <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-600">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {/* 3. RESPONSIVE ACTIONS MENU */}
            {/* On mobile this is easy to tap. On desktop it's a clean dropdown. */}
            <div className="md:col-span-1 flex justify-end">
              <div className="relative group">
                <button className="p-1.5 rounded-md hover:bg-slate-200 transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-slate-500" />
                </button>
                {/* This menu is hidden by default and appears on hover of the parent 'group' */}
                <div className="absolute top-full right-0 z-10 w-36 bg-white border border-slate-200 rounded-lg shadow-xl hidden group-hover:block">
                  <Link href={`/posts/edit/${post.id}`} className="flex w-full items-center gap-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    <Edit size={14} /> Edit Post
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="w-full flex items-center gap-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}