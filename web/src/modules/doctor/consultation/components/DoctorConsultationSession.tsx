'use client';

import React, { useState } from 'react';
import { 
  Video, Mic, PhoneOff, Monitor, Settings, Send, 
  MessageSquare, VideoOff, MicOff, CheckCircle2, 
  AlertCircle, X, ShieldAlert, FileText, User, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DoctorConsultationSession() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { sender: 'doctor', text: 'Hello Arthur, how have you been feeling since we adjusted your blood pressure medication?', time: '2:31 PM' },
    { sender: 'patient', text: 'Hi Dr. Adams, much better! The headaches have stopped completely, but I still feel slightly dizzy in the mornings.', time: '2:32 PM' }
  ]);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Session completion modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [prescriptionsAdded, setPrescriptionsAdded] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'doctor', text: input, time: '2:33 PM' }]);
    setInput('');
  };

  const handleConfirmComplete = () => {
    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  const handleFinish = () => {
    setIsSuccessOpen(false);
    router.push('/doctor/appointments');
  };

  return (
    <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300">
      
      {/* Patient Banner Info Strip */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            AP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900">Active Patient: Arthur Pendragon</h2>
              <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded">Checked In</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
              DOB: Aug 12, 1989 (36 yrs) · Gender: Male · Blood Type: O+ · ID: #PT-88301
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsConfirmOpen(true)}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-accent-dark transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Complete Session
          </button>
        </div>
      </div>

      {/* Grid Layout: Video Feed Left, Patient Vitals & Chat Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Video Column (2/3) */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-4 h-full">
          
          {/* Main Video Viewport (Webcam Canvas) */}
          <div className="relative flex-1 min-h-[350px] overflow-hidden rounded-3xl bg-slate-950 shadow-md border border-slate-100 flex items-center justify-center">
            {/* Main Video (Patient) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/25 text-white text-3xl font-extrabold border-2 border-primary shadow-md animate-pulse">
                  AP
                </div>
                <span className="block text-sm font-extrabold text-white">Arthur Pendragon (Patient webcam feed)</span>
                <span className="block text-[10px] text-slate-400 font-semibold">720p · 30fps · Mono Audio</span>
              </div>
            </div>

            {/* Picture-in-Picture (Doctor Feed) */}
            <div className="absolute bottom-6 right-6 h-28 sm:h-36 aspect-video rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl flex items-center justify-center transition-all">
              {isVideoOff ? (
                <div className="text-center p-2">
                  <VideoOff className="h-5 w-5 text-slate-500 mx-auto" />
                  <span className="block text-[8px] text-slate-500 mt-1 font-bold">Video Muted</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white text-xs font-bold border border-slate-700">
                    EA
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
                HD Connection
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap justify-center items-center gap-3.5 bg-white border border-slate-100 rounded-2xl py-3 px-6 shadow-sm max-w-lg mx-auto w-full">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isMuted ? 'bg-rose-50/80 text-rose-550 hover:bg-rose-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isVideoOff ? 'bg-rose-50/80 text-rose-550 hover:bg-rose-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>

            <button 
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isScreenSharing ? 'bg-primary-light text-primary hover:bg-primary/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900'
              }`}
              title={isScreenSharing ? 'Stop Share' : 'Share Screen'}
            >
              <Monitor className="h-5 w-5" />
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900 transition-colors cursor-pointer" title="Settings">
              <Settings className="h-5 w-5" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
            
            <button 
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-accent hover:bg-accent-dark text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs"
              title="Complete Consultation Session"
            >
              <CheckCircle2 className="h-4.5 w-4.5" /> Complete Session
            </button>

            <Link 
              href="/doctor/appointments"
              className="flex h-10 w-12 items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-xs" 
              title="Hang Up without Completing"
            >
              <PhoneOff className="h-5 w-5" />
            </Link>
          </div>

        </div>

        {/* Sidebar Column (1/3): Vitals & Chat */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          
          {/* Patient Health Indicators Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Patient Live Vitals</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-450 font-medium">Heart Rate</span>
                <span className="block text-sm font-black text-rose-500 mt-0.5">72 bpm</span>
              </div>
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-450 font-medium">Blood Pressure</span>
                <span className="block text-sm font-black text-primary mt-0.5">120/80 mmHg</span>
              </div>
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-450 font-medium block">Last Clinic Check-up</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">Hypertension review</span>
                </div>
                <span className="text-[10px] font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-sm">Stable</span>
              </div>
            </div>
          </div>

          {/* Consultation Chat */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col h-80 flex-1">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5 shrink-0">
              <MessageSquare className="h-4 w-4 text-primary" /> Consultation Chat
            </h3>
            
            {/* Scrollable messages container */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2 text-xs scrollbar-thin scrollbar-thumb-slate-200">
              {messages.map((m, index) => (
                <div key={index} className={`flex flex-col ${m.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] text-slate-450 mb-0.5 px-1 font-bold">{m.sender === 'doctor' ? 'You' : 'Arthur'}</span>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] font-semibold leading-relaxed ${
                    m.sender === 'doctor' 
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
                placeholder="Type message..."
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

      {/* CONFIRM COMPLETION MODAL */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 relative animate-in scale-in duration-200 space-y-4">
            <button 
              onClick={() => setIsConfirmOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="h-10 w-10 rounded-full bg-accent-light text-accent flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Complete Consultation Session?</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Finalize visit record for Arthur Pendragon</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              This action will mark the session status as <strong className="text-accent">Completed</strong>. Arthur will be disconnected, and you will finalize the medical logs.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Consultation Notes & Diagnosis (Optional)
                </label>
                <textarea 
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Record summary of symptoms discussed, diagnoses, and medical advice..."
                  className="w-full rounded-xl border border-slate-100 p-2.5 text-xs text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-primary/25 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="prescription-check" 
                  checked={prescriptionsAdded}
                  onChange={(e) => setPrescriptionsAdded(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="prescription-check" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  e-Prescription submitted for refill
                </label>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-550 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmComplete}
                className="flex-1 py-2 text-xs font-bold text-white bg-accent hover:bg-accent-dark rounded-xl shadow-md shadow-accent/10 cursor-pointer transition-all"
              >
                Yes, Complete Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS RECEIPT MODAL */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 text-center animate-in scale-in duration-200 space-y-6">
            
            {/* Animated bouncing checkmark icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-accent border border-accent/15 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-black text-slate-900">Consultation Finished Successfully!</h2>
              <p className="text-xs text-slate-500 font-semibold">The session report has been generated and saved.</p>
            </div>

            {/* Receipt Summary Sheet */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5 text-left text-xs font-semibold text-slate-650 space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/60">
                <span className="flex items-center gap-1.5 text-slate-450"><User className="h-4 w-4" /> Patient Name</span>
                <span className="font-extrabold text-slate-800">Arthur Pendragon</span>
              </div>
              
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/60">
                <span className="flex items-center gap-1.5 text-slate-450"><Clock className="h-4 w-4" /> Session Duration</span>
                <span className="font-extrabold text-slate-800">22 mins 14 secs</span>
              </div>

              {prescriptionsAdded && (
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/60">
                  <span className="flex items-center gap-1.5 text-slate-450"><FileText className="h-4 w-4" /> Prescription status</span>
                  <span className="text-[10px] font-extrabold bg-primary-light text-primary px-2 py-0.5 rounded">Submitted</span>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-slate-450 flex items-center gap-1.5"><FileText className="h-4 w-4" /> Logged Notes</span>
                <p className="font-medium text-slate-600 bg-white rounded-lg p-2.5 border border-slate-100 max-h-24 overflow-y-auto italic">
                  {sessionNotes.trim() ? sessionNotes : "No specific notes logged."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50/45 p-3 rounded-2xl border border-blue-55/15 text-[10px] text-blue-700 text-left">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>A follow-up email with prescription guidelines and visit record details has been sent to Arthur.</span>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark font-extrabold text-xs transition-all shadow-xs cursor-pointer"
            >
              Return to Appointments List
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
