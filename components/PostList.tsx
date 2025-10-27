'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

// Define the type for a post, matching our database schema
type Post = {
  id: number;
  created_at: string;
  title: string;
  category: string;
  content: string | null;
};

export default function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      // Delete from Supabase
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id: id });

      if (error) {
        toast.error(`Error deleting post: ${error.message}`);
      } else {
        // Update the UI by removing the post from our local state
        setPosts(posts.filter(post => post.id !== id));
        toast.success('Post deleted successfully!');
      }
    }
  };

  if (posts.length === 0) {
    return <p className="text-gray-500 mt-4">No posts found. Create one!</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{post.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {post.category}
                </span>
              </td>
              {/* Format the date for better readability */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/posts/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </Link>
                <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 ml-4">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}