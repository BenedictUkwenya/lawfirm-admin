'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true); // To show a loading message
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission

  useEffect(() => {
    if (!postId) return; // Don't run if the ID isn't available yet

    // Define an async function inside the effect to fetch the data
    const fetchPost = async () => {
      // Fetch a single post where the id matches postId
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single(); // .single() is crucial for fetching one record

      if (error) {
        console.error('Error fetching post:', error);
        alert('Could not fetch post data.');
        router.push('/posts'); // Redirect if post not found or error
      } else if (post) {
        // Populate the form with the fetched data
        setTitle(post.title);
        setCategory(post.category);
        setContent(post.content || ''); // Use empty string if content is null
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [postId, router]); // Dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This is the Supabase UPDATE logic
    const { error } = await supabase
      .from('posts')
      .update({ 
        title: title, 
        category: category, 
        content: content 
      })
      .eq('id', postId); // Crucial: specifies WHICH post to update

    if (error) {
      toast.error(`Error updating post: ${error.message}`);
    } else {
      toast.success('Post updated successfully!');
      router.push('/posts');
    }

    setIsSubmitting(false);
  };

  // Show a loading state while fetching initial data
  if (isLoading) {
    return <p>Loading post...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Category Input */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Content Textarea */}
           <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={isSubmitting}
                />
            </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;