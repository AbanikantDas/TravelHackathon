# Traveloop 🌍

A personalized, multi-city travel planning platform — hackathon project.

> **Design:** Premium travel magazine aesthetic — terracotta, teal, warm gold, editorial typography, smooth animations.

---

## 📁 Project Structure

```
Traveloop/
├── frontend/        ← React + Vite (Member 1 + Member 2)
├── backend/         ← Node.js + Express + PostgreSQL (Member 3)
└── docs/            ← API documentation
```

---

## 🚀 How to Run (After Cloning from GitHub)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Traveloop.git
cd Traveloop
```

---

### Step 2 — Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

> Opens at **http://localhost:5173** (or next available port)
> 
> ✅ Works fully offline with demo data — no backend needed for the frontend demo.

---

### Step 3 — Run the Backend *(Optional — only needed for real DB)*

**First, set up PostgreSQL:**

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE traveloop;"

# Run schema
psql -U postgres -d traveloop -f backend/database/schema.sql

# Seed sample data
psql -U postgres -d traveloop -f backend/database/seed.sql
```

**Configure environment variables:**

```bash
cd backend
cp ../.env.example .env
# Edit .env with your PostgreSQL credentials
```

**Install and start the backend:**

```bash
cd backend
npm install
npm run dev
```

> Runs at **http://localhost:5000**

---

## 🧑‍💻 Team Split

| Member | Folder | Screens |
|--------|--------|---------|
| Member 1 | `frontend/src/pages-member1/` | Login, Signup, Dashboard, My Trips, Create Trip, Packing, Profile, 404 |
| Member 2 | `frontend/src/pages-member2/` | Itinerary Builder, Itinerary View, City Search, Activity Modal, Budget, Shared View, Notes, Admin |
| Member 3 | `backend/` | Express API, PostgreSQL models, JWT auth, all REST routes |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Routing | React Router v6 |
| Storage | localStorage (demo) / PostgreSQL (production) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT (bcryptjs) |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Terracotta | `#C4703A` |
| Deep Teal | `#1B4D5C` |
| Warm Gold | `#E8C97E` |
| Background | `#FAF7F2` |
| Font Display | Playfair Display |
| Font Body | DM Sans |

---

## 📄 API Documentation

See [`docs/API_Endpoints.md`](docs/API_Endpoints.md) for all REST endpoints.

---

## 📝 Notes

- The frontend works **fully standalone** using `localStorage` — no backend setup needed to run the app and see the UI.
- Demo data (3 trips with cities and activities) is seeded automatically on first load.
- To use the real backend, set `VITE_API_URL=http://localhost:5000/api` in a `frontend/.env` file.
