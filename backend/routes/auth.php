<?php
/**
 * Authentication Handler
 * POST /backend/api.php/auth - Login
 */

function handleAuthRequest($method, $input, $conn) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'error' => 'Method not allowed'
        ]);
        return;
    }

    $username = $input['username'] ?? null;
    $password = $input['password'] ?? null;

    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'Username and password required'
        ]);
        return;
    }

    // Query user from database
    $query = "SELECT id, username, role, password_hash, registered_at AS created_at FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'error' => 'Database error: ' . $conn->error
        ]);
        return;
    }

    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'error' => 'Invalid username or password'
        ]);
        $stmt->close();
        return;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password (using bcrypt)
    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'error' => 'Invalid username or password'
        ]);
        return;
    }

    // Login successful
    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'data' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'created_at' => $user['created_at']
        ]
    ]);
}
