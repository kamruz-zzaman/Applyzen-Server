import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
const PORT = process.env.PORT ?? 4000;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/job-tracker";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";
async function main() {
    await connectDB(MONGODB_URI);
    const app = createApp(CLIENT_ORIGIN);
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}
main().catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
});
