FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY backend/pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY backend/src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copy ML modules
COPY backend/ml ./ml


# Copy built JAR
COPY --from=build /app/target/*.jar app.jar

# Install Python dependencies
RUN pip3 install --no-cache-dir --break-system-packages pandas numpy scikit-learn joblib
# Set environment variables for ML paths
ENV APP_ML_PYTHON_PATH=python3
ENV APP_ML_RECOMMEND_SCRIPT_PATH=/app/ml/recommend.py
ENV APP_ML_RAINFALL_CSV_PATH=/app/Data/rainfall_master_normalized.csv
ENV APP_LLM_ENABLED=true

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]