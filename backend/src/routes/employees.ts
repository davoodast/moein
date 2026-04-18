import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/connection';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all employees
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [employees]: any = await pool.query(
      `SELECT e.*, u.username, u.email, u.phone, u.bank_account, r.name as role
       FROM employees e
       JOIN users u ON e.user_id = u.id
       LEFT JOIN roles r ON u.role_id = r.id`
    );
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single employee
router.get('/:id', authMiddleware, async (req, res): Promise<void> => {
  try {
    const [employee]: any = await pool.query(
      `SELECT e.*, u.username, u.email, u.phone, u.bank_account
       FROM employees e
       JOIN users u ON e.user_id = u.id
       WHERE e.id = ?`,
      [req.params.id]
    );

    if (!employee[0]) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.json(employee[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create employee (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { username, email, phone, password, position, salary, startDate } = req.body;

    // Create user
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const [userResult]: any = await pool.query(
      'INSERT INTO users (username, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, 3] // 3 = employee role
    );

    // Create employee
    const [empResult]: any = await pool.query(
      'INSERT INTO employees (user_id, position, salary, start_date) VALUES (?, ?, ?, ?)',
      [userResult.insertId, position, salary, startDate]
    );

    res.status(201).json({
      id: empResult.insertId,
      userId: userResult.insertId,
      username,
      message: 'Employee created successfully',
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update employee (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { position, salary, status, phone, bank_account, bankAccount } = req.body;

    const [employee]: any = await pool.query(
      'SELECT user_id FROM employees WHERE id = ?',
      [req.params.id]
    );

    if (!employee[0]) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    await pool.query(
      'UPDATE employees SET position = ?, salary = ?, status = ? WHERE id = ?',
      [position, salary, status || 'active', req.params.id]
    );

    if (phone || bank_account || bankAccount) {
      await pool.query(
        'UPDATE users SET phone = ?, bank_account = ? WHERE id = ?',
        [phone, bank_account || bankAccount, employee[0].user_id]
      );
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete employee (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res): Promise<void> => {
  try {
    const [employee]: any = await pool.query(
      'SELECT user_id FROM employees WHERE id = ?',
      [req.params.id]
    );

    if (!employee[0]) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    // Delete employee first
    await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    
    // Then delete the user
    await pool.query('DELETE FROM users WHERE id = ?', [employee[0].user_id]);

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employee ceremonies (for employee dashboard)
router.get('/:id/ceremonies', authMiddleware, async (req, res) => {
  try {
    const [ceremonies]: any = await pool.query(
      `SELECT c.*, ct.role_description FROM ceremonies c
       JOIN ceremony_tasks ct ON c.id = ct.ceremony_id
       JOIN employees e ON ct.employee_id = e.id
       WHERE e.id = ?
       ORDER BY c.date_jalali DESC`,
      [req.params.id]
    );

    res.json(ceremonies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
