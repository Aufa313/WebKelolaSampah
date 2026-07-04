<?php
/**
 * Main API Router
 * Routes requests to appropriate handlers
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pos = strpos($path, 'api.php');
if ($pos !== false) {
    $path = substr($path, $pos + 7);
}
$path = trim($path, '/');

// Route parsing
$routes = explode('/', $path);
$endpoint = $routes[0] ?? '';

// Request body
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($endpoint) {
        case 'auth':
            require_once __DIR__ . '/routes/auth.php';
            handleAuthRequest($method, $input, $conn);
            break;
            
        case 'pricing':
            require_once __DIR__ . '/routes/pricing.php';
            handlePricingRequest($method, $conn);
            break;
            
        case 'leaderboard':
            require_once __DIR__ . '/routes/leaderboard.php';
            handleLeaderboardRequest($method, $conn);
            break;
            
        case 'user':
            require_once __DIR__ . '/routes/user.php';
            handleUserRequest($method, $input, $conn);
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'ok' => false,
                'error' => 'Endpoint not found'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => $e->getMessage()
    ]);
}
