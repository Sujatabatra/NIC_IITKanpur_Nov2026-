import mongoose from "mongoose"; // MongoDB ODM
import bcrypt from "bcryptjs"; // password hashing

// The shape and rules of a user document.
const userSchema = new mongoose.Schema(
  {
    // name: required text.
    name: { type: String, required: [true, "Name is required"], trim: true },
    // email: the login id; unique so two accounts cannot share it.
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    // password: at least 8 characters; select:false hides it from every query unless .select("+password") is used.
    password: { type: String, required: [true, "Password is required"], minlength: 8, select: false }, // never returned by default
    // role: "user" by default; only the seed script makes admins.
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

// hash before saving (salt rounds = 12)
// pre("save") runs before every save(). A normal function is needed so `this` is the document.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // password unchanged -> do not hash the existing hash again
  this.password = await bcrypt.hash(this.password, 12); // replace the plain text by its salted hash
});

// user.matchPassword("typed") -> true/false. bcrypt re-hashes the typed text using the salt inside the stored hash.
userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Compile and export the model ("users" collection).
export default mongoose.model("User", userSchema);
