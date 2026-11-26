// =====================================================================================
// STEP 09 - JSON Web Tokens: sign, verify, expire, tamper
// Run:  node steps/09-jwt.js          (the secret is in lib/config.js, no database needed)
//
// WHAT YOU LEARN
//   - a JWT = header.payload.signature, three base64 parts joined by dots
//   - the payload is READABLE by anyone (never put a password in it); the SIGNATURE stops forgery
//   - jwt.verify throws when the token is tampered with, signed with another secret, or expired
//   - stateless: the server remembers nothing, it just re-checks the signature on every request
// =====================================================================================

// jsonwebtoken: sign() creates tokens, verify() checks them.
import jwt from "jsonwebtoken";
// The secret is written in lib/config.js.
import { JWT_SECRET } from "../lib/config.js";

// The secret key used to sign and verify. Whoever knows it can create valid tokens.
const secret = JWT_SECRET;

// SIGN: what we put inside is called "claims". Keep it small: id and role are enough.
// expiresIn "1d" adds an `exp` claim one day ahead; sign also adds `iat` (issued at).
const token = jwt.sign({ id: "64b0c0ffee0000000000abcd", role: "admin" }, secret, { expiresIn: "1d" });
console.log("token:\n", token, "\n");

// ANYONE can read the payload, no secret needed. This is why secrets never go inside.
// Split the token at the dots: h = header, p = payload (we ignore the signature here).
const [h, p] = token.split(".");
// base64url-decode each part to bytes, then JSON.parse the text into an object.
console.log("header :", JSON.parse(Buffer.from(h, "base64url")));
console.log("payload:", JSON.parse(Buffer.from(p, "base64url")), "\n");

// VERIFY returns the payload when the signature and expiry are fine.
console.log("verified:", jwt.verify(token, secret));

// 1) Tampered: change the role in the payload and keep the old signature.
// Build a new payload part (base64url of the JSON) ...
const fakePayload = Buffer.from(JSON.stringify({ id: "x", role: "admin" })).toString("base64url");
try {
  // ... and glue it between the original header and the ORIGINAL signature. The signature no longer matches.
  jwt.verify(`${h}.${fakePayload}.${token.split(".")[2]}`, secret);
} catch (e) {
  console.log("tampered  ->", e.name, "-", e.message); // JsonWebTokenError - invalid signature
}

// 2) Wrong secret.
try {
  jwt.verify(token, "another-secret"); // a different key cannot validate our signature
} catch (e) {
  console.log("wrong key ->", e.name, "-", e.message);
}

// 3) Expired: create a token that expired one second ago.
const old = jwt.sign({ id: "x" }, secret, { expiresIn: -1 }); // negative lifetime = already expired
try {
  jwt.verify(old, secret);
} catch (e) {
  console.log("expired   ->", e.name, "-", e.message); // TokenExpiredError - jwt expired
}
// All three throw. In the API, the error handler turns them into 401 Unauthorized.

// TRY IT: paste a token from this script into https://jwt.io to see the payload (never paste a real production token).
// TRY IT: sign with { expiresIn: "2s" }, wait 3 seconds, verify.
