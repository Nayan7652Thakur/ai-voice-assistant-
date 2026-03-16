const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected...");
        const db = mongoose.connection.db;
        const result = await db.collection('chats').dropIndex('user_1');
        console.log("Dropped index:", result);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit(0);
    }
}
fix();
