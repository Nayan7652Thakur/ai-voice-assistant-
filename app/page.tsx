"use client";

import React, { useState, useEffect } from "react";
import Orb from "./components/Orb";
import Transcript from "./components/Transcript";
import ControlBar from "./components/ControlBar";
import { TERA_DEMO_SYSTEM_PROMPT } from "./data/aiData";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [vapiMuted, setVapiMuted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [transcriptText, setTranscriptText] = useState("");
  const [vapi, setVapi] = useState<any>(null);

  // Vapi integration
  useEffect(() => {
    // Dynamically import Vapi to avoid SSR issues with browser APIs
    let vapiInstance: any;

    const initVapi = async () => {
      const { default: Vapi } = await import('@vapi-ai/web');
      vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "e2b55e52-b48a-4a7a-9735-8914fc72803f");
      setVapi(vapiInstance);

      // Setup Vapi event listeners
      vapiInstance.on('call-start', () => {
        setStatus('listening');
        // setTranscriptText("How can I help you?");
      });

      vapiInstance.on('call-end', () => {
        setStatus('idle');
        setTranscriptText("Session ended.");
        setIsMuted(true);
      });

      vapiInstance.on('speech-start', () => {
        setStatus('speaking');
      });

      vapiInstance.on('speech-end', () => {
        setStatus('listening');
      });

      vapiInstance.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          setTranscriptText(message.transcript);
        }
      });

      vapiInstance.on('error', (e: any) => {
        console.error("Vapi Error:", e);
        setStatus('idle');
        setTranscriptText("Error connecting to Voice assistant.");
        setIsMuted(true);
      });
    };

    initVapi();

    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
        vapiInstance.removeAllListeners();
      }
    };
  }, []);

  const handleToggleMute = () => {
    if (!vapi) return;

    if (status === 'idle') {
      // Start call
      setStatus('listening');
      setTranscriptText("Connecting...");
      setIsMuted(false);

      const strictInstructions = `\n\nCRITICAL INSTRUCTION: You must ONLY answer questions using the information provided in this system prompt above. If the user asks a question and the answer is not explicitly found in this prompt, you MUST say exactly: 'The data is not available.' Do not attempt to guess, extrapolate, or provide outside information under any circumstances.`;

      vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "61bb6f63-fc75-4211-8aee-1b0e1af0da30", {
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: TERA_DEMO_SYSTEM_PROMPT + strictInstructions
            }
          ]
        }
      });
    } else {
      // For now, toggle mute means stop call if active, based on user request "red button declines"
      setVapiMuted(!vapiMuted);
      vapi.setMuted(!vapiMuted);
    }
  };

  const handleEndCall = () => {
    if (vapi && status !== 'idle') {
      vapi.stop();
      setStatus('idle');
      setTranscriptText("Call declined/ended.");
      setIsMuted(true);
    }
  };


  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-black text-white selection:bg-primary/30">

      {/* Dynamic Background Noise / Blur effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen mix-blend-lighten animate-spin-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen mix-blend-lighten animate-float" style={{ animationDuration: '12s' }}></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 w-full max-w-5xl mx-auto h-full mt-10 md:mt-0">

        {/* Top Spacer / Header Area */}
        <div className="absolute top-8 w-full flex justify-center opacity-60 text-sm font-light tracking-widest uppercase">
          <span className="text-gradient font-semibold">AI Assistant</span>
        </div>

        {/* Central Orb Visualization */}
        <div className={`transition-all duration-700 ease-in-out ${status === 'speaking' ? 'scale-110 drop-shadow-[0_0_60px_rgba(139,92,246,0.3)]' : status === 'listening' ? 'scale-100' : 'scale-90 opacity-80'}`}>
          <Orb />
        </div>

        {/* Transcript / Caption Area */}
        <div className="mt-12 md:mt-24 w-full flex justify-center">
          <Transcript status={status} text={transcriptText} />
        </div>

      </main>

      {/* Fixed Bottom Control Bar */}
      <div className="fixed  w-full z-50 flex justify-center px-4">
        <ControlBar
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onEndCall={handleEndCall}
        />
      </div>

    </div>
  );
}
