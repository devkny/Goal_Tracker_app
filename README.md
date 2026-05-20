# GoalFlow 🎯

> Turn dopamine spikes into real progress. An accountability journal with structured goal cycles.

## What It Does

**Goal → Plan → Action → Report**

You set a big Goal (e.g. "Become a proficient dev"), break it into Plans (e.g. "Build 2 apps"), then create Actions under each plan (e.g. "Build a weather app"). When done, you submit a report — what you built, what tech you used, what you learned. Over time, your history becomes a personal portfolio journal.

---

## Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React + Vite                |
| Backend   | Node.js + Express           |
| Database  | MongoDB + Mongoose          |
| Auth      | JWT + bcryptjs              |
| Charts    | Recharts                    |

---

## Project Structure

```
app/
├── backend/
│   ├── models/         User, Goal, Plan, Action
│   ├── routes/         auth, goals, plans, actions
│   ├── middleware/     JWT auth
│   ├── server.js
│   └── .env.example
└── frontend/
    └── src/
        ├── pages/      Landing, Login, Signup, Dashboard, GoalDetail, Journal, Stats
        ├── components/ Navbar, GoalCard, GoalModal, PlanModal, ActionModal, ReportModal
        ├── context/    AuthContext
        └── services/   api.js (axios)
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local install or free MongoDB Atlas cluster)

---

### 1. Clone / copy the project

```bash
cd app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/goalflow
JWT_SECRET=pick_a_long_random_string_here
JWT_EXPIRES_IN=7d
```

> If using MongoDB Atlas, replace MONGODB_URI with your connection string.

Start the backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

> The Vite dev server proxies `/api` requests to `localhost:5000` automatically.

---

## API Endpoints

### Auth
| Method | Route            | Description      |
|--------|-----------------|------------------|
| POST   | /api/auth/signup | Register         |
| POST   | /api/auth/login  | Login            |
| GET    | /api/auth/me     | Get current user |

### Goals
| Method | Route           | Description        |
|--------|-----------------|--------------------|
| GET    | /api/goals      | List all goals     |
| POST   | /api/goals      | Create goal        |
| GET    | /api/goals/:id  | Get goal + plans   |
| PATCH  | /api/goals/:id  | Update goal        |
| DELETE | /api/goals/:id  | Delete goal        |

### Plans
| Method | Route           | Description     |
|--------|-----------------|-----------------|
| GET    | /api/plans      | List plans      |
| POST   | /api/plans      | Create plan     |
| GET    | /api/plans/:id  | Get plan        |
| PATCH  | /api/plans/:id  | Update plan     |
| DELETE | /api/plans/:id  | Delete plan     |

### Actions
| Method | Route                     | Description           |
|--------|--------------------------|----------------------|
| GET    | /api/actions              | List actions          |
| POST   | /api/actions              | Create action         |
| GET    | /api/actions/:id          | Get action            |
| PATCH  | /api/actions/:id          | Update + submit report|
| DELETE | /api/actions/:id          | Delete action         |
| GET    | /api/actions/stats/overview | Productivity stats  |

---

## Pages

| Route          | Description                              |
|----------------|------------------------------------------|
| `/`            | Landing page                             |
| `/signup`      | Create account                           |
| `/login`       | Log in                                   |
| `/dashboard`   | All goals + filters                      |
| `/goals/:id`   | Goal detail — plans and actions          |
| `/journal`     | Full history of reported actions         |
| `/stats`       | Productivity charts + tech stack summary |

---

## What's Next (V2 ideas)

- [ ] Email/push notifications when a deadline is approaching
- [ ] Auto-mark actions as incomplete when deadline passes (cron job)
- [ ] Markdown support in reports
- [ ] Goal sharing / accountability partner
- [ ] React Native mobile app
- [ ] Export journal as PDF
