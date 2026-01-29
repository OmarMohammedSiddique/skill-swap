"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, ArrowRight, Repeat, MessageSquare, Clock } from "lucide-react";
import SwapRequestButton from "@/components/swap-request-button";
import SwapRequestsList from "@/components/swap-requests-list";
import MessagesView from "@/components/messages-view";

import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/utils/supabase/client";

interface DashboardClientProps {
  user: any;
  mySkills: any[];
  potentialTeachers: any[];
  directMatches: any[];
  circularMatches: any[];
  outgoingRequests: any[];
  incomingRequests: any[];
}

export default function DashboardClient({
  user,
  mySkills,
  potentialTeachers,
  directMatches,
  circularMatches,
  outgoingRequests,
  incomingRequests,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("matches"); // matches | swaps | messages | settings
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") return;
    setIsDeleting(true);

    try {
        const { error } = await supabase.rpc('delete_user');
        if (error) throw error;
        
        await supabase.auth.signOut();
        router.push('/');
    } catch (error: any) {
        alert("Error deleting account: " + error.message);
        setIsDeleting(false);
    }
  };

  const iWantToLearn =
    mySkills?.find((s) => s.skill_type === "LEARN")?.skill_name || "...";
  const iCanTeach =
    mySkills?.find((s) => s.skill_type === "TEACH")?.skill_name || "...";

  // Filter pending requests for the "Alert" at the top
  const pendingIncomingRequests = incomingRequests?.filter(r => r.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Dashboard Nav */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="bg-indigo-600 p-1 rounded text-white">
              <RefreshCw size={16} />
            </div>
            SkillSwap
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                className="pl-9 pr-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-600 outline-none w-64 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                placeholder="Find a skill..."
              />
            </div>
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              {user.email?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-2 overflow-hidden flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-500">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user.email}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{iCanTeach} Expert</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Credits</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3 Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Reputation</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">New</span>
                </div>
              </div>
              <Button
                className="w-full mt-4 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                variant="outline"
                size="sm"
                onClick={() => router.push("/setup")}
              >
                Edit Profile
              </Button>
            </div>

            <div className="space-y-1">
              <h4 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Menu
              </h4>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === 'matches' ? 'text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => setActiveTab('matches')}
              >
                Find Matches
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeTab === 'swaps' ? 'text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => setActiveTab('swaps')}
              >
                My Swaps
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeTab === 'messages' ? 'text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => setActiveTab('messages')}
              >
                Messages
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeTab === 'settings' ? 'text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </Button>
              <form action="/auth/signout" method="post">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sign Out
                </Button>
              </form>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 space-y-8">

            {activeTab === 'matches' && (
                <>
                {/* INCOMING REQUESTS CHECK */}
                {pendingIncomingRequests.length > 0 && (
                <SwapRequestsList requests={pendingIncomingRequests} />
                )}

                {/* SECTION 1: PERFECT DIRECT MATCHES */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Perfect Matches
                    </h2>
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                      Direct Swap
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {directMatches.map((match) => {
                      const existingRequest = outgoingRequests?.find(
                        (req) => req.receiver_id === match.user_id
                      );
                      return (
                        <Card key={match.user_id} className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-900/30">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl font-bold text-amber-600 dark:text-amber-400 border-2 border-amber-200 dark:border-amber-800">
                                  {match.profiles?.full_name?.charAt(0)}
                              </div>
                              <div className="flex-1 text-center md:text-left">
                                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{match.profiles?.full_name}</h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    You both want what the other has!
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                                      <Badge variant="outline" className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                                        Offers: {match.skill_name}
                                      </Badge>
                                      <RefreshCw size={14} className="text-amber-500" />
                                      <Badge variant="outline" className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                                        Wants: {match.their_want}
                                      </Badge>
                                  </div>
                              </div>
                              <SwapRequestButton
                                teacherId={match.user_id}
                                initialStatus={existingRequest?.status}
                                teacherContact={match.profiles?.whatsapp_contact}
                              />
                          </div>
                        </Card>
                      )
                    })}
                    {directMatches.length === 0 && (
                      <div className="p-8 text-center border rounded-lg bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-sm">
                        No direct swaps found yet. Try finding a circular match!
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 2: CIRCULAR MATCHES */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Community Circles
                    </h2>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      Chain Swap
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {circularMatches.map((match, idx) => {
                      const existingRequest = outgoingRequests?.find(
                        (req) => req.receiver_id === match.user.user_id
                      );
                      return (
                        <Card key={idx} className="p-6 border-indigo-100 dark:border-slate-800 dark:bg-slate-900">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                              {/* Chain Visual */}
                              <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs font-mono">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center dark:text-slate-300">You</div>
                                </div>
                                <ArrowRight size={12} />
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                                        {match.user.profiles?.full_name?.charAt(0)}
                                    </div>
                                    <span>{match.user.profiles?.full_name.split(' ')[0]}</span>
                                </div>
                                <ArrowRight size={12} />
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-700 dark:text-slate-300">
                                        {match.intermediary.profiles?.full_name?.charAt(0)}
                                    </div>
                                    <span>{match.intermediary.profiles?.full_name.split(' ')[0]}</span>
                                </div>
                                <ArrowRight size={12} />
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center dark:text-slate-300">You</div>
                                </div>
                              </div>

                              <div className="flex-1 text-center md:text-left pl-4 border-l border-slate-100 dark:border-slate-800">
                                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                    Swap with {match.user.profiles?.full_name}
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Part of a 3-way exchange. {match.intermediary.profiles?.full_name} completes the circle.
                                  </p>
                                  <div className="mt-2">
                                      <Badge variant="outline" className="dark:border-slate-700 dark:text-slate-300">
                                        You learn {match.user.skill_name}
                                      </Badge>
                                  </div>
                              </div>
                              <SwapRequestButton
                                teacherId={match.user.user_id}
                                initialStatus={existingRequest?.status}
                                teacherContact={match.user.profiles?.whatsapp_contact}
                              />
                          </div>
                        </Card>
                      )
                    })}
                    {circularMatches.length === 0 && (
                      <div className="p-8 text-center border rounded-lg bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-sm">
                        No circular matches found.
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 3: ALL TEACHERS (Direct Directory) */}
                <div>
                  <div className="mb-6 mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      All Teachers for {iWantToLearn}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      These people teach what you want, but might not need what you teach.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {potentialTeachers?.map((match: any) => {
                      // Avoid showing duplicates if they are already in direct matches
                      if (directMatches.find(dm => dm.user_id === match.user_id)) return null;

                      const existingRequest = outgoingRequests?.find(
                        (req) => req.receiver_id === match.user_id
                      );
                      return (
                        <Card
                          key={match.user_id}
                          className="flex flex-col md:flex-row items-center p-6 gap-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        >
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-400">
                              {match.profiles?.full_name?.charAt(0) || "?"}
                            </div>
                          </div>

                          <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                                {match.profiles?.full_name || "Anonymous"}
                              </h3>
                            </div>

                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Teaches: <span className="font-semibold text-slate-900 dark:text-slate-200">{match.skill_name}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full md:w-auto min-w-[200px]">
                            <SwapRequestButton
                              teacherId={match.user_id}
                              initialStatus={existingRequest?.status}
                              teacherContact={match.profiles?.whatsapp_contact}
                            />
                          </div>
                        </Card>
                      );
                    })}

                    {(!potentialTeachers || potentialTeachers.length === 0) && (
                      <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-900/50">
                        <p className="text-muted-foreground">
                          No one is teaching <strong>{iWantToLearn}</strong> yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 p-6 bg-indigo-900 rounded-xl text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Don't see a match?</h3>
                    <p className="text-indigo-200 text-sm">
                      Update your skills to appear in more searches.
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => router.push("/setup")}>
                    Update Profile
                  </Button>
                </div>
                </>
            )}

            {activeTab === 'swaps' && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Requests You've Sent</h2>
                        {outgoingRequests.length === 0 && <p className="text-slate-500">No requests sent.</p>}
                        <div className="space-y-3">
                            {outgoingRequests.map((req, i) => (
                                <Card key={i} className="p-4 flex justify-between items-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                                         <Clock size={16} className="text-slate-500 dark:text-slate-400" />
                                      </div>
                                      <div>
                                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Request sent to {req.receiver_id.substring(0,6)}...</p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(req.created_at).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                    <Badge variant={req.status === 'pending' ? 'outline' : req.status === 'accepted' ? 'default' : 'destructive'} className="dark:text-slate-100 dark:border-slate-700">
                                        {req.status}
                                    </Badge>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Requests You've Received</h2>
                        {incomingRequests.length === 0 && <p className="text-slate-500">No requests received.</p>}
                        {incomingRequests.length > 0 && (
                            <SwapRequestsList requests={incomingRequests} />
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="max-w-xl mx-auto space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Settings</h2>
                        <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences.</p>
                     </div>

                     <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button 
                                variant="destructive" 
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete Account
                            </Button>
                        </div>
                     </Card>
                </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <Card className="max-w-md w-full p-6 shadow-2xl relative">
                        <h3 className="text-xl font-bold text-foreground mb-4">Delete Account?</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </p>
                        
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground">
                                Type <span className="font-mono font-bold">DELETE</span> to confirm
                            </label>
                            <input 
                                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="DELETE"
                            />
                        </div>

                        <div className="flex gap-3 mt-6 justify-end">
                            <Button variant="ghost" onClick={() => {
                                setShowDeleteModal(false);
                                setDeleteConfirmation('');
                            }}>
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                                onClick={handleDeleteAccount}
                            >
                                {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'messages' && (
                <MessagesView user={user} />
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
