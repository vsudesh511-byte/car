<?php
/*
 * POST   /contact.php          save a message from the contact form (anyone)
 * GET    /contact.php          list all messages, newest first   (admin)
 * DELETE /contact.php?id=3     delete one message                (admin)
 */
require __DIR__ . '/db.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $input = json_input();
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $subject = trim($input['subject'] ?? '');
        $message = trim($input['message'] ?? '');

        $errors = [];
        if ($name === '') $errors['name'] = 'Please enter your name.';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Please enter a valid email address.';
        if ($subject === '') $errors['subject'] = 'Please enter a subject.';
        if (strlen($message) < 10) $errors['message'] = 'Message should be at least 10 characters.';
        if ($errors) {
            respond(['error' => 'Please fix the highlighted fields.', 'fields' => $errors], 422);
        }

        $stmt = db()->prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $email, $subject, $message]);
        respond(['ok' => true, 'id' => (int) db()->lastInsertId()], 201);

    case 'GET':
        require_admin();
        $rows = db()->query('SELECT * FROM messages ORDER BY id DESC')->fetchAll();
        respond($rows);

    case 'DELETE':
        require_admin();
        db()->prepare('DELETE FROM messages WHERE id = ?')->execute([(int) ($_GET['id'] ?? 0)]);
        respond(['ok' => true]);

    default:
        respond(['error' => 'Method not allowed.'], 405);
}
