import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Simple in-memory user store for demo purposes.
// Replace with a real database (MongoDB, PostgreSQL, etc.) in production.
const DEMO_USERS = [
    { email: "demo@voiceai.com", password: "demo123", name: "Demo User" },
];

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        const user = DEMO_USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json(
            {
                message: "Login successful.",
                token,
                user: { name: user.name, email: user.email },
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
