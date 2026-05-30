'use client';

import React, { useState } from 'react';
import { 
  Video, Mic, PhoneOff, Settings, Send, 
  MessageSquare, VideoOff, MicOff
} from 'lucide-react';
import Link from 'next/link';

export default function PatientConsultationSession() {
  const [messages, setMessages] = useState([
    { sender: 'doctor', text: 'Hello Arthur, how have you been feeling since we adjusted your blood pressure medication?', time: '2:31 PM' },
    { sender: 'patient', text: 'Hi Dr. Adams, much better! The headaches have stopped completely, but I still feel slightly dizzy in the mornings.', time: '2:32 PM' }
  ]);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'patient', text: input, time: '2:33 PM' }]);
    setInput('');
  };

  return (
    <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300">
      
      {/* Grid Layout: Video Feed Left, Session Details & Chat Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Video Column (2/3) */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-4 h-full">
          
          {/* Main Video Viewport (Webcam canvas) */}
          <div className="relative flex-1 min-h-[350px] overflow-hidden rounded-3xl bg-slate-950 shadow-md border border-slate-100 flex items-center justify-center">
            {/* Main Video (Doctor) */}
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent/25 text-white text-3xl font-extrabold border-2 border-accent shadow-md animate-pulse">
                EA
              </div>
              <span className="block text-sm font-extrabold text-white">Dr. Evelyn Adams (Doctor Live Feed)</span>
              <span className="block text-[10px] text-slate-400 font-semibold">1080p · 60fps · Stereo Audio</span>
            </div>

            {/* Picture-in-Picture (Patient Feed) */}
            <div className="absolute bottom-6 right-6 h-28 sm:h-36 aspect-video rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl flex items-center justify-center transition-all">
              {isVideoOff ? (
                <div className="text-center p-2">
                  <VideoOff className="h-5 w-5 text-slate-500 mx-auto" />
                  <span className="block text-[8px] text-slate-500 mt-1 font-bold">Video Muted</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white text-xs font-bold border border-slate-700">
                    AP
                  </div>
                  <span className="block text-[8px] text-slate-400 mt-1 font-bold">You (Self Feed)</span>
                </div>
              )}
            </div>

            {/* Video Overlay Info */}
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-white bg-slate-900/80 border border-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" /> LIVE · 04:32
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-white bg-slate-900/80 border border-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs">
                Encrypted Connection
              </span>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="flex justify-center items-center gap-4 bg-white border border-slate-100 rounded-2xl py-3 px-6 shadow-sm max-w-md mx-auto w-full">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isMuted ? 'bg-rose-50/80 text-rose-500 hover:bg-rose-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-655 hover:text-slate-900'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isVideoOff ? 'bg-rose-50/80 text-rose-500 hover:bg-rose-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-655 hover:text-slate-900'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-655 hover:text-slate-900 transition-colors cursor-pointer" title="Call Settings">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-1" />
            
            <Link 
              href="/patient/appointment"
              className="flex h-10 w-14 items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-xs" 
              title="Hang Up Consultation"
            >
              <PhoneOff className="h-5 w-5" />
            </Link>
          </div>

        </div>

        {/* Sidebar Column (1/3): Summary & Chat */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          
          {/* Session Details Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Session Info</h3>
            
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-450">Practitioner</span>
                <span className="font-extrabold text-slate-850">Dr. Evelyn Adams</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-450">Specialization</span>
                <span className="font-extrabold text-slate-850">Cardiology</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-450">Consultation ID</span>
                <span className="font-mono text-[10px] text-slate-500">#CS-EA-93041</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-450">Medications Shared</span>
                <span className="text-accent font-extrabold flex items-center gap-1">Yes</span>
              </div>
            </div>
          </div>

          {/* Consultation Chat */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col h-80 flex-1">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5 shrink-0">
              <MessageSquare className="h-4 w-4 text-primary" /> Live Call Chat
            </h3>
            
            {/* Scrollable messages container */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2 text-xs scrollbar-thin scrollbar-thumb-slate-200">
              {messages.map((m, index) => (
                <div key={index} className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] text-slate-450 mb-0.5 px-1 font-bold">{m.sender === 'patient' ? 'You' : 'Dr. Adams'}</span>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] font-semibold leading-relaxed ${
                    m.sender === 'patient' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/40'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input field */}
            <div className="mt-3 flex gap-2 shrink-0 border-t border-slate-100 pt-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 h-9 rounded-xl bg-slate-50 border border-transparent px-3 text-xs font-semibold text-slate-700 outline-hidden focus:border-primary/25 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button 
                onClick={sendMessage}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
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
