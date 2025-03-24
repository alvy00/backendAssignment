const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const bcrypt = require('bcryptjs');

const saltRounds = 10;

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword123"
 *     responses:
 *       201:
 *         description: User successfully registered. A verification link has been sent to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User signed up successfully. Please check your email for a verification link."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "b85bb9f4-d62b-4bb8-9f80-6d1eeb99f8c1"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Missing email or password.
 *       500:
 *         description: Error during registration process.
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password", error: err.message });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
      message: "User signed up successfully. Please check your email for a verification link.",
      user: data.user,
    });
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     description: Log in a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "b85bb9f4-d62b-4bb8-9f80-6d1eeb99f8c1"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing email or password.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error during login.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: "Invalid credentials", error: error.message });
  }

  const passwordMatch = await bcrypt.compare(password, data.user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "Login successful",
    user: data.user,
    access_token: data.session.access_token,
  });
});

module.exports = router;
