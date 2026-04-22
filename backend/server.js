import express from "express";
import { connectToDB } from "./config/db.js";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

/* =========================
   MIDDLEWARE
========================= */
const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

app.get("/", (req, res) => res.send("Server running..."));

/* ---------- SIGNUP ---------- */
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already in use." });

    if (await User.findOne({ username }))
      return res.status(400).json({ message: "Username already taken." });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const userDoc = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...user } = userDoc.toObject();
    res.status(201).json({ user, message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

/* ---------- LOGIN ---------- */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const userDoc = await User.findOne({ username });
    if (!userDoc) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcryptjs.compare(password, userDoc.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...user } = userDoc.toObject();
    res.json({ user, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

/* ---------- FETCH USER ---------- */
app.get("/api/fetch-user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- LOGOUT ---------- */
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

/* =========================
   🚀 START SERVER
========================= */
connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });