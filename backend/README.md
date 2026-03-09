# AgriLink Backend (Spring Boot)

Local backend for the React app with SQL persistence and ML prediction bridge.

## Stack
- Spring Boot 3
- MySQL
- JPA/Hibernate
- Python bridge for ML inference

## 1) Start MySQL
Create/update credentials in [src/main/resources/application.properties](src/main/resources/application.properties).

Default values:
- DB: `agrilink_db`
- user: `root`
- password: `root`

## 2) Run backend
From `backend` folder:
- `mvn spring-boot:run`

Backend runs at `http://localhost:8080`.

## 3) ML model integration
Prediction endpoint uses [ml/predict.py](ml/predict.py).

Set these properties if needed:
- `app.ml.python-command` (example: `python`)
- `app.ml.script-path` (example: `ml/predict.py`)
- `app.ml.model-path` (path to your `.joblib` model)

## 4) API summary
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET/POST /api/farmer/products`
- `POST /api/farmer/predict`
- `GET /api/aggregator/offers/available`
- `POST /api/aggregator/offers/{listingId}/accept`
- `GET /api/aggregator/offers/my`
- `POST /api/aggregator/offers/{offerId}/verify`
- `GET /api/admin/stats`
- `POST /api/admin/announcements`

All non-auth endpoints require header:
- `Authorization: Bearer <token>`
