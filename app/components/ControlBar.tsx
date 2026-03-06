import { Mic, MicOff, Phone, Settings } from 'lucide-react';

interface ControlBarProps {
    isMuted: boolean;
    onToggleMute: () => void;
    onEndCall: () => void;
}

export default function ControlBar({ isMuted, onToggleMute, onEndCall }: ControlBarProps) {
    return (
        <div className="glass-panel rounded-full px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-center gap-4 sm:gap-8 mx-auto w-max mb-4  transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:bg-zinc-900/40">

            <button
                className="p-3 sm:p-4 rounded-full transition-all duration-300 text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95"
                aria-label="Settings"
            >
                <Settings size={22} className="opacity-80" />
            </button>

            <button
                onClick={onToggleMute}
                className={`relative group p-5 sm:p-6 rounded-full transition-all duration-500 active:scale-95 overflow-hidden ${isMuted
                    ? 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 border border-white/5 shadow-inner'
                    : 'bg-zinc-100 text-zinc-900 hover:bg-white shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]'
                    }`}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {/* Subtle gradient overlay for unmuted state */}
                {!isMuted && <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50"></div>}

                <div className="relative z-10">
                    {isMuted ? <MicOff size={26} /> : <Mic size={28} className="drop-shadow-sm" />}
                </div>
            </button>

            <button
                onClick={onEndCall}
                className="p-3 sm:p-4 rounded-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 active:scale-95"
                aria-label="End Call"
            >
                <Phone size={22} className="rotate-[135deg]" />
            </button>

        </div>
    );
}
