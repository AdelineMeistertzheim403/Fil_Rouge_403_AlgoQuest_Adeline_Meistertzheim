# ────────────────────────────────
# Étape 1 — Build + Tests
# ────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copie du pom.xml d'abord pour profiter du cache Docker
COPY pom.xml .

# Pré-téléchargement des dépendances Maven
RUN mvn -B -q -Dmaven.test.skip=true -DskipITs dependency:go-offline

# Copie du code source et de la config
COPY src ./src
COPY config ./config

# Compilation + analyse de code
RUN mvn -B -e clean verify checkstyle:check

# ────────────────────────────────
# Étape 2 — Runtime
# ────────────────────────────────
FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

# Argument pour le GID du groupe docker (passé depuis le docker-compose)
ARG DOCKER_GID=994

# Installation de tini et du client Docker
RUN apt-get update && \
    apt-get install -y --no-install-recommends tini docker-cli && \
    rm -rf /var/lib/apt/lists/*

# Création de l'utilisateur et du groupe docker aligné sur l'hôte
RUN groupadd -r api 2>/dev/null || true && \
    useradd -r -g api -m api 2>/dev/null || true && \
    groupadd -g ${DOCKER_GID} docker 2>/dev/null || true && \
    usermod -aG docker api || true

# Copie du jar généré
COPY --from=builder /app/target/*.jar app.jar

# Copie du script d'entrée
COPY --chmod=755 entrypoint.sh /app/entrypoint.sh

# Exécution sous l'utilisateur non-root
USER api

EXPOSE 8080
ENTRYPOINT ["/usr/bin/tini", "--", "/app/entrypoint.sh"]
