<?php
/**
 * Database Configuration
 * For XAMPP/Local Development
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'layanan_setor_sampah');

// Attempt database connection
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode([
            'ok' => false,
            'error' => 'Database connection failed: ' . $conn->connect_error
        ]));
    }
    
    // Set charset to UTF-8
    $conn->set_charset("utf8mb4");
    
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode([
        'ok' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]));
}

/**
 * CORS Headers
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
