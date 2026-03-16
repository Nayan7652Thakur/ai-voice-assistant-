import type { Metadata } from "next";
import "./auth.css";

export const metadata: Metadata = {
    title: "VoiceAI – Account",
    description: "Sign in or create your VoiceAI account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
