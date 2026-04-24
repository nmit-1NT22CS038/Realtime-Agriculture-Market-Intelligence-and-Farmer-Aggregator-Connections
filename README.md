# AgriLink: Realtime Agriculture Market Intelligence and Farmer-Aggregator Connections

Full-stack agriculture marketplace platform combining real-time market intelligence with AI-driven crop recommendations:

- **React + Vite** frontend with TypeScript
- **Spring Boot 3** backend with Java 21
- **MySQL 8** persistence
- **Python ML bridge** for crop recommendation scoring and LLM explanations
- **OpenAI API** integration for farmer-friendly explanations

## Features

### Authentication & Authorization
- Role-based access: `farmer`, `aggregator`, `admin`
- Bearer token authentication with session management
- Protected API endpoints with role validation

### Farmer Dashboard
- **Crop Recommendation System** (NEW)
  - Input: District, season (Rabi/Kharif), current commodity, land size
  - Output: Main crop recommendation (60% allocation) + alternatives (40% split)
  - Rainfall-based suitability scoring (0-4 scale)
  - Farmer-friendly LLM explanation of reasoning
  - Supported: 31 Karnataka districts, 13 crop types, rainfall data 2020-2024

- Product listing creation and management
- View bids from aggregators
- Accept/reject bids
- Price prediction for crops

### Aggregator
- View available farm product listings
- Place competitive bids
- Track selected offers
- OTP verification flow

### Admin
- Platform statistics and monitoring
- Send announcements to users

## Tech Stack

### Frontend
- **Framework**: React 18+, TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **HTTP Client**: fetch API with typed interfaces

### Backend
- **Framework**: Spring Boot 3.4.3
- **Language**: Java 21
- **ORM**: JPA/Hibernate
- **Build**: Maven 3.9+
- **HTTP Client**: Java HttpClient (for OpenAI API)
- **JSON**: Jackson ObjectMapper

### Database
- **System**: MySQL 8.0
- **Schema**: agrilink_db
- **Auto-init**: JPA ddl-auto=update

### ML & AI
- **Recommendation Engine**: Python 3.10+ (crop_knowledge.py, rainfall_processor.py, scoring_engine.py, recommend.py)
- **LLM**: OpenAI GPT-4o-mini (temperature=0.2 for deterministic responses)
- **Data**: Rainfall CSV with normalized district names and annual rainfall

## Project Structure

```
├── src/                              # React frontend
│   ├── components/
│   │   ├── CropRecommendationForm.tsx   # User input form
│   │   ├── RecommendationDisplay.tsx    # Results visualization
│   │   └── FarmerDashboard.tsx          # Main dashboard
│   ├── hooks/
│   │   └── useRecommendation.ts         # Recommendation state management
│   ├── lib/
│   │   └── api.ts                       # API client + types
│   └── pages/
│
├── backend/
│   ├── pom.xml                          # Maven dependencies
│   ├── src/main/java/
│   │   └── com/agrilink/
│   │       ├── controller/
│   │       │   └── FarmerController.java        # /api/farmer/recommend endpoint
│   │       ├── service/
│   │       │   ├── RecommendationService.java  # Python ProcessBuilder
│   │       │   ├── LlmExplanationService.java  # OpenAI integration
│   │       │   └── AuthService.java             # Authentication
│   │       ├── dto/
│   │       │   ├── RecommendationRequest.java  # Request DTO
│   │       │   └── CropRecommendation.java     # Response DTO
│   │       ├── entity/
│   │       │   └── UserSession.java
│   │       ├── repository/
│   │       │   └── UserSessionRepository.java
│   │       ├── config/
│   │       │   └── CorsConfig.java             # CORS configuration
│   │       └── Application.java                # Main entry point
│   │
│   ├── ml/
│   │   ├── recommend.py                 # Orchestrator script
│   │   ├── crop_knowledge.py            # Crop database (13 types)
│   │   ├── rainfall_processor.py        # CSV loading & categorization
│   │   └── scoring_engine.py            # Deterministic recommendation scoring
│   │
│   ├── database/
│   │   └── init.sql                     # Schema initialization
│   │
│   ├── src/main/resources/
│   │   ├── application.properties       # Default config
│   │   └── application-local.properties # Local dev config (absolute paths)
│   │
│   └── target/                          # Compiled classes (generated)
│
├── Data/
│   ├── rainfall_master_normalized.csv   # Rainfall dataset
│   ├── Boundaries/                      # GIS shapefiles
│   └── ...
│
├── .env.example                         # Frontend env template
├── package.json                         # Frontend dependencies
└── vite.config.ts                       # Vite build config
```

## Prerequisites

- **Node.js** 18+ (or newer LTS)
- **npm** 9+
- **Java** 21 (JDK)
- **Maven** 3.9+
- **MySQL** 8.0 (or Docker container)
- **Python** 3.10+ (for ML modules)
- **OpenAI API Key** (for LLM explanations, optional but recommended)

## Environment Setup

### 1) Frontend Environment
Create `.env` in repository root from `.env.example`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8080/api
```

### 2) Database Setup
Start MySQL (or Docker):
```bash
# Docker
docker run -d -p 3306:3306 --name mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=agrilink_db \
  -e MYSQL_USER=agrilink_user \
  -e MYSQL_PASSWORD=agrilink_password \
  mysql:8.0
```

Or create database manually:
```sql
CREATE DATABASE agrilink_db;
CREATE USER 'agrilink_user'@'localhost' IDENTIFIED BY 'agrilink_password';
GRANT ALL PRIVILEGES ON agrilink_db.* TO 'agrilink_user'@'localhost';
FLUSH PRIVILEGES;
```

Update credentials in `backend/src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/agrilink_db
spring.datasource.username=agrilink_user
spring.datasource.password=agrilink_password
```

### 3) ML Configuration
Update `backend/src/main/resources/application-local.properties` with absolute paths:

```properties
# Python ML paths
app.ml.python-path=python                    # or /usr/bin/python3
app.ml.recommend-script-path=C:/Users/Gagan/Projects/finalyear_project/Realtime-Agriculture-Market-Intelligence-and-Farmer-Aggregator-Connections/backend/ml/recommend.py
app.ml.rainfall-csv-path=C:/Users/Gagan/Projects/finalyear_project/Data/rainfall_master_normalized.csv

# OpenAI LLM (optional)
app.llm.enabled=true
app.llm.api-key=${OPENAI_API_KEY:}  # Set via environment variable
app.llm.model=gpt-4o-mini
```

Set OpenAI API key as environment variable:
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="sk-proj-..."

# Linux/Mac
export OPENAI_API_KEY="sk-proj-..."
```

### 4) Python Dependencies
Install ML requirements:
```bash
cd Realtime-Agriculture-Market-Intelligence-and-Farmer-Aggregator-Connections
pip install pandas numpy scikit-learn joblib
```

## Running the Project

### Backend (Terminal 1)
```bash
cd Realtime-Agriculture-Market-Intelligence-and-Farmer-Aggregator-Connections/backend

# First time: download dependencies
mvn clean install

# Run with local profile
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

**Backend URL**: `http://localhost:8080`  
**API Base**: `http://localhost:8080/api`

### Frontend (Terminal 2)
```bash
cd Realtime-Agriculture-Market-Intelligence-and-Farmer-Aggregator-Connections

# First time: install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend URL**: `http://localhost:5173` (default Vite port)

## Access Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/signup` | User registration |
| `/login` | User login |
| `/dashboard/farmer` | Farmer dashboard (protected) |
| `/dashboard/aggregator` | Aggregator dashboard (protected) |
| `/dashboard/admin` | Admin dashboard (protected) |

## API Endpoints

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
```

### Farmer
```
GET /api/farmer/listings                          # Get user's listings
POST /api/farmer/listings                         # Create listing
POST /api/farmer/recommend                        # Get crop recommendation (NEW)
GET /api/farmer/bids/{listingId}                  # Get bids on listing
POST /api/farmer/bids/{bidId}/accept              # Accept bid
POST /api/farmer/bids/{bidId}/reject              # Reject bid
```

### Aggregator
```
GET /api/aggregator/offers/available              # View available listings
POST /api/aggregator/offers/{listingId}/bid       # Place bid
GET /api/aggregator/offers/my                     # Get my offers
POST /api/aggregator/offers/{offerId}/verify      # Verify with OTP
```

### Admin
```
GET /api/admin/stats                              # Platform statistics
POST /api/admin/announcements                     # Create announcement
GET /api/admin/announcements                      # Get announcements
```

All protected endpoints require:
```
Authorization: Bearer <token>
```

## Crop Recommendation Feature

### How It Works
1. **User Input**: District, season (Rabi/Kharif), current commodity, land size
2. **Rainfall Lookup**: Fetches rainfall data for district from CSV
3. **Scoring**: Deterministic scoring (0-4 scale) based on:
   - Season compatibility (best growing season)
   - Rainfall type match (Low/Medium/High)
   - Water intensity alignment
4. **Main Crop**: Top-scoring crop recommendation
5. **Land Allocation**: 60% to main crop, 40% split equally among alternatives
6. **LLM Explanation**: GPT-4o-mini generates farmer-friendly reasoning (fallback provided if API unavailable)

### Supported Districts (31 Karnataka)
Bagalkote, Ballari, Belagavi, Bengaluru Rural, Bengaluru Urban, Bijapur, Chikballapur, Chikmagalur, Chitradurga, Dakshina Kannada, Davanagere, Dharwad, Gadag, Gulbarga, Hassana, Haveri, Kalaburagi, Kodagu, Kolar, Kolhapur, Koppal, Mandya, Mysuru, Raichur, Ramanagara, Shivamogga, Tumkur, Udupi, Uttara Kannada, Yadgir, Yeshwantpur

### Supported Crops (13 types)
Rice, Wheat, Maize, Ragi, Jowar, Tur Dal, Green Gram, Chana Dal, Groundnut, Sunflower, Cotton, Onion, Potato

### Example Request
```bash
curl -X POST http://localhost:8080/api/farmer/recommend \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Mysuru",
    "season": "Kharif",
    "commodity": "Rice",
    "landSize": 2.5
  }'
```

### Example Response
```json
{
  "recommendations": {
    "district": "Mysuru",
    "rainfall_mm": 742,
    "rainfall_type": "Medium",
    "season": "Kharif",
    "current_crop": "Rice",
    "main_crop": "Maize",
    "recommended_crops": ["Maize", "Jowar", "Green Gram"],
    "land_plan": {
      "Maize": "60%",
      "Jowar": "20%",
      "Green Gram": "20%"
    }
  },
  "explanation": "Maize is highly recommended for your Mysuru farm during Kharif season. With 742mm rainfall and medium rainfall type, Maize thrives in these conditions with medium water requirements. We suggest allocating 60% of your 2.5 acres to Maize (1.5 acres), while diversifying with Jowar and Green Gram (0.5 acres each) to reduce risk..."
}
```

## ML Pipeline Architecture

### 1. crop_knowledge.py
- Single source of truth for crop properties
- Defines 13 crops with: rainfall requirements, seasons, water intensity
- Functions: `get_crop_info()`, `get_all_crops()`

### 2. rainfall_processor.py
- Loads rainfall_master_normalized.csv
- Normalizes district names (handles variations)
- Retrieves rainfall for any district
- Categorizes rainfall as Low (<600mm) / Medium (600-1200mm) / High (>1200mm)

### 3. scoring_engine.py
- **score_crop()**: Deterministic 0-4 scoring
  - +3 for season match
  - +2 for rainfall type match
  - -1 for water intensity mismatch with current crop
- **recommend_crops()**: Returns top N crops by score (excluding current crop)
- **allocate_land()**: Splits allocation (60% main, 40% alternatives)

### 4. recommend.py
- Orchestrator called by Java via ProcessBuilder
- Arguments: `--district`, `--season`, `--commodity`, `--land_size`, `--rainfall_csv`
- Returns JSON with recommendations and land allocation
- Stdout captured by Spring Boot for response formatting

### Data Flow Diagram
```
User Input (Frontend)
       ↓
FarmerController.recommend()
       ↓
RecommendationService.recommend()
       ↓
ProcessBuilder → recommend.py
       ↓
├─ RainfallProcessor (CSV lookup)
├─ ScoringEngine (deterministic scoring)
└─ Land allocation calculation
       ↓
JSON response to Backend
       ↓
LlmExplanationService.generateExplanation()
       ↓
OpenAI API (GPT-4o-mini, temp=0.2)
       ↓
{recommendations, explanation} → Frontend
       ↓
RecommendationDisplay.tsx renders results
```

## Build Commands

### Frontend
```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
# From backend/ directory
mvn spring-boot:run -Dspring-boot.run.profiles=local    # Run dev server
mvn clean install                                        # Build with dependencies
mvn test                                                 # Run tests
mvn clean package                                        # Build JAR
java -jar target/app.jar -Dspring.profiles.active=local # Run JAR
```

## Common Troubleshooting

### Recommendation returns empty / 500 error
**Check**:
- Backend running with local profile: `mvn spring-boot:run -Dspring-boot.run.profiles=local`
- `app.ml.recommend-script-path` exists and is readable
- `app.ml.rainfall-csv-path` exists with correct data
- Python available in PATH or configured in `app.ml.python-path`
- Backend logs show Python error messages if execution fails

### CORS or API connection errors
**Check**:
- Frontend `.env` has correct `VITE_API_BASE_URL` (use `127.0.0.1`, not `localhost`)
- Backend running on port 8080
- Frontend running on port 5173
- Backend CORS allows frontend origin

### MySQL connection refused
**Check**:
- MySQL running: `docker ps` or `mysql -u root -p`
- Datasource URL uses `127.0.0.1` not `localhost` (Windows IPv6 issue)
- Credentials match database user

### "No EntityManager with transaction available"
**Check**:
- Backend has `@Transactional` annotation on write operations (e.g., AuthService.requireUserFromToken())
- Services properly configured with `@Service` annotation

### LLM explanation not appearing
**Check**:
- `app.llm.enabled=true` in application-local.properties
- `OPENAI_API_KEY` environment variable set
- Network connectivity to api.openai.com
- Check backend logs for API errors (timeouts, invalid key, etc.)
- Fallback explanation should display if API unavailable

## Deployment

### Local Testing Checklist
- [ ] Backend starts without errors
- [ ] Frontend loads without TypeScript errors
- [ ] Can login as farmer/aggregator/admin
- [ ] Crop recommendation form renders correctly
- [ ] Can submit recommendation and receive results
- [ ] LLM explanation displays (or fallback if API disabled)
- [ ] Land allocation percentages sum to 100%

### Production Deployment
1. Build JAR: `mvn clean package`
2. Update `application.properties` with production MySQL
3. Set `OPENAI_API_KEY` environment variable
4. Deploy JAR to cloud (DigitalOcean, AWS, etc.)
5. Update frontend VITE_API_BASE_URL to production backend URL
6. Deploy frontend to Vercel or similar

## Notes

- This project uses absolute file paths in `application-local.properties` for ML scripts and data. Update paths for your machine.
- Backend generated classes in `target/` should not be edited; modify `src/` files instead.
- Python scripts in `backend/ml/` must remain executable and accessible from backend working directory.
- Rainfall data is limited to districts present in CSV; requests for unsupported districts will fail gracefully with error message.
- Crop recommendations are deterministic (same input = same output) except for LLM explanation which may vary slightly.