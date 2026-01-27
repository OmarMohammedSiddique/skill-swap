"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Check } from "lucide-react";

interface SwapRequestButtonProps {
    teacherId: string;
    initialStatus?: "pending" | "accepted" | "rejected" | null;
    teacherContact?: string;
    onStatusChange?: (status: "pending" | "accepted" | "rejected") => void;
}

export default function SwapRequestButton({
    teacherId,
    initialStatus,
    teacherContact,
    onStatusChange,
}: SwapRequestButtonProps) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleRequest = async () => {
        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { error } = await supabase.from("swap_requests").insert({
            requester_id: user.id,
            receiver_id: teacherId,
            status: "pending",
        });

        setLoading(false);

        if (error) {
            alert("Error sending request: " + error.message);
        } else {
            setStatus("pending");
            if (onStatusChange) onStatusChange("pending");
        }
    };

    if (status === "accepted" && teacherContact) {
        return (
            <a
                href={`https://wa.me/${teacherContact.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
            >
                <Button className="w-full bg-green-600 hover:bg-green-700">
                    Chat on WhatsApp
                </Button>
            </a>
        );
    }

    if (status === "pending") {
        return (
            <Button disabled className="w-full flex-1" variant="secondary">
                <Check className="mr-2 h-4 w-4" /> Request Sent
            </Button>
        );
    }

    if (status === "rejected") {
        return (
            <Button disabled className="w-full flex-1" variant="destructive">
                Request Rejected
            </Button>
        );
    }

    return (
        <Button
            className="w-full flex-1 bg-indigo-600 hover:bg-indigo-700"
            onClick={handleRequest}
            disabled={loading}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
            ) : (
                "Request Swap"
            )}
        </Button>
    );
}
