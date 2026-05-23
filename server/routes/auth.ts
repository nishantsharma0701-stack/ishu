import express from 'express';
import { dbInstance } from '../db.ts';
import { hashPassword, signToken } from '../jwt.ts';
import { authMiddleware, requireAuth, AuthenticatedRequest } from '../middleware.ts';

const router = express.Router();

// Register: POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email and password are required" });
  }

  const existing = dbInstance.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: "A user with this email already exists" });
  }

  const hashedPassword = hashPassword(password);
  const user = dbInstance.createUser({
    username,
    email,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundType=solid&backgroundColor=1a1a1a`
  }, hashedPassword);

  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({ user, token });
});

// Login: POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = dbInstance.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const storedHash = dbInstance.getPasswordHash(user.id);
  const incomingHash = hashPassword(password);
  if (storedHash !== incomingHash) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ user, token });
});

// Google Login Mock: POST /api/auth/google
router.post('/google', (req, res) => {
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Google email is required" });
  }

  let user = dbInstance.getUserByEmail(email);
  if (!user) {
    // Auto-create Google registered user
    const username = name || email.split('@')[0];
    user = dbInstance.createUser({
      username,
      email,
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundType=solid&backgroundColor=1a1a1a`
    }, hashPassword(Math.random().toString(36)));
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ user, token });
});

// Profile Me: GET /api/auth/me
router.get('/me', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const user = dbInstance.getUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
});

// Update Profile Preference (Body Type, Skin Tone, etc.): PUT /api/auth/profile
router.put('/profile', authMiddleware, requireAuth, (req: AuthenticatedRequest, res) => {
  const updatedUser = dbInstance.updateUserProfile(req.userId!, req.body);
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user: updatedUser });
});

export default router;
