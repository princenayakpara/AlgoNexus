const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

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
}

module.exports = { googleLogin, getMe };
