"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface SwapRequest {
    id: string;
    requester_id: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    profiles: {
        full_name: string;
        email: string;
    };
    skill_name: string; // Ideally we pass this or fetch it, simplistically assuming we might need to join skills or just show profile
}

interface SwapRequestsListProps {
    requests: any[]; // Using any to avoid strict type complexity for now, ideally mapped to SwapRequest
}

export default function SwapRequestsList({ requests }: SwapRequestsListProps) {
    const supabase = createClient();
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAction = async (requestId: string, status: "accepted" | "rejected") => {
        setLoadingId(requestId);
        const { error } = await supabase
            .from("swap_requests")
            .update({ status })
            .eq("id", requestId);

        setLoadingId(null);
        if (error) {
            alert("Error updating request: " + error.message);
        } else {
            router.refresh();
        }
    };

    if (!requests || requests.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Swap Requests</CardTitle>
                    <CardDescription>No pending requests at the moment.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Swap Requests</CardTitle>
                <CardDescription>People who want to learn from you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {requests.map((req) => (
                    <div
                        key={req.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-slate-50"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarFallback>
                                    {req.profiles?.full_name?.substring(0, 2).toUpperCase() || "??"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-sm">
                                    {req.profiles?.full_name || "Unknown User"}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    Wants to swap skills
                                </p>
                            </div>
                        </div>

                        {req.status === 'pending' ? (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleAction(req.id, "rejected")}
                                    disabled={loadingId === req.id}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleAction(req.id, "accepted")}
                                    disabled={loadingId === req.id}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Badge variant={req.status === 'accepted' ? 'default' : 'destructive'}>
                                {req.status}
                            </Badge>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
