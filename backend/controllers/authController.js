const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const users = new Map(); // Simple in-memory user store

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Upsert User
    let user = users.get(googleId);
    if (!user) {
      user = { id: googleId, email, name, picture, createdAt: new Date() };
      users.set(googleId, user);
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ error: "Invalid authentication token" });
  }
};

const getMe = async (req, res) => {
  const user = users.get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Since we use the Google ID as the map key currently, let's use the email for manual accounts
    const userId = email.toLowerCase();

    if (users.has(userId)) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = { 
      id: userId, 
      email: userId, 
      name, 
      password: hashedPassword, // Store hashed password
      picture: null, 
      createdAt: new Date() 
    };
    
    users.set(userId, user);

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Don't send the password back to the client
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    res.status(201).json({ token: jwtToken, user: userWithoutPassword });

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Server error during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const userId = email.toLowerCase();
    const user = users.get(userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(401).json({ error: "Please sign in with Google for this account" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    res.json({ token: jwtToken, user: userWithoutPassword });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = { googleLogin, getMe, register, login };
