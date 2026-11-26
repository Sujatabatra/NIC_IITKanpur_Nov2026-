// =====================================================================================
// STEP 08 - Never store passwords: hash them with bcrypt
// Run:  node steps/08-bcrypt.js          (no database needed)
//
// WHAT YOU LEARN
//   - a HASH is one-way: you can check a password against it, but never get the password back
//   - bcrypt adds a random SALT, so the same password gives a different hash every time
//   - the COST (12 here) makes each guess slow on purpose: brute force becomes expensive
//   - compare(plain, hash) is how login checks a password
//   - in the app this lives in the User model: pre("save") hashes, matchPassword() compares
// =====================================================================================

// bcryptjs provides hash() and compare().
import bcrypt from "bcryptjs";

// A demo password (never hard-code real ones).
const password = "Secret@123";

// Hash the same password twice with cost 12 (2^12 rounds of work). A random salt is generated each time.
const h1 = await bcrypt.hash(password, 12);
const h2 = await bcrypt.hash(password, 12);
console.log("hash 1:", h1);
console.log("hash 2:", h2);
// Different salts -> different hashes, so `!==` is true.
console.log("same password, different hashes:", h1 !== h2);
// Anatomy of "$2b$12$<22 chars salt><31 chars hash>":  $2b$ = algorithm, 12 = cost, then salt + hash.

// compare() reads the salt and cost from the stored hash, hashes the typed text the same way, and checks equality.
console.log("\ncorrect password :", await bcrypt.compare("Secret@123", h1)); // true
console.log("wrong password   :", await bcrypt.compare("secret@123", h1)); // false (capital S matters)

// Cost matters: each +1 doubles the work. Measure it.
for (const cost of [8, 10, 12]) {
  const t = Date.now(); // start time in milliseconds
  await bcrypt.hash(password, cost); // do the hashing
  console.log(`cost ${cost}: ${Date.now() - t} ms`); // elapsed time
}

// WHY the User model uses `select: false` on password: even the HASH should not leave the database by accident.
// WHY login says "Invalid email or password" for both cases: otherwise an attacker learns which emails exist.

// TRY IT: hash "123" and "a-long-random-passphrase": the hash length is identical. Length of the HASH never leaks the password's.
