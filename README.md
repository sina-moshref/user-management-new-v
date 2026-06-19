# سیستم مدیریت کاربران (User Management System)

یک سامانه مدیریت کاربران توسعه داده شده با React، Fastify، PostgreSQL و Socket.IO که امکان احراز هویت، مدیریت نقش‌ها و مشاهده وضعیت آنلاین کاربران را فراهم می‌کند.

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

- Frontend: Netlify
- Backend: Render
- Database: PostgreSQL

## قابلیت‌ها

- ثبت‌نام کاربران
- ورود و خروج امن با JWT
- مدیریت نقش‌ها (Admin، Moderator، User)
- نمایش وضعیت آنلاین کاربران به صورت لحظه‌ای
- ثبت آخرین زمان فعالیت (Last Seen)
- داشبورد مدیریتی
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

## لینک پروژه

- Frontend: https://user-managementd.netlify.app
- Backend API: https://user-management-new-v.onrender.com/
