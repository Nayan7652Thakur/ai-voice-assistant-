interface TranscriptProps {
    status: 'idle' | 'listening' | 'speaking';
    text: string;
}

export default function Transcript({ status, text }: TranscriptProps) {
    return (
        <div className="w-full max-w-2xl px-6 py-8 flex flex-col items-center justify-center min-h-[160px] text-center transition-all duration-700">

            {/* Premium Status indicator */}
            <div className={`flex items-center gap-3 mb-6 transition-all duration-500 ${status === 'idle' ? 'opacity-40' : 'opacity-100'}`}>
                {status === 'listening' ? (
                    <div className="flex gap-1 h-5 items-end bg-black/20 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                        <div className="w-1 bg-secondary rounded-sm animate-wave" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1 bg-secondary rounded-sm animate-wave" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 bg-primary rounded-sm animate-wave" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 bg-primary rounded-sm animate-wave" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-1 bg-accent rounded-sm animate-wave" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                ) : status === 'speaking' ? (
                    <div className="flex gap-1.5 h-6 items-center bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '0.6s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }}></div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                    </div>
                )}

                <span className="text-xs font-semibold text-zinc-400 tracking-[0.2em] uppercase">
                    {status === 'listening' ? 'Listening...' : status === 'speaking' ? 'AI Speaking' : 'Standby'}
                </span>
            </div>

            {/* High-End Transcript Text */}
            <div className={`transition-all duration-700 transform ${status === 'idle' ? 'translate-y-4 opacity-30 scale-95 md:scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
                <p className={`text-3xl md:text-4xl font-semibold tracking-tight leading-tight whitespace-pre-wrap ${status === 'speaking' ? 'text-gradient' : 'text-zinc-100 drop-shadow-md'
                    }`}>
                    {text || "How can I assist you?"}
                </p>
            </div>

        </div>
    );
}