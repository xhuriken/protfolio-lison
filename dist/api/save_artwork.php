<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

$json_file = '../data/artworks.json';
$base_upload_dir = '../artworks/'; 

if (!file_exists($json_file)) die(json_encode(['success' => false, 'message' => 'artworks.json not found']));
$artworks = json_decode(file_get_contents($json_file), true);

$isEditing = isset($_POST['id']);
$id = $isEditing ? (int)$_POST['id'] : (empty($artworks) ? 1 : max(array_column($artworks, 'id')) + 1);

$artworkIndex = -1;
if ($isEditing) {
    foreach ($artworks as $index => $art) {
        if ($art['id'] === $id) $artworkIndex = $index;
    }
}

// Build the artwork object (Bye bye thumbnailUrl!)
$newArtwork = [
    'id' => $id,
    'title' => $_POST['title'] ?? '',
    'description' => $_POST['description'] ?? '',
    'timeSpent' => $_POST['timeSpent'] ?? '',
    'date' => $_POST['date'] ?? '',
    'category' => $_POST['category'] ?? '',
    'imageUrl' => $isEditing && $artworkIndex !== -1 ? $artworks[$artworkIndex]['imageUrl'] : ''
];

// Handle Image Upload & Conversion
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'bmp', 'webp'];
    
    if (in_array($ext, $allowed_extensions)) {
        
        $artwork_dir = $base_upload_dir . $id . '/';
        if (!is_dir($artwork_dir)) mkdir($artwork_dir, 0777, true);

        $base_filename = 'artwork_' . time();
        
        // If it's already a good web format, keep it
        if ($ext === 'jpg' || $ext === 'jpeg' || $ext === 'png') {
            $final_filename = $base_filename . '.' . $ext;
            move_uploaded_file($file['tmp_name'], $artwork_dir . $final_filename);
            $newArtwork['imageUrl'] = 'artworks/' . $id . '/' . $final_filename;
        } 
        // If it's heavy/unoptimized like BMP, convert to JPG!
        else {
            $final_filename = $base_filename . '.jpg';
            $destination = $artwork_dir . $final_filename;
            
            if ($ext === 'bmp' && function_exists('imagecreatefrombmp')) {
                $image = imagecreatefrombmp($file['tmp_name']);
            } elseif ($ext === 'webp' && function_exists('imagecreatefromwebp')) {
                $image = imagecreatefromwebp($file['tmp_name']);
            } else {
                $image = false;
            }

            if ($image !== false) {
                // Convert and save as JPG at 85% quality (great for web)
                imagejpeg($image, $destination, 85); 
                imagedestroy($image);
                $newArtwork['imageUrl'] = 'artworks/' . $id . '/' . $final_filename;
            } else {
                // Fallback if server lacks GD library support for this format
                $fallback_name = $base_filename . '.' . $ext;
                move_uploaded_file($file['tmp_name'], $artwork_dir . $fallback_name);
                $newArtwork['imageUrl'] = 'artworks/' . $id . '/' . $fallback_name;
            }
        }
    }
}

if ($isEditing && $artworkIndex !== -1) {
    // Keep old properties if they exist, but overwrite with new ones
    // We also make sure to unset thumbnailUrl if it existed in the old data
    unset($artworks[$artworkIndex]['thumbnailUrl']); 
    $artworks[$artworkIndex] = $newArtwork; 
} else {
    array_unshift($artworks, $newArtwork);
}

file_put_contents($json_file, json_encode($artworks, JSON_PRETTY_PRINT));
echo json_encode(['success' => true, 'data' => $artworks]);
?>