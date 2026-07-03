<?php
/**
 * Pricing Handler
 * GET /backend/api.php/pricing - Fetch pricing data
 */

function handlePricingRequest($method, $conn) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'error' => 'Method not allowed'
        ]);
        return;
    }

    // Static pricing data (can be extended to fetch from DB)
    $pricing = [
        'plastik' => [
            'label' => 'Plastik Sektor Premium',
            'points' => 120,
            'rupiah' => 2500,
            'co2Factor' => 1.5,
            'color' => 'bg-blue-500',
            'desc' => 'Botol PET, Gelas Plastik, HDPE tebal, Emberan bersih.'
        ],
        'kertas' => [
            'label' => 'Kertas, Kardus & Karton',
            'points' => 90,
            'rupiah' => 1800,
            'co2Factor' => 0.9,
            'color' => 'bg-orange-500',
            'desc' => 'Koran bekas, buku tua, kardus cokelat lipat tebal.'
        ],
        'logam' => [
            'label' => 'Logam & Aluminium',
            'points' => 200,
            'rupiah' => 4500,
            'co2Factor' => 3.2,
            'color' => 'bg-slate-500',
            'desc' => 'Kaleng minuman soda, tembaga, kabel tembaga rusak, besi tua.'
        ]
    ];

    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'data' => $pricing
    ]);
}
