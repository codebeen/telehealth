'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Stethoscope, SwitchCamera, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface UserProfile {
  name: string;
  role: 'doctor' | 'patient';
  email: string;
  avatarUrl?: string;
}

interface SidebarProps {
  navigation: NavigationItem[];
  user: UserProfile;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ navigation, user, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-[#1F2D3D] transition-transform duration-300 lg:static lg:translate-x-0",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            KY<span className="text-secondary">UR</span>
          </span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar Nav Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-md bg-secondary" />
              )}
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "text-white" : "text-slate-400 group-hover:text-white group-hover:scale-105"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Workspace Toggle & User Card */}
      <div className="border-t border-slate-700/50 p-4 space-y-3 bg-black/15">
        {/* Quick role switcher for demo convenience */}
        <Link 
          href={user.role === 'doctor' ? '/patient/dashboard' : '/doctor/dashboard'}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-2 px-3 text-xs font-semibold text-slate-300 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <SwitchCamera className="h-3.5 w-3.5" />
          Switch to {user.role === 'doctor' ? 'Patient' : 'Doctor'} Space
        </Link>

        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/10 bg-slate-800 shadow-sm">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#1F2D3D] bg-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="truncate text-sm font-semibold text-white leading-tight">{user.name}</h4>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300 bg-white/10 rounded px-1.5 py-0.5 mt-0.5 inline-block">
              {user.role}
            </span>
          </div>
          <Link href="/" title="Log Out" className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/10">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
