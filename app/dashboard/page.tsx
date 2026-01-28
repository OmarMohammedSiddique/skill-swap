import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/");

  // 1. Get My Skills
  const { data: mySkills } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", user.id);

  // Check Profile Completion
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.full_name) {
    return redirect("/setup");
  }

  const iWantToLearn =
    mySkills?.find((s) => s.skill_type === "LEARN")?.skill_name || "";
  const iCanTeach =
    mySkills?.find((s) => s.skill_type === "TEACH")?.skill_name || "";

  // 2. Fetch ALL Skills to build the Match Graph (MVP Approach)
  // In a real app with 10k+ users, this should be a Postgres Database Function.
  const { data: allSkills } = await supabase
    .from("skills")
    .select(`
      user_id,
      skill_name,
      skill_type,
      profiles ( full_name, whatsapp_contact )
    `)
    .neq("user_id", user.id); // Exclude me

  // Helper to normalize strings for matching
  const normalize = (str: string) => str?.toLowerCase().trim() || "";

  // 3. Logic: Find Matches
  const directMatches = [];
  const circularMatches = [];
  const potentialTeachers = []; // Old style "One Way" matches

  if (allSkills) {
    // A. Identify Candidates
    // Users who Teach what I Want
    const teachersForMe = allSkills.filter(
      (s) =>
        s.skill_type === "TEACH" &&
        normalize(s.skill_name) === normalize(iWantToLearn)
    );

    for (const teacher of teachersForMe) {
      const teacherId = teacher.user_id;
      
      // Get what this Teacher WANTS to learn
      const teacherWants = allSkills.filter(
        (s) => s.user_id === teacherId && s.skill_type === "LEARN"
      );

      let isDirectMatch = false;

      // Check for Direct Match
      // Does the teacher WANT what I TEACH?
      for (const want of teacherWants) {
        if (normalize(want.skill_name) === normalize(iCanTeach)) {
          directMatches.push({
            ...teacher, // Contains profile info
            matchType: "DIRECT",
            their_want: want.skill_name, // What they want (which is what I teach)
          });
          isDirectMatch = true;
          break; 
        }
      }

      // If not direct match, check for Circular Match (Chain of 3)
      // Me -> Teacher -> ThirdParty -> Me
      if (!isDirectMatch) {
         // potentialTeachers.push(teacher); // Add to general pool if not direct match

         // Look for Third Party who Teaches what (Teacher wants) && Wants what (I teach)
         for (const tWant of teacherWants) {
             const tWantName = tWant.skill_name;

             // Find candidates for Third Party
             const thirdParties = allSkills.filter(
                 (current3rd) => 
                    current3rd.skill_type === 'TEACH' && 
                    normalize(current3rd.skill_name) === normalize(tWantName) &&
                    current3rd.user_id !== user.id && // Not me
                    current3rd.user_id !== teacherId // Not the first teacher
             );

             for (const tp of thirdParties) {
                 // Does Third Party WANT what I TEACH?
                 const tpWants = allSkills.filter(
                     (s) => s.user_id === tp.user_id && s.skill_type === 'LEARN'
                 );
                 
                 const completesCircle = tpWants.some(
                     (tpWant) => normalize(tpWant.skill_name) === normalize(iCanTeach)
                 );

                 if (completesCircle) {
                     circularMatches.push({
                         user: teacher, // The person I will interact with first
                         intermediary: tp, // The person completing the circle
                         matchType: 'CIRCULAR'
                     });
                     // prevent duplicates if multiple paths exist?
                     // for now, just break after finding one valid circle for this teacher
                 }
             }
         }
      }
      
      // Add to "Potential Teachers" regardless, or only if no match? 
      // User request implies distinguishing them. Let's add all valid teachers here
      // Client side can filter duplicates or show them in different tabs.
      potentialTeachers.push(teacher);
    }
  }
  
  // Deduplicate Circular Matches (if multiple paths to same person)
  // Actually, we might want to show unique CHAINS. 
  // But for simple User Interface, let's just pass the list.

  // 4. Fetch Requests
  const { data: outgoingRequests } = await supabase
    .from("swap_requests")
    .select("*")
    .eq("requester_id", user.id);

  const { data: incomingRequests } = await supabase
    .from("swap_requests")
    .select(`
      *,
      profiles!requester_id ( full_name, email )
    `)
    .eq("receiver_id", user.id)
    .eq("status", "pending");

  return (
    <DashboardClient
      user={user}
      mySkills={mySkills || []}
      potentialTeachers={potentialTeachers}
      directMatches={directMatches}
      circularMatches={circularMatches}
      outgoingRequests={outgoingRequests || []}
      incomingRequests={incomingRequests || []}
    />
  );
}
