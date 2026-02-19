<?php
// Allow React (localhost) to communicate with our PHP server (Laragon)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests from React (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

// --- PATH CONFIGURATION ---
// Since we are in "public/api/", we go up one level ("../") to reach the "public" folder
$json_file = '../data/hero.json';
$upload_dir = '../'; 

// Prepare the default response
$response = ['success' => false, 'message' => ''];

// 1. Get current data from the JSON file
if (!file_exists($json_file)) {
    die(json_encode(['success' => false, 'message' => 'hero.json not found']));
}
$current_data = json_decode(file_get_contents($json_file), true);

// 2. Update text with data sent by React (FormData)
$current_data['name'] = isset($_POST['name']) ? $_POST['name'] : $current_data['name'];
$current_data['description'] = isset($_POST['description']) ? $_POST['description'] : $current_data['description'];
$current_data['email'] = isset($_POST['email']) ? $_POST['email'] : $current_data['email'];
$current_data['phone'] = isset($_POST['phone']) ? $_POST['phone'] : $current_data['phone'];

// 3. Handle NEW IMAGE upload (if an image was sent)
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    
    // Check file extension for security reasons
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif'];
    
    if (in_array($ext, $allowed_extensions)) {
        // Rename file cleanly (e.g., profile_pic.jpg) and overwrite the old one!
        $new_filename = 'profile_pic.' . $ext;
        $destination = $upload_dir . $new_filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            // Update image URL in the JSON data
            // We add '/' so React loads it from the root of the public folder
            $current_data['imageUrl'] = $new_filename; 
        } else {
            $response['message'] = 'Error saving image on the server.';
            echo json_encode($response);
            exit;
        }
    } else {
        $response['message'] = 'Image format not allowed.';
        echo json_encode($response);
        exit;
    }
}

// 4. Overwrite old hero.json with new data (Text + Image)
if (file_put_contents($json_file, json_encode($current_data, JSON_PRETTY_PRINT))) {
    $response['success'] = true;
    $response['data'] = $current_data; // Send data back to update React
} else {
    $response['message'] = 'Error: Cannot modify hero.json file';
}

echo json_encode($response);
?>