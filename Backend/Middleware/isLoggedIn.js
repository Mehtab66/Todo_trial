// In isLoggedIn.js (ESM style)
import { auth } from "express-oauth2-jwt-bearer"; // Importing correctly in ESM

export const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
});
