# ⚡ شروع سریع — Quick Start

## **۵ دقیقه تا آغاز برنامه**

### گزینه ۱: اسکریپت خودکار (آسان‌ترین)

**Windows (Command Prompt):**
```cmd
setup.bat
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

✅ اسکریپت تمام چیز را نصب و تنظیم می‌کند!

---

### گزینه ۲: نصب دستی (درصورت مشکل)

#### ۱. نصب وابستگی‌ها
```powershell
# Terminal 1
cd backend
npm install

# Terminal 2
cd frontend
npm install
```

#### ۲. تنظیمات محیط
```powershell
# Backend
cd backend
copy .env.example .env

# Frontend
cd frontend  
copy .env.example .env
```

#### ۳. مقدار دهی دیتابیس
```powershell
cd backend
npm run seed
```

#### ۴. اجرای برنامه

**ترمینال ۱ (Backend):**
```powershell
cd backend
npm run dev
```

**ترمینال ۲ (Frontend):**
```powershell
cd frontend
npm run dev
```

---

## 🌐 دسترسی

| بخش | URL | توضیح |
|------|-----|--------|
| Frontend | http://localhost:5173 | رابط کاربر |
| Backend API | http://localhost:3001/api | سرویس‌ها |
| Health Check | http://localhost:3001/api/health | بررسی وضعیت |

---

## 🔑 ورود پیش‌فرض

```
نام‌کاربری: admin
رمز‌عبور: admin123

یا

نام‌کاربری: emp_photographer
رمز‌عبور: password123
```

---

## ⚠️ مشکلات رایج

| مشکل | حل |
|------|-----|
| "Port already in use" | تغییر PORT در `.env` |
| "Cannot find jalaali-js" | `npm install` مجدد |
| صفحه سفید | کنسول F12 را باز کنید |
| خطا در ورود | بررسی دیتابیس: `npm run seed` |

---

## 📚 اطلاعات بیشتر

- **راهنمای کامل**: [INSTALL.md](INSTALL.md)
- **استقرار**: [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)
- **مستندات**: [README.md](README.md)

---

## ✅ خط‌ مشی بررسی

- [ ] Node.js و npm نصب شده
- [ ] Backend نصب و اجرا می‌شود
- [ ] Frontend نصب و اجرا می‌شود
- [ ] دیتابیس آغاز شده
- [ ] می‌توانید وارد شوید

**تبریک! 🎉 پروژه آماده است!**
