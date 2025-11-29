"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Lamp,
  Upload,
  Languages,
  Clock,
  Users,
  Shield,
  Sparkles,
  Zap,
  FileText,
  ArrowRight,
  Check,
  Play,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-lamp">
                <Lamp className="h-5 w-5 text-lamp-dark" />
              </div>
              <span className="text-xl font-bold tracking-tight">LampScribe</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                FAQs
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="gradient-lamp text-lamp-dark hover:opacity-90">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-lamp-subtle opacity-50" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Stats badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Sparkles className="h-4 w-4" />
              <span>1,234,567 hours transcribed</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Illuminate
              </span>{" "}
              your audio
              <br />
              <span className="text-foreground">with perfect transcripts</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
              Transform audio and video into accurate text in seconds.
              <br />
              Up to <span className="font-semibold text-foreground">10 hours</span> per file. 
              <span className="font-semibold text-foreground"> 98+ languages</span>. 
              <span className="font-semibold text-foreground"> Speaker recognition</span>.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" asChild className="gradient-lamp text-lamp-dark hover:opacity-90 h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/25">
                <Link href="/dashboard">
                  <Upload className="mr-2 h-5 w-5" />
                  Start Transcribing Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            {/* Free tier info */}
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">3 free transcripts daily</span> • No credit card required
            </p>
          </div>
          
          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-lamp mb-6 lamp-glow">
                    <FileText className="h-10 w-10 text-lamp-dark" />
                  </div>
                  <p className="text-xl font-medium text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need for perfect transcripts
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by OpenAI&apos;s latest speech-to-text models for unmatched accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: Zap,
                title: "99.8% Accuracy",
                description: "State-of-the-art AI delivers near-perfect transcriptions every time",
              },
              {
                icon: Languages,
                title: "98+ Languages",
                description: "Transcribe audio in virtually any language with native-level accuracy",
              },
              {
                icon: Clock,
                title: "10 Hour Uploads",
                description: "No limits on file length - upload recordings up to 10 hours long",
              },
              {
                icon: Users,
                title: "Speaker Recognition",
                description: "Automatically identify and label different speakers in your audio",
              },
              {
                icon: Shield,
                title: "Private & Secure",
                description: "Your files are encrypted and never used for training AI models",
              },
              {
                icon: FileText,
                title: "Multiple Exports",
                description: "Download as PDF, DOCX, TXT, or SRT subtitles with timestamps",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transcription Modes Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose your transcription mode
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Balance speed and accuracy based on your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                emoji: "🐆",
                name: "Cheetah",
                description: "Fastest",
                detail: "Quick transcriptions for time-sensitive content",
                model: "gpt-4o-mini-transcribe",
              },
              {
                emoji: "🐬",
                name: "Dolphin",
                description: "Balanced",
                detail: "Perfect balance of speed and accuracy",
                model: "gpt-4o-transcribe",
                featured: true,
              },
              {
                emoji: "🐳",
                name: "Whale",
                description: "Most Accurate",
                detail: "Maximum accuracy with speaker diarization",
                model: "gpt-4o-transcribe-diarize",
              },
            ].map((mode, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border text-center transition-all duration-300 ${
                  mode.featured
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-105"
                    : "border-border/50 bg-card hover:border-primary/30"
                }`}
              >
                {mode.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full gradient-lamp px-3 py-1 text-xs font-semibold text-lamp-dark">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </span>
                  </div>
                )}
                <div className="text-5xl mb-4">{mode.emoji}</div>
                <h3 className="text-xl font-bold mb-1">{mode.name}</h3>
                <p className="text-sm font-medium text-primary mb-3">{mode.description}</p>
                <p className="text-sm text-muted-foreground mb-4">{mode.detail}</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {mode.model}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need more
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border border-border/50 bg-card">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect for trying out LampScribe</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "3 transcripts per day",
                  "Up to 30 minutes per file",
                  "All transcription modes",
                  "Basic export formats",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
            
            {/* Unlimited Plan */}
            <div className="relative p-8 rounded-2xl border-2 border-primary bg-card shadow-lg shadow-primary/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full gradient-lamp px-3 py-1 text-xs font-semibold text-lamp-dark">
                  Best Value
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Unlimited</h3>
              <p className="text-muted-foreground mb-6">For power users and professionals</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$10</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-sm text-primary mt-1">$120/year (Save 50%)</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited transcripts",
                  "Up to 10 hours per file",
                  "All transcription modes",
                  "All export formats (PDF, DOCX, SRT)",
                  "Speaker recognition",
                  "Priority processing",
                  "Translate to English",
                  "Audio restoration",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full gradient-lamp text-lamp-dark hover:opacity-90" asChild>
                <Link href="/dashboard">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl gradient-lamp p-12 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-lamp-dark mb-4">
                Ready to illuminate your audio?
              </h2>
              <p className="text-lg text-lamp-dark/80 mb-8 max-w-xl mx-auto">
                Join thousands of users who trust LampScribe for accurate, fast transcriptions.
              </p>
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold" asChild>
                <Link href="/dashboard">
                  <Upload className="mr-2 h-5 w-5" />
                  Start Transcribing Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-lamp">
                <Lamp className="h-4 w-4 text-lamp-dark" />
              </div>
              <span className="font-bold">LampScribe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by OpenAI Whisper • © 2025 LampScribe
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
