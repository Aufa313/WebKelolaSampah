<?php
// backend/routes/notifications.php

function handleNotificationsRequest($method, $input, $conn) {
    if ($method === 'GET') {
        $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

        if (!$user_id) {
            echo json_encode(["ok" => false, "error" => "user_id is required"]);
            return;
        }

        $stmt = $conn->prepare("
            SELECT id, title, message, is_read, created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 50
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $notifications = [];
        while ($row = $result->fetch_assoc()) {
            $row['is_read'] = intval($row['is_read']);
            $notifications[] = $row;
        }

        echo json_encode([
            "ok" => true,
            "data" => $notifications
        ]);
        return;
    }

    if ($method === 'POST') {
        $user_id = isset($input['user_id']) ? intval($input['user_id']) : null;
        $title = isset($input['title']) ? trim($input['title']) : '';
        $message = isset($input['message']) ? trim($input['message']) : '';

        if (!$user_id || empty($title) || empty($message)) {
            echo json_encode(["ok" => false, "error" => "user_id, title, and message are required"]);
            return;
        }

        $stmt = $conn->prepare("
            INSERT INTO notifications (user_id, title, message, is_read, created_at)
            VALUES (?, ?, ?, 0, NOW())
        ");
        $stmt->bind_param("iss", $user_id, $title, $message);
        
        if ($stmt->execute()) {
            echo json_encode([
                "ok" => true,
                "data" => [
                    "id" => $conn->insert_id,
                    "user_id" => $user_id,
                    "title" => $title,
                    "message" => $message,
                    "is_read" => 0
                ]
            ]);
        } else {
            echo json_encode(["ok" => false, "error" => $stmt->error]);
        }
        return;
    }

    if ($method === 'PUT') {
        $id = isset($input['id']) ? intval($input['id']) : null;
        $user_id = isset($input['user_id']) ? intval($input['user_id']) : null;

        if ($id) {
            // Mark specific notification as read
            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
            $stmt->bind_param("i", $id);
        } else if ($user_id) {
            // Mark all notifications as read for a user
            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
            $stmt->bind_param("i", $user_id);
        } else {
            echo json_encode(["ok" => false, "error" => "id or user_id is required"]);
            return;
        }

        if ($stmt->execute()) {
            echo json_encode(["ok" => true, "message" => "Notification status updated successfully"]);
        } else {
            echo json_encode(["ok" => false, "error" => $stmt->error]);
        }
        return;
    }

    echo json_encode(["ok" => false, "error" => "Method not allowed"]);
}
?>
