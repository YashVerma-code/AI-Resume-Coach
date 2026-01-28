"use client";

import { useEffect, useState } from "react";

export default function BackgroundWrapper() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const arr = [...Array(60)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float-particle ${5 + Math.random() * 10}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.3
    }));

    setParticles(arr);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: 'url("/bg3.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-300 rounded-full"
            style={{
              ...style,
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)"
            }}
          />
        ))}
      </div>
    </div>
  );
}
