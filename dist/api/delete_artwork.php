<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

$json_file = '../data/artworks.json';
if (!file_exists($json_file)) die(json_encode(['success' => false]));

// Read ID sent by React
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['id'])) die(json_encode(['success' => false, 'message' => 'No ID provided']));

$id_to_delete = (int)$input['id'];
$artworks = json_decode(file_get_contents($json_file), true);

// Filter out the deleted artwork
$filtered_artworks = array_values(array_filter($artworks, function($art) use ($id_to_delete) {
    return $art['id'] !== $id_to_delete;
}));

file_put_contents($json_file, json_encode($filtered_artworks, JSON_PRETTY_PRINT));
echo json_encode(['success' => true, 'data' => $filtered_artworks]);
?>