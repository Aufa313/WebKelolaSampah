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
                'rank' => 1,
                'name' => 'Warga Kelurahan Maju Jaya',
                'points' => 4500,
                'avatar' => 'WMJ',
                'change' => '+120'
            ],
            [
                'rank' => 2,
                'name' => 'Komunitas Hijau Kota',
                'points' => 3800,
                'avatar' => 'KHK',
                'change' => '+89'
            ],
            [
                'rank' => 3,
                'name' => 'Perkampungan Eco Bersih',
                'points' => 3200,
                'avatar' => 'PEB',
                'change' => '+45'
            ]
        ],
        'monthly' => [
            [
                'rank' => 1,
                'name' => 'Warga Kelurahan Maju Jaya',
                'points' => 18500,
                'avatar' => 'WMJ',
                'change' => '+520'
            ],
            [
                'rank' => 2,
                'name' => 'Komunitas Hijau Kota',
                'points' => 15200,
                'avatar' => 'KHK',
                'change' => '+340'
            ],
            [
                'rank' => 3,
                'name' => 'Perkampungan Eco Bersih',
                'points' => 12800,
                'avatar' => 'PEB',
                'change' => '+210'
            ]
        ]
    ];

    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'data' => $leaderboard
    ]);
}
