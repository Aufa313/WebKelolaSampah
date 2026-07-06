<?php
// backend/routes/withdrawals.php

function handleWithdrawalsRequest($method, $input, $conn) {
    if ($method === 'GET') {
        $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        
        $sql = "
            SELECT w.*, u.full_name as warga_name, u.phone as warga_phone 
            FROM withdrawals w
            JOIN users u ON w.user_id = u.id
        ";
        
        if ($user_id) {
            $sql .= " WHERE w.user_id = " . $user_id;
        }
        $sql .= " ORDER BY w.created_at DESC";
        
        $result = $conn->query($sql);
        $withdrawals = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $row['amount'] = floatval($row['amount']);
                $withdrawals[] = $row;
            }
        }
        
        echo json_encode(["ok" => true, "data" => $withdrawals]);
        return;
    }
    
    if ($method === 'POST') {
        if (!isset($input['user_id'], $input['amount'], $input['withdrawal_type'])) {
            echo json_encode(["ok" => false, "error" => "Missing required fields"]);
            return;
        }
        
        $user_id = intval($input['user_id']);
        $amount = floatval($input['amount']);
        $type = $input['withdrawal_type'];
        
        // Check balance first
        $stmtBalance = $conn->prepare("
            SELECT 
                SUM(CASE WHEN transaction_type = 'Masuk' THEN amount ELSE 0 END) - 
                SUM(CASE WHEN transaction_type = 'Keluar' THEN amount ELSE 0 END) as net_saldo
            FROM balance_transactions
            WHERE user_id = ?
        ");
        $stmtBalance->bind_param("i", $user_id);
        $stmtBalance->execute();
        $balanceData = $stmtBalance->get_result()->fetch_assoc();
        $currentBalance = floatval($balanceData['net_saldo'] ?? 0);
        
        if ($currentBalance < $amount) {
            echo json_encode(["ok" => false, "error" => "Saldo tidak mencukupi"]);
            return;
        }
        
        $stmt = $conn->prepare("INSERT INTO withdrawals (user_id, amount, withdrawal_type) VALUES (?, ?, ?)");
        $stmt->bind_param("ids", $user_id, $amount, $type);
        
        if ($stmt->execute()) {
            $insertedId = $stmt->insert_id;
            // Insert notification
            $notifTitle = "Pengajuan Pencairan";
            $notifMsg = "Pengajuan pencairan " . $type . " sebesar Rp " . number_format($amount) . " sedang diproses & menunggu persetujuan admin.";
            $stmtNotif = $conn->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmtNotif->bind_param("iss", $user_id, $notifTitle, $notifMsg);
            $stmtNotif->execute();

            echo json_encode(["ok" => true, "message" => "Withdrawal requested successfully", "id" => $insertedId]);
        } else {
            echo json_encode(["ok" => false, "error" => "Failed to create withdrawal request"]);
        }
        return;
    }
    
    if ($method === 'PUT') {
        if (!isset($input['id'], $input['status'])) {
            echo json_encode(["ok" => false, "error" => "Missing id or status"]);
            return;
        }
        
        $id = intval($input['id']);
        $status = $input['status']; // 'Disetujui' or 'Ditolak'
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Get withdrawal details
            $stmtGet = $conn->prepare("SELECT user_id, amount, status, withdrawal_type FROM withdrawals WHERE id = ?");
            $stmtGet->bind_param("i", $id);
            $stmtGet->execute();
            $wData = $stmtGet->get_result()->fetch_assoc();
            
            if (!$wData) {
                throw new Exception("Withdrawal request not found");
            }
            if ($wData['status'] !== 'Pending') {
                throw new Exception("Withdrawal request already processed");
            }
            
            // Update status
            $stmtUpdate = $conn->prepare("UPDATE withdrawals SET status = ?, updated_at = NOW() WHERE id = ?");
            $stmtUpdate->bind_param("si", $status, $id);
            $stmtUpdate->execute();
            
            $user_id = $wData['user_id'];
            $amount = $wData['amount'];
            $w_type = $wData['withdrawal_type'];

            // If approved, deduct balance
            if ($status === 'Disetujui') {
                $desc = "Pencairan Saldo - Disetujui (Admin)";
                
                $stmtTx = $conn->prepare("INSERT INTO balance_transactions (user_id, transaction_type, amount, description) VALUES (?, 'Keluar', ?, ?)");
                $stmtTx->bind_param("ids", $user_id, $amount, $desc);
                $stmtTx->execute();
            }

            // Insert notification
            $notifTitle = "Pencairan " . $status;
            $notifMsg = "Pengajuan pencairan " . $w_type . " sebesar Rp " . number_format($amount) . " telah " . $status . " oleh admin.";
            $stmtNotif = $conn->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
            $stmtNotif->bind_param("iss", $user_id, $notifTitle, $notifMsg);
            $stmtNotif->execute();
            
            $conn->commit();
            echo json_encode(["ok" => true, "message" => "Withdrawal status updated to " . $status]);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["ok" => false, "error" => $e->getMessage()]);
        }
        return;
    }
    
    echo json_encode(["ok" => false, "error" => "Method not allowed"]);
}
