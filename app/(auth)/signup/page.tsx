"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Mic } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");


        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Signup failed. Please try again.");
            } else {
                // Store JWT token and user info in localStorage
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("auth_user", JSON.stringify(data.user));
                router.push("/");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = (() => {
        const p = formData.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
    const strengthColor = ["", "#f43f5e", "#f59e0b", "#06b6d4", "#22c55e"][passwordStrength];

    return (
        <div className="auth-page">
            {/* Aurora Background */}
            <div className="auth-bg">
                <div className="aurora-orb aurora-orb-1" />
                <div className="aurora-orb aurora-orb-2" />
                <div className="aurora-orb aurora-orb-3" />
                <div className="noise-overlay" />
            </div>

            {/* Card */}
            <div className="auth-card-wrapper">
                <div className="auth-card">
                    {/* Logo */}
                    <div className="auth-logo">
                        <div className="auth-logo-icon">
                            <Mic size={26} className="auth-logo-mic" />
                        </div>
                        <span className="auth-logo-text text-gradient">VoiceAI</span>
                    </div>

                    {/* Heading */}
                    <h1 className="auth-heading">Create account</h1>
                    <p className="auth-subheading">Join VoiceAI and start talking</p>

                    {/* Error */}
                    {error && (
                        <div className="auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="name" className="auth-label">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email" className="auth-label">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password" className="auth-label">
                                Password
                            </label>
                            <div className="auth-input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="auth-input auth-input-pwd"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="auth-eye-btn"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            {formData.password && (
                                <div className="pwd-strength">
                                    <div className="pwd-strength-bar">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="pwd-strength-seg"
                                                style={{
                                                    backgroundColor:
                                                        i <= passwordStrength ? strengthColor : "rgba(255,255,255,0.1)",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span className="pwd-strength-label" style={{ color: strengthColor }}>
                                        {strengthLabel}
                                    </span>
                                </div>
                            )}
                        </div>



                        <button
                            type="submit"
                            disabled={isLoading}
                            className="auth-submit-btn"
                            id="signup-submit"
                        >
                            {isLoading ? (
                                <span className="auth-spinner" />
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span className="auth-divider-line" />
                        <span className="auth-divider-text">or</span>
                        <span className="auth-divider-line" />
                    </div>

                    {/* Switch */}
                    <p className="auth-switch-text">
                        Already have an account?{" "}
                        <Link href="/login" className="auth-link-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
