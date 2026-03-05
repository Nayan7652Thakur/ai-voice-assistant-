import React from 'react';

interface TranscriptProps {
    status: 'idle' | 'listening' | 'speaking';
    text: string;
}

export default function Transcript({ status, text }: TranscriptProps) {
    return (
        <div className="w-full max-w-2xl px-6 py-8 flex flex-col items-center justify-center min-h-[160px] text-center transition-all duration-500">

            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-4">
                {status === 'listening' ? (
                    <div className="flex gap-1 h-4 items-center">
                        <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 bg-secondary rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-1 bg-secondary rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                ) : status === 'speaking' ? (
                    <div className="flex gap-1.5 h-6 items-center">
                        <div className="w-1.5 bg-white rounded-full animate-wave" style={{ animationDelay: '0.2s', animationDuration: '0.8s' }}></div>
                        <div className="w-1.5 bg-white rounded-full animate-wave" style={{ animationDelay: '0.4s', animationDuration: '0.9s' }}></div>
                        <div className="w-1.5 bg-white rounded-full animate-wave" style={{ animationDelay: '0.1s', animationDuration: '0.7s' }}></div>
                        <div className="w-1.5 bg-white rounded-full animate-wave" style={{ animationDelay: '0.5s', animationDuration: '1s' }}></div>
                    </div>
                ) : (
                    <div className="w-2 h-2 rounded-full bg-white/30"></div>
                )}
                <span className="text-sm font-medium text-white/50 tracking-widest uppercase">
                    {status === 'listening' ? 'Listening...' : status === 'speaking' ? 'Assistant Speaking' : 'Ready'}
                </span>
            </div>

            {/* Actual Transcript Text */}
            <p className={`text-2xl md:text-3xl font-light tracking-wide leading-relaxed transition-opacity duration-300 ${status === 'idle' ? 'opacity-40' : 'opacity-100'}`}>
                {text || "How can I help you today?"}
            </p>

        </div>
    );
}
