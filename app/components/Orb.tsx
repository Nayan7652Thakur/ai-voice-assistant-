import React from 'react';

export default function Orb() {
    return (
        <div className="relative flex items-center justify-center h-64 w-64 md:h-80 md:w-80 animate-float">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-70"></div>

            {/* Mid Layer - Rotating Aura */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary/30 via-secondary/30 to-transparent blur-xl animate-spin-slow"></div>

            {/* Inner Core */}
            <div className="relative z-10 h-32 w-32 md:h-40 md:w-40 rounded-full bg-black border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden">
                {/* Core dynamic gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-secondary/40 blur-md"></div>
                {/* Inner intense dot */}
                <div className="relative h-16 w-16 bg-white rounded-full blur-sm opacity-90 shadow-[0_0_20px_white]"></div>
            </div>
        </div>
    );
}
