<?php
require_once __DIR__ . '/config.php';

// Try creating database table using $conn (mysqli)
$sql = "CREATE TABLE IF NOT EXISTS notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["ok" => true, "message" => "Notifications table created or already exists."]);
} else {
    echo json_encode(["ok" => false, "error" => $conn->error]);
}
?>
