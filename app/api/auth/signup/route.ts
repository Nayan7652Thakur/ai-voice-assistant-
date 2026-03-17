import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email and password are required." },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to database
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, name: newUser.name, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json(
            {
                message: "Account created successfully.",
                token,
                user: { name: newUser.name, email: newUser.email },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
