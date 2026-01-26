import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Code, Palette, Languages, Music, Briefcase, Camera } from "lucide-react";

export default function ExplorePage() {
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

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Explore Skills
                    </h1>
                    <p className="text-xl text-slate-600 mb-8">
                        Discover skills you can learn from our community members.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search for skills (e.g. Python, Piano, Cooking)..."
                            className="pl-10 h-12 text-lg shadow-sm"
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {categories.map((cat) => (
                            <Button key={cat.name} variant="outline" size="sm" className="gap-2 rounded-full">
                                {cat.icon}
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Opportunities</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredSkills.map((skill, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                                    {skill.category}
                                </Badge>
                                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                    {skill.level}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{skill.title}</h3>
                            <p className="text-slate-500 text-sm mb-4">Offered by {skill.user}</p>
                            <Button className="w-full variant-outline">View Details</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
