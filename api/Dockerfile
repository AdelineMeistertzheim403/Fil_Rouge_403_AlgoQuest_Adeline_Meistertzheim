# Étape 1 — Build + Tests
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copie du pom.xml d'abord pour le cache des dépendances
COPY pom.xml .
RUN mvn -B -q -Dmaven.test.skip=true -DskipITs dependency:go-offline

# Copie du code et build
COPY src ./src
COPY config ./config
RUN mvn -B -e clean verify checkstyle:check

# Étape 2 — Runtime
FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends tini docker-cli && \
    rm -rf /var/lib/apt/lists/*

# Créer utilisateur non-root
RUN groupadd -r api && useradd -r -g api -m api

# Donner les bons droits à /tmp
RUN chmod 1777 /tmp

COPY --from=builder /app/target/*.jar app.jar
COPY --chmod=755 entrypoint.sh /app/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/usr/bin/tini", "--", "/app/entrypoint.sh"]
