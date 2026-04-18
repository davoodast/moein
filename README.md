# آتلیه معین — Atelier Moein 📸

سیستم مدیریت آتلیه عکاسی و فیلمبرداری عروسی با قابلیت مدیریت مراسمات، کارمندان، پلن‌های خدماتی، تقویم جلالی و داشبورد آماری.

---

## فناوری‌های استفاده شده

### بک‌اند
| فناوری | نسخه |
|--------|------|
| Node.js | v24 |
| Express | 5.x |
| TypeScript | 5.x |
| SQLite (better-sqlite3) | 11.x |
| JWT | jsonwebtoken |

### فرانت‌اند
| فناوری | نسخه |
|--------|------|
| React | 18 |
| TypeScript | 5.x |
| Vite | 8.x |
| Tailwind CSS | 3.4 |
| jalaali-js | latest |
| Lucide React | latest |

---

## ساختار پروژه

```
moein/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── db/connection.ts      # SQLite adapter + migrations
│   │   ├── middleware/auth.ts    # JWT middleware, role guards
│   │   └── routes/
│   │       ├── auth.ts           # ورود / خروج
│   │       ├── ceremonies.ts     # مراسمات + وظایف
│   │       ├── employees.ts      # کارمندان
│   │       ├── plans.ts          # پلن‌های خدماتی
│   │       └── settings.ts       # تنظیمات آتلیه
│   └── data/atelier_moein.db     # SQLite (~4 KB)
└── frontend/
    └── src/
        ├── pages/
        │   ├── HomePage.tsx              # صفحه اصلی editorial
        │   ├── LoginPage.tsx             # ورود
        │   ├── AdminDashboardPage.tsx    # داشبورد مدیریت (5 تب)
        │   └── EmployeeDashboardPage.tsx # داشبورد کارمند (2 تب)
        ├── components/
        │   ├── admin/
        │   │   ├── CeremoniesManagement.tsx  # 19.6 KB
        │   │   ├── EmployeesManagement.tsx   # 14.1 KB
        │   │   ├── PlansManagement.tsx       # 9.6 KB
        │   │   └── TaskAssignment.tsx        # 6.9 KB
        │   ├── ui/
        │   │   ├── JalaliCalendar.tsx        # 5.3 KB
        │   │   └── JalaliDatePicker.tsx      # 5.0 KB
        │   └── common/
        │       ├── Header.tsx / Sidebar.tsx / MainLayout.tsx
        ├── context/
        │   ├── AuthContext.tsx    # JWT auth state
        │   └── ThemeContext.tsx   # Dark/Light mode
        └── utils/numberToWords.ts # فرمت فارسی اعداد
```

---

## اجرای پروژه

```bash
# بک‌اند
cd backend && npm install && npm run dev
# → http://localhost:3001

# فرانت‌اند
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

---

## حساب‌های کاربری پیش‌فرض

| نام کاربری | رمز عبور | نقش |
|-----------|---------|-----|
| admin | password123 | مدیر |
| emp_photographer | password123 | عکاس |
| emp_videographer | password123 | فیلمبردار |
| emp_editor | password123 | تدوینگر |

---

## API

```
POST /api/auth/login                     ورود
GET  /api/auth/me                        کاربر جاری

GET|POST   /api/ceremonies               لیست / ثبت مراسم
GET|PUT|DELETE /api/ceremonies/:id       جزئیات / ویرایش / حذف
GET  /api/ceremonies/my-tasks/list       وظایف کارمند
POST /api/ceremonies/:id/tasks           تخصیص کارمند
DELETE /api/ceremonies/:id/tasks/:tid    حذف وظیفه

GET|POST   /api/employees                کارمندان
PUT|DELETE /api/employees/:id

GET|POST   /api/plans                    پلن‌ها
PUT|DELETE /api/plans/:id                (admin only)
```

---

## قابلیت‌ها

### داشبورد مدیریت (5 تب)
1. **داشبورد** — آمار کلی، نمودارهای SVG، جدول + کارت موبایل
2. **مراسمات** — دو حالت رزرو سریع (4 فیلد) و قرارداد کامل با پلن
3. **کارمندان** — CRUD کامل با mobile card view
4. **تقویم** — تقویم جلالی با کلیک روی روز
5. **پلن‌ها** — بسته‌های خدماتی با قیمت و لیست خدمات

### داشبورد کارمند (2 تب)
1. **خلاصه** — آمار وظایف، لیست با نقش و ساعت کاری
2. **تقویم** — تقویم کاری شخصی

### ویژگی‌های فنی
- **PWA iPhone** — `viewport-fit=cover`, safe-area-inset, `apple-mobile-web-app-capable`
- **RTL کامل** — sidebar از سمت راست با `translate-x-full`
- **Dark Mode** — بدون FOUC (اعمال قبل از render اول)، status badges با dark variants
- **تقویم جلالی** — jalaali-js، رنگ‌بندی روزها (سبز=رزرو، بنفش=تکمیل)
- **Responsive** — کارت موبایل / جدول دسکتاپ برای تمام لیست‌ها

---

## ساختار پایگاه داده

| جدول | توضیح |
|------|-------|
| `users` | کاربران |
| `employees` | اطلاعات کارمندان |
| `ceremonies` | مراسمات (`plan_id`, `ceremony_mode`) |
| `ceremony_tasks` | وظایف (`attendance_hours`) |
| `plans` | پلن‌ها (`features` JSON) |
| `ceremony_payments` | پرداخت‌ها |
| `payroll / advances / expenses` | مالی |
| `settings` | تنظیمات |

---

## حجم فایل‌های اصلی

| فایل | حجم |
|------|-----|
| CeremoniesManagement.tsx | 19.6 KB / 346 خط |
| EmployeesManagement.tsx | 14.1 KB / 344 خط |
| AdminDashboardPage.tsx | 11.8 KB / 184 خط |
| PlansManagement.tsx | 9.6 KB / 197 خط |
| db/connection.ts | 8.3 KB / 267 خط |
| routes/ceremonies.ts | 7.6 KB / 261 خط |
| **Database** | **~4 KB** |

---

*آتلیه معین — Photography & Cinematography — MMXXVI*
