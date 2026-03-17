require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

const MessageSchema = new mongoose.Schema(
    {
        role: { type: String, required: true },
        content: { type: String, required: true },
    },
    { _id: false }
);

const ChatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        messages: [MessageSchema],
    },
    { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({ email: String }));

async function injectMockChat() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to database.");

        const user = await User.findOne({ email: "agent_test_76@example.com" });
        if (!user) {
            console.error("Test user not found in the database. Run the signup flow first.");
            process.exit(1);
        }

        const mockChat = new Chat({
            userId: user._id,
            title: "Hello AI...",
            messages: [
                { role: "assistant", content: "Hello! How can I assist you today?" },
                { role: "user", content: "Hello AI, I need some help testing the chat UI." },
                { role: "assistant", content: "Of course! What would you like to test?" },
                { role: "user", content: "Just wanted to see if long texts wrap properly and if the back button works." }
            ],
        });

        await mockChat.save();
        console.log("Mock chat injected successfully! Chat ID:", mockChat._id.toString());
    } catch (error) {
        console.error("Error injecting mock chat:", error);
    } finally {
        await mongoose.disconnect();
    }
}

injectMockChat();
