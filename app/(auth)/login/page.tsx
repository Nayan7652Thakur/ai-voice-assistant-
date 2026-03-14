"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Mic } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed. Please try again.");
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
                    <h1 className="auth-heading">Welcome back</h1>
                    <p className="auth-subheading">Sign in to your account to continue</p>

                    {/* Error */}
                    {error && (
                        <div className="auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
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
                                    autoComplete="current-password"
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
                        </div>

                        <div className="auth-forgot-row">
                            <Link href="/forgot-password" className="auth-link-subtle">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="auth-submit-btn"
                            id="login-submit"
                        >
                            {isLoading ? (
                                <span className="auth-spinner" />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In
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
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="auth-link-primary">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
