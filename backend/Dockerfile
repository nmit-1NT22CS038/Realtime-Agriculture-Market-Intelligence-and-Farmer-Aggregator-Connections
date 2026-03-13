FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

COPY ml ./ml
COPY --from=build /app/target/*.jar app.jar

RUN pip3 install --no-cache-dir -r ml/requirements.txt

ENV APP_ML_PYTHON_COMMAND=python3

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]