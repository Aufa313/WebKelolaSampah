<?php
/**
 * Resident Pickups Handler
 * GET /backend/api.php/pickups - Fetch pickup requests
 * POST /backend/api.php/pickups - Create a pickup request
 * PUT /backend/api.php/pickups - Update status, courier assignment, or actual weight
 */

function handlePickupsRequest($method, $input, $conn) {
    if ($method === 'GET') {
        $userId = $_GET['user_id'] ?? null;
        $courierId = $_GET['courier_id'] ?? null;
        
        $query = "SELECT rp.*, 
                         u.full_name AS warga_name, 
                         u.phone AS warga_phone, 
                         u.address AS warga_address,
                         c.full_name AS courier_name,
                         c.phone AS courier_phone
                  FROM resident_pickups rp
                  LEFT JOIN users u ON rp.user_id = u.id
                  LEFT JOIN users c ON rp.assigned_courier_id = c.id";
        
        $params = [];
        $types = "";
        
        if ($userId) {
            $query .= " WHERE rp.user_id = ?";
            $params[] = (int)$userId;
            $types .= "i";
        } elseif ($courierId) {
            $query .= " WHERE rp.assigned_courier_id = ?";
            $params[] = (int)$courierId;
            $types .= "i";
        }
        
        $query .= " ORDER BY rp.requested_at DESC";
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Database error: ' . $conn->error]);
            return;
        }
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $pickups = [];
        while ($row = $result->fetch_assoc()) {
            // format fields for frontend
            $row['id'] = (int)$row['id'];
            $row['user_id'] = (int)$row['user_id'];
            $row['estimated_weight'] = (float)$row['estimated_weight'];
            $row['actual_weight'] = $row['actual_weight'] !== null ? (float)$row['actual_weight'] : null;
            $row['assigned_courier_id'] = $row['assigned_courier_id'] !== null ? (int)$row['assigned_courier_id'] : null;
            
            // Map status values for compatibility
            $row['wargaName'] = $row['warga_name'] ?: 'Warga';
            $row['wargaPhone'] = $row['warga_phone'] ?: '';
            $row['wargaAddress'] = $row['warga_address'] ?: $row['pickup_address'];
            $row['assignedCourier'] = $row['courier_name'] ?: null;
            $row['estimatedWeight'] = $row['estimated_weight'];
            $row['requestDate'] = date('d M Y', strtotime($row['requested_at']));
            
            $pickups[] = $row;
        }
        
        $stmt->close();
        
        http_response_code(200);
        echo json_encode(['ok' => true, 'data' => $pickups]);
        
    } elseif ($method === 'POST') {
        $userId = $input['user_id'] ?? null;
        $wasteCategory = $input['waste_category'] ?? null;
        $estimatedWeight = $input['estimated_weight'] ?? null;
        $pickupAddress = $input['pickup_address'] ?? null;
        $pickupDate = $input['pickup_date'] ?? null;
        $pickupTimeSlot = $input['pickup_time_slot'] ?? null;
        
        if (!$userId || !$wasteCategory || !$estimatedWeight || !$pickupAddress) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
            return;
        }
        
        $query = "INSERT INTO resident_pickups (user_id, waste_category, estimated_weight, pickup_address, status, pickup_date, pickup_time_slot) 
                  VALUES (?, ?, ?, ?, 'Menunggu Penugasan', ?, ?)";
                  
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Database error: ' . $conn->error]);
            return;
        }
        
        $weight = (float)$estimatedWeight;
        $stmt->bind_param('isdsss', $userId, $wasteCategory, $weight, $pickupAddress, $pickupDate, $pickupTimeSlot);
        
        if ($stmt->execute()) {
            $newId = $conn->insert_id;
            $stmt->close();
            
            http_response_code(201);
            echo json_encode([
                'ok' => true,
                'data' => [
                    'id' => $newId,
                    'status' => 'Menunggu Penugasan'
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Failed to create pickup request: ' . $stmt->error]);
            $stmt->close();
        }
        
    } elseif ($method === 'PUT') {
        $id = $input['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Request ID is required']);
            return;
        }
        
        // Admin Assigns Courier
        $assignedCourierId = $input['assigned_courier_id'] ?? null;
        $status = $input['status'] ?? null;
        $actualWeight = $input['actual_weight'] ?? null;
        $notes = $input['notes'] ?? null;
        
        // Dynamically build update query
        $query = "UPDATE resident_pickups SET updated_at = NOW()";
        $params = [];
        $types = "";
        
        if ($assignedCourierId !== null) {
            $query .= ", assigned_courier_id = ?";
            $params[] = (int)$assignedCourierId;
            $types .= "i";
        }
        if ($status !== null) {
            $query .= ", status = ?";
            $params[] = $status;
            $types .= "s";
        }
        if ($actualWeight !== null) {
            $query .= ", actual_weight = ?";
            $params[] = (float)$actualWeight;
            $types .= "d";
        }
        if ($notes !== null) {
            $query .= ", notes = ?";
            $params[] = $notes;
            $types .= "s";
        }
        
        $query .= " WHERE id = ?";
        $params[] = (int)$id;
        $types .= "i";
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Database error: ' . $conn->error]);
            return;
        }
        
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            // If the courier finishes penjemputan, we should also log a balance transaction!
            if ($status === 'Selesai' && $actualWeight !== null) {
                // Get the user_id and category first
                $selectQuery = "SELECT user_id, waste_category FROM resident_pickups WHERE id = ?";
                $selStmt = $conn->prepare($selectQuery);
                if ($selStmt) {
                    $selStmt->bind_param('i', $id);
                    $selStmt->execute();
                    $selRes = $selStmt->get_result()->fetch_assoc();
                    $selStmt->close();
                    
                    if ($selRes) {
                        $wargaUserId = (int)$selRes['user_id'];
                        $category = $selRes['waste_category'];
                        
                        // Look up how much Rp this category earns per Kg from the pricing table!
                        $priceQuery = "SELECT label, rupiah FROM pricing WHERE label = ? OR slug = ? LIMIT 1";
                        $prStmt = $conn->prepare($priceQuery);
                        if ($prStmt) {
                            $categoryLower = strtolower($category);
                            // standard match slugs
                            $slug = 'plastik';
                            if (strpos($categoryLower, 'plastik') !== false) $slug = 'plastik';
                            elseif (strpos($categoryLower, 'kertas') !== false || strpos($categoryLower, 'kardus') !== false) $slug = 'kertas';
                            elseif (strpos($categoryLower, 'logam') !== false || strpos($categoryLower, 'besi') !== false) $slug = 'logam';
                            elseif (strpos($categoryLower, 'organik') !== false) $slug = 'organik';
                            elseif (strpos($categoryLower, 'elektronik') !== false || strpos($categoryLower, 'waste') !== false) $slug = 'elektronik';
                            elseif (strpos($categoryLower, 'jelantah') !== false || strpos($categoryLower, 'minyak') !== false) $slug = 'jelantah';
                            
                            $prStmt->bind_param('ss', $category, $slug);
                            $prStmt->execute();
                            $prRes = $prStmt->get_result()->fetch_assoc();
                            $prStmt->close();
                            
                            if ($prRes) {
                                $rupiahPerKg = (int)$prRes['rupiah'];
                                $totalAmount = $rupiahPerKg * (float)$actualWeight;
                                $description = "Setor " . $category . " " . $actualWeight . " Kg";
                                
                                // Insert transaction
                                $txQuery = "INSERT INTO balance_transactions (user_id, transaction_type, amount, description) VALUES (?, 'Masuk', ?, ?)";
                                $txStmt = $conn->prepare($txQuery);
                                if ($txStmt) {
                                    $txStmt->bind_param('ids', $wargaUserId, $totalAmount, $description);
                                    $txStmt->execute();
                                    $txStmt->close();
                                }
                            }
                        }
                    }
                }
            }
            
            $stmt->close();
            http_response_code(200);
            echo json_encode(['ok' => true, 'message' => 'Pickup request updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Failed to update pickup request: ' . $stmt->error]);
            $stmt->close();
        }
        
    } else {
        http_response_code(405);
        echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    }
}
