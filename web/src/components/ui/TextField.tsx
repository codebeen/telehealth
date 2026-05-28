import React, { InputHTMLAttributes } from 'react';
import { LucideIcon, AlertCircle } from 'lucide-react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      icon: Icon,
      rightElement,
      required,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        <label htmlFor={id} className="block text-xs font-bold text-slate-600 tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        
        <div className="relative">
          {Icon && (
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
              <Icon className="h-4 w-4" />
            </span>
          )}
          
          <input
            id={id}
            ref={ref}
            required={required}
            className={`block w-full h-11 rounded-xl border px-3.5 text-xs font-medium text-brand-text outline-hidden focus:ring-1 transition-all ${
              Icon ? 'pl-10' : 'pl-3.5'
            } ${
              rightElement ? 'pr-10' : 'pr-3.5'
            } ${
              error 
                ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' 
                : 'border-slate-200 focus:border-primary/30 focus:ring-primary/30'
            } ${className}`}
            {...props}
          />
          
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
            <AlertCircle className="h-3 w-3 shrink-0" /> {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
