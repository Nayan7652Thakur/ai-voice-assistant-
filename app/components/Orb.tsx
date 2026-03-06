interface OrbProps {
    status?: 'idle' | 'listening' | 'speaking';
}

export default function Orb({ status = 'idle' }: OrbProps) {
    return (
        <div className="relative flex items-center justify-center h-64 w-64 md:h-80 md:w-80 animate-float">
            {/* Outer Glow Ring - dynamically colored based on status */}
            <div className={`absolute inset-0 rounded-full animate-pulse-ring opacity-60 transition-colors duration-700 ${status === 'speaking' ? 'shadow-[0_0_0_rgba(139,92,246,0.6)]' :
                    status === 'listening' ? 'shadow-[0_0_0_rgba(6,182,212,0.6)]' :
                        'shadow-[0_0_0_rgba(161,161,170,0.3)]'
                }`}></div>

            {/* Mid Layer - Rotating Energy Field */}
            <div className={`absolute inset-4 rounded-full blur-2xl animate-spin-slow transition-opacity duration-700 ${status === 'idle' ? 'opacity-30 bg-gradient-to-tr from-zinc-500/30 via-zinc-400/20 to-transparent' :
                    'opacity-80 bg-gradient-to-tr from-primary/50 via-secondary/50 to-accent/30'
                }`}
                style={{ animationDuration: status === 'speaking' ? '4s' : status === 'listening' ? '8s' : '15s' }}
            ></div>

            {/* Inner Core - Premium 3D Glass Sphere Look */}
            <div className="relative z-10 h-32 w-32 md:h-40 md:w-40 rounded-full bg-zinc-950 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)_inset,0_0_40px_rgba(139,92,246,0.5)] flex items-center justify-center overflow-hidden backdrop-blur-3xl">

                {/* Core dynamic ambient light */}
                <div className={`absolute inset-0 blur-xl transition-opacity duration-700 ${status === 'idle' ? 'opacity-40 bg-zinc-600' : 'opacity-80 bg-gradient-to-br from-primary via-secondary to-transparent'
                    }`}></div>

                {/* Inner intense energy core */}
                <div className={`relative rounded-full blur-[2px] shadow-[0_0_30px_white] transition-all duration-500 ${status === 'speaking' ? 'h-20 w-20 bg-white opacity-100 scale-110' :
                        status === 'listening' ? 'h-16 w-16 bg-blue-100 opacity-90 scale-100' :
                            'h-10 w-10 bg-zinc-300 opacity-60 scale-90'
                    }`}></div>

                {/* Glass reflection highlight overlay */}
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-40 mix-blend-overlay rotate-[-45deg] pointer-events-none"></div>
            </div>
        </div>
    );
}
