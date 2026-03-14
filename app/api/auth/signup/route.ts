import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Simple in-memory user store for demo purposes.
// Replace with a real database (MongoDB, PostgreSQL, etc.) in production.
const registeredUsers: { name: string; email: string; password: string }[] = [];

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email and password are required." },
                { status: 400 }
            );
        }

        const exists = registeredUsers.find((u) => u.email === email);
        if (exists) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // In production: hash the password (e.g. bcrypt) before storing.
        registeredUsers.push({ name, email, password });

        // Generate JWT token
        const token = jwt.sign(
            { name, email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json(
            {
                message: "Account created successfully.",
                token,
                user: { name, email },
            },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
