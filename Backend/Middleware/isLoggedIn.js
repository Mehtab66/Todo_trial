import { auth } from "express-oauth2-jwt-bearer"; // ✅ CommonJS import

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
});

export default { checkJwt };
