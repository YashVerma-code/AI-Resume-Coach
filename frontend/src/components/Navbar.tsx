"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";


gsap.registerPlugin(ScrollTrigger);

const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Upload", href: "/upload" },
];

export default function Navbar() {
    const navRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                nav,
                {
                    maxWidth: "100%",
                    y: 0,
                    borderRadius: 0,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                },
                {
                    maxWidth: "50rem",
                    y: 16,
                    borderRadius: 20,
                    boxShadow: "0 0 30px rgba(239,68,68,0.35)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: document.body,
                        start: "top top",
                        end: "200px top",
                        scrub: 1.2,
                    },
                    
                }
            );
        });

        return () => ctx.revert();
    }, []);


    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <nav
                ref={navRef}
                className="
          pointer-events-auto
          backdrop-blur-xl
          border border-red-500/20
          bg-black/50
          w-full px-8 py-4 flex items-center justify-center
          transition-colors
        "
            >
                {/* Desktop Nav */}
                <div className="hidden md:flex w-full items-center">
                    <div className="flex gap-12 mx-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`text-xl relative font-medium transition-all duration-300 group 
            ${isActive ? "text-red-400" : "text-slate-300 hover:text-red-400"}`}
                                >
                                    {item.label}
                                    <span className={`
            absolute -bottom-1 h-0.5 bg-red-500 transition-all duration-300
            ${isActive ? "left-0 w-full" : "left-1/2 w-0 group-hover:w-full group-hover:left-0"}
          `} />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Clerk Auth Buttons */}
                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9 ring-2 ring-red-500/40 rounded-full"
                                    }
                                }}
                            />
                        </SignedIn>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>


                {/* Mobile Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden absolute right-6 top-4 text-red-400"
                >
                    {open ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {open && (
                <div className="fixed top-20 left-4 right-4 bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 flex flex-col gap-4 md:hidden shadow-[0_0_25px_rgba(239,68,68,0.35)]">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="text-slate-200 text-lg text-center py-2 rounded-xl hover:bg-red-500/10 transition-all"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="flex justify-center pt-4 border-t border-red-500/20">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>

            )}
        </div>
    );
}
