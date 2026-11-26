// =====================================================================================
// ALL SETTINGS FOR THE STEPS LIVE HERE, IN PLAIN SIGHT.
//
// Every step imports its settings from this one file, so you can see exactly what the program connects to.
// There is no .env file in this project.
//
// TRAINING ONLY. In a real project these values are SECRETS and must never be written in source code
// (or committed to git): they go in a .env file. The finished project (../../backend) does it that way.
// =====================================================================================

// ---------- The database connection string (MONGO_URI) ----------
// Anatomy:   mongodb://  <host>  :  <port>  /  <database name>
//            mongodb://127.0.0.1 : 27017   /  mern_steps
//   127.0.0.1 = this computer      27017 = MongoDB's default port      mern_steps = the database we use
// MongoDB creates the database the first time something is written to it.
export const MONGO_URI = "mongodb://127.0.0.1:27017/mern_steps";

// Using MongoDB Atlas (cloud) instead? Comment the line above and use this one, with YOUR user, password and cluster:
//   (a password with special characters such as @ : / # must be URL-encoded, e.g. @ becomes %40)
// export const MONGO_URI = "mongodb+srv://myUser:myPassword@cluster0.xxxxx.mongodb.net/mern_steps?retryWrites=true&w=majority";

// ---------- The web server ----------
export const PORT = 5000; // steps 07 and 10 listen here: http://localhost:5000

// ---------- Tokens (steps 09 and 10) ----------
// The secret signs every JWT. Anyone who knows it can forge a login, so a real one is long and random.
export const JWT_SECRET = "training-only-secret-do-not-use-in-real-projects-0123456789";
export const JWT_EXPIRES_IN = "1d"; // a token stops working after one day

// ---------- The first admin user (step 11 creates it) ----------
export const SEED_ADMIN_EMAIL = "admin@example.com";
export const SEED_ADMIN_PASSWORD = "Admin@12345"; // must be at least 8 characters
