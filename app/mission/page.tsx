

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Globe, Lightbulb, Coffee } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-in fade-in zoom-in duration-500">
            <Heart className="w-4 h-4 fill-indigo-700" />
            <span>Community Supported</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            SkillSwap is Free. <span className="text-indigo-600">For Everyone.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe that knowledge shouldn't have a price tag. Our mission is to democratize education by connecting people directly.
          </p>
        </div>
      </section>

      {/* Mission Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <Globe className="w-10 h-10 text-indigo-600 mb-4" />
                <CardTitle>Universal Access</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Whether you're in New York or Nairobi, you deserve access to the world's best teachers. We remove financial barriers to learning.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <Lightbulb className="w-10 h-10 text-orange-500 mb-4" />
                <CardTitle>Skills as Currency</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Your expertise is valuable. By trading your time and knowledge, you create real value without spending a dime.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <Heart className="w-10 h-10 text-red-500 mb-4" />
                <CardTitle>Human Connection</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Algorithms can't replace empathy. We foster real, human connections that make learning faster, stickier, and more fun.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation / Support Section */}
      <section className="py-24 bg-slate-900 text-white px-4 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <Coffee className="w-16 h-16 mx-auto text-yellow-400 mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Help Keep the Lights On
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            While SkillSwap is free for everyone, servers, databases, and coffee for our developers aren't. We rely on the generosity of our community to keep this platform running independent and ad-free.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-10">
            <p className="text-lg font-medium mb-4">Your donation goes directly towards:</p>
            <ul className="text-slate-300 space-y-2 text-left max-w-md mx-auto list-disc pl-5">
              <li>Server and hosting costs</li>
              <li>Development of new features</li>
              <li>Community moderation tools</li>
              <li>Keeping user data private and secure</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg h-14 px-8">
              Become a Donor
            </Button>
            <Button size="lg" variant="outline" className="text-black border-white hover:bg-white/10 hover:text-white text-lg h-14 px-8">
              Share Our Mission
            </Button>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Secure payments processed by Stripe. You can cancel monthly donations at any time.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
