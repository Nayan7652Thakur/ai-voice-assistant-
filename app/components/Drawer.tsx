"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, LogOut, User, Settings, MessageSquare } from "lucide-react";

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

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                setUser(null);
            }
        }
    }, [open]);

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
                className={`drawer-backdrop ${open ? "drawer-backdrop--open" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <aside className={`drawer-panel ${open ? "drawer-panel--open" : ""}`} role="dialog" aria-modal="true">
                {/* Header */}
                <div className="drawer-header">
                    <span className="drawer-title">Menu</span>
                    <button className="drawer-close-btn" onClick={onClose} aria-label="Close menu" id="close-drawer-btn">
                        <X size={20} />
                    </button>
                </div>

                {/* User info */}
                {user && (
                    <div className="drawer-user-card">
                        <div className="drawer-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="drawer-user-info">
                            <p className="drawer-user-name">{user.name}</p>
                            <p className="drawer-user-email">{user.email}</p>
                        </div>
                    </div>
                )}

                {/* Nav items */}
                <nav className="drawer-nav">
                    <button className="drawer-nav-item" onClick={onClose}>
                        <MessageSquare size={18} />
                        <span>Chat History</span>
                    </button>
                    <button className="drawer-nav-item" onClick={onClose}>
                        <User size={18} />
                        <span>Profile</span>
                    </button>
                    <button className="drawer-nav-item" onClick={onClose}>
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                </nav>

                {/* Logout */}
                <div className="drawer-footer">
                    <button className="drawer-logout-btn" onClick={handleLogout} id="drawer-logout-btn">
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
