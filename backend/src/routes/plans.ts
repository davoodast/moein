import { Router } from 'express';
import pool from '../db/connection';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all plans
router.get('/', authMiddleware, async (_req, res) => {
  try {
    const [plans] = await pool.query('SELECT * FROM plans ORDER BY price ASC');
    res.json(plans);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create plan (admin)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, description, price, features, is_active } = req.body;
    const featuresStr = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');
    const [result]: any = await pool.query(
      'INSERT INTO plans (name, description, price, features, is_active) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', price || 0, featuresStr, is_active !== false ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Plan created' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update plan (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, description, price, features, is_active } = req.body;
    const featuresStr = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');
    await pool.query(
      'UPDATE plans SET name=?, description=?, price=?, features=?, is_active=? WHERE id=?',
      [name, description || '', price || 0, featuresStr, is_active !== false ? 1 : 0, req.params.id]
    );
    res.json({ message: 'Plan updated' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete plan (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    await pool.query('DELETE FROM plans WHERE id=?', [_req.params.id]);
    res.json({ message: 'Plan deleted' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
