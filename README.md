# รถเช่า - Mini Project

บริหารจัดการรถสำหรับการให้บริการรถเช่า พร้อมระบบจองและติดตามสถานะการใช้รถ

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **UI Library**: shadcn/ui
- **State Management**: SWR, React Context
- **Form Handling**: React Hook Form, Zod
- **Database**: Supabase (PostgreSQL
  )
- **ORM**: Prisma
- **Authentication**: NextAuth.js / Auth.js

## คุณสมบัติ

- 🚗 จัดการข้อมูลรถและคนขับ
- 📆 ระบบจองรถ
- 📊 แดชบอร์ดสำหรับผู้ดูแลระบบ
- 👤 การจัดการผู้ใช้และการกำหนดสิทธิ์
- 📱 Responsive design รองรับทุกขนาดหน้าจอ

## โครงสร้างโปรเจค

```
/app - Next.js App Router
  /api - API Routes
  /(routes) - Application routes
/components - React components
/lib - Utility functions, configurations
/prisma - Database schema and migrations
/public - Static assets
```

## การติดตั้ง

1. โคลนโปรเจค

```bash
git clone https://github.com/yourusername/mini-project.git
cd mini-project
```

2. ติดตั้ง dependencies

```bash
npm install
# หรือ
yarn install
```

3. สร้างไฟล์ .env จาก .env.example และกำหนดค่า environment variables

```bash
cp .env.example .env
```

4. เริ่มการพัฒนา

```bash
npm run dev
# หรือ
yarn dev
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
