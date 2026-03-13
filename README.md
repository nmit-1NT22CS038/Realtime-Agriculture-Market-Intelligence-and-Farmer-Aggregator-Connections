# AgriLink: Realtime Agriculture Market Intelligence and Farmer-Aggregator Connections

Full-stack agriculture marketplace platform with:
- React + Vite frontend
- Spring Boot backend
- MySQL persistence
- Python ML-based price prediction bridge

## Features
- Role-based authentication: `farmer`, `aggregator`, `admin`
- Farmer:
  - Create product listings
  - View bids
  - Accept/reject bids
  - Predict crop price (ML + fallback)
- Aggregator:
  - View available listings
  - Place bids
  - Track selected offers
  - OTP verification flow
- Admin:
  - View platform stats
  - Send announcements

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind, shadcn/ui
- Backend: Spring Boot 3, Java 21, JPA/Hibernate
- Database: MySQL 8
- ML: Python script bridge (`backend/ml/predict.py`)

## Project Structure
- `src/` - frontend application
- `backend/src/main/java/` - backend source
- `backend/src/main/resources/` - backend configuration
- `backend/database/init.sql` - DB initialization
- `backend/ml/predict.py` - ML inference script
- `.env.example` - frontend environment template

## Prerequisites
- Node.js 18+ (or newer LTS)
- npm
- Java 21
- Maven 3.9+
- MySQL 8+
- Python 3.10+ (or 3.12)

## Environment Setup

### 1) Frontend environment
Create `.env` in repo root from `.env.example`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8080/api

2) Database setup
Create database:CREATE DATABASE agrilink_db;
Then update backend DB credentials in:

backend/src/main/resources/application.properties
or backend/src/main/resources/application-local.properties (if using local profile)
3) ML configuration
backend/src/main/resources/application-local.properties contains ML settings:

app.ml.python-command
app.ml.script-path
app.ml.model-path
app.ml.encoders-path
app.ml.features-path
app.ml.history-path
Update absolute paths to match your machine.

Run the Project
1) Start backend
From backend/:mvn spring-boot:run -Dspring-boot.run.profiles=local
Backend runs at:

http://localhost:8080
API base: http://localhost:8080/api
2) Start frontend
From repository root:
npm install
npm run dev

Frontend runs at:

http://localhost:5173 (default Vite port)
Access Routes
/ - Home
/signup - Register user
/login - Login
/dashboard/farmer - Farmer dashboard
/dashboard/aggregator - Aggregator dashboard
/dashboard/admin - Admin dashboard
Note:

Dashboards are protected and role-restricted.
Main API Endpoints
Auth
POST /api/auth/signup
POST /api/auth/login
Farmer
GET /api/farmer/listings
POST /api/farmer/listings
POST /api/farmer/predict
GET /api/farmer/bids/{listingId}
POST /api/farmer/bids/{bidId}/accept
POST /api/farmer/bids/{bidId}/reject
Aggregator
GET /api/aggregator/offers/available
POST /api/aggregator/offers/{listingId}/bid
GET /api/aggregator/offers/my
POST /api/aggregator/offers/{offerId}/verify
Admin
GET /api/admin/stats
POST /api/admin/announcements
GET /api/admin/announcements
All protected endpoints require:

Authorization: Bearer <token>
Common Troubleshooting
Prediction failed / blank page on predict
Check:

Backend started with local profile:
mvn spring-boot:run -Dspring-boot.run.profiles=local
app.ml.script-path points to real backend/ml/predict.py
Python is installed and available as configured in app.ml.python-command
Model/encoder/features/history file paths exist
Backend logs for Python stderr: lines
CORS or API connection issues
Check:

Frontend .env has correct VITE_API_BASE_URL
Backend is running on port 8080
Frontend is running on port 5173
Build Commands
Frontend
npm run dev - start dev server
npm run build - production build
npm run preview - preview build
npm run lint - lint code
Backend
mvn spring-boot:run - run backend
mvn test - run tests
mvn clean package - build jar
Notes
This project includes legacy/generated folders (backend/target) that should not be edited directly.
Use source files under src/ and backend/src/ for all code changes.