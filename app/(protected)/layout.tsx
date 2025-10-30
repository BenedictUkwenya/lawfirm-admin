'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If the session is finished loading and there's no user, redirect to login
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [session, isLoading, router]);

  // While loading, we can show a full-page loader to prevent content flashing
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading session...</div>;
  }

  // If there is a session, render the dashboard layout
  if (session) {
    return (
      <div className="flex h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header isSidebarOpen={isSidebarOpen} onMenuClick={() => setSidebarOpen(s => !s)} />
          <main className="flex-1 p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // If no session and not loading (should have been redirected, but as a fallback)
  return null;
}