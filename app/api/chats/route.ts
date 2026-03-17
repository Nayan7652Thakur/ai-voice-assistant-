import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Chat } from "@/models/Chat";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

// Middleware-like function to verify token and get user
async function authenticate(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded;
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await authenticate(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        // Fetch all chats for the user, sorted by newest first
        // Need to convert string ID to ObjectId for correct matching
        const chats = await Chat.find({ userId: new mongoose.Types.ObjectId(user.id) })
            .select("_id title createdAt")
            .sort({ createdAt: -1 });

        return NextResponse.json({ chats }, { status: 200 });
    } catch (error) {
        console.error("Fetch chats error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await authenticate(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ message: "Messages are required" }, { status: 400 });
        }

        // Count existing chats for the user to determine the title number
        const chatCount = await Chat.countDocuments({ userId: new mongoose.Types.ObjectId(user.id) });
        const title = `Title ${chatCount + 1}`;

        const newChat = await Chat.create({
            userId: user.id,
            title,
            messages,
        });

        return NextResponse.json({ message: "Chat saved", chat: newChat }, { status: 201 });
    } catch (error) {
        console.error("Save chat error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
