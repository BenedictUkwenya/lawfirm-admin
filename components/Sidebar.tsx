'use client';

// Step 1: Import all necessary hooks, components, and utilities
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import our custom auth hook
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  PenSquare, 
  Settings, 
  BookText, 
  LogOut 
} from 'lucide-react';

// Step 2: Define the props for the component.
// These are passed from the layout to control its visibility on mobile.
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Step 3: Define the component function.
const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // Step 4: Use hooks to get necessary data and functions.
  const pathname = usePathname(); // Gets the current URL path (e.g., "/posts")
  const router = useRouter(); // Allows us to programmatically navigate
  const { session } = useAuth(); // Gets the current user session from our AuthContext

  // Step 5: Define the sign-out logic.
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Sign out failed. Please try again.');
    } else {
      // Redirect to the login page after a successful sign-out.
      router.push('/login');
    }
  };

  // Step 6: Define a helper function to dynamically set link styles.
  // This keeps our JSX clean and readable.
  const getLinkClass = (path: string, startsWith = false) => {
    const isActive = startsWith ? pathname.startsWith(path) : pathname === path;
    const baseClasses = 'flex items-center w-full p-3 rounded-lg transition-all duration-200 gap-x-3';
    
    if (isActive) {
      return `${baseClasses} bg-indigo-600 text-white shadow-lg`; // Style for the active link
    }
    return `${baseClasses} text-slate-400 hover:bg-slate-800 hover:text-white`; // Style for inactive links
  };

  // Step 7: Render the component's JSX.
  return (
    <>
      {/* Mobile Overlay: Appears behind the sidebar on mobile to allow closing it by tapping outside */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* The Main Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 flex-shrink-0 bg-slate-900 text-white p-6 flex flex-col z-40
                   transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Section */}
        <div className="mb-10 flex items-center gap-x-3">
          <BookText className="h-8 w-8 text-indigo-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Law Firm Admin
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <Link href="/" className={getLinkClass('/')} onClick={onClose}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/posts" className={getLinkClass('/posts', true)} onClick={onClose}>
                 <PenSquare className="h-5 w-5" />
                 <span>Manage Posts</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className={getLinkClass('/settings')} onClick={onClose}>
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Dynamic User Profile and Sign Out Section */}
        <div className="mt-auto space-y-2">
            {/* We only render this box if the session exists */}
            {session?.user && (
                <div className="p-3 rounded-lg bg-slate-800 break-words">
                    {/* Here is the dynamic part: we display the user's email */}
                    <p className="text-sm font-semibold text-white truncate">
                        {session.user.email}
                    </p>
                    <p className="text-xs text-slate-400">Administrator</p>
                </div>
            )}
            <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-x-3 p-3 rounded-lg text-slate-400 hover:bg-red-900/50 hover:text-red-400 transition-all duration-200"
            >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;