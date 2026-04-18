import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../db/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to sign token
const signToken = (payload: any, expiresIn?: string): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: expiresIn || '7d' } as any);
};

// Login
router.post('/login', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.query(
      'SELECT u.*, r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.username = ?',
      [username]
    );

    const user = rows[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signToken(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_EXPIRE || '7d'
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        bankAccount: user.bank_account,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      'SELECT u.*, r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [req.user.id]
    );

    const user = rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      bankAccount: user.bank_account,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Register (admin only)
router.post('/register', authMiddleware, async (req: AuthRequest, res): Promise<void> => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403).json({ error: 'Admin only' });
      return;
    }

    const { username, email, password, phone, roleId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
      'INSERT INTO users (username, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, roleId || 3]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      email,
      role: 'employee',
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;
