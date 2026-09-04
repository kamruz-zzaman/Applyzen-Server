import { jwtVerify } from "jose";
import { ApiError } from "./errorHandler.js";
let secretKey = null;
function getSecretKey() {
    if (!secretKey) {
        const secret = process.env.AUTH_SECRET;
        if (!secret)
            throw new Error("AUTH_SECRET is not set");
        secretKey = new TextEncoder().encode(secret);
    }
    return secretKey;
}
// The Next.js app mints this short-lived token (see app/api/auth-token/route.ts)
// separately from its own session cookie, since Auth.js session cookies are
// encrypted JWEs that aren't meant to be decoded outside of Auth.js itself.
export async function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next(new ApiError(401, "Missing or invalid Authorization header"));
        return;
    }
    const token = header.slice("Bearer ".length);
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        if (typeof payload.sub !== "string")
            throw new Error("Token missing subject");
        req.userId = payload.sub;
        next();
    }
    catch {
        next(new ApiError(401, "Invalid or expired token"));
    }
}
