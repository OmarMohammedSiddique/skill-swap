"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  RefreshCw,
  Code,
  Palette,
  Languages,
  Music,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";

// --- COMPONENTS MOVED OUTSIDE ---

// --- COMPONENTS MOVED OUTSIDE ---

const Navbar = ({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  navigateTo,
  storiesRef,
  scrollToStories,
  user,
}: any) => (
  <nav
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-3" : "bg-transparent py-5"}`}
  >
    <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
      <div
        onClick={() => navigateTo("landing")}
        className="cursor-pointer"
      >
        <BrandLogo />
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/how-it-works"
          className="text-sm font-medium text-muted-foreground hover:text-indigo-600"
        >
          How it Works
        </Link>
        <Link
          href="/explore"
          className="text-sm font-medium text-muted-foreground hover:text-indigo-600"
        >
          Explore Skills
        </Link>
        <button
          onClick={scrollToStories}
          className="text-sm font-medium text-muted-foreground hover:text-indigo-600"
        >
          Stories
        </button>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <ThemeToggle className="mr-2" />
        {user ? (
          <div className="flex gap-4 items-center">
             {user.is_admin && (
                <Link href="/admin">
                   <Button variant="ghost">Admin</Button>
                </Link>
             )}
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <>
            <Button variant="ghost" className="text-foreground" onClick={() => navigateTo("login")}>
              Log in
            </Button>
            <Button onClick={() => navigateTo("login")}>Get Started</Button>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-foreground"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>
    </div>

    {/* Mobile Nav */}
    {mobileMenuOpen && (
      <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-4 flex flex-col gap-4 md:hidden shadow-lg animate-in slide-in-from-top-5">
        <Link
          href="/how-it-works"
          className="text-left text-sm font-medium text-slate-600 py-2"
        >
          How it Works
        </Link>
        <Link
          href="/explore"
          className="text-left text-sm font-medium text-slate-600 py-2"
        >
          Explore Skills
        </Link>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToStories();
          }}
          className="text-left text-sm font-medium text-slate-600 py-2"
        >
          Stories
        </button>
        <div className="h-px bg-slate-100 my-2" />
        <div className="flex items-center gap-4 px-2">
          <span className="text-sm font-medium text-slate-600">Theme</span>
          <ThemeToggle />
        </div>
        <div className="h-px bg-slate-100 my-2" />
        {user ? (
          <Link href="/dashboard">
             <Button className="w-full justify-start">Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => navigateTo("login")}
            >
              Log in
            </Button>
            <Button className="justify-start" onClick={() => navigateTo("login")}>
              Get Started
            </Button>
          </>
        )}
      </div>
    )}
  </nav>
);



const LandingView = ({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  navigateTo,
  scrollToStories,
  storiesRef,
  user,
}: any) => (
  <div className="min-h-screen bg-background">
    <Navbar
      isScrolled={isScrolled}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      navigateTo={navigateTo}
      scrollToStories={scrollToStories}
      user={user}
    />

    {/* Hero Section */}
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-4 relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-orange-50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/4"></div>

      <div className="container mx-auto max-w-5xl text-center">
        <Badge
          variant="outline"
          className="mb-6 px-4 py-1.5 text-sm border-indigo-200 bg-indigo-50 text-indigo-700"
        >
          Now live in 50+ countries 🌍
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
          Swap Skills.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Not Bills.
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Exchange your expertise for the knowledge you crave. Connect with
          people who want to learn what you know, and teach you what you don't.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            className="h-12 px-8 text-base w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
            onClick={() => user ? window.location.href = '/dashboard' : navigateTo("login")}
          >
            {user ? "Go to Dashboard" : "Start Swapping Now"}
          </Button>
          <Link href="/explore">
            <Button
              variant="outline"
              className="h-12 px-8 text-base w-full sm:w-auto text-foreground"
            >
              View Popular Skills
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-slate-400 grayscale opacity-70">
          {/* Mock Logos */}
          <div className="flex items-center gap-2 font-bold">
            <Code size={20} /> DevDaily
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Palette size={20} /> DesignHub
          </div>
          <div className="flex items-center gap-2 font-bold">
            <TrendingUp size={20} /> GrowthMakers
          </div>
        </div>
      </div>
    </section>

    {/* Value Prop / How it works */}
    <section className="py-24 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How SkillSwap Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our AI matching algorithm connects you with the perfect learning
            partner based on your skills and interests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="text-indigo-600" size={32} />,
              title: "Create your Profile",
              desc: "List the skills you have (e.g., Python, Piano) and the skills you want (e.g., Spanish, SEO).",
            },
            {
              icon: <RefreshCw className="text-indigo-600" size={32} />,
              title: "Get Matched",
              desc: "We find people who need your skills and possess the ones you want. It's a perfect double coincidence of wants.",
            },
            {
              icon: <CheckCircle2 className="text-indigo-600" size={32} />,
              title: "Learn & Teach",
              desc: "Schedule sessions via video call or meet locally. Verify the swap and earn reputation points.",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="border-none shadow-lg bg-card relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              <CardHeader>
                <div className="mb-4 p-3 bg-indigo-50 rounded-xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>


    {/* Stories Section */}
    <section ref={storiesRef} className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-muted/50 opacity-50 -z-10"></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-indigo-700 bg-indigo-50 border-indigo-200">
            Community Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See what happens when skills swap
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real people, real connections, and real growth. Join thousands of others who are leveling up their lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "I needed a website for my bakery, but couldn't afford a dev. I swapped my baking skills for a React site. Now I have a site AND a new friend who loves sourdough!",
              author: "Elena R.",
              role: "Baker & Entrepreneur",
              skillSwapped: "Baking ⇄ Web Dev"
            },
            {
              quote: "I always wanted to learn guitar. I found a music student who needed help with Statistics. We met weekly, and now I can play Wonderwall (and he passed his exam!).",
              author: "Marcus T.",
              role: "Data Analyst",
              skillSwapped: "Stats ⇄ Guitar"
            },
            {
              quote: "Language exchange apps felt impersonal. Here, I met a native Japanese speaker who wanted to improve her English presentation skills. The cultural exchange was invaluable.",
              author: "Sarah J.",
              role: "Marketing Director",
              skillSwapped: "English ⇄ Japanese"
            }
          ].map((story, i) => (
            <Card key={i} className="bg-card border-border shadow-md hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-muted-foreground italic mb-6 leading-relaxed">"{story.quote}"</p>
              </CardHeader>
              <CardContent className="mt-auto border-t border-slate-50 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground">{story.author}</h4>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                  </div>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-normal">
                    {story.skillSwapped}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Live Categories */}
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Trending Skills
            </h2>
            <p className="text-muted-foreground">
              What the community is swapping this week.
            </p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="hidden md:flex gap-2 text-muted-foreground hover:text-foreground">
              View all <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: "Web Development",
              count: "1.2k swappers",
              icon: <Code size={20} className="text-blue-500" />,
            },
            {
              name: "Graphic Design",
              count: "850 swappers",
              icon: <Palette size={20} className="text-pink-500" />,
            },
            {
              name: "Languages",
              count: "2.4k swappers",
              icon: <Languages size={20} className="text-orange-500" />,
            },
            {
              name: "Music Theory",
              count: "500 swappers",
              icon: <Music size={20} className="text-purple-500" />,
            },
            {
              name: "Marketing",
              count: "900 swappers",
              icon: <TrendingUp size={20} className="text-green-500" />,
            },
            {
              name: "Photography",
              count: "720 swappers",
              icon: <Users size={20} className="text-indigo-500" />,
            },
            {
              name: "Cooking",
              count: "1.1k swappers",
              icon: <Star size={20} className="text-red-500" />,
            },
            {
              name: "Data Science",
              count: "600 swappers",
              icon: <Code size={20} className="text-cyan-500" />,
            },
          ].map((cat, i) => (
            <div
              key={i}
              className="p-4 border border-border rounded-xl hover:border-indigo-600 hover:shadow-md cursor-pointer transition-all flex flex-col gap-3 group"
            >
              <div className="flex justify-between items-start">
                {cat.icon}
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-600"
                />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{cat.name}</h4>
                <p className="text-xs text-muted-foreground">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24 px-4 bg-slate-900 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to upgrade your skillset?
        </h2>
        <p className="text-slate-300 text-lg mb-10">
          Join 50,000+ others who are saving money and making friends by
          swapping their unique talents.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="h-12 px-8 text-base bg-white text-slate-900 hover:bg-indigo-50"
            onClick={() => user ? window.location.href = "/dashboard" : window.location.href = "/signup"}
          >
            {user ? "Go to Dashboard" : "Create Free Account"}
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          No credit card required. Free for everyone.
        </p>
      </div>
    </section>

    <Footer />
  </div>
);

const LoginView = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleLogin,
  handleSignUp,
  navigateTo,
}: any) => (
  <div className="min-h-screen grid md:grid-cols-2 bg-background">
    <div className="relative hidden md:block bg-slate-900">
      <div className="absolute inset-0 bg-indigo-600/20 mix-blend-multiply"></div>
      <img
        src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80"
        alt="Login"
        className="w-full h-full object-cover opacity-50"
      />
      <div className="absolute bottom-12 left-12 right-12 text-white">
        <h2 className="text-3xl font-bold mb-4">
          "I taught Sarah React, and she helped me pass my French B2 exam. Best
          swap ever."
        </h2>
        <p className="text-indigo-200">— James K., London</p>
      </div>
    </div>

    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-4">
            <BrandLogo />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground mt-2">
            Enter your details to access your account.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignUp}
            disabled={loading}
          >
            Create New Account
          </Button>
        </div>

        <div className="text-center text-sm">
          <button
            className="text-muted-foreground hover:text-indigo-600"
            onClick={() => navigateTo("landing")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "login">(
    "landing",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for User
  useEffect(() => {
    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
             const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
             setUser({ ...user, is_admin: profile?.is_admin });
        } else {
             setUser(null);
        }
    }
    checkUser();
  }, [])

  // Scroll reference for Stories section
  const storiesRef = useRef<HTMLDivElement>(null);

  const scrollToStories = () => {
    if (currentView !== "landing") {
      setCurrentView("landing");
      setTimeout(() => {
        storiesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      storiesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigateTo = (view: "landing" | "login") => {
    // If attempting to go to login but we are already logged in -> Dashboard
    if (view === 'login' && user) {
        window.location.href = '/dashboard';
        return;
    }

    window.scrollTo(0, 0);
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleSignUp = async () => {
     window.location.href = '/signup';
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Login Error: " + error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="font-sans text-slate-900 antialiased">
      {currentView === "landing" && (
        <LandingView
          isScrolled={isScrolled}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          navigateTo={navigateTo}
          storiesRef={storiesRef}
          scrollToStories={scrollToStories}
          user={user}
        />
      )}
      {currentView === "login" && (
        <LoginView
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          navigateTo={navigateTo}
        />
      )}
    </div>
  );
}
