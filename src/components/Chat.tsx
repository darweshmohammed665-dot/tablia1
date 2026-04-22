import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, off, serverTimestamp } from 'firebase/database';
import { rtdb, auth } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, MessageCircle, X } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface ChatProps {
  orderId: string;
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Chat({ orderId, recipientName, isOpen, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rtdb || !orderId) return;

    const chatRef = ref(rtdb, `chats/${orderId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, msg]: [string, any]) => ({
          id,
          ...msg,
        })).sort((a, b) => {
          const t1 = typeof a.timestamp === 'number' ? a.timestamp : Date.now();
          const t2 = typeof b.timestamp === 'number' ? b.timestamp : Date.now();
          return t1 - t2;
        });
        setMessages(messageList);
      }
    });

    return () => {
      off(chatRef, 'value', unsubscribe);
    };
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !rtdb || !auth?.currentUser) return;

    const chatRef = ref(rtdb, `chats/${orderId}`);
    await push(chatRef, {
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || 'مستخدم',
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-brand-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <span className="font-bold">محادثة مع {recipientName}</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto space-y-4 bg-stone-50"
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === auth?.currentUser?.uid;
          return (
            <div 
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                isMe 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
              }`}>
                <p className="font-bold text-[10px] mb-1 opacity-70">{msg.senderName}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-100 bg-white flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-grow px-4 py-2 rounded-full border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all text-sm"
        />
        <button 
          type="submit"
          className="bg-brand-primary text-white p-2 rounded-full hover:scale-110 transition-transform"
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
}
