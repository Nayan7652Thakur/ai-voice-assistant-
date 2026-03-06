import { useState, useEffect } from 'react';
import { TERA_DEMO_SYSTEM_PROMPT } from '../data/aiData';

export function useVapi() {
    const [isMuted, setIsMuted] = useState(true);
    const [vapiMuted, setVapiMuted] = useState(false);
    const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
    const [transcriptText, setTranscriptText] = useState("");
    const [vapi, setVapi] = useState<any>(null);

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

    const toggleMute = () => {
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

    const endCall = () => {
        if (vapi && status !== 'idle') {
            vapi.stop();
            setStatus('idle');
            setTranscriptText("Call declined/ended.");
            setIsMuted(true);
        }
    };

    return {
        isMuted,
        status,
        transcriptText,
        toggleMute,
        endCall
    };
}
