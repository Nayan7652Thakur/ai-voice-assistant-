import React, { useState, useEffect, useRef } from 'react';
import { TERA_DEMO_SYSTEM_PROMPT } from '../data/aiData';

export function useVapi() {
    const [isMuted, setIsMuted] = useState(true);
    const [vapiMuted, setVapiMuted] = useState(false);
    const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
    const [transcriptText, setTranscriptText] = useState("");
    const [vapi, setVapi] = useState<any>(null);

    // Using a ref to track conversation for the endCall closure without stale state issues
    // while keeping state for UI if necessary
    const conversationRef = useRef<{ role: string, content: string }[]>([]);

    // Use a ref to store the actual Vapi instance to prevent it from being recreated
    // or incorrectly cleaned up during React Strict Mode double-invocations
    const vapiRef = useRef<any>(null);

    useEffect(() => {
        // Dynamically import Vapi to avoid SSR issues with browser APIs
        const initVapi = async () => {
            if (vapiRef.current) return; // Prevent double initialization

            const { default: Vapi } = await import('@vapi-ai/web');
            const newVapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "e2b55e52-b48a-4a7a-9735-8914fc72803f");
            vapiRef.current = newVapiInstance;
            setVapi(newVapiInstance);

            // Setup Vapi event listeners
            newVapiInstance.on('call-start', () => {
                setStatus('listening');
            });

            newVapiInstance.on('call-end', () => {
                setStatus('idle');
                setTranscriptText("Session ended.");
                setIsMuted(true);

                const currentConversation = conversationRef.current;
                if (currentConversation.length > 0) {
                    const token = localStorage.getItem("auth_token");
                    if (token) {
                        fetch("/api/chats", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ messages: currentConversation }),
                            keepalive: true
                        }).catch(console.error);
                        conversationRef.current = [];
                    }
                }
            });

            newVapiInstance.on('speech-start', () => {
                setStatus('speaking');
            });

            newVapiInstance.on('speech-end', () => {
                setStatus('listening');
            });

            newVapiInstance.on('message', (message: any) => {
                if (message.type === 'conversation-update') {
                    // Just update our ref for saving when the call ends, filtering out the giant system prompt
                    if (message.conversation && Array.isArray(message.conversation)) {
                        conversationRef.current = message.conversation.filter((m: any) => m.role !== 'system');
                    }
                } else if (message.type === 'transcript') {
                    if (message.transcriptType === 'final') {
                        const content = message.transcript || message.text || "";
                        if (content) {
                            // Ensure the final user transcript is explicitly added before endCall
                            if (message.role === 'user' && !conversationRef.current.find(m => m.content === content)) {
                                conversationRef.current.push({ role: 'user', content });
                            }
                            setTranscriptText(content);
                        }
                    } else if (message.transcriptType === 'interim') {
                        const interim = message.transcript || message.text || "";
                        if (interim) setTranscriptText(interim);
                    }
                } else if (message.type === 'speech-update' && message.role === 'assistant') {
                    if (message.text) {
                        // Keep our ref updated in case the user abruptly hangs up while the AI speaks
                        const existing = conversationRef.current.find(m => m.role === 'assistant' && m.content === message.text);
                        if (!existing) {
                            conversationRef.current.push({ role: 'assistant', content: message.text });
                        }
                        setTranscriptText(message.text);
                    }
                }
            });

            newVapiInstance.on('error', (e: any) => {
                console.error("Vapi Error:", e);
                setStatus('idle');
                setTranscriptText("Error connecting to Voice assistant.");
                setIsMuted(true);
            });
        };

        if (typeof window !== 'undefined') {
            initVapi();
        }

        return () => {
            if (vapiRef.current) {
                // Clean up on component unmount only
                try {
                    vapiRef.current.stop();
                    vapiRef.current.removeAllListeners();
                    vapiRef.current = null;
                } catch (e) {
                    console.error("Error during Vapi cleanup", e);
                }
            }
        };
    }, []);

    const saveChatEnd = async (currentConversation: { role: string, content: string }[]) => {
        console.log("Saving chat, length:", currentConversation.length);
        if (currentConversation.length === 0) return;

        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
            console.log("Sending chat payload to backend...", currentConversation);
            const res = await fetch("/api/chats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ messages: currentConversation }),
                keepalive: true
            });
            const data = await res.json();
            console.log("Save chat response:", res.status, data);
        } catch (error) {
            console.error("Failed to save chat:", error);
        }
    };

    // Add effect for saving on unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            const currentConversation = conversationRef.current;
            if (currentConversation.length === 0) return;

            const token = localStorage.getItem("auth_token");
            if (!token) return;

            // Keep-alive fetch allows the request to outlive the page
            fetch("/api/chats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ messages: currentConversation }),
                keepalive: true
            }).catch(console.error);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const toggleMute = () => {
        if (!vapi) return;

        if (status === 'idle') {
            // Start call
            setStatus('listening');
            setTranscriptText("Connecting...");
            conversationRef.current = [];
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

            // Save current conversation ref
            saveChatEnd([...conversationRef.current]);
            conversationRef.current = [];
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