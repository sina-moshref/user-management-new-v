# Watch Time

یک سامانه مدیریت فیلم و کاربران توسعه داده شده با React، Fastify، PostgreSQL و Socket.IO که امکان احراز هویت، مدیریت نقش‌ها، ثبت و جستجوی فیلم‌ها و مشاهده وضعیت آنلاین کاربران را فراهم می‌کند.

## فناوری‌های استفاده شده

### Frontend

- React
- React Router
- Vite
- Socket.IO Client

### Backend

- Fastify
- Sequelize ORM
- JWT Authentication
- Socket.IO
- PostgreSQL

### Deployment

- Frontend: Cloudflare Pages
- Backend: Render
- Database: PostgreSQL

## قابلیت‌ها

- ثبت‌نام کاربران
- ورود و خروج امن با JWT
- مدیریت نقش‌ها (Admin، Moderator، User)
- نمایش وضعیت آنلاین کاربران به صورت لحظه‌ای
- ثبت آخرین زمان فعالیت (Last Seen)
- داشبورد مدیریتی
- مدیریت فیلم‌ها (افزایش، ویرایش، حذف) برای ادمین و مدریتور
- جستجوی فیلم‌ها
- امتیازدهی ستاره‌ای به فیلم‌ها
- دسته‌بندی فیلم‌ها بر اساس ژانر
- مستندسازی API با Swagger

## اطلاعات ورود مدیر سیستم

برای مشاهده امکانات مدیریتی می‌توانید از حساب زیر استفاده کنید:

**Email:** [admin@example.com](mailto:admin@example.com)

**Password:** Admin123!

## راه‌اندازی محلی پروژه

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## نکات مهم

- برای استفاده از نسخه آنلاین پروژه، VPN باید فعال باشد.
- سرویس Backend روی Render میزبانی شده است و ممکن است در برخی شبکه‌ها بدون VPN در دسترس نباشد.
- در اولین درخواست پس از مدتی عدم استفاده، ممکن است سرویس Render چند ثانیه برای فعال شدن مجدد زمان نیاز داشته باشد.
- فرانت‌اند روی Cloudflare Pages میزبانی می‌شود.

## لینک پروژه

- Frontend: https://watch-time.pages.dev
- Backend API: https://user-management-new-v.onrender.com/
