import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/");

  // Get My Skills
  const { data: mySkills } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", user.id);

  const iWantToLearn =
    mySkills?.find((s) => s.skill_type === "LEARN")?.skill_name || "";
  const iCanTeach =
    mySkills?.find((s) => s.skill_type === "TEACH")?.skill_name || "";

  // Find Matches
  const { data: potentialTeachers } = await supabase
    .from("skills")
    .select(
      `
      user_id,
      skill_name,
      profiles ( full_name, whatsapp_contact )
    `,
    )
    .eq("skill_type", "TEACH")
    .ilike("skill_name", iWantToLearn)
    .neq("user_id", user.id);

  return (
    <DashboardClient
      user={user}
      mySkills={mySkills || []}
      potentialTeachers={potentialTeachers || []}
    />
  );
}
