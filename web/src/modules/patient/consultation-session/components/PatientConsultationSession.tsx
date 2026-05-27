'use client';

import React, { useState } from 'react';
import { 
  Video, Mic, PhoneOff, Settings, Send, 
  MessageSquare 
} from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';

export default function PatientConsultationSession() {
  const [messages, setMessages] = useState([
    { sender: 'doctor', text: 'Hello Arthur, how have you been feeling since we adjusted your blood pressure medication?', time: '2:31 PM' },
    { sender: 'patient', text: 'Hi Dr. Adams, much better! The headaches have stopped completely, but I still feel slightly dizzy in the mornings.', time: '2:32 PM' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'patient', text: input, time: '2:33 PM' }]);
    setInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <PageHeader 
        title="Virtual Consultation Session" 
        description="Practitioner: Dr. Evelyn Adams (Cardiology)" 
        border={true}
        action={
          <Link 
            href="/patient/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Exit Session
          </Link>
        }
      />

      {/* Grid Layout: Video Feed Left, Notes & Chat Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Video Column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Main Video Viewport */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-900 shadow-lg border border-slate-800">
            {/* Main Video (Doctor) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/25 text-white text-3xl font-extrabold border-2 border-accent">
                  EA
                </div>
                <span className="block text-xs font-semibold text-slate-300">Dr. Evelyn Adams (Doctor Live Feed)</span>
              </div>
            </div>

            {/* Picture-in-Picture (Patient Feed) */}
            <div className="absolute bottom-6 right-6 h-28 sm:h-36 aspect-video rounded-2xl border-2 border-white/20 bg-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-semibold">
                  AP
                </div>
                <span className="block text-[8px] text-slate-400 mt-1">You</span>
              </div>
            </div>

            {/* Video Overlay Info */}
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" /> LIVE · 04:32
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                Encrypted Connection
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex justify-center items-center gap-4 bg-white border border-slate-100 rounded-2xl py-3 px-6 shadow-xs max-w-md mx-auto">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Toggle Mic">
              <Mic className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Toggle Video">
              <Video className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Settings">
              <Settings className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <Link 
              href="/patient/dashboard"
              className="flex h-10 w-12 items-center justify-center rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors" 
              title="Hang Up"
            >
              <PhoneOff className="h-5 w-5" />
            </Link>
          </div>

        </div>

        {/* Sidebar Column (1/3): Summary & Chat */}
        <div className="space-y-6">
          
          {/* Prescription & Status Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Session Details</h3>
            
            <div className="space-y-2.5 text-xs text-slate-500">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="font-medium">Specialist</span>
                <span className="font-bold text-brand-text">Dr. Evelyn Adams</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="font-medium">Topic</span>
                <span className="font-bold text-brand-text">Cardiology Follow-up</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium">Prescriptions draft</span>
                <span className="text-accent font-bold flex items-center gap-1">Shared</span>
              </div>
            </div>
          </div>

          {/* Consultation Chat */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col h-80">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5 shrink-0">
              <MessageSquare className="h-4 w-4" /> Consultation Chat
            </h3>
            
            {/* Scrollable messages container */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2 text-xs">
              {messages.map((m, index) => (
                <div key={index} className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-slate-400 mb-0.5 px-1">{m.sender === 'patient' ? 'You' : 'Dr. Adams'}</span>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] ${
                    m.sender === 'patient' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input field */}
            <div className="mt-3 flex gap-2 shrink-0 border-t border-slate-50 pt-3">
              <input
                type="text"
                placeholder="Type message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 h-9 rounded-xl bg-slate-50 border border-transparent px-3 text-xs font-medium text-brand-text outline-hidden focus:border-primary/20 focus:bg-white"
              />
              <button 
                onClick={sendMessage}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
