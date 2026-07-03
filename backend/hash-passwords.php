<?php
/**
 * Password Hash Generator
 * Generate bcrypt hashes for sample users
 * Run this once to update user passwords in database
 * Usage: php hash-passwords.php
 */

require_once __DIR__ . '/config.php';

// Define sample users with their plaintext passwords
$sampleUsers = [
    'admin' => '123456',
    'kurir01' => '554433',
    'warga001' => '884812',
];

echo "=== Updating User Passwords with Bcrypt ===\n\n";

foreach ($sampleUsers as $username => $plainPassword) {
    $hash = password_hash($plainPassword, PASSWORD_BCRYPT);
    
    $query = "UPDATE users SET password_hash = ? WHERE username = ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        echo "ERROR: Prepare failed for $username: " . $conn->error . "\n";
        continue;
    }
    
    $stmt->bind_param('ss', $hash, $username);
    
    if ($stmt->execute()) {
        echo "✓ Updated $username (password: $plainPassword)\n";
        echo "  Hash: " . substr($hash, 0, 30) . "...\n";
    } else {
        echo "✗ Failed to update $username: " . $stmt->error . "\n";
    }
    
    $stmt->close();
}

echo "\n=== Complete ===\n";
echo "Sample users are now ready for login:\n";
foreach ($sampleUsers as $username => $password) {
    echo "  - Username: $username, Password: $password\n";
}

$conn->close();
