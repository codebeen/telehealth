'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, BrainCircuit, User, Star, Clock, 
  DollarSign, ChevronRight, RefreshCw, X, MessageSquare
} from 'lucide-react';
import { mockDoctors } from '@/modules/patient/doctor-discovery/services/doctorService';
import { Doctor } from '@/modules/patient/doctor-discovery/types/doctor';
import DoctorScheduleModal from '@/modules/patient/doctor-discovery/components/DoctorScheduleModal';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  recommendedDoctors?: Doctor[];
}

export default function KyuraChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialMessage: ChatMessage = {
    id: 'msg-init',
    sender: 'ai',
    text: "Hello! I am Kyura, your AI Health Assistant. Please describe any symptoms or healthcare concerns you are experiencing (e.g. chest pain, skin rash, or child's fever), and I'll analyze them to match you with the right specialist.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState<Doctor | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    { label: "Chest pressure", text: "I have chest tightness and a racing heart rate." },
    { label: "Dry skin rash", text: "I have a dry, itchy rash on my left wrist." },
    { label: "Migraines", text: "I've been experiencing severe migraines and lightheadedness." },
    { label: "Child's fever", text: "My 3-year-old has a high fever and is coughing." },
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const matchDoctor = (query: string): Doctor[] => {
    const q = query.toLowerCase();
    const matched: Doctor[] = [];
    
    if (
      q.includes('chest') || q.includes('heart') || q.includes('cardio') || 
      q.includes('bp') || q.includes('pressure') || q.includes('palpitations') || 
      q.includes('breath') || q.includes('cardiology')
    ) {
      const doc = mockDoctors.find(d => d.specialty === 'Cardiology');
      if (doc) matched.push(doc);
    }
    if (
      q.includes('rash') || q.includes('skin') || q.includes('eczema') || 
      q.includes('acne') || q.includes('mole') || q.includes('itch') || 
      q.includes('hair') || q.includes('dermatology') || q.includes('dry')
    ) {
      const doc = mockDoctors.find(d => d.specialty === 'Dermatology');
      if (doc && !matched.includes(doc)) matched.push(doc);
    }
    if (
      q.includes('child') || q.includes('baby') || q.includes('kid') || 
      q.includes('pediatric') || q.includes('pediatrics') || q.includes('growth') ||
      q.includes('vaccination')
    ) {
      const doc = mockDoctors.find(d => d.specialty === 'Pediatrics');
      if (doc && !matched.includes(doc)) matched.push(doc);
    }
    if (
      q.includes('head') || q.includes('migraine') || q.includes('nerve') || 
      q.includes('dizzy') || q.includes('numb') || q.includes('tremor') || 
      q.includes('brain') || q.includes('neurology') || q.includes('headache')
    ) {
      const doc = mockDoctors.find(d => d.specialty === 'Neurology');
      if (doc && !matched.includes(doc)) matched.push(doc);
    }
    
    // Default/Fallback to General Medicine if general keywords match or if we found no specific matches
    if (
      matched.length === 0 || 
      q.includes('fever') || q.includes('cough') || q.includes('flu') || 
      q.includes('cold') || q.includes('throat') || q.includes('fatigue') || 
      q.includes('sore') || q.includes('allergy') || q.includes('general')
    ) {
      const doc = mockDoctors.find(d => d.specialty === 'General Medicine');
      if (doc && !matched.includes(doc)) matched.push(doc);
    }

    return matched;
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    
    const matched = matchDoctor(userMsg.text);

    setTimeout(() => {
      setIsTyping(false);
      
      let aiText = '';
      if (matched.length > 0) {
        const specialtiesList = Array.from(new Set(matched.map(d => d.specialty)));
        aiText = `Based on your symptoms, I suggest speaking with a specialist in ${specialtiesList.join(' or ')}. Here is the recommended practitioner for you:`;
      } else {
        const genPractitioner = mockDoctors.find(d => d.specialty === 'General Medicine');
        aiText = `I couldn't match those specific symptoms. I recommend starting with a general check-up. Here is our General Medicine practitioner:`;
        if (genPractitioner) matched.push(genPractitioner);
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedDoctors: matched,
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <>
      {/* FLOATING TEXT LABEL */}
      {!isOpen && (
        <div className="fixed bottom-[33px] right-[88px] bg-primary border border-primary-dark shadow-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white animate-in fade-in slide-in-from-right-3 duration-305 pointer-events-none z-40 flex items-center gap-1.5 whitespace-nowrap">
          <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
          Chat with Kyura
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 z-40 group"
        title="Chat with Kyura"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <div className="relative">
            <BrainCircuit className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 border-2 border-primary rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* FLOATING CHAT WIDGET WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-white rounded-3xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden z-40 animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Background decal grid overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-slate-50/50 to-transparent opacity-50 pointer-events-none" />

          {/* Widget Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between z-10 shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/15">
                <BrainCircuit className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wide text-white">Kyura</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-slate-300">Online Health Assistant</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMessages([initialMessage])}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer"
                title="Minimize Chat"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-thin">
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar Icon */}
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border shadow-2xs ${
                    isAI 
                      ? 'bg-slate-50 border-slate-100 text-slate-500' 
                      : 'bg-primary border-primary text-white'
                  }`}>
                    {isAI ? <Sparkles className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5" />}
                  </div>

                  {/* Message Bubble Column */}
                  <div className="space-y-1">
                    <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-normal font-semibold shadow-3xs ${
                      isAI 
                        ? 'bg-slate-50/70 border border-slate-100 text-slate-750 rounded-tl-xs' 
                        : 'bg-primary text-white rounded-tr-xs'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Recommended Doctors list */}
                    {isAI && msg.recommendedDoctors && msg.recommendedDoctors.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        {msg.recommendedDoctors.map((doc) => (
                          <div 
                            key={doc.id} 
                            className="bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all duration-200 p-3 flex flex-col gap-2"
                          >
                            <div className="flex items-center gap-3">
                              {/* Doctor Avatar */}
                              <div className="h-9 w-9 rounded-lg bg-primary-light text-primary flex items-center justify-center font-extrabold text-xs shrink-0 border border-primary/5 shadow-inner">
                                {doc.avatar}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-extrabold text-slate-850 text-xs leading-none truncate">{doc.name}</h4>
                                  <span className="flex items-center gap-0.5 text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-100/50">
                                    <Star className="h-2 w-2 fill-current" /> {doc.rating}
                                  </span>
                                </div>
                                <p className="text-[9px] text-primary font-bold mt-0.5">{doc.specialty}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold border-t border-slate-50 pt-1.5">
                              <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> {doc.experience} exp</span>
                              <span className="flex items-center gap-0.5"><DollarSign className="h-2.5 w-2.5" /> {doc.fee} consult</span>
                            </div>

                            <button 
                              onClick={() => setSelectedDoctorForSchedule(doc)}
                              className="w-full rounded-xl bg-primary hover:bg-primary-dark text-white py-2 text-[10px] font-bold shadow-2xs hover:shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0 mt-0.5"
                            >
                              Book Appointment <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp label */}
                    <span className={`text-[8px] font-bold text-slate-400 block px-1 mt-0.5 ${!isAI ? 'text-right' : ''}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Bouncing Dot Indicator */}
            {isTyping && (
              <div className="flex gap-2 max-w-[75%] mr-auto">
                <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-spin [animation-duration:3s]" />
                </div>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 w-14">
                  <span className="h-1 w-1 bg-slate-450 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1 w-1 bg-slate-450 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1 w-1 bg-slate-450 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* Scroll Target */}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion Chips Panel */}
          <div className="px-4 py-2 border-t border-slate-50 bg-slate-55/20 z-10 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {suggestionChips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(chip.text)}
                  disabled={isTyping}
                  className="text-[9px] font-bold text-slate-600 bg-white border border-slate-100 hover:border-primary/20 hover:text-primary rounded-lg px-2 py-1 shadow-3xs cursor-pointer transition-colors duration-150 disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Console */}
          <div className="p-3 border-t border-slate-100 bg-white z-10 shrink-0">
            <div className="flex gap-2 items-center relative">
              <input
                type="text"
                placeholder="Ask Kyura about symptoms..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                className="flex-1 h-9 rounded-xl border border-slate-200 pl-3 pr-10 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-75"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={isTyping || !inputText.trim()}
                className="absolute right-1.5 top-1.5 h-6 w-6 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                title="Send Message"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Availability Schedule modal overlay */}
      {selectedDoctorForSchedule && (
        <DoctorScheduleModal 
          doctor={selectedDoctorForSchedule} 
          onClose={() => setSelectedDoctorForSchedule(null)} 
        />
      )}
    </>
  );
}
