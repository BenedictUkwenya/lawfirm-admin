'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 1. Import the hook
import { LayoutDashboard, PenSquare, Settings } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname(); // 2. Get the current path

  // Helper function to determine the class
  const getLinkClass = (path: string) => {
    // 3. Check if the current path matches the link's path
    return pathname === path
      ? 'flex items-center p-2 bg-gray-700 text-white rounded-md transition-colors' // Active style
      : 'flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors'; // Default style
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Law Firm Admin</h2>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/" className={getLinkClass('/')}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            {/* We also want /posts/create and /posts/edit/[id] to highlight this link */}
            <Link href="/posts" className={pathname.startsWith('/posts') ? getLinkClass('/posts') : getLinkClass('/posts-inactive')}>
               <PenSquare className="mr-3 h-5 w-5" />
               Manage Posts
            </Link>
          </li>
          <li>
            <Link href="/settings" className={getLinkClass('/settings')}>
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;