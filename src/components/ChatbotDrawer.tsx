import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Send, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const ChatbotDrawer: React.FC = () => {
  const { chatbotOpen, setChatbotOpen, sendChatMessage, products, navigateTo } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: "Welcome, gentlemen. I am your complimentary sartorial assistant. How can I guide your wardrobe choices today? Ask me about color palettes, tailored fits, or finding specific items in our showroom." }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  if (!chatbotOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);

    try {
      // Structure dialogue history for Express AI endpoint
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const botText = await sendChatMessage(userText, history);
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: botText 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: "Pardon my pause. My stylist connection is temporarily occupied. Please try again soon." 
      }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl transition-transform duration-300 md:max-w-md animate-slide-in">
      
      {/* Header element */}
      <div className="flex h-20 items-center justify-between border-b border-neutral-900 bg-black px-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-widest text-amber-500">Personal Stylist</span>
            <span className="block font-sans text-sm font-semibold tracking-wide text-white">Sartorial Guide</span>
          </div>
        </div>
        <button 
          onClick={() => setChatbotOpen(false)}
          className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Suggestion Starter chips */}
      <div className="border-b border-neutral-900 bg-neutral-950 px-6 py-3">
        <span className="block font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-2 font-semibold">Common inquiries:</span>
        <div className="flex flex-wrap gap-1.5">
          {["What is Old Money Style?", "Recommend formal outfits", "Show me Chelsea boots"].map((chip) => (
            <button
              key={chip}
              onClick={() => setInputMessage(chip)}
              className="rounded-full border border-neutral-800 bg-neutral-900/50 px-2.5 py-1 text-[10px] text-neutral-400 hover:text-white hover:border-amber-500 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messaging thread area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-neutral-950/20 p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-900"
      >
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1 font-semibold">
              {m.role === 'user' ? 'You' : 'Stylist Assistant'}
            </span>
            <div 
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-amber-600 font-medium text-black' 
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-200 shadow-sm shadow-amber-500/[0.01]'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex flex-col items-start">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Stylist is drafting...</span>
            <div className="flex space-x-1.5 rounded-lg bg-neutral-900/60 border border-neutral-850 px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick Showcase list embedded */}
      <div className="bg-neutral-900/40 border-t border-neutral-900 px-6 py-3">
        <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5 font-semibold">Store Catalog Shortcuts</span>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {products.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setChatbotOpen(false);
                navigateTo('shop', p.id);
              }}
              className="flex shrink-0 items-center space-x-2 rounded border border-neutral-800 bg-neutral-950/70 p-1.5 text-left hover:border-amber-500 transition-colors"
            >
              <img src={p.image} alt="" className="h-6 w-6 rounded object-cover" />
              <div className="text-[10px]">
                <span className="block text-white truncate max-w-[80px] font-medium leading-none">{p.name}</span>
                <span className="block text-amber-500 leading-none mt-0.5">₹{p.price.toLocaleString('en-IN')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Form input */}
      <form onSubmit={handleSend} className="border-t border-neutral-900 bg-black p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Search, ask styling tip, or select item..."
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 py-3.5 pl-4 pr-12 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="absolute right-2 rounded-md p-2 text-amber-500 hover:text-white hover:bg-neutral-900 transition-all disabled:text-neutral-700 disabled:hover:bg-transparent"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
