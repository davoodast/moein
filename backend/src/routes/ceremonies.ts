import { Router } from 'express';
import pool from '../db/connection';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all ceremonies
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [ceremonies] = await pool.query(
      'SELECT * FROM ceremonies ORDER BY date_jalali DESC LIMIT 100'
    );
    res.json(ceremonies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get ceremonies by date range (for calendar)
router.get('/range/:startDate/:endDate', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const [ceremonies]: any = await pool.query(
      'SELECT * FROM ceremonies WHERE date_jalali BETWEEN ? AND ?',
      [startDate, endDate]
    );
    res.json(ceremonies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get my tasks (for logged-in employee) – must be before /:id
router.get('/my-tasks/list', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const [emp]: any = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
    if (!emp[0]) { res.json([]); return; }
    const [tasks]: any = await pool.query(
      `SELECT ct.*, c.type, c.groom_name, c.bride_name, c.date_jalali, c.time, c.address, c.status
       FROM ceremony_tasks ct
       JOIN ceremonies c ON ct.ceremony_id = c.id
       WHERE ct.employee_id = ?
       ORDER BY c.date_jalali DESC`,
      [emp[0].id]
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single ceremony
router.get('/:id', authMiddleware, async (req, res): Promise<void> => {
  try {
    const [ceremony]: any = await pool.query(
      'SELECT * FROM ceremonies WHERE id = ?',
      [req.params.id]
    );

    if (!ceremony[0]) {
      res.status(404).json({ error: 'Ceremony not found' });
      return;
    }

    // Get payments
    const [payments] = await pool.query(
      'SELECT * FROM ceremony_payments WHERE ceremony_id = ?',
      [req.params.id]
    );

    // Get assigned employees
    const [tasks] = await pool.query(
      `SELECT ct.*, e.*, u.username FROM ceremony_tasks ct
       JOIN employees e ON ct.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE ct.ceremony_id = ?`,
      [req.params.id]
    );

    res.json({
      ...ceremony[0],
      payments,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create ceremony (admin)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      type,
      groom_name,
      bride_name,
      groomName,
      brideName,
      date_jalali,
      dateJalali,
      time,
      address,
      plan_details,
      planDetails,
      total_amount,
      totalAmount,
      advance_paid,
      advancePaid,
    } = req.body;

    const [result]: any = await pool.query(
      `INSERT INTO ceremonies 
       (type, groom_name, bride_name, date_jalali, time, address, plan_details, total_amount, advance_paid)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        groom_name || groomName,
        bride_name || brideName,
        date_jalali || dateJalali,
        time,
        address,
        plan_details || planDetails,
        total_amount || totalAmount,
        advance_paid || advancePaid || 0,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Ceremony created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update ceremony (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      type,
      groom_name,
      bride_name,
      groomName,
      brideName,
      date_jalali,
      dateJalali,
      time,
      address,
      plan_details,
      planDetails,
      total_amount,
      totalAmount,
      advance_paid,
      advancePaid,
      status
    } = req.body;

    await pool.query(
      `UPDATE ceremonies SET type = ?, groom_name = ?, bride_name = ?, date_jalali = ?, time = ?, 
       address = ?, plan_details = ?, total_amount = ?, advance_paid = ?, status = ? WHERE id = ?`,
      [
        type,
        groom_name || groomName,
        bride_name || brideName,
        date_jalali || dateJalali,
        time,
        address,
        plan_details || planDetails,
        total_amount || totalAmount,
        advance_paid || advancePaid,
        status || 'booked',
        req.params.id,
      ]
    );

    res.json({ message: 'Ceremony updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete ceremony (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    await pool.query('DELETE FROM ceremonies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Ceremony deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add payment to ceremony
router.post('/:id/payments', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { amount, type, checkNumber, dueDate } = req.body;

    const [result]: any = await pool.query(
      `INSERT INTO ceremony_payments (ceremony_id, amount, type, check_number, due_date)
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, amount, type, checkNumber, dueDate]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Payment added successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign employee to ceremony
router.post('/:id/assign', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { employeeId, roleDescription } = req.body;

    const [result]: any = await pool.query(
      `INSERT INTO ceremony_tasks (ceremony_id, employee_id, role_description)
       VALUES (?, ?, ?)`,
      [req.params.id, employeeId, roleDescription]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Employee assigned successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add task (with attendance hours)
router.post('/:id/tasks', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { employee_id, role_description, attendance_hours } = req.body;
    const [result]: any = await pool.query(
      `INSERT INTO ceremony_tasks (ceremony_id, employee_id, role_description, attendance_hours) VALUES (?, ?, ?, ?)`,
      [req.params.id, employee_id, role_description, attendance_hours || 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Task assigned' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id/tasks/:taskId', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    await pool.query('DELETE FROM ceremony_tasks WHERE id = ? AND ceremony_id = ?', [req.params.taskId, req.params.id]);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
