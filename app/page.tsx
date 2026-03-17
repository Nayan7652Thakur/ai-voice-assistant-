"use client";

import React, { useState } from "react";
import Orb from "./components/Orb";
import Transcript from "./components/Transcript";
import ControlBar from "./components/ControlBar";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import { useVapi } from "./hooks/useVapi";

export default function Home() {
  const { isMuted, status, transcriptText, toggleMute, endCall } = useVapi();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground selection:bg-primary/30">

      {/* Header & Drawer */}
      <Header onOpenDrawer={() => setIsDrawerOpen(true)} />
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Modern High-End Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-background">
        {/* Deep ambient glow */}
        <div className="absolute w-[80vw] h-[80vh] top-[10%] left-[10%] bg-primary/10 rounded-full blur-[160px] mix-blend-screen mix-blend-lighten animate-spin-slow"></div>
        {/* Dynamic bright spot 1 (Cyan/Teal) */}
        <div className="absolute w-[50vw] h-[50vh] top-[-10%] right-[-10%] bg-secondary/15 rounded-full blur-[120px] mix-blend-screen mix-blend-lighten animate-float" style={{ animationDuration: '14s' }}></div>
        {/* Dynamic bright spot 2 (Rose/Pink) */}
        <div className="absolute w-[60vw] h-[60vh] bottom-[-20%] left-[-20%] bg-accent/15 rounded-full blur-[140px] mix-blend-screen mix-blend-lighten animate-float" style={{ animationDuration: '18s', animationDelay: '2s' }}></div>

        {/* Optional noise texture overlay for realism (using CSS radial-gradient as fallback) */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6  pb-32 relative z-10 w-full max-w-5xl mx-auto h-full mt-10 md:mt-0">


        {/* Central Orb Visualization container */}
        <div className={`transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${status === 'speaking' ? 'scale-[1.15] drop-shadow-[0_0_80px_rgba(139,92,246,0.4)]' :
          status === 'listening' ? 'scale-100 drop-shadow-[0_0_40px_rgba(6,182,212,0.2)]' :
            'scale-90 opacity-70 grayscale-[20%]'
          }`}>
          <Orb status={status} />
        </div>

        {/* Transcript / Caption Area */}
        <div className="mt-8 md:mt-1 w-full flex justify-center perspective-[1000px]">
          <Transcript status={status} text={transcriptText} />
        </div>

      </main>

      {/* Floating Modern Bottom Control Bar */}
      <div className="fixed bottom-0 w-full z-50 flex justify-center pb-8 px-4 bg-gradient-to-t from-background via-background/80 to-transparent pt-12">
        <ControlBar
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onEndCall={endCall}
        />
      </div>

    </div>
  );
}