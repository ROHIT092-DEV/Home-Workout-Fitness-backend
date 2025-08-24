import { verifyAccessToken } from "../utils/tokens.js";


export function requireAuth(req, res, next) {
const auth = req.headers.authorization || "";
const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }



if (!token) return res.status(401).json({ success: false, message: "Missing token" });
try {
const payload = verifyAccessToken(token);
req.user = { id: payload.id, role: payload.role };
next();
} catch (err) {
return res.status(401).json({ success: false, message: "Invalid or expired token" });
}


}