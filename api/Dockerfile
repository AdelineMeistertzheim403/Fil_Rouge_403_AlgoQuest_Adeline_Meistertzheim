# Étape 1 — Build + Tests
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copie du pom.xml d'abord pour le cache des dépendances
COPY pom.xml .

# Télécharge les dépendances pour accélérer les builds suivants
RUN mvn -B -q -Dmaven.test.skip=true -DskipITs dependency:go-offline

# Copie du reste du code
COPY src ./src
COPY config ./config

# Compilation + Checkstyle
RUN mvn -B -e clean verify checkstyle:check

# Étape 2 — Runtime
FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends tini docker-cli && \
    rm -rf /var/lib/apt/lists/*

# Créer un utilisateur + groupe docker et lui donner accès au socket
RUN groupadd -r api 2>/dev/null || true && \
    useradd -r -g api -m api 2>/dev/null || true && \
    groupadd -f docker 2>/dev/null || true && \
    usermod -aG docker api || true


# Copier le JAR généré
COPY --from=builder /app/target/*.jar app.jar
COPY --chmod=755 entrypoint.sh /app/entrypoint.sh

USER api
EXPOSE 8080
ENTRYPOINT ["/usr/bin/tini", "--", "/app/entrypoint.sh"]
