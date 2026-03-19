import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Chat } from "@/models/Chat";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await connectToDatabase();

        const chat = await Chat.findOne({
            _id: id,
            userId: new mongoose.Types.ObjectId(user.id)
        });

        if (!chat) {
            return NextResponse.json({ message: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({ chat }, { status: 200 });
    } catch (error) {
        console.error("Fetch chat error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
