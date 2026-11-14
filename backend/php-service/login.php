<?php
// POST /login.php  {"username": "admin", "password": "admin123"}  ->  {"token": "...", "username": "admin"}
require __DIR__ . '/db.php';
require_method('POST');

$input = json_input();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

$stmt = db()->prepare('SELECT password_hash FROM admins WHERE username = ?');
$stmt->execute([$username]);
$hash = $stmt->fetchColumn();

if ($hash === false || !password_verify($password, $hash)) {
    respond(['error' => 'Wrong username or password.'], 401);
}

$token = bin2hex(random_bytes(24));
db()->prepare('INSERT INTO admin_tokens (token, username) VALUES (?, ?)')->execute([$token, $username]);
db()->exec("DELETE FROM admin_tokens WHERE created_at <= datetime('now', '" . TOKEN_LIFETIME . "')");

respond(['token' => $token, 'username' => $username]);
