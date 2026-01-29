"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Code, Palette, Languages, Music, Briefcase, Camera, X, CheckCircle2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ExploreView() {
    const supabase = createClient();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [vouchLoading, setVouchLoading] = useState<string | null>(null);

    const categories = [
        { name: "Development", icon: <Code className="w-4 h-4" />, keywords: ['code', 'dev', 'react', 'js', 'javascript', 'python', 'html', 'css', 'node', 'app', 'web', 'program'] },
        { name: "Design", icon: <Palette className="w-4 h-4" />, keywords: ['design', 'ui', 'ux', 'figma', 'adobe', 'logo', 'art', 'sketch', 'creative', 'graphic'] },
        { name: "Languages", icon: <Languages className="w-4 h-4" />, keywords: ['english', 'spanish', 'french', 'german', 'mandarin', 'japanese', 'language', 'speak', 'chinese', 'arabic'] },
        { name: "Music", icon: <Music className="w-4 h-4" />, keywords: ['music', 'guitar', 'piano', 'voice', 'sing', 'instrument', 'theory', 'drum', 'violin'] },
        { name: "Business", icon: <Briefcase className="w-4 h-4" />, keywords: ['business', 'market', 'finance', 'startup', 'management', 'sales', 'seo', 'strategy'] },
    ];

    const dummyProfiles = [
        {
            id: "dummy-1",
            full_name: "Sarah Chen",
            country: "Singapore",
            vouch_count: 12,
            skills: [
                { id: "d1-s1", skill_name: "React Native", skill_type: "TEACH" },
                { id: "d1-s2", skill_name: "UI Design", skill_type: "TEACH" },
                { id: "d1-s3", skill_name: "Japanese", skill_type: "LEARN" }
            ],
            is_dummy: true
        },
        {
            id: "dummy-2",
            full_name: "Marcus Johnson",
            country: "USA",
            vouch_count: 8,
            skills: [
                { id: "d2-s1", skill_name: "Digital Marketing", skill_type: "TEACH" },
                { id: "d2-s2", skill_name: "SEO", skill_type: "TEACH" },
                { id: "d2-s3", skill_name: "Piano", skill_type: "LEARN" }
            ],
            is_dummy: true
        },
        {
            id: "dummy-3",
            full_name: "Elena Rodriguez",
            country: "Spain",
            vouch_count: 24,
            skills: [
                { id: "d3-s1", skill_name: "Spanish", skill_type: "TEACH" },
                { id: "d3-s2", skill_name: "Cooking", skill_type: "TEACH" },
                { id: "d3-s3", skill_name: "Python", skill_type: "LEARN" }
            ],
            is_dummy: true
        },
        {
            id: "dummy-4",
            full_name: "David Kim",
            country: "South Korea",
            vouch_count: 5,
            skills: [
                { id: "d4-s1", skill_name: "Guitar", skill_type: "TEACH" },
                { id: "d4-s2", skill_name: "Music Theory", skill_type: "TEACH" },
                { id: "d4-s3", skill_name: "English", skill_type: "LEARN" }
            ],
            is_dummy: true
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // 1. Get Current User
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // 2. Fetch Profiles with Skills
        const { data: profilesData, error } = await supabase
            .from('profiles')
            .select(`
                *,
                skills (*)
            `);
        
        let fetchedProfiles: any[] = [];

        if (profilesData) {
            // 3. Enrich with Vouch Data
             fetchedProfiles = await Promise.all(profilesData.map(async (profile) => {
                // Get Vouch Count
                const { count } = await supabase
                    .from('vouches')
                    .select('*', { count: 'exact', head: true })
                    .eq('vouched_id', profile.id);

                let canVouch = false;
                let hasVouched = false;

                if (user && user.id !== profile.id) {
                    const { data: myVouch } = await supabase
                        .from('vouches')
                        .select('id')
                        .eq('voucher_id', user.id)
                        .eq('vouched_id', profile.id)
                        .single();
                    
                    hasVouched = !!myVouch;

                    if (!hasVouched) {
                         const { data: exactSwap } = await supabase
                            .from('swap_requests')
                            .select('id')
                            .eq('status', 'accepted')
                            .or(`and(requester_id.eq.${user.id},receiver_id.eq.${profile.id}),and(requester_id.eq.${profile.id},receiver_id.eq.${user.id})`)
                            .maybeSingle();

                        if (exactSwap) {
                            canVouch = true;
                        }
                    }
                }

                return {
                    ...profile,
                    vouch_count: count || 0,
                    can_vouch: canVouch,
                    has_vouched: hasVouched
                };
            }));
        }

        // Merge Dummy Data + Real Data
        // Put dummy data at the end or mix? Let's put at the end for simple "Featured" feel
        setProfiles([...fetchedProfiles, ...dummyProfiles]);
        setLoading(false);
    };

    const handleVouch = async (targetId: string) => {
        if (!currentUser) return;
        setVouchLoading(targetId);

        const { error } = await supabase
            .from('vouches')
            .insert({
                voucher_id: currentUser.id,
                vouched_id: targetId
            });

        if (error) {
            alert("Error verifying swap: " + error.message);
        } else {
            setProfiles(prev => prev.map(p => {
                if (p.id === targetId) {
                    return {
                        ...p,
                        vouch_count: (p.vouch_count || 0) + 1,
                        can_vouch: false,
                        has_vouched: true
                    }
                }
                return p;
            }));
        }
        setVouchLoading(null);
    };

    // Filter Logic
    const filteredProfiles = profiles.filter(p => {
        // 1. Filter by Search Query (Name or Skill Name)
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            const matchesName = p.full_name?.toLowerCase().includes(lowerQuery);
            const matchesSkill = p.skills?.some((s: any) => s.skill_name.toLowerCase().includes(lowerQuery));
            if (!matchesName && !matchesSkill) return false;
        }

        // 2. Filter by Category (Smart Keyword Matching)
        if (activeCategory) {
            const category = categories.find(c => c.name === activeCategory);
            if (category) {
                 const hasCategorySkill = p.skills?.some((s: any) => 
                     s.skill_type === 'TEACH' && 
                     category.keywords.some(k => s.skill_name.toLowerCase().includes(k))
                 );
                 if (!hasCategorySkill) return false;
            }
        }
        
        return true;
    });

    const toggleCategory = (catName: string) => {
        if (activeCategory === catName) {
            setActiveCategory(null);
        } else {
            setActiveCategory(catName);
            setSearchQuery(""); // Clear search when picking a category for clarity
        }
    };


    return (
        <>
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
                        Explore Skills
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Discover skills you can learn from our community members.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for skills (e.g. Python, Piano, Cooking)..."
                            className="pl-10 pr-10 h-12 text-lg shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {categories.map((cat) => (
                            <Button
                                key={cat.name}
                                variant={activeCategory === cat.name ? "default" : "outline"}
                                size="sm"
                                className={`gap-2 rounded-full ${activeCategory === cat.name ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                                onClick={() => toggleCategory(cat.name)}
                            >
                                {cat.icon}
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Featured Opportunities</h2>
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading community...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfiles.map((profile) => {
                            const teachSkills = profile.skills?.filter((s:any) => s.skill_type === 'TEACH') || [];
                            const learnSkills = profile.skills?.filter((s:any) => s.skill_type === 'LEARN') || [];
                            
                            return (
                                <div key={profile.id} className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src="" />
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                                    {profile.full_name?.substring(0, 2).toUpperCase() || "??"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground leading-tight">
                                                    {profile.full_name || "Community Member"}
                                                </h3>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                    {profile.country && <span>{profile.country}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vouch Badge */}
                                    <div className="mb-4">
                                        <Badge variant="outline" className={`font-medium ${profile.vouch_count > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500'}`}>
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Verified Teacher ({profile.vouch_count} Swaps)
                                        </Badge>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Teaching</p>
                                            <div className="flex flex-wrap gap-2">
                                                {teachSkills.length > 0 ? teachSkills.map((s: any) => (
                                                    <Badge key={s.id} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                                                        {s.skill_name}
                                                    </Badge>
                                                )) : <span className="text-sm text-muted-foreground italic">No skills listed</span>}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-emerald-600/80">Wants to Learn</p>
                                             <div className="flex flex-wrap gap-2">
                                                {learnSkills.slice(0, 3).map((s: any) => (
                                                    <Badge key={s.id} variant="outline" className="border-emerald-200 text-emerald-700">
                                                        {s.skill_name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Button className="w-full" variant="default" disabled={!currentUser || currentUser.id === profile.id}>
                                            Request Swap
                                        </Button>
                                        
                                        {/* Verify Swap Button (Only if eligible) */}
                                        {profile.can_vouch && (
                                            <Button 
                                                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                                variant="default"
                                                onClick={() => handleVouch(profile.id)}
                                                disabled={vouchLoading === profile.id}
                                            >
                                                {vouchLoading === profile.id ? "Verifying..." : (
                                                    <><ThumbsUp className="w-4 h-4 mr-2" /> Verify Swap</>
                                                )}
                                            </Button>
                                        )}
                                        
                                        {profile.has_vouched && (
                                            <Button className="w-full" variant="ghost" disabled>
                                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> You verified this
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
