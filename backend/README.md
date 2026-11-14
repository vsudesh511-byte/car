# CarVerse backend

The React website talks to three small services. All three share one SQLite database file,
`database/carverse.db`, which is created automatically the first time a service starts.

| Service | Language | Port | What it does |
| --- | --- | --- | --- |
| `java-api` | Java 17, Spring Boot | 9090 | Cars REST API: list, view, add, edit, delete, reset to sample data |
| `python-service` | Python 3, Flask | 5000 | Compare verdict ("best in each spec"), "Find my car" recommendations, dashboard statistics |
| `php-service` | PHP 8 | 8000 | Admin login/logout (tokens), contact form messages |

```
React (Vite, port 8080)
   │  /api/cars ───────► Java  :9090 ──┐
   │  /api/py   ───────► Python :5000 ─┼──► database/carverse.db (SQLite)
   │  /api/php  ───────► PHP   :8000 ──┘
```

Vite forwards the `/api/...` calls to the right service (see `vite.config.ts`), so the browser
only ever talks to `http://localhost:8080`.

## What you need installed

- **Java 17+** (Maven is not needed, `mvnw` downloads it)
- **Python 3.10+**
- **PHP 8+** with the `pdo_sqlite` extension (on Windows, enable `extension=pdo_sqlite` in `php.ini`; XAMPP has it on by default)
- **Node.js 20+** for the React website

## Run everything

1. Start the three services:
   - Linux / macOS: `./backend/start-all.sh`
   - Windows: double-click `backend\start-all.bat` (opens three windows)
2. In another terminal, from the project root: `npm install` (first time only), then `npm run dev`
3. Open http://localhost:8080

Admin login: `admin` / `admin123`

### Or start each service by hand

```bash
# Java (from backend/java-api)
./mvnw spring-boot:run            # Windows: mvnw.cmd spring-boot:run

# Python (from backend/python-service)
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt    # Windows: .venv\Scripts\pip ...
.venv/bin/python app.py

# PHP (from backend/php-service)
php -S localhost:8000
```

## API reference

### Java — `http://localhost:9090`

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/cars` | All cars |
| GET | `/api/cars/{id}` | One car |
| POST | `/api/cars` | Add a car (admin) |
| PUT | `/api/cars/{id}` | Edit a car (admin) |
| DELETE | `/api/cars/{id}` | Delete a car (admin) |
| POST | `/api/cars/reset` | Reload the sample cars (admin) |
| GET | `/api/cars/health` | Health check |

"Admin" endpoints need the header `X-Admin-Token: <token>`; the token comes from the PHP login.

### Python — `http://localhost:5000`

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/py/compare?ids=bmw-3-series,audi-a4` | Winner per spec + verdict sentences |
| GET | `/api/py/recommend?budget=30&fuel=Petrol&seating=5&priority=mileage` | Top 3 matches (`priority` = `value`, `mileage` or `power`) |
| GET | `/api/py/stats` | Totals, average price, cars per fuel type and brand |
| GET | `/api/py/health` | Health check |

### PHP — `http://localhost:8000`

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/login.php` | Body `{"username","password"}` → `{"token"}` (valid for 8 hours) |
| POST | `/logout.php` | Deletes the token |
| GET | `/me.php` | Checks a token |
| POST | `/contact.php` | Save a contact form message |
| GET | `/contact.php` | List messages (admin) |
| DELETE | `/contact.php?id=1` | Delete a message (admin) |
| GET | `/health.php` | Health check |

## Database

- `database/schema.sql` — tables (`cars`, `admins`, `admin_tokens`, `messages`); every service runs it on start-up.
- `database/seed.sql` — the 12 sample cars, loaded by the Java service.
- Delete `database/carverse.db` to start fresh.
