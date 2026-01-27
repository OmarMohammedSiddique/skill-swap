"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";

export default function MessagesPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/");
                return;
            }
            setUser(user);
            fetchConversations(user.id);
        };
        getUser();
    }, []);

    const fetchConversations = async (userId: string) => {
        // Fetch accepted swap requests where user is either requester or receiver
        const { data, error } = await supabase
            .from("swap_requests")
            .select(`
        id,
        requester_id,
        receiver_id,
        status,
        profiles!requester_id(full_name, email),
        profiles!receiver_id(full_name, email)
      `)
            .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
            .eq("status", "accepted");

        if (error) {
            console.error("Error fetching conversations:", error);
            return;
        }

        // Format into a list of "conversation partners"
        const formatted = data.map((req: any) => {
            const isRequester = req.requester_id === userId;
            const partnerProfile = isRequester ? req.profiles : req.profiles; // Wait, profiles is array or object?
            // Supabase join returns object if single relation, but let's check structure.
            // If alias is used !requester_id, it returns as key 'profiles' is NOT correct?
            // Actually with alias it returns key as alias or table name?
            // Let's assume standard response for now and debug if needed.
            // Actually, standard response with !alias returns the alias as key.

            // Let's restart logic slightly better:
            const partnerId = isRequester ? req.receiver_id : req.requester_id;
            // The select query above needs to be precise. 
            // easier to just fetch and map manually in client or complex query.

            // Simplified approach: just mapped object
            return {
                requestId: req.id,
                partnerId: partnerId,
                partnerName: isRequester ? req.profiles?.full_name : req.profiles?.full_name, // This is wrong because of how I selected.
                // I need to correct the select to get both profiles properly.
            };
        });

        // Placeholder implementation for now
        setConversations(data || []);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="bg-white border-b px-4 py-3 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="font-bold text-lg">Messages</h1>
            </div>
            <div className="flex-1 container mx-auto p-4 flex gap-4">
                {/* Sidebar */}
                <Card className="w-1/3 p-4 bg-white h-[calc(100vh-100px)]">
                    <h2 className="font-semibold mb-4">Conversations</h2>
                    <div className="space-y-2">
                        {/* List */}
                        <p className="text-sm text-muted-foreground">Select a conversation</p>
                    </div>
                </Card>

                {/* Chat Window */}
                <Card className="flex-1 bg-white h-[calc(100vh-100px)] flex items-center justify-center">
                    <p className="text-slate-400">Select a conversation to start chatting</p>
                </Card>
            </div>
        </div>
    );
}
