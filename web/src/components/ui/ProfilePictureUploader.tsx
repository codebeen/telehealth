'use client';

import React from 'react';
import { User, Camera, X } from 'lucide-react';

interface ProfilePictureUploaderProps {
  value: string;
  onChange: (val: string) => void;
}

export function ProfilePictureUploader({ value, onChange }: ProfilePictureUploaderProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 pb-4">
      <div className="relative group h-24 w-24 rounded-full border-2 border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer shadow-xs hover:border-primary/50 transition-all">
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                onChange(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {value ? (
          <img src={value} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <User className="h-10 w-10 text-slate-350" />
        )}

        <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera className="h-5 w-5" />
          <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Upload</span>
        </div>
      </div>

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <X className="h-3 w-3" /> Remove picture
        </button>
      )}
      <p className="text-[10px] text-slate-400 font-medium text-center max-w-[180px] leading-snug">
        Click the circle above to upload your profile photo. Accepted: JPG, PNG.
      </p>
    </div>
  );
}
