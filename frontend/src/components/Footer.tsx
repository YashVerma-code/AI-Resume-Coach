"use client";

import {
  Rocket,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
} from "lucide-react";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/YashVerma-code", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/yash-verma/", label: "LinkedIn" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:yashverma221004@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`footer-particle-${i}`}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${8 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Glow orbs */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative border-t border-red-500/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg flex items-center justify-center"
                  style={{ boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" }}
                >
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
                  AI Interview Coach
                </span>
              </div>

              <p className="text-slate-300 mb-6 leading-relaxed">
                Transform your interview preparation with AI-powered precision.
                Launch your career to new heights.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="group w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-110"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s backwards`,
                    }}
                  >
                    <div className="text-red-400 group-hover:text-red-300 transition-colors">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-red-500/20 pt-8 pb-8">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold mb-2 text-white">
                Stay Updated
              </h3>
              <p className="text-slate-300 mb-4 text-sm">
                Get the latest updates on AI interview preparation tips and
                features.
              </p>

              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-black/40 border border-red-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500/60 transition-all duration-300 backdrop-blur-xl"
                />
                <button className="group px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Subscribe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-red-500/20 pt-8 pb-8">
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400" />
                <span>support@aiinterviewcoach.com</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-red-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} AI Interview Coach. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>for aspiring professionals</span>
            </div>

          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>Made using hackpack-cli</span>

          </div>
        </div>
      </div>
    </footer>
  );
}
