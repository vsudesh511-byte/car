<?php
// POST /logout.php  (header X-Admin-Token)  ->  deletes the token
require __DIR__ . '/db.php';
require_method('POST');

db()->prepare('DELETE FROM admin_tokens WHERE token = ?')->execute([admin_token()]);
respond(['ok' => true]);
