'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar, { NavigationItem, UserProfile } from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navigation: NavigationItem[];
  user: UserProfile;
}

export default function DashboardLayout({ children, navigation, user }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close mobile sidebar drawer when pathname shifts
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-bg font-sans">
      
      {/* 1. Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar Navigation Panel */}
      <Sidebar 
        navigation={navigation} 
        user={user} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* 3. Main Content Container Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar Header */}
        <Header 
          user={user} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        {/* Dynamic Inner Panel Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
export type { NavigationItem, UserProfile };
