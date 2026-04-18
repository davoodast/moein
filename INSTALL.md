# 📖 راهنمای نصب آتلیه معین — Atelier Moein Setup Guide

## فهرست مطالب
- [پیش‌نیازها](#پیش‌نیازها)
- [نصب سریع](#نصب-سریع)
- [ساختار پروژه](#ساختار-پروژه)
- [تنظیمات محیط](#تنظیمات-محیط)
- [راه‌اندازی برنامه](#راه‌اندازی-برنامه)
- [تولید برای تولید](#تولید-برای-تولید)
- [رفع مشکلات](#رفع-مشکلات)

---

## پیش‌نیازها

تأکید داشته باشید که موارد زیر در سیستم شما نصب شده‌اند:

### لازم‌ الزام
- **Node.js**: نسخه 20 یا بالاتر ([دانلود](https://nodejs.org/en/download))
- **npm**: معمولاً با Node.js نصب می‌شود (معمولاً v10+)

### اختیاری
- **Git**: برای کلون کردن مخزن
- **VS Code**: برای توسعه (توصیه می‌شود)

### بررسی نسخه‌ها
```powershell
node --version    # باید v20 یا بالاتر باشد
npm --version     # باید v10 یا بالاتر باشد
```

---

## نصب سریع

### گام ۱: کلون/دانلود پروژه
```powershell
cd C:\Users\davoo\Desktop\github
git clone <your-repo-url> moein
# یا
# اگر قبلاً دانلود شده است، به پوشه پروژه بروید
cd moein
```

### گام ۲: نصب وابستگی‌ها (Backend)
```powershell
cd backend
npm install
```

### گام ۳: نصب وابستگی‌ها (Frontend)
```powershell
cd ..\frontend
npm install
```

### گام ۴: تنظیمات محیط

**Backend (.env)**
```powershell
cd ..\backend
copy .env.example .env
# سپس .env را با یک ویرایشگر باز کنید و مقادیر را تأیید کنید
```

مقادیر پیش‌فرض در `.env.example`:
```
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
```

**Frontend (.env)**
```powershell
cd ..\frontend
copy .env.example .env
# معمولاً نیازی به تغییر نیست، اگر backend در جای دیگری اجرا می‌شود
```

### گام ۵: ایجاد دیتابیس و اطلاعات نمونه
```powershell
cd ..\backend
npm run seed
```

---

## ساختار پروژه

```
moein/
├── backend/
│   ├── src/
│   │   ├── index.ts              # نقطه ورود
│   │   ├── db/
│   │   │   └── connection.ts    # اتصال SQLite و تهیه‌کننده
│   │   ├── middleware/
│   │   │   └── auth.ts          # احراز هویت JWT
│   │   ├── routes/
│   │   │   ├── auth.ts          # ورود/خروج
│   │   │   ├── ceremonies.ts    # مراسمات
│   │   │   ├── employees.ts     # کارمندان
│   │   │   ├── plans.ts         # پلن‌های خدماتی
│   │   │   └── settings.ts      # تنظیمات
│   │   ├── scripts/
│   │   │   └── seed-data.ts     # داده‌های نمونه
│   │   ├── services/            # منطق کسب‌وکار
│   │   └── utils/               # توابع کمکی
│   ├── data/
│   │   └── atelier_moein.db     # دیتابیس SQLite (~4 KB)
│   ├── uploads/                 # فایل‌های بارگذاری شده
│   ├── dist/                    # نتیجه کامپایل (تولیدی)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx             # نقطه ورود React
│   │   ├── App.tsx              # کامپوننت ریشه
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   └── EmployeeDashboardPage.tsx
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── CeremoniesManagement.tsx
│   │   │   │   ├── EmployeesManagement.tsx
│   │   │   │   ├── PlansManagement.tsx
│   │   │   │   └── TaskAssignment.tsx
│   │   │   ├── ui/
│   │   │   │   ├── JalaliCalendar.tsx
│   │   │   │   └── JalaliDatePicker.tsx
│   │   │   └── common/
│   │   │       ├── Header.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── dist/                    # نتیجه بیلد (تولیدی)
│   ├── public/                  # فایل‌های ثابت
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── README.md                    # توضیحات اصلی
├── INSTALL.md                   # این فایل
└── DEPLOYMENT_READY.md          # نکات배포
```

---

## تنظیمات محیط

### Backend Environment

**فایل: `backend/.env`**

```env
# سرور
PORT=3001
NODE_ENV=development

# JWT برای احراز هویت
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

# بارگذاری فایل
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760    # 10 MB

# Frontend URL (برای CORS)
FRONTEND_URL=http://localhost:5173
```

**توصیه‌های امنیتی:**
- `JWT_SECRET` را در محیط تولید تغییر دهید
- از یک JWT Secret قوی استفاده کنید (حداقل ۳۲ کاراکتر)
- محدودیت اندازه فایل را بر حسب نیاز تنظیم کنید

### Frontend Environment

**فایل: `frontend/.env`**

```env
VITE_API_URL=http://localhost:3001/api
```

---

## راه‌اندازی برنامه

### حالت توسعه (Development)

**ترمینال ۱: Backend**
```powershell
cd backend
npm run dev
# نتیجه: Server running on http://localhost:3001
```

**ترمینال ۲: Frontend**
```powershell
cd frontend
npm run dev
# نتیجه: Local: http://localhost:5173
```

### دسترسی به برنامه
- **صفحه اصلی**: http://localhost:5173
- **API**: http://localhost:3001/api
- **سلامت بررسی**: http://localhost:3001/api/health

### اطلاعات ورود پیش‌فرض
```
نام‌کاربری: admin
رمز‌عبور: admin123
```

---

## تولید برای تولید

### ۱. بیلد Backend
```powershell
cd backend
npm run build
```

نتیجه: فایل‌های کامپایل در `backend/dist/`

### ۲. بیلد Frontend
```powershell
cd frontend
npm run build
```

نتیجه: فایل‌های ثابت در `frontend/dist/`

### ۳. اجرای Backend در تولید
```powershell
cd backend
npm start
# یا
node dist/index.js
```

### ۴. نصب و میزبانی Frontend
- فایل‌های `frontend/dist/` را به سرور وب (nginx, Apache, etc.) آپلود کنید
- یا از یک سرویس میزبانی استفاده کنید (Vercel, Netlify, etc.)

---

## اسکریپت‌های دسترسی

### Backend

```bash
npm run dev          # اجرای حالت توسعه
npm run build        # کامپایل TypeScript
npm start            # اجرای نسخه کامپایل شده
npm run seed         # افزودن داده‌های نمونه
npm test             # تست‌ها (اگر پیاده‌سازی شده‌اند)
```

### Frontend

```bash
npm run dev          # اجرای حالت توسعه
npm run build        # بیلد برای تولید
npm run preview      # پیش‌نمایش نسخه تولید
npm run lint         # بررسی کد
```

---

## رفع مشکلات

### خطا: "Cannot find module 'jalaali-js'"

**حل:**
```powershell
cd frontend
npm install
# دوباره بیلد کنید
npm run build
```

### خطا: "Port 3001 is already in use"

**حل:**
```powershell
# شماره درگاه را تغییر دهید
# در backend/.env تغییر دهید:
PORT=3002
```

### خطا: "Database connection failed"

**حل:**
```powershell
# مطمئن شوید فایل database موجود است
cd backend
# اگر داده‌ها پاک شده‌اند، دوباره ایجاد کنید
npm run seed
```

### خطا: "CORS error" هنگام درخواست API

**حل:**
1. بررسی کنید که `FRONTEND_URL` در `backend/.env` صحیح است
2. اطمینان حاصل کنید frontend در `http://localhost:5173` است
3. دوباره backend را راه‌اندازی کنید

### صفحه Frontend سفید است

**حل:**
1. کنسول را باز کنید (F12)
2. خطاهای JavaScript را بررسی کنید
3. API endpoint را بررسی کنید
4. Frontend دوباره راه‌اندازی کنید

---

## بررسی نهایی

قبل از استقرار:

- [ ] Backend بدون خطا جمع‌آوری می‌شود
- [ ] Frontend بدون خطا جمع‌آوری می‌شود
- [ ] دیتابیس آغاز شده است (`npm run seed`)
- [ ] Backend در http://localhost:3001 اجرا می‌شود
- [ ] Frontend در http://localhost:5173 اجرا می‌شود
- [ ] می‌توانید با اطلاعات پیش‌فرض وارد شوید
- [ ] داشبورد بارگذاری می‌شود

---

## پشتیبانی و مشکلات

برای کمک بیشتر:
1. فایل `README.md` را بررسی کنید
2. کنسول Backend و Frontend را بررسی کنید
3. دیباگر VS Code را استفاده کنید

---

**تاریخ ایجاد**: ۱۸ فروردین ۱۴۰۵
**آخرین به‌روزرسانی**: ۱۸ فروردین ۱۴۰۵
