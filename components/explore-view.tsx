"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Code, Palette, Languages, Music, Briefcase, Camera } from "lucide-react";

export default function ExploreView() {
    const categories = [
        { name: "Development", icon: <Code className="w-4 h-4" /> },
        { name: "Design", icon: <Palette className="w-4 h-4" /> },
        { name: "Languages", icon: <Languages className="w-4 h-4" /> },
        { name: "Music", icon: <Music className="w-4 h-4" /> },
        { name: "Business", icon: <Briefcase className="w-4 h-4" /> },
        { name: "Photography", icon: <Camera className="w-4 h-4" /> },
    ];

    const featuredSkills = [
        { title: "React Development", category: "Development", level: "Intermediate", user: "Alex M." },
        { title: "Spanish Conversation", category: "Languages", level: "Native", user: "Maria G." },
        { title: "Digital Marketing", category: "Business", level: "Expert", user: "Sarah L." },
        { title: "Guitar Basics", category: "Music", level: "Beginner", user: "David K." },
        { title: "UI/UX Design", category: "Design", level: "Advanced", user: "Jessica R." },
        { title: "Portrait Photography", category: "Photography", level: "Professional", user: "Tom H." },
    ];

    const [searchQuery, setSearchQuery] = useState("");

    const filteredSkills = featuredSkills.filter(skill =>
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for skills (e.g. Python, Piano, Cooking)..."
                            className="pl-10 h-12 text-lg shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {categories.map((cat) => (
                            <Button
                                key={cat.name}
                                variant={searchQuery === cat.name ? "default" : "outline"}
                                size="sm"
                                className={`gap-2 rounded-full ${searchQuery === cat.name ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                                onClick={() => setSearchQuery(cat.name)}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.map((skill, index) => (
                        <div key={index} className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
                                    {skill.category}
                                </Badge>
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                    {skill.level}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{skill.title}</h3>
                            <p className="text-muted-foreground text-sm mb-4">Offered by {skill.user}</p>
                            <Button className="w-full text-foreground" variant="outline">View Details</Button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
