-- CarVerse shared database (SQLite).
-- All three services (Java, Python, PHP) use the same file: backend/database/carverse.db
-- Every service runs this script on start-up, so the start order does not matter.

-- Cars: written by the Java API, read by the Java API and the Python service.
CREATE TABLE IF NOT EXISTS cars (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  brand        TEXT NOT NULL,
  price        REAL NOT NULL,
  mileage      TEXT NOT NULL DEFAULT '',
  fuel         TEXT NOT NULL DEFAULT 'Petrol',
  transmission TEXT NOT NULL DEFAULT 'Manual',
  engine       TEXT NOT NULL DEFAULT '',
  seating      INTEGER NOT NULL DEFAULT 5,
  horsepower   TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  features     TEXT NOT NULL DEFAULT '[]',
  image        TEXT NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin accounts: managed by the PHP service (passwords are stored as bcrypt hashes).
CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

-- Login tokens: created by PHP on login, checked by Java before add/edit/delete.
CREATE TABLE IF NOT EXISTS admin_tokens (
  token      TEXT PRIMARY KEY,
  username   TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Contact form messages: written and read by the PHP service.
CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
