@echo off
REM Starts the Java, Python and PHP services in three windows (Windows).
REM Then run "npm run dev" in the project root and open http://localhost:8080
cd /d "%~dp0"

start "CarVerse PHP service (8000)" cmd /k "cd php-service && php -S localhost:8000"
start "CarVerse Python service (5000)" cmd /k "cd python-service && (if not exist .venv python -m venv .venv) && .venv\Scripts\pip install -r requirements.txt && .venv\Scripts\python app.py"
start "CarVerse Java API (9090)" cmd /k "cd java-api && mvnw.cmd spring-boot:run"
