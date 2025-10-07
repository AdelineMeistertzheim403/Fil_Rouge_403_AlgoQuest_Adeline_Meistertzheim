#!/bin/sh
echo "🔍 Attente de MongoDB..."
until nc -z mongo 27017; do
  echo "⏳ Mongo pas prêt, attente..."
  sleep 2
done

echo "✅ Mongo prêt, exécution des tests..."
mvn test -Dspring.profiles.active=test -Dcheckstyle.skip=true || exit 1

echo "✅ Tests OK, lancement de l'application..."
exec java -jar /app/app.jar
