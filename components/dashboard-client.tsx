"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search } from "lucide-react";
import SwapRequestButton from "@/components/swap-request-button";
import SwapRequestsList from "@/components/swap-requests-list";

interface DashboardClientProps {
  user: any;
  mySkills: any[];
  potentialTeachers: any[];
  outgoingRequests: any[];
  incomingRequests: any[];
}

export default function DashboardClient({
  user,
  mySkills,
  potentialTeachers,
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

            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                  Recommended Matches
                </h1>
                <p className="text-slate-600">
                  Based on your desire to learn{" "}
                  <span className="font-semibold text-indigo-600">
                    {iWantToLearn}
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-4">
                {potentialTeachers?.map((match: any) => {
                  const existingRequest = outgoingRequests?.find(
                    (req) => req.receiver_id === match.user_id
                  );
                  return (
                    <Card
                      key={match.user_id}
                      className="flex flex-col md:flex-row items-center p-6 gap-6 hover:border-indigo-300 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                          {match.profiles?.full_name?.charAt(0) || "?"}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                          <h3 className="font-bold text-lg text-slate-900">
                            {match.profiles?.full_name || "Anonymous"}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-green-600 bg-green-50 border-green-200"
                          >
                            95% Match
                          </Badge>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm">
                          <div className="flex items-center gap-1 justify-center md:justify-start text-slate-600">
                            <span className="font-medium text-slate-400 uppercase text-xs">
                              Offers:
                            </span>
                            <span className="font-semibold text-slate-800">
                              {match.skill_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 justify-center md:justify-start text-slate-600">
                            <span className="font-medium text-slate-400 uppercase text-xs">
                              Wants:
                            </span>
                            <span className="font-semibold text-slate-800">
                              {iCanTeach}
                            </span>
                          </div>
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
