<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

$theme_file = '../data/theme.json';

// 1. GET: Return current theme
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($theme_file)) {
        echo file_get_contents($theme_file);
    } else {
        echo json_encode(['currentTheme' => 'theme-sakura']);
    }
    exit;
}

// 2. POST: Update theme
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['theme'])) {
        $data = ['currentTheme' => $input['theme']];
        file_put_contents($theme_file, json_encode($data));
        echo json_encode(['success' => true, 'theme' => $input['theme']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No theme provided']);
    }
    exit;
}
?>