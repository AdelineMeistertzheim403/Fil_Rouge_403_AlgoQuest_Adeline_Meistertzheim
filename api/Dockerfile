# Étape 1 — Build + Tests
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copie du pom.xml d'abord pour le cache des dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie du reste du code
COPY src ./src

RUN mvn clean package -DskipTests -Dcheckstyle.skip=true

# Étape 2 — Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Outils utiles pour le healthcheck ou debug
RUN apt-get update && apt-get install -y curl docker-cli && rm -rf /var/lib/apt/lists/*

# Copie du JAR depuis l'étape précédente
COPY --from=builder /app/target/*.jar app.jar

# Port exposé par l’application
EXPOSE 8080

# Commande de lancement
CMD ["java", "-jar", "app.jar"]
