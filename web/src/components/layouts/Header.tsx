'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, Bell, ChevronDown, User, Settings, LogOut, Stethoscope, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfile } from './Sidebar';

interface HeaderProps {
  user: UserProfile;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function Header({ user, setIsSidebarOpen, onLogout }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New Message', description: 'Dr. Sarah Connor updated your treatment plan.', time: '5m ago', read: false },
    { id: 2, title: 'Appointment Confirmed', description: 'Your session tomorrow at 10:00 AM is scheduled.', time: '1h ago', read: true },
    { id: 3, title: 'Lab Report Ready', description: 'Your blood test results are uploaded.', time: '4h ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Portal Type Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {user.role === 'doctor' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-light border border-primary/10 text-primary animate-in fade-in duration-200">
              <Stethoscope className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Doctor Portal</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-light border border-accent/10 text-accent-dark animate-in fade-in duration-200">
              <Activity className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Patient Portal</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Popups */}
      <div className="flex items-center gap-3">

        {/* Notification Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-brand-text transition-all duration-200 relative",
              isNotificationOpen && "bg-slate-50 text-brand-text border-slate-200"
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
              <div className="absolute right-0 mt-2.5 z-50 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-slate-100 animate-in fade-in-50 slide-in-from-top-3 duration-200">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-brand-text">Notifications</span>
                  <button className="text-[10px] font-bold text-primary hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                      <div className="flex justify-between items-start gap-2">
                        <span className={cn("text-xs font-semibold", item.read ? "text-slate-600" : "text-brand-text font-bold")}>
                          {item.title}
                        </span>
                        <span className="text-[9px] text-slate-400 shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-slate-100 p-1.5 pr-3 hover:bg-slate-50 transition-all duration-200",
              isProfileOpen && "bg-slate-50 border-slate-200"
            )}
          >
            <div className="h-7 w-7 overflow-hidden rounded-lg bg-slate-200">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <span className="hidden text-xs font-semibold text-brand-text md:block">
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-2.5 z-50 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-slate-100 animate-in fade-in-50 slide-in-from-top-3 duration-200">
                <div className="px-3 py-2.5 border-b border-slate-50">
                  <p className="text-xs font-bold text-brand-text truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link 
                    href={user.role === 'doctor' ? '/doctor/profile' : '/patient/profile'}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-text transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    My Profile
                  </Link>
                  <Link 
                    href={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-text transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-slate-50 pt-1 mt-1">
                  <button 
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
