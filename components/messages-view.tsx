"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

export default function MessagesView({ user }: { user: any }) {
  const supabase = createClient();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      // Logic: A conversation exists if a Swap Request matches two people AND is accepted
      // For MVP, we effectively say "If you have an accepted swap, you can chat"
      
      const { data, error } = await supabase
        .from("swap_requests")
        .select(`
          id,
          requester_id,
          receiver_id,
          status,
          created_at,
          requester:profiles!requester_id(full_name),
          receiver:profiles!receiver_id(full_name)
        `)
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (data) {
        // Transform to friendly format
        const formatted = data.map((req: any) => {
          const isMeRequester = req.requester_id === user.id;
          const partnerName = isMeRequester 
            ? req.receiver?.full_name 
            : req.requester?.full_name;
            
          return {
            id: req.id,
            partnerName: partnerName || "Unknown User",
            lastMessage: "Start chatting...",
            date: new Date(req.created_at).toLocaleDateString()
          };
        });
        setConversations(formatted);
      }
      setLoading(false);
    };

    fetchConversations();
  }, [user.id]);

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading messages...</div>;

  return (
    <div className="h-[600px] flex gap-6">
      {/* Sidebar List */}
      <Card className="w-1/3 flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
           <h3 className="font-bold text-slate-700 dark:text-slate-200">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {conversations.length === 0 && (
                <p className="text-sm text-center text-slate-400 mt-10">No accepted swaps yet.</p>
            )}
            {conversations.map(chat => (
                <div 
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 border' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
                >
                    <div className="font-bold text-slate-900 dark:text-slate-100">{chat.partnerName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{chat.lastMessage}</div>
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
                <div className="flex-1 bg-white dark:bg-slate-950 p-4 flex flex-col justify-end">
                    <div className="text-center text-slate-300 dark:text-slate-600 text-sm mb-4">
                        This is the start of your conversation with {activeChat.partnerName}
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2">
                    <Input placeholder="Type a message..." className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                    <Button size="icon">
                        <MessageSquare size={18} />
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
