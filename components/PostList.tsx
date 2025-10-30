'use client';

import Link from 'next/link';
import { useState } from 'react'; // Import useState to manage menu state
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { MoreHorizontal, Trash2, Edit, Calendar, Tag } from 'lucide-react';

// (The Post type definition is unchanged)
type Post = {
  id: number;
  created_at: string;
  title: string;
  category: string;
  content: string | null;
};

export default function PostsList({ initialPosts = [] }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  // 1. ADD STATE FOR THE DROPDOWN MENU
  // This will store the ID of the post whose menu is currently open.
  // 'null' means no menu is open.
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // (handleDelete function is unchanged and correct)
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
  
  // A helper function to toggle the menu for a specific post
  const handleMenuToggle = (postId: number) => {
    // If the clicked menu is already open, close it. Otherwise, open it.
    setOpenMenuId(prevId => (prevId === postId ? null : postId));
  };


  // (The "empty state" is unchanged and correct)
  if (posts.length === 0) {
    return (
        <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-700">No Posts Yet</h3>
            <p className="text-slate-500 mt-2">Click "Create New Post" to get started.</p>
        </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      {/* (The desktop-only header is unchanged and correct) */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-1 text-right">Actions</div>
      </div>
      
      <div className="divide-y divide-slate-200">
        {posts.map((post) => (
          <div key={post.id} className="grid grid-cols-1 md:grid-cols-12 p-4 md:px-6 md:py-4 items-start md:items-center gap-y-4 gap-x-6 hover:bg-slate-50 transition-colors">
            
            {/* (Title, Category, Date are unchanged and correct) */}
            <div className="md:col-span-5">
              <Link href={`/posts/edit/${post.id}`} className="font-semibold text-slate-800 hover:text-indigo-600 text-base">
                {post.title}
              </Link>
            </div>
            <div className="md:col-span-3 flex items-center gap-x-2">
              <Tag className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-600">{post.category}</span>
            </div>
            <div className="md:col-span-3 flex items-center gap-x-2">
                <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-600">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {/* 2. UPDATE THE ACTIONS MENU */}
            <div className="md:col-span-1 flex justify-end">
              <div className="relative">
                {/* Add onClick handler and an aria-label for accessibility */}
                <button
                  onClick={() => handleMenuToggle(post.id)}
                  aria-label="Open post actions menu"
                  className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5 text-slate-500" />
                </button>
                {/* 
                  The menu is now shown based on state, not hover.
                  We check if the 'openMenuId' matches the current 'post.id'.
                */}
                <div 
                  className={`absolute top-full right-0 z-10 w-36 bg-white border border-slate-200 rounded-lg shadow-xl transition-opacity duration-200
                  ${openMenuId === post.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
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