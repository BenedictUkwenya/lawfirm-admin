import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient'; // Import our Supabase client
import PostsList from '@/components/PostList'; // We will create this component next

// This is now an async Server Component
export default async function ManagePostsPage() {
  // 1. Fetch data directly from Supabase
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false }); // Get newest posts first

  // 2. Handle potential errors
  if (error) {
    return <p className="text-red-500">Error fetching posts: {error.message}</p>;
  }

  // 3. Render the page with the fetched data
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Posts</h1>
        <Link 
          href="/posts/create" 
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {/* We will pass the fetched posts to a new Client Component for interaction */}
      <PostsList initialPosts={posts || []} />
    </div>
  );
}