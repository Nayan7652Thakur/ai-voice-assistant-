import React from 'react';
import { Mic, MicOff, Phone, Settings, Volume2 } from 'lucide-react';

interface ControlBarProps {
    isMuted: boolean;
    onToggleMute: () => void;
    onEndCall: () => void;
}

export default function ControlBar({ isMuted, onToggleMute, onEndCall }: ControlBarProps) {
    return (
        <div className="glass-dark rounded-full px-6 py-4 flex items-center gap-6 md:gap-8 mx-auto w-max mb-8 transition-transform hover:scale-[1.02]">

            <button
                className="p-3 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                aria-label="Settings"
            >
                <Settings size={22} />
            </button>

            <button
                onClick={onToggleMute}
                className={`p-5 rounded-full transition-all duration-300 shadow-lg ${isMuted
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-primary text-white hover:bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                    }`}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <button
                onClick={onEndCall}
                className="p-4 rounded-full bg-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all duration-300"
                aria-label="End Call"
            >
                <Phone size={24} className="rotate-[135deg]" />
            </button>

        </div>
    );
}
