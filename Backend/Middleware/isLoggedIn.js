// Middleware/isLoggedIn.js
import { auth } from "express-oauth2-jwt-bearer";

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
});

export { checkJwt }; // Use ES Module export
