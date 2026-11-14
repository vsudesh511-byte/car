#!/usr/bin/env bash
# Starts the Java, Python and PHP services together (Linux / macOS).
# Then, in another terminal, run "npm run dev" in the project root and open http://localhost:8080
set -e
cd "$(dirname "$0")"

echo "Starting PHP service on http://localhost:8000"
(cd php-service && php -S localhost:8000) &

echo "Starting Python service on http://localhost:5000"
(
  cd python-service
  [ -d .venv ] || python3 -m venv .venv
  .venv/bin/pip install -q -r requirements.txt
  .venv/bin/python app.py
) &

echo "Starting Java API on http://localhost:9090"
(cd java-api && ./mvnw -q spring-boot:run) &

trap 'kill 0' EXIT
wait
