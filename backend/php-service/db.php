<?php
/*
 * Shared helpers for the CarVerse PHP service.
 * Connects to the same SQLite database as the Java and Python services.
 */

const TOKEN_LIFETIME = '-8 hours';

// Allow the React app (and tools like Postman) to call this service.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $path = getenv('CARVERSE_DB') ?: __DIR__ . '/../database/carverse.db';
        $pdo = new PDO('sqlite:' . $path);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->setAttribute(PDO::ATTR_TIMEOUT, 5);
        $pdo->exec(file_get_contents(__DIR__ . '/../database/schema.sql'));
        seed_admin($pdo);
    }
    return $pdo;
}

/** Creates the demo admin account (admin / admin123) the first time. */
function seed_admin(PDO $pdo): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
    if ($count === 0) {
        $stmt = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
        $stmt->execute(['admin', password_hash('admin123', PASSWORD_DEFAULT)]);
    }
}

function json_input(): array
{
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function respond($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        respond(['error' => "Use $method for this endpoint."], 405);
    }
}

function admin_token(): string
{
    return trim($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '');
}

/** Returns the logged-in admin's username, or stops with 401. */
function require_admin(): string
{
    $token = admin_token();
    if ($token !== '') {
        $stmt = db()->prepare("SELECT username FROM admin_tokens WHERE token = ? AND created_at > datetime('now', ?)");
        $stmt->execute([$token, TOKEN_LIFETIME]);
        $username = $stmt->fetchColumn();
        if ($username !== false) {
            return $username;
        }
    }
    respond(['error' => 'Please log in as admin first.'], 401);
}
