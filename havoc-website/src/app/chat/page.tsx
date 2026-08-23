"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { toast } from "sonner";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  text: string;
  createdAt: any;
};

export default function ChatPage() {
  const { user, havocUser, loading } = useAuth();
  const { confirm } = useUI();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (!loading && havocUser) {
      if (havocUser.isAdmin) return;
      if (havocUser.status !== "approved") router.push("/dashboard");
      if (!havocUser.chatAccess) router.push("/dashboard");
    }
  }, [user, havocUser, loading, router]);

  useEffect(() => {
    if (!user || (!havocUser?.chatAccess && !havocUser?.isAdmin)) return;

    const q = query(collection(db, "groups", "havoc", "messages"), orderBy("createdAt", "asc"), limit(150));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: 'estimate' })
      })) as ChatMessage[];
      setMessages(msgs);
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth"
          });
        }
      }, 10);
    }, (error) => {
      console.error("Chat subscription error:", error);
      if (error.code === 'permission-denied') {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [user, havocUser, router]);

  if (loading || !user || (!havocUser?.chatAccess && !havocUser?.isAdmin)) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const text = newMessage;
    setNewMessage("");

    try {
      await addDoc(collection(db, "groups", "havoc", "messages"), {
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        text: text.trim(),
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
      setNewMessage(text);
    }
  };

  const handleDelete = async (msgId: string) => {
    if (!havocUser?.isAdmin) return;
    
    const isConfirmed = await confirm({
      title: "Delete Message",
      message: "Are you sure you want to permanently delete this message?",
      confirmText: "Delete",
      destructive: true
    });

    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "groups", "havoc", "messages", msgId));
      } catch (e) {
        console.error(e);
        toast.error("Failed to delete message.");
      }
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FAFAFA] text-black overflow-hidden relative">
      
      {/* Subtle Light Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[800px] bg-gradient-to-b from-black/[0.02] to-transparent rounded-[100%] blur-[100px] pointer-events-none z-0" />

      {/* Glass Header (Flex Item) */}
      <header className="shrink-0 z-20 pt-4 px-4 md:px-6 flex justify-center w-full">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard")} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-all text-black/60 hover:text-black"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-[13px] font-black uppercase tracking-widest text-black leading-tight">War Room</h1>
              <p className="text-[9px] font-bold tracking-[0.2em] text-black/40 uppercase">HAVOC Secure Channel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 border border-black/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-black/60">Live</span>
          </div>
        </div>
      </header>

      {/* Messages Area (Flex-1) */}
      <main ref={scrollContainerRef} data-lenis-prevent="true" className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-6 custom-scrollbar z-10 w-full max-w-4xl mx-auto">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white border border-black/5 px-6 py-4 rounded-2xl text-black/40 font-bold uppercase tracking-widest text-xs shadow-sm">
              No messages yet. Start the conversation.
            </div>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user.uid;
            
            const currSecs = msg.createdAt?.seconds || 0;
            const prevSecs = messages[i-1]?.createdAt?.seconds || 0;
            
            const showHeader = i === 0 || messages[i-1].senderId !== msg.senderId || (currSecs > 0 && prevSecs > 0 && currSecs - prevSecs > 300);

            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}
              >
                {showHeader && (
                  <div className={`flex items-end gap-2 mb-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.senderPhoto} alt="" className="w-6 h-6 rounded-full bg-zinc-200 border border-black/5 shadow-sm" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{isMe ? 'You' : msg.senderName}</span>
                  </div>
                )}
                
                <div className="group relative max-w-[85%] md:max-w-md">
                  <div className={`px-5 py-3 rounded-2xl text-[14px] font-medium leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-black text-white rounded-tr-sm shadow-[0_4px_14px_rgba(0,0,0,0.15)]' 
                      : 'bg-white border border-black/5 text-black/90 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {havocUser?.isAdmin && (
                    <button 
                      onClick={() => handleDelete(msg.id)} 
                      className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-red-500 bg-white hover:bg-red-50 hover:text-red-600 border border-black/5 hover:border-red-200 rounded-xl transition-all shadow-sm ${isMe ? '-left-12' : '-right-12'}`}
                      title="Delete message"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      {/* Command Center Input (Flex Item) */}
      <footer className="shrink-0 p-4 md:p-6 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent z-20 pb-safe w-full flex justify-center">
        <form onSubmit={handleSend} className="w-full max-w-3xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-black/0 via-black/5 to-black/0 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Broadcast to the War Room..."
            className="relative w-full bg-white border border-black/10 text-black px-6 py-4 rounded-2xl outline-none focus:border-black/30 transition-all font-medium text-[15px] placeholder:text-black/30 pr-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)]"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-2 bottom-2 w-12 bg-black text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:bg-black/10 disabled:text-black/50 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.15)] disabled:shadow-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
