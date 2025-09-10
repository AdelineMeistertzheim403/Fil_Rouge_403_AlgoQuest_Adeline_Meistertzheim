# Étape 1 : Build avec Maven + JDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copier le contenu du projet dans le conteneur
COPY . .

# Compiler et générer le JAR, sans lancer les tests
RUN mvn clean package -DskipTests

# Étape 2 : Exécution avec une image JDK 17 minimale
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copier uniquement le .jar généré
COPY --from=builder /app/target/*.jar app.jar


# Exposer le port par défaut de Spring Boot
EXPOSE 8080

# Lancer l'application (tu peux supprimer --enable-preview si tu n’utilises pas de fonctionnalités expérimentales)
CMD ["java", "-jar", "app.jar"]
