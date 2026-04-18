import db from '../db/connection';
import bcrypt from 'bcryptjs';

async function addSampleData() {
  try {
    console.log('🌱 Adding sample data...');

    // Add sample employees
    const employees = [
      {
        username: 'emp_photographer',
        email: 'photo@moein.local',
        phone: '09123456789',
        position: 'عکاسی اصلی',
        salary: 2000000,
        start_date: '1401/01/01',
        password: 'password123',
      },
      {
        username: 'emp_videographer',
        email: 'video@moein.local',
        phone: '09123456790',
        position: 'فیلمبرداری',
        salary: 1800000,
        start_date: '1401/03/15',
        password: 'password123',
      },
      {
        username: 'emp_editor',
        email: 'editor@moein.local',
        phone: '09123456791',
        position: 'تدوین و پروژه‌کاری',
        salary: 1500000,
        start_date: '1401/06/01',
        password: 'password123',
      },
    ];

    for (const emp of employees) {
      const hashedPassword = await bcrypt.hash(emp.password, 10);
      
      // Check if user exists
      const [existing]: any = await db.query('SELECT id FROM users WHERE username = ?', [emp.username]);
      
      if (!existing || existing.length === 0) {
        const [userResult]: any = await db.query(
          'INSERT INTO users (username, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?)',
          [emp.username, emp.email, hashedPassword, emp.phone, 3]
        );

        await db.query(
          'INSERT INTO employees (user_id, position, salary, start_date, status) VALUES (?, ?, ?, ?, ?)',
          [userResult.insertId, emp.position, emp.salary, emp.start_date, 'active']
        );

        console.log(`✅ Added employee: ${emp.username}`);
      }
    }

    // Add sample ceremonies
    const ceremonies = [
      {
        type: 'عروسی',
        groom_name: 'علی رضائی',
        bride_name: 'فاطمه احمدی',
        date_jalali: '1402/05/20',
        time: '18:00',
        address: 'تهران - میدان ولیعصر - درکه',
        plan_details: 'عکاسی و فیلمبرداری کامل',
        total_amount: 2500000,
        advance_paid: 1000000,
        status: 'booked',
      },
      {
        type: 'عقد',
        groom_name: 'محمد جعفری',
        bride_name: 'ایران فرهادی',
        date_jalali: '1402/06/10',
        time: '17:00',
        address: 'تهران - شریف - تالار مرجان',
        plan_details: 'عکاسی و فیلمبرداری',
        total_amount: 1500000,
        advance_paid: 500000,
        status: 'booked',
      },
      {
        type: 'عروسی',
        groom_name: 'رضا موسوی',
        bride_name: 'مریم هاشمی',
        date_jalali: '1402/07/05',
        time: '19:00',
        address: 'تهران - درکه - تالار کاخ',
        plan_details: 'پکیج کامل با تدوین',
        total_amount: 3000000,
        advance_paid: 1500000,
        status: 'in_progress',
      },
    ];

    for (const ceremony of ceremonies) {
      const [existing]: any = await db.query(
        'SELECT id FROM ceremonies WHERE groom_name = ? AND bride_name = ?',
        [ceremony.groom_name, ceremony.bride_name]
      );

      if (!existing || existing.length === 0) {
        await db.query(
          `INSERT INTO ceremonies (type, groom_name, bride_name, date_jalali, time, address, plan_details, total_amount, advance_paid, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ceremony.type,
            ceremony.groom_name,
            ceremony.bride_name,
            ceremony.date_jalali,
            ceremony.time,
            ceremony.address,
            ceremony.plan_details,
            ceremony.total_amount,
            ceremony.advance_paid,
            ceremony.status
          ]
        );

        console.log(`✅ Added ceremony: ${ceremony.groom_name} و ${ceremony.bride_name}`);
      }
    }

    console.log('🎉 Sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
