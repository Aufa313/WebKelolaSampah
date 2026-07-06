<?php
/**
 * Leaderboard Handler
 * GET /backend/api.php/leaderboard - Fetch leaderboard data
 */

function handleLeaderboardRequest($method, $conn) {
    if ($method === 'GET') {
        // Real logic: aggregate from resident_pickups and join with users
        $sql = "
            SELECT u.id, u.full_name as nama, u.address, u.phone,
                   IFNULL(SUM(rp.actual_weight), 0) as totalBerat
            FROM users u
            LEFT JOIN resident_pickups rp ON u.id = rp.user_id AND rp.status = 'Selesai'
            WHERE u.role = 'warga'
            GROUP BY u.id
            ORDER BY totalBerat DESC
            LIMIT 10
        ";
        
        $result = $conn->query($sql);
        $leaderboard = [];
        if ($result) {
            $rank = 1;
            while ($row = $result->fetch_assoc()) {
                if (floatval($row['totalBerat']) > 0) {
                    $leaderboard[] = [
                        "id" => "WRG-" . str_pad($row['id'], 3, "0", STR_PAD_LEFT),
                        "nama" => $row['nama'],
                        "totalBerat" => floatval($row['totalBerat']),
                        "rank" => $rank
                    ];
                    $rank++;
                }
            }
        }
        
        echo json_encode([
            "ok" => true,
            "data" => $leaderboard
        ]);
        return;
    }


