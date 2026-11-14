<?php
// GET /me.php  (header X-Admin-Token)  ->  {"username": "admin"} or 401 when the token is missing/expired
require __DIR__ . '/db.php';
require_method('GET');

respond(['username' => require_admin()]);
