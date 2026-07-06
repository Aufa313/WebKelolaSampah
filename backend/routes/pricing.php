<?php
/**
 * Pricing Handler
 * GET /backend/api.php/pricing - Fetch pricing data from DB
 * POST /backend/api.php/pricing - Update commodity pricing in DB
 */

function handlePricingRequest($method, $input, $conn) {
    if ($method === 'GET') {
        try {
            $query = "SELECT slug, label, points, rupiah, co2_factor AS co2Factor, color, description AS `desc` FROM pricing";
            $result = $conn->query($query);
            
            if (!$result) {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'error' => 'Database error: ' . $conn->error
                ]);
                return;
            }
            
            $pricing = [];
            while ($row = $result->fetch_assoc()) {
                $slug = $row['slug'];
                unset($row['slug']);
                
                // Type conversion
                $row['points'] = (int)$row['points'];
                $row['rupiah'] = (int)$row['rupiah'];
                $row['co2Factor'] = (float)$row['co2Factor'];
                
                $pricing[$slug] = $row;
            }
            
            http_response_code(200);
            echo json_encode([
                'ok' => true,
                'data' => $pricing
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'ok' => false,
                'error' => $e->getMessage()
            ]);
        }
        
    } elseif ($method === 'POST') {
        $prices = $input['prices'] ?? null;
        
        if (!is_array($prices)) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'error' => 'Invalid request payload: list of prices required'
            ]);
            return;
        }
        
        // Transaction to ensure all or nothing updates
        $conn->begin_transaction();
        
        try {
            $stmt = $conn->prepare("UPDATE pricing SET rupiah = ? WHERE slug = ?");
            if (!$stmt) {
                throw new Exception("Failed to prepare statement: " . $conn->error);
            }
            
            foreach ($prices as $item) {
                $slug = $item['slug'] ?? '';
                $pricePerKg = $item['pricePerKg'] ?? null;
                
                if ($slug && $pricePerKg !== null) {
                    $rupiah = (int)$pricePerKg;
                    $stmt->bind_param('is', $rupiah, $slug);
                    $stmt->execute();
                }
            }
            
            $stmt->close();
            $conn->commit();
            
            http_response_code(200);
            echo json_encode([
                'ok' => true,
                'message' => 'Commodity pricing updated successfully'
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            http_response_code(500);
            echo json_encode([
                'ok' => false,
                'error' => 'Failed to update pricing: ' . $e->getMessage()
            ]);
        }
        
    } else {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'error' => 'Method not allowed'
        ]);
    }
}
