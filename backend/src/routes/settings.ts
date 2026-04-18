import { Router } from 'express';
import pool from '../db/connection';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    const [settings]: any = await pool.query('SELECT * FROM settings LIMIT 1');
    res.json(settings[0] || {});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update settings (admin only)
router.put('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { companyName, aboutUs, contactEmail, contactPhone, address, logo } = req.body;

    const [result]: any = await pool.query(
      `UPDATE settings SET company_name = ?, about_us = ?, contact_email = ?, contact_phone = ?, address = ?, logo = ? 
       WHERE id = 1`
    );

    if (result.affectedRows === 0) {
      await pool.query(
        `INSERT INTO settings (company_name, about_us, contact_email, contact_phone, address, logo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [companyName, aboutUs, contactEmail, contactPhone, address, logo]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
