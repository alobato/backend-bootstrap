import jwt from "jsonwebtoken";
import "dotenv/config";
const SECRET = process.env.JWT_SECRET ?? "supersecret";
export function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}
export function verifyToken(token) {
    if (!token)
        return null;
    try {
        return jwt.verify(token, SECRET);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=jwt.js.map