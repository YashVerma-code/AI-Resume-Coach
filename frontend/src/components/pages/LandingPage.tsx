"use client";

import { ArrowRight, FileText, Rocket, Upload, Flame, Zap, Brain, CheckCircle2, MessageSquare, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Features, Outputs } from "../../lib/constants";
// import gsap from "gsap"; 
// import ScrollTrigger from "gsap/ScrollTrigger"; 
// import { useGSAP } from "@gsap/react";

import "../pages/landing.css";
import Link from "next/link";

type Particle = {
    left: number;
    top: number;
    duration: number;
    delay: number;
};

export default function LandingPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const rocketRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [activeFeature, setActiveFeature] = useState<number>(0);
    const [particles, setParticles] = useState<Particle[]>([]);
    // Floating animation for rocket
    useEffect(() => {
        const generatedParticles: Particle[] = Array.from({ length: 8 }).map(() => ({
            left: 20 + Math.random() * 60,
            top: 20 + Math.random() * 60,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 2,
        }));

        setParticles(generatedParticles);
    }, []);

    useEffect(() => {
        const rocket = rocketRef.current;
        if (rocket) {
            let position = 0;
            const float = () => {
                position += 0.02;
                const y = Math.sin(position) * 10;
                const rotate = Math.sin(position * 0.5) * 5;
                rocket.style.transform = `translateY(${y}px) rotate(${rotate}deg)`;
                requestAnimationFrame(float);
            };
            float();
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Hero Section */}
            <div ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6">
                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                    {/* Floating Rocket Icon with flame effect */}
                    <div className="inline-block mb-4 relative">
                        <div ref={rocketRef} className="relative">
                            <Rocket
                                className="w-16 h-16 text-red-500"
                                style={{
                                    filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))'
                                }}
                            />
                            {/* Flame trail */}
                            <Flame
                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 text-orange-500 animate-pulse"
                                style={{
                                    filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.8))'
                                }}
                            />
                        </div>
                    </div>

                    {/* Logo/Badge with glow effect */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/40 rounded-full backdrop-blur-xl animate-border-glow">
                        <Zap className="w-4 h-4 text-red-400 animate-pulse" />
                        <span className="text-sm text-red-300 font-medium">AI-Powered Interview Preparation</span>
                    </div>

                    {/* Main Headline with typing effect simulation */}
                    <h1
                        ref={titleRef}
                        className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
                        style={{
                            textShadow: '0 0 60px rgba(239, 68, 68, 0.4)',
                            animation: 'fadeInUp 1s ease-out, gradient 3s ease infinite'
                        }}
                    >
                        Launch Your Career
                    </h1>

                    <p
                        className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed"
                        style={{ animation: 'fadeInUp 1s ease-out 0.2s backwards' }}
                    >
                        Interviewers powered by <span className="text-red-400 font-semibold animate-pulse-text">your own resume</span>. Navigate the cosmos of interviews with AI precision.
                    </p>

                    {/* CTA Buttons with enhanced effects */}
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                        style={{ animation: 'fadeInUp 1s ease-out 0.4s backwards' }}
                    >
                        <Link href="/upload">
                            <button className=" group relative px-8 py-4 bg-gradient-to-r from-red-900 to-rose-700 rounded-lg font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 flex items-center gap-2" >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

                                <Upload className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Upload Resume</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />

                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-red-500/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </Link>
                    </div>

                    {/* File Format Info with fade in */}
                    <div
                        className="flex items-center justify-center gap-4 text-sm text-slate-300"
                        style={{ animation: 'fadeInUp 1s ease-out 0.6s backwards' }}
                    >
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-400" />
                            <span>PDF / DOCX / JPG / PNG</span>
                        </div>
                        <span className="text-red-400/50">•</span>
                        <span>Free to start</span>
                        <span className="text-red-400/50">•</span>
                        <span>No credit card required</span>
                    </div>
                </div>


            </div>

            {/* Features Section */}
            <div className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Section Heading */}
                    <div className="feature-section text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent animate-gradient"
                            // style={{ animation: 'fadeInUp 1s ease-out, gradient 3s ease infinite' }}
                            >
                            Mission Control Features
                        </h2>
                        <p className="mt-4 text-slate-200 text-lg max-w-2xl mx-auto"
                            // style={{ animation: 'fadeInUp 1s ease-out 0.2s backwards' }}
                            >
                            Precision engineered tools to transform your resume into an elite interview performance engine.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Features.map((feature, idx) => (
                            <div
                                key={idx}
                                className={`group relative p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.05] overflow-hidden ${activeFeature === idx
                                    ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.35)]"
                                    : "border-white/10 hover:border-red-500/50"
                                    }`}
                                onMouseEnter={() => setActiveFeature(idx)}
                                style={{ animation: `fadeInUp 0.8s ease-out ${0.4 + idx * 0.1}s backwards` }}
                            >
                                {/* Glow background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-rose-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Floating glow orb */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Icon */}
                                <div
                                    className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-red-600 to-rose-600 transition-transform duration-500 ${activeFeature === idx ? "scale-110 rotate-6" : ""
                                        }`}
                                    style={{
                                        boxShadow: "0 0 25px rgba(239,68,68,0.45)"
                                    }}
                                >
                                    {feature.icon && <feature.icon />}
                                </div>

                                {/* Title */}
                                <h3 className="relative text-xl font-semibold mb-3 text-white">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="relative text-slate-300 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Output Showcase */}
                    <div className="mt-24 text-center"
                        style={{ animation: 'fadeInUp 1s ease-out 1s backwards' }}>
                        <h3 className="text-3xl md:text-4xl font-semibold mb-10 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent animate-gradient">
                            What You Get
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {Outputs.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group relative px-6 py-3 rounded-full border border-red-500/20 bg-black/60 backdrop-blur-xl text-slate-200 text-sm tracking-wide hover:border-red-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${1.2 + idx * 0.1}s backwards`,
                                        boxShadow: "0 0 0 rgba(239,68,68,0)"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "0 0 25px rgba(239,68,68,0.25)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "0 0 0 rgba(239,68,68,0)";
                                    }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                                    <span className="relative z-10 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-red-400" />
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Mock Interview Section */}
            <div className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-black/60 border border-red-500/20 rounded-3xl p-12 backdrop-blur-xl relative overflow-hidden"
                        style={{ animation: 'fadeInUp 1s ease-out 0.5s backwards' }}>

                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5" />

                        {/* Animated glow orbs */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

                        <div className="relative grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-6 text-white"
                                    style={{
                                        textShadow: '0 0 40px rgba(239, 68, 68, 0.3)',
                                        animation: 'fadeInUp 1s ease-out 0.7s backwards'
                                    }}>
                                    Practice in Zero Gravity
                                </h2>
                                <p className="text-slate-200 text-lg mb-8"
                                    style={{ animation: 'fadeInUp 1s ease-out 0.9s backwards' }}>
                                    Choose your format: engage in realistic chat-based interviews or level up with voice mode for the most authentic practice experience.
                                </p>
                                <div className="flex gap-4"
                                    style={{ animation: 'fadeInUp 1s ease-out 1.1s backwards' }}>
                                    <div className="group relative flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/40 hover:border-red-500/70 transition-all duration-300 overflow-hidden">
                                        {/* Hover shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <MessageSquare className="w-5 h-5 text-red-400 relative z-10" />
                                        <span className="text-white relative z-10">Chat Mode</span>
                                    </div>
                                    <div className="group relative flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-lg border border-rose-500/40 hover:border-rose-500/70 transition-all duration-300 overflow-hidden">
                                        {/* Hover shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <Mic className="w-5 h-5 text-rose-400 relative z-10 group-hover:scale-110 transition-transform" />
                                        <span className="text-white relative z-10">Voice Mode</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative"
                                style={{ animation: 'fadeInUp 1s ease-out 1.3s backwards' }}>
                                <div className="w-full h-64 bg-black/80 rounded-2xl border border-red-500/30 flex items-center justify-center backdrop-blur-xl relative overflow-hidden group hover:border-red-500/60 transition-all duration-500">

                                    {/* Animated gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10" />

                                    {/* Particle effects */}
                                    {particles.map((p, i) => (
                                        <div
                                            key={`sim-particle-${i}`}
                                            className="absolute w-1 h-1 bg-red-500 rounded-full"
                                            style={{
                                                left: `${p.left}%`,
                                                top: `${p.top}%`,
                                                animation: `float-particle ${p.duration}s ease-in-out infinite`,
                                                animationDelay: `${p.delay}s`,
                                                opacity: 0.4,
                                                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                                            }}
                                        />
                                    ))}


                                    <div className="relative text-center space-y-4">
                                        {/* Pulsing brain icon */}
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center relative"
                                            style={{
                                                animation: 'pulse-icon 2s ease-in-out infinite',
                                                boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
                                            }}>
                                            {/* Expanding rings */}
                                            <div className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping" />
                                            <div className="absolute inset-0 rounded-full border-2 border-red-500/30" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.5s' }} />

                                            <Brain className="w-10 h-10 text-white relative z-10" />
                                        </div>
                                        <p className="text-slate-200 font-medium">AI Interview Simulation</p>

                                        {/* Status indicator */}
                                        <div className="flex items-center justify-center gap-2 text-xs text-red-400">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                                style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)' }} />
                                            <span>Ready to Launch</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}