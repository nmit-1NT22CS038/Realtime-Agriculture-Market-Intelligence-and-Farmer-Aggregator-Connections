# Build images locally
docker-compose build

# Run all services (backend + MySQL + frontend)
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f backend    # Backend logs
docker-compose logs -f frontend   # Frontend logs
docker-compose logs -f mysql      # MySQL logs

# Test
# Frontend: http://localhost:3001
# Backend API: http://localhost:8082/api

# Stop all services
docker-compose down

# Clean up (remove volumes too)
docker-compose down -v

______________________________
cd Realtime-Agriculture-Market-Intelligence-and-Farmer-Aggregator-Connections

# Set OpenAI key
$env:OPENAI_API_KEY="sk-proj-your-key"

# Build & run all services
docker-compose up --build

# Test
# Frontend: http://localhost:3001
# Backend: http://localhost:8082/api