'use client';
// No longer need useState here
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}