<?php
// backend/routes/stats.php

function handleStatsRequest($method, $conn) {
    if ($method === 'GET') {
        $stats = [
            "total_warga" => 0,
            "total_kurir" => 0,
            "total_saldo_beredar" => 0,
            "total_sampah_terkumpul" => 0
        ];

        // 1. Total Warga
        $stmtWarga = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'warga'");
        $stmtWarga->execute();
        $resWarga = $stmtWarga->get_result();
        $stats['total_warga'] = intval($resWarga->fetch_assoc()['count'] ?? 0);

        // 2. Total Kurir
        $stmtKurir = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'kurir'");
        $stmtKurir->execute();
        $resKurir = $stmtKurir->get_result();
        $stats['total_kurir'] = intval($resKurir->fetch_assoc()['count'] ?? 0);

        // 3. Total Saldo Beredar (Masuk - Keluar)
        $stmtSaldo = $conn->prepare("
            SELECT 
                SUM(CASE WHEN transaction_type = 'Masuk' THEN amount ELSE 0 END) - 
                SUM(CASE WHEN transaction_type = 'Keluar' THEN amount ELSE 0 END) as net_saldo
            FROM balance_transactions
        ");
        $stmtSaldo->execute();
        $resSaldo = $stmtSaldo->get_result();
        $stats['total_saldo_beredar'] = floatval($resSaldo->fetch_assoc()['net_saldo'] ?? 0);

        // 4. Total Sampah Terkumpul
        $stmtSampah = $conn->prepare("SELECT SUM(actual_weight) as total_weight FROM resident_pickups WHERE status = 'Selesai'");
        $stmtSampah->execute();
        $resSampah = $stmtSampah->get_result();
        $stats['total_sampah_terkumpul'] = floatval($resSampah->fetch_assoc()['total_weight'] ?? 0);

        echo json_encode([
            "ok" => true,
            "data" => $stats
        ]);
        return;
    }

    echo json_encode(["ok" => false, "error" => "Method not allowed"]);
}
