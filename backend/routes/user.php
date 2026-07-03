<?php
/**
 * User Handler
 * GET /backend/api.php/user/{id} - Fetch user info
 * POST /backend/api.php/user - Create/Register user
 */

function handleUserRequest($method, $input, $conn) {
    global $routes;
    
    if ($method === 'GET') {
        // Fetch user info
        $userId = $routes[1] ?? null;
        
        if (!$userId) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'error' => 'User ID required'
            ]);
            return;
        }

        $query = "SELECT id, username, role, created_at FROM users WHERE id = ?";
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            http_response_code(500);
            echo json_encode([
                'ok' => false,
                'error' => 'Database error'
            ]);
            return;
        }

        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'ok' => false,
                'error' => 'User not found'
            ]);
            $stmt->close();
            return;
        }

        $user = $result->fetch_assoc();
        $stmt->close();

        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'data' => $user
        ]);
        
    } elseif ($method === 'POST') {
        // Register new user (simplified, without bcrypt for now)
        $username = $input['username'] ?? null;
        $password = $input['password'] ?? null;
        $role = $input['role'] ?? 'warga';

        if (!$username || !$password) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'error' => 'Username and password required'
            ]);
            return;
        }

        // Hash password
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $query = "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            http_response_code(500);
            echo json_encode([
                'ok' => false,
                'error' => 'Database error: ' . $conn->error
            ]);
            return;
        }

        $stmt->bind_param('sss', $username, $passwordHash, $role);
        
        if (!$stmt->execute()) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'error' => 'Username already exists or invalid data'
            ]);
            $stmt->close();
            return;
        }

        $newUserId = $conn->insert_id;
        $stmt->close();

        http_response_code(201);
        echo json_encode([
            'ok' => true,
            'data' => [
                'id' => $newUserId,
                'username' => $username,
                'role' => $role
            ]
        ]);
        
    } else {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'error' => 'Method not allowed'
        ]);
    }
}
