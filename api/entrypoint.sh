#!/usr/bin/env sh
set -e

# Lis les secrets si présents
if [ -f "/run/secrets/mongo_app_user" ]; then
  MONGO_APP_USER="$(cat /run/secrets/mongo_app_user | tr -d '\r\n')"
fi
if [ -f "/run/secrets/mongo_app_password" ]; then
  MONGO_APP_PASSWORD="$(cat /run/secrets/mongo_app_password | tr -d '\r\n')"
fi
: "${MONGO_DB_NAME:=algoquest}"
: "${MONGO_HOST:=mongo}"
: "${MONGO_PORT:=27017}"

# Construit l’URI si non fourni
if [ -z "$SPRING_DATA_MONGODB_URI" ] && [ -n "$MONGO_APP_USER" ] && [ -n "$MONGO_APP_PASSWORD" ]; then
  export SPRING_DATA_MONGODB_URI="mongodb://${MONGO_APP_USER}:${MONGO_APP_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin&retryWrites=true&w=majority"
fi

: "${SERVER_PORT:=8080}"
export SERVER_PORT

echo "🔧 Vérification du répertoire /tmp/algoquest..."
mkdir -p /tmp/algoquest
chown -R api:api /tmp/algoquest
chmod -R 777 /tmp/algoquest
ls -ld /tmp /tmp/algoquest

echo "🚀 Lancement de l'application sous l'utilisateur 'api'..."
exec su -s /bin/sh api -c "/usr/bin/java ${JAVA_OPTS} -jar /app/app.jar"
