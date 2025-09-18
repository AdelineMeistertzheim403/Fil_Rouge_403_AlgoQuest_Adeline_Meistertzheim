#!/bin/sh

echo "⏳ Waiting for Mongo to be ready..."

until mongosh "mongodb://${MONGO_USER}:${MONGO_password}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_DB}" --eval "db.stats()" > /dev/null 2>&1; do
  echo "MongoDB is not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "✅ Mongo is ready. Starting Spring Boot application..."
exec java -jar /app/app.jar
