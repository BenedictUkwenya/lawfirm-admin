import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from 'react-hot-toast'; // 1. Import Toaster

export const metadata: Metadata = {
  title: "Law Firm Admin",
  description: "Admin dashboard for the law firm blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" /> {/* 2. Add the component here */}
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}