'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar, { NavigationItem, UserProfile } from './Sidebar';
import Header from './Header';
import { AlertTriangle } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navigation: NavigationItem[];
  user: UserProfile;
}

export default function DashboardLayout({ children, navigation, user }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Close mobile sidebar drawer when pathname shifts
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('registered_patient_profile');
    localStorage.removeItem('registered_doctor_profile');
    setIsLogoutConfirmOpen(false);
    router.push('/login');
  };

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
        onLogout={() => setIsLogoutConfirmOpen(true)}
      />

      {/* 3. Main Content Container Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar Header */}
        <Header 
          user={user} 
          setIsSidebarOpen={setIsSidebarOpen} 
          onLogout={() => setIsLogoutConfirmOpen(true)}
        />

        {/* Dynamic Inner Panel Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* 4. Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsLogoutConfirmOpen(false)}
          />
          
          {/* Card Container */}
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-6 text-center shadow-2xl ring-1 ring-slate-100/50 transition-all animate-in zoom-in-95 slide-in-from-bottom-8 duration-200 ease-out">
            {/* Warning Icon Badge */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 animate-pulse">
              <AlertTriangle className="h-7 w-7" />
            </div>
            
            <h3 className="text-lg font-bold text-brand-text mb-2">Confirm Sign Out</h3>
            <p className="text-xs font-semibold text-slate-400 leading-relaxed mb-6">
              Are you sure you want to log out? You will need to re-authenticate to access your workspace.
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-98 transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-md shadow-red-600/25 active:scale-98 transition-all duration-150 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export type { NavigationItem, UserProfile };
