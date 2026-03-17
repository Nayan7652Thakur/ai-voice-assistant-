"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, LogOut, MessageSquare, ArrowLeft } from "lucide-react";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
}

interface AuthUser {
    name: string;
    email: string;
}

export default function Drawer({ open, onClose }: DrawerProps) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [chats, setChats] = useState<{ _id: string; title: string; createdAt: string }[]>([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);

    // For specific chat view
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedChatDetails, setSelectedChatDetails] = useState<{ messages: { role: string, content: string }[] } | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchChats = async (token: string) => {
            setIsLoadingChats(true);
            try {
                const res = await fetch("/api/chats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setChats(data.chats || []);
                }
            } catch (err) {
                console.error("Failed to load chats:", err);
            } finally {
                setIsLoadingChats(false);
            }
        };

        const stored = localStorage.getItem("auth_user");
        const token = localStorage.getItem("auth_token");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                setUser(null);
            }
        }

        if (token && open) {
            fetchChats(token);
        }

        // Reset view when drawer closes or opens
        if (!open) {
            setSelectedChatId(null);
            setSelectedChatDetails(null);
        }
    }, [open]);

    const fetchChatDetails = async (chatId: string) => {
        setSelectedChatId(chatId);
        setIsLoadingDetails(true);
        setSelectedChatDetails(null);

        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/chats/${chatId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedChatDetails(data.chat);
            }
        } catch (err) {
            console.error("Failed to load chat details:", err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        onClose();
        router.push("/login");
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 z-[60] ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-zinc-950/60 backdrop-blur-2xl border-l border-white/10 shadow-[0_8px_32px_0_#00000080] z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        {selectedChatId && (
                            <button
                                onClick={() => setSelectedChatId(null)}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                                aria-label="Back to chat list"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <span className="text-lg font-semibold tracking-wide text-foreground">
                            {selectedChatId ? "Conversation" : "Menu"}
                        </span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground relative z-[80]" onClick={onClose} aria-label="Close menu" id="close-drawer-btn">
                        <X size={20} />
                    </button>
                </div>

                {/* Main scrollable content area */}
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                    {!selectedChatId ? (
                        <>
                            {/* User info */}
                            {user && (
                                <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/5 shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">
                                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="font-semibold truncate text-foreground">{user?.name || "User"}</p>
                                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Chat List */}
                            <div className="p-4 flex flex-col gap-2">
                                <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Recent Conversations
                                </h3>
                                {isLoadingChats ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                                ) : chats.length > 0 ? (
                                    chats.map((chat) => (
                                        <button
                                            key={chat._id}
                                            className="w-full flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                                            onClick={() => fetchChatDetails(chat._id)}
                                        >
                                            <div className="flex items-center gap-2 text-foreground/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                                <MessageSquare size={16} className="shrink-0 text-primary/70" />
                                                <span className="truncate">{chat.title}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground px-6">
                                                {new Date(chat.createdAt).toLocaleDateString()}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">No recent conversations.</div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Individual Chat View */
                        <div className="p-4 flex flex-col gap-4">
                            {isLoadingDetails ? (
                                <div className="text-center text-sm text-muted-foreground mt-10">Loading conversation...</div>
                            ) : selectedChatDetails ? (
                                selectedChatDetails.messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-2xl max-w-[85%] ${msg.role === 'user'
                                            ? 'bg-primary/20 text-foreground ml-auto border border-primary/20 rounded-tr-sm'
                                            : 'bg-white/5 text-foreground/90 border border-white/5 rounded-tl-sm'
                                            }`}
                                    >
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                                            {msg.role === 'user' ? 'You' : 'VoiceAI'}
                                        </div>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-muted-foreground mt-10">Failed to load conversation.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Logout */}
                {!selectedChatId && (
                    <div className="p-6 border-t border-white/5 mt-auto bg-black/20 shrink-0">
                        <button className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all font-medium border border-destructive/20 hover:border-destructive/40" onClick={handleLogout} id="drawer-logout-btn">
                            <LogOut size={18} />
                            <span>Log out</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
