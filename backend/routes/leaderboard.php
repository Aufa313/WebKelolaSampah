<?php
/**
 * Leaderboard Handler
 * GET /backend/api.php/leaderboard - Fetch leaderboard data
 */

function handleLeaderboardRequest($method, $conn) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'error' => 'Method not allowed'
        ]);
        return;
    }

    // Static leaderboard data (can be extended to fetch from DB)
    $leaderboard = [
        'weekly' => [
            [
                'name' => 'Bpk. Heri Susanto',
                'points' => 410,
                'category' => 'Minyak Jelantah & Kardus',
                'badge' => '🏆',
                'rank' => 1,
            ],
            [
                'name' => 'Siti Rahmaawati',
                'points' => 340,
                'category' => 'Kardus & Kertas',
                'badge' => '🥈',
                'rank' => 2,
            ],
            [
                'name' => 'Kurniawan',
                'points' => 280,
                'category' => 'Minyak Jelantah',
                'badge' => '🥉',
                'rank' => 3,
            ],
            [
                'name' => 'Budi Santoso',
                'points' => 220,
                'category' => 'Plastik PET Gelas & Botol',
                'badge' => '4',
                'rank' => 4,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'points' => 165,
                'category' => 'Sampah Organik Bersih',
                'badge' => '5',
                'rank' => 5,
            ]
        ],
        'monthly' => [
            [
                'name' => 'Bpk. Heri Susanto',
                'points' => 1580,
                'category' => 'Minyak Jelantah & Kardus',
                'badge' => '🏆',
                'rank' => 1,
            ],
            [
                'name' => 'Kurniawan',
                'points' => 1220,
                'category' => 'Minyak Jelantah',
                'badge' => '🥈',
                'rank' => 2,
            ],
            [
                'name' => 'Siti Rahmaawati',
                'points' => 1040,
                'category' => 'Kardus & Kertas',
                'badge' => '🥉',
                'rank' => 3,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'points' => 890,
                'category' => 'Sampah Organik Bersih',
                'badge' => '4',
                'rank' => 4,
            ],
            [
                'name' => 'Lestari Widodo',
                'points' => 650,
                'category' => 'Layanan E-Waste Khusus',
                'badge' => '5',
                'rank' => 5,
            ]
        ]
    ];

    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'data' => $leaderboard
    ]);
}
