<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

$json_file = '../data/artworks.json';

// Get the new array sent by React
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['artworks'])) {
    // Overwrite the JSON file with the new order
    if (file_put_contents($json_file, json_encode($input['artworks'], JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'data' => $input['artworks']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to write to file']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No artworks provided']);
}
?>