import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the structure of a user document
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, "Please provide a name"], // Custom error message
      trim: true, // Remove whitespace from edges
      minlength: [2, "Name must be at least 2 characters"],
    },

    // User's email (unique - no duplicates)
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true, // MongoDB will prevent duplicates
      lowercase: true, // Always store lowercase for consistency
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email", // Regex for email validation
      ],
    },

    // User's password (will be hashed before saving)
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password by default when querying
    },
  },
  {
    timestamps: true, // Auto-creates createdAt and updatedAt fields
  },
);

// MIDDLEWARE: Hash password before saving
// "pre" means this runs BEFORE the document is saved
userSchema.pre("save", async function () {
  // If password wasn't modified, skip hashing
  if (!this.isModified("password")) {
    return;
  }

  // Generate salt (random data to make hash unique)
  // 10 = cost factor (higher = more secure but slower)
  const salt = await bcrypt.genSalt(10);

  // Hash the password
  // bcrypt.hash("abc123", salt) → "$2b$10$xK9pL2mN..."
  this.password = await bcrypt.hash(this.password, salt);
});

// METHOD: Compare entered password with stored hash
// Used during login to verify password
userSchema.methods.comparePassword = async function (enteredPassword) {
  // bcrypt.compare("abc123", "$2b$10$...") → true or false
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from schema
// "User" is the singular name, MongoDB creates collection "users"
const User = mongoose.model("User", userSchema);

export default User;
