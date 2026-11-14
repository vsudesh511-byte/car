<?php
require __DIR__ . '/db.php';
db();
respond(['service' => 'php-service', 'status' => 'ok']);
