"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, ArrowRight, Repeat } from "lucide-react";
import SwapRequestButton from "@/components/swap-request-button";
import SwapRequestsList from "@/components/swap-requests-list";

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

  const iWantToLearn =
    mySkills?.find((s) => s.skill_type === "LEARN")?.skill_name || "...";
  const iCanTeach =
    mySkills?.find((s) => s.skill_type === "TEACH")?.skill_name || "...";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Nav */}
      <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 font-bold text-lg text-slate-900 cursor-pointer"
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
                className="pl-9 pr-4 py-1.5 text-sm rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-indigo-600 outline-none w-64 transition-all"
                placeholder="Find a skill..."
              />
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {user.email?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-2 overflow-hidden flex items-center justify-center text-2xl font-bold text-slate-400">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-slate-900 truncate">
                  {user.email}
                </h3>
                <p className="text-xs text-slate-500">{iCanTeach} Expert</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Credits</span>
                  <span className="font-bold text-indigo-600">3 Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Reputation</span>
                  <span className="font-bold text-indigo-600">New</span>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                variant="outline"
                size="sm"
                onClick={() => router.push("/setup")}
              >
                Edit Profile
              </Button>
            </div>

            <div className="space-y-1">
              <h4 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Menu
              </h4>
              <Button
                variant="ghost"
                className="w-full justify-start text-indigo-700 bg-indigo-50"
              >
                Find Matches
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                My Swaps
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Messages
              </Button>
              <form action="/auth/signout" method="post">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </form>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 space-y-8">

            {/* INCOMING REQUESTS CHECK */}
            {incomingRequests && incomingRequests.length > 0 && (
              <SwapRequestsList requests={incomingRequests} />
            )}

            {/* SECTION 1: PERFECT DIRECT MATCHES */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Perfect Matches
                </h2>
                <Badge className="bg-amber-500 hover:bg-amber-600">
                  Direct Swap
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {directMatches.map((match) => {
                   const existingRequest = outgoingRequests?.find(
                    (req) => req.receiver_id === match.user_id
                  );
                  return (
                    <Card key={match.user_id} className="p-6 border-amber-200 bg-amber-50/50">
                       <div className="flex flex-col md:flex-row items-center gap-6">
                          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-amber-600 border-2 border-amber-200">
                              {match.profiles?.full_name?.charAt(0)}
                          </div>
                          <div className="flex-1 text-center md:text-left">
                              <h3 className="font-bold text-lg">{match.profiles?.full_name}</h3>
                              <p className="text-sm text-slate-600">
                                You both want what the other has!
                              </p>
                              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                                  <Badge variant="outline" className="bg-white">
                                    Offers: {match.skill_name}
                                  </Badge>
                                  <RefreshCw size={14} className="text-amber-500" />
                                  <Badge variant="outline" className="bg-white">
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
                  <div className="p-8 text-center border rounded-lg bg-gray-50 text-gray-500 text-sm">
                    No direct swaps found yet. Try finding a circular match!
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: CIRCULAR MATCHES */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Community Circles
                </h2>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                  Chain Swap
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {circularMatches.map((match, idx) => {
                   const existingRequest = outgoingRequests?.find(
                    (req) => req.receiver_id === match.user.user_id
                  );
                  return (
                    <Card key={idx} className="p-6 border-indigo-100">
                       <div className="flex flex-col md:flex-row items-center gap-6">
                          {/* Chain Visual */}
                          <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                             <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">You</div>
                             </div>
                             <ArrowRight size={12} />
                             <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                    {match.user.profiles?.full_name?.charAt(0)}
                                </div>
                                <span>{match.user.profiles?.full_name.split(' ')[0]}</span>
                             </div>
                             <ArrowRight size={12} />
                             <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border">
                                    {match.intermediary.profiles?.full_name?.charAt(0)}
                                </div>
                                <span>{match.intermediary.profiles?.full_name.split(' ')[0]}</span>
                             </div>
                             <ArrowRight size={12} />
                             <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">You</div>
                             </div>
                          </div>

                          <div className="flex-1 text-center md:text-left pl-4 border-l border-slate-100">
                              <h3 className="font-bold text-lg">
                                Swap with {match.user.profiles?.full_name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                Part of a 3-way exchange. {match.intermediary.profiles?.full_name} completes the circle.
                              </p>
                              <div className="mt-2">
                                  <Badge variant="outline">
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
                  <div className="p-8 text-center border rounded-lg bg-gray-50 text-gray-500 text-sm">
                    No circular matches found.
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: ALL TEACHERS (Direct Directory) */}
            <div>
              <div className="mb-6 mt-8 border-t pt-8">
                <h1 className="text-xl font-bold text-slate-900">
                  All Teachers for {iWantToLearn}
                </h1>
                <p className="text-slate-600 text-sm">
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
                      className="flex flex-col md:flex-row items-center p-6 gap-6 hover:border-slate-300 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500">
                          {match.profiles?.full_name?.charAt(0) || "?"}
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                          <h3 className="font-bold text-base text-slate-900">
                            {match.profiles?.full_name || "Anonymous"}
                          </h3>
                        </div>

                        <div className="text-sm text-slate-600">
                            Teaches: <span className="font-semibold text-slate-900">{match.skill_name}</span>
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
                  <div className="p-12 text-center border-2 border-dashed rounded-lg bg-white/50">
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
          </main>
        </div>
      </div>
    </div>
  );
}
