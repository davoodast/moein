import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create database directory
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dbDir, 'atelier_moein.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Create an adapter to provide MySQL-like interface
class DatabaseAdapter {
  private db: Database.Database;

  constructor(database: Database.Database) {
    this.db = database;
  }

  // Provide a query method compatible with MySQL pool.query
  async query(sql: string, params?: any[]): Promise<[any[], any]> {
    try {
      // For SELECT queries
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = this.db.prepare(sql);
        const results = stmt.all(...(params || [])) as any[];
        return [results, undefined];
      }
      // For INSERT, UPDATE, DELETE queries
      else {
        const stmt = this.db.prepare(sql);
        const info = stmt.run(...(params || []));
        return [{ insertId: info.lastInsertRowid, affectedRows: info.changes } as any, undefined];
      }
    } catch (error) {
      console.error('Query error:', error, 'SQL:', sql, 'Params:', params);
      throw error;
    }
  }

  // Execute without returning result (for initialization)
  exec(sql: string): void {
    this.db.exec(sql);
  }
}

const pool = new DatabaseAdapter(db);

export default pool;

export async function testConnection() {
  try {
    db.prepare('SELECT 1').all();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}


export async function initializeDatabase() {
  try {
    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        password TEXT NOT NULL,
        phone TEXT,
        role_id INTEGER,
        bank_account TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )`,

      `CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        position TEXT,
        start_date TEXT,
        salary DECIMAL(12, 0),
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS ceremonies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        groom_name TEXT,
        bride_name TEXT,
        date_jalali TEXT,
        time TEXT,
        address TEXT,
        plan_details TEXT,
        total_amount DECIMAL(12, 0),
        advance_paid DECIMAL(12, 0) DEFAULT 0,
        status TEXT DEFAULT 'booked',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS ceremony_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ceremony_id INTEGER,
        amount DECIMAL(12, 0),
        type TEXT,
        check_number TEXT,
        due_date TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ceremony_id) REFERENCES ceremonies(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS ceremony_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ceremony_id INTEGER,
        employee_id INTEGER,
        role_description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ceremony_id) REFERENCES ceremonies(id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(12, 0) DEFAULT 0,
        features TEXT DEFAULT '[]',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS payroll (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        month_year TEXT,
        gross_salary DECIMAL(12, 0),
        deductions DECIMAL(12, 0),
        total DECIMAL(12, 0),
        pdf_path TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS advances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        amount DECIMAL(12, 0),
        date_jalali TEXT,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        amount DECIMAL(12, 0),
        date_jalali TEXT,
        description TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT DEFAULT 'آتلیه معین',
        about_us TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        address TEXT,
        logo TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    for (const table of tables) {
      db.prepare(table).run();
    }

    console.log('✅ Tables created/verified');

    // Migrations – add columns if not exist
    const migrations = [
      'ALTER TABLE ceremony_tasks ADD COLUMN attendance_hours REAL DEFAULT 0',
      'ALTER TABLE ceremonies ADD COLUMN plan_id INTEGER REFERENCES plans(id)',
      'ALTER TABLE ceremonies ADD COLUMN ceremony_mode TEXT DEFAULT \'quick\'',
    ];
    for (const m of migrations) {
      try { db.prepare(m).run(); } catch (_) { /* column already exists */ }
    }

    // Seed default roles
    const rolesQuery = 'INSERT OR IGNORE INTO roles (id, name, description) VALUES (?, ?, ?)';
    const roles = [
      [1, 'admin', 'Administrator with full access'],
      [2, 'accountant', 'Accountant can manage contracts and payroll'],
      [3, 'employee', 'Employee can view assigned tasks and payroll'],
      [4, 'customer', 'Customer can view their ceremony details'],
    ];

    for (const role of roles) {
      db.prepare(rolesQuery).run(...role);
    }

    console.log('✅ Roles seeded');

    // Seed default admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminQuery =
      'INSERT OR IGNORE INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)';
    db.prepare(adminQuery).run('admin', 'admin@atelier.local', hashedPassword, 1);

    console.log('✅ Default admin user created (username: admin, password: password123)');

    // Seed settings
    const settingsQuery =
      'INSERT OR REPLACE INTO settings (id, company_name, about_us, contact_email, contact_phone) VALUES (1, ?, ?, ?, ?)';
    db.prepare(settingsQuery).run(
      'آتلیه معین',
      'استودیو عکاسی و فیلمبرداری مراسم',
      'info@atelier.local',
      '09XX XXX XXXX'
    );

    console.log('✅ Settings seeded');

    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

export function closeDatabase() {
  db.close();
}
