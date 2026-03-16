"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

interface HeaderProps {
    onOpenDrawer: () => void;
}

export default function Header({ onOpenDrawer }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const user = localStorage.getItem("auth_user");

        if (token && user) {
            setIsLoggedIn(true);
        }

        // Listen for storage changes to update state across tabs if needed
        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem("auth_token");
            setIsLoggedIn(!!updatedToken);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <header className="w-full flex justify-end items-center p-6 absolute top-0 z-50">
            {isLoggedIn ? (
                <button
                    onClick={onOpenDrawer}
                    className="p-3 rounded-full bg-background/20 hover:bg-background/50 border border-primary/20 backdrop-blur-md transition-all drop-shadow-lg"
                    aria-label="Open User Menu"
                >
                    <Menu className="w-6 h-6 text-foreground" />
                </button>
            ) : (
                <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-full bg-primary/20 hover:bg-primary/40 border border-primary/40 text-primary-foreground backdrop-blur-md transition-all font-medium drop-shadow-md tracking-wide"
                >
                    Login
                </Link>
            )}
        </header>
    );
}
