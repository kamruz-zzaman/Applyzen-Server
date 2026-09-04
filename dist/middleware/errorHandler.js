import { ZodError } from "zod";
export class ApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export function notFoundHandler(_req, res) {
    res.status(404).json({ error: "Not found" });
}
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ZodError) {
        res.status(400).json({ error: "Validation failed", details: err.flatten() });
        return;
    }
    if (err instanceof ApiError) {
        res.status(err.status).json({ error: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
}
