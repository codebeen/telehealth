'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'warning' | 'success';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-dark shadow-primary/15';
      case 'danger':
        return 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/15';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/15';
      case 'success':
        return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/15';
    }
  };

  const getIconContainerClass = () => {
    switch (variant) {
      case 'primary':
        return 'text-primary bg-primary-light';
      case 'danger':
        return 'text-rose-500 bg-rose-50';
      case 'warning':
        return 'text-amber-500 bg-amber-50';
      case 'success':
        return 'text-emerald-500 bg-emerald-50';
    }
  };

  const renderIcon = () => {
    switch (variant) {
      case 'primary':
        return <Info className="h-6 w-6" />;
      case 'danger':
        return <XCircle className="h-6 w-6" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6" />;
      case 'success':
        return <CheckCircle2 className="h-6 w-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-50 space-y-4 text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Dynamic Icon */}
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${getIconContainerClass()}`}>
          {renderIcon()}
        </div>

        {/* Title & Message */}
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-brand-text">{title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button 
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition-colors ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
