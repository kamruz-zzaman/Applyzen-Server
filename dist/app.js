import cors from "cors";
import express from "express";
import morgan from "morgan";
import jobApplicationRoutes from "./routes/jobApplications.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/auth.js";
export function createApp(clientOrigin) {
    const app = express();
    app.use(cors({ origin: clientOrigin }));
    app.use(express.json());
    app.use(morgan("dev"));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/api/job-applications", requireAuth, jobApplicationRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
