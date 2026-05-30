'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  Menu, Bell, ChevronDown, User, LogOut, Stethoscope, Activity, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfile } from './Sidebar';
import { AppNotification } from '@/modules/notifications/types/notification';
import {
  createNotificationSocket,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/modules/notifications/services/notificationService';

interface HeaderProps {
  user: UserProfile;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function Header({ user, setIsSidebarOpen, onLogout }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (!token) return;

    fetchNotifications()
      .then(setNotifications)
      .catch((err) => console.error('Failed to load notifications:', err));

    const socket = createNotificationSocket(token);
    socket.on('connect', () => {
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          socket.emit('notifications:join', { userId: parsed.id });
        } catch {
          // Ignore malformed local user data.
        }
      }
    });
    socket.on('notifications:new', (notification: AppNotification) => {
      setNotifications((current) => [
        notification,
        ...current.filter((item) => item.id !== notification.id),
      ]);
    });
    socket.on('connect_error', (err) => {
      console.error('Notification socket connection failed:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const formatNotificationTime = (value: string) => {
    const date = new Date(value);
    const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
    if (diffMinutes < 1) return 'Now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleMarkAllRead = async () => {
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.isRead) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );
      try {
        await markNotificationRead(notification.id);
      } catch (err) {
        console.error('Failed to mark notification read:', err);
      }
    }
  };

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

        {/* Notification Drawer */}
        <div>
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
              <div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs" onClick={() => setIsNotificationOpen(false)} />
              <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-slate-100 bg-white shadow-2xl animate-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <span className="text-sm font-extrabold text-brand-text">Notifications</span>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Real-time appointment and schedule updates
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNotificationOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50"
                    title="Close notifications"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 px-5 py-3">
                  <span className="text-xs font-bold text-slate-500">
                    {unreadCount} unread
                  </span>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  {notifications.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                        <Bell className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-500">No notifications yet</p>
                      <p className="mt-1 max-w-56 text-[10px] font-medium text-slate-400">
                        Bookings, upcoming appointments, and schedule updates will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNotificationClick(item)}
                          className={cn(
                            'w-full rounded-2xl border p-3 text-left transition-colors',
                            item.isRead
                              ? 'border-slate-100 bg-white hover:bg-slate-50'
                              : 'border-primary/15 bg-primary-light/40 hover:bg-primary-light/60',
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {!item.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                                <span className="text-xs font-extrabold text-brand-text">{item.title}</span>
                              </div>
                              <p className="text-[11px] font-medium leading-relaxed text-slate-500">
                                {item.message}
                              </p>
                            </div>
                            <span className="shrink-0 text-[9px] font-semibold text-slate-400">
                              {formatNotificationTime(item.createdAt)}
                            </span>
                          </div>
                          <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                            {item.type.toLowerCase().replace('_', ' ')}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
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
