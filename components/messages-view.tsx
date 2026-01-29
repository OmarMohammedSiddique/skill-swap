"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/app/actions/messaging";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, AlertTriangle } from "lucide-react";

export default function MessagesView({ user }: { user: any }) {
  const supabase = createClient();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Conversations (People I matched with)
  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from("swap_requests")
        .select(`
          id,
          requester_id,
          receiver_id,
          status,
          requester:profiles!requester_id(full_name),
          receiver:profiles!receiver_id(full_name)
        `)
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (data) {
        const formatted = data.map((req: any) => {
          const isMeRequester = req.requester_id === user.id;
          const partnerName = isMeRequester 
            ? req.receiver?.full_name 
            : req.requester?.full_name;
          const partnerId = isMeRequester ? req.receiver_id : req.requester_id;
            
          return {
            id: req.id, // Swap ID
            partnerId: partnerId,
            partnerName: partnerName || "Unknown User",
            lastMessage: "Start chatting...",
          };
        });
        setConversations(formatted);
      }
      setLoading(false);
    };

    fetchConversations();
  }, [user.id]);

  // 2. Fetch Messages & Subscribe when Active Chat changes
  useEffect(() => {
    if (!activeChat) return;

    // Load initial history
    const fetchMessages = async () => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .or(`sender_id.eq.${activeChat.partnerId},receiver_id.eq.${activeChat.partnerId}`)
            .order('created_at', { ascending: true }); // Oldest first for chat log
        
        // Filter strictly for this pair (RLS allows seeing my msgs, need to filter for THIS partner)
        // actually the OR query above gets ALL my messages AND ALL partner messages.
        // We need (Me AND Partner) OR (Partner AND Me)
        // Supabase simpler query:
        // .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.partnerId}),and(sender_id.eq.${activeChat.partnerId},receiver_id.eq.${user.id})`)
        
        if (data) {
             const relevant = data.filter(m => 
                (m.sender_id === user.id && m.receiver_id === activeChat.partnerId) ||
                (m.sender_id === activeChat.partnerId && m.receiver_id === user.id)
             );
             setMessages(relevant);
             scrollToBottom();
        }
    };

    fetchMessages();

    // Subscribe to NEW messages
    const channel = supabase
        .channel('chat_room')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${user.id}` // Only listen for incoming to ME
            },
            (payload) => {
                // Check if it belongs to current active chat
                if (payload.new.sender_id === activeChat.partnerId) {
                    setMessages((prev) => [...prev, payload.new]);
                    scrollToBottom();
                } else {
                    // TODO: Show notification dot for other chats?
                }
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };

  }, [activeChat, user.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;
    setSending(true);

    const content = newMessage;
    setNewMessage(""); // Optimistic clear

    // Optimistic UI Append? 
    // Wait for server verification due to profanity filter
    
    const result = await sendMessage(content, activeChat.partnerId);

    if (result.status === 'success') {
        // If successful, we can manually append it or wait for a fetch. 
        // Typically Sender doesn't get a subscription event for their OWN insert unless listening to sender_id too
        // So let's append manually
        const tempMsg = {
            id: Math.random(), // temp id
            content: content,
            sender_id: user.id,
            receiver_id: activeChat.partnerId,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        scrollToBottom();
    } else if (result.status === 'blocked') {
        // Show Warning
        alert(`⚠️ WARNING: ${result.message}\nTotal Warnings: ${result.warningCount}. Admins have been notified.`);
    } else {
        alert('Failed to send message.');
    }

    setSending(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading conversations...</div>;

  return (
    <div className="h-[600px] flex gap-6">
      {/* Sidebar List */}
      <Card className="w-1/3 flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
           <h3 className="font-bold text-slate-700 dark:text-slate-200">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {conversations.length === 0 && (
                <p className="text-sm text-center text-slate-400 mt-10">No matches yet.</p>
            )}
            {conversations.map(chat => (
                <div 
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 border' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
                >
                    <div className="font-bold text-slate-900 dark:text-slate-100">{chat.partnerName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tap to chat</div>
                </div>
            ))}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        {activeChat ? (
            <>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{activeChat.partnerName}</h3>
                </div>
                
                {/* Messages List */}
                <div className="flex-1 bg-white dark:bg-slate-950 p-4 overflow-y-auto flex flex-col gap-3">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-300 dark:text-slate-600 text-sm mt-10">
                            Start the conversation!
                        </div>
                    )}
                    {messages.map((msg, i) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2">
                    <Input 
                        placeholder="Type a message..." 
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={sending}
                    />
                    <Button size="icon" onClick={handleSend} disabled={sending || !newMessage.trim()}>
                        {sending ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Send size={18} />}
                    </Button>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>Select a conversation to start chatting</p>
            </div>
        )}
      </Card>
    </div>
  );
}
