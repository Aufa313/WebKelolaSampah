<?php
// backend/routes/transactions.php

function handleTransactionsRequest($method, $input, $conn) {
    if ($method === 'GET') {
        $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

        if (!$user_id) {
            echo json_encode(["ok" => false, "error" => "user_id is required"]);
            return;
        }

        // 1. Calculate net balance
        $stmtBalance = $conn->prepare("
            SELECT 
                SUM(CASE WHEN transaction_type = 'Masuk' THEN amount ELSE 0 END) as total_masuk,
                SUM(CASE WHEN transaction_type = 'Keluar' THEN amount ELSE 0 END) as total_keluar
            FROM balance_transactions
            WHERE user_id = ?
        ");
        $stmtBalance->bind_param("i", $user_id);
        $stmtBalance->execute();
        $resultBalance = $stmtBalance->get_result();
        $balanceData = $resultBalance->fetch_assoc();

        $totalMasuk = floatval($balanceData['total_masuk'] ?? 0);
        $totalKeluar = floatval($balanceData['total_keluar'] ?? 0);
        $netBalance = $totalMasuk - $totalKeluar;

        // 2. Get transaction history
        $stmtHist = $conn->prepare("
            SELECT id, transaction_type, amount, description, created_at
            FROM balance_transactions
            WHERE user_id = ?
            ORDER BY created_at DESC
        ");
        $stmtHist->bind_param("i", $user_id);
        $stmtHist->execute();
        $resultHist = $stmtHist->get_result();

        $history = [];
        while ($row = $resultHist->fetch_assoc()) {
            $row['amount'] = floatval($row['amount']);
            $history[] = $row;
        }

        echo json_encode([
            "ok" => true,
            "data" => [
                "balance" => $netBalance,
                "history" => $history
            ]
        ]);
        return;
    }

    echo json_encode(["ok" => false, "error" => "Method not allowed"]);
}
