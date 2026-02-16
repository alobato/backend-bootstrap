import { UserService } from "./services/UserService.js";
import { verifyToken } from "./utils/jwt.js";
export const context = async ({ req, res }) => {
    // Try to read token from Authorization header first
    const auth = req.headers.authorization ?? "";
    let token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    // Se não encontrou no header, tentar ler do cookie
    if (!token && req.cookies) {
        token = req.cookies["auth-token"];
    }
    const payload = verifyToken(token);
    const user = await UserService.getUserBySub(payload?.sub ?? "");
    return { user, res };
};
//# sourceMappingURL=context.js.map