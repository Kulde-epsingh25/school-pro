# School-Pro Web Application (MVP)

School-Pro is a comprehensive, multi-tenant school management system built with modern web technologies. It is designed to handle everything from permissions and analytics to fee tracking, transport, and hostel management.

## Tech Stack
- **Frontend**: Next.js 16 (React 19), Tailwind CSS, shadcn/ui, Zustand, Recharts
- **Backend**: Express.js (Node.js), TypeScript
- **Database**: MongoDB (managed via Prisma ORM)

## MVP Features (Phases 1-9)
This MVP implements the complete 9-phase roadmap:

1. **Role-Based Access Control (RBAC)**: Secure multi-tenant middleware and JWT validation for Super Admins, School Admins, Teachers, Students, and Parents.
2. **Communication Module**: Real-time messaging and announcement/notice board.
3. **Analytics Dashboard**: KPI tracking (enrollment, fee collection, attendance metrics) visualized using Recharts.
4. **Document Generation**: PDF generation service (using Puppeteer) for custom certificates and templates.
5. **Attendance & Leave Management**: Bulk attendance processing, biometric data sync simulation, and a full leave application approval workflow.
6. **Fee Management**: Tracking student fees, processing partial payments, and managing scholarship concessions.
7. **Library Management**: Book catalog, inventory tracking (`availableCopies`), and automated late fine calculation for book issues/returns.
8. **Transport System**: Fleet (vehicle) management, nested route building with pickup/drop-off times, student allocation, and a simulated live-tracking portal for parents.
9. **Hostel Management**: Boarding capacities, strict room allocation logic, and a digital visitor/gate pass ledger.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/school-pro?retryWrites=true&w=majority"
   JWT_SECRET="your_jwt_secret"
   PORT=8000
   ```
4. Push the Prisma schema and generate the client:
   ```bash
   npx prisma generate
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8000/api"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
- **Frontend (Next.js)**: Optimized for deployment on [Vercel](https://vercel.com).
- **Backend (Express)**: Can be deployed to services like Render, Railway, or Heroku. Ensure `DATABASE_URL` and `JWT_SECRET` are securely configured in the hosting environment.

## License
Private - All Rights Reserved.
