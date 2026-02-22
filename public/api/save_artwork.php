<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

$json_file = '../data/artworks.json';
// Base directory for our organized images (public/artworks/)
$base_upload_dir = '../artworks/'; 

if (!file_exists($json_file)) die(json_encode(['success' => false, 'message' => 'artworks.json not found']));
$artworks = json_decode(file_get_contents($json_file), true);

// Get data from React
$isEditing = isset($_POST['id']);
$id = $isEditing ? (int)$_POST['id'] : (empty($artworks) ? 1 : max(array_column($artworks, 'id')) + 1);

// Find existing artwork if editing
$artworkIndex = -1;
if ($isEditing) {
    foreach ($artworks as $index => $art) {
        if ($art['id'] === $id) $artworkIndex = $index;
    }
}

// Build the artwork object
$newArtwork = [
    'id' => $id,
    'title' => $_POST['title'] ?? '',
    'description' => $_POST['description'] ?? '',
    'timeSpent' => $_POST['timeSpent'] ?? '',
    'date' => $_POST['date'] ?? '',
    'category' => $_POST['category'] ?? '',
    // Keep old URLs if editing and no new image is provided
    'imageUrl' => $isEditing && $artworkIndex !== -1 ? $artworks[$artworkIndex]['imageUrl'] : '',
    'thumbnailUrl' => $isEditing && $artworkIndex !== -1 && isset($artworks[$artworkIndex]['thumbnailUrl']) ? $artworks[$artworkIndex]['thumbnailUrl'] : ''
];

// Handle Image Upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'bmp', 'webp'];
    
    if (in_array($ext, $allowed_extensions)) {
        
        // 1. Create a specific folder for this artwork ID (e.g., public/artworks/12/)
        $artwork_dir = $base_upload_dir . $id . '/';
        if (!is_dir($artwork_dir)) {
            mkdir($artwork_dir, 0777, true);
        }

        $original_filename = 'original_' . time() . '.' . $ext;
        $destination = $artwork_dir . $original_filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            
            // The relative path we save in JSON (ex: artworks/12/original_123.bmp)
            $public_path_original = 'artworks/' . $id . '/' . $original_filename;
            
            // The Modal will ALWAYS use the original file, even if it's a BMP
            $newArtwork['imageUrl'] = $public_path_original; 
            
            // 2. Logic for BMP vs other formats
            if ($ext === 'bmp' && function_exists('imagecreatefrombmp')) {
                // If it's a BMP, we create a compressed JPG copy for the Card
                $bmp_image = imagecreatefrombmp($destination);
                if ($bmp_image !== false) {
                    $thumb_filename = 'thumb_' . time() . '.jpg';
                    $thumb_destination = $artwork_dir . $thumb_filename;
                    
                    imagejpeg($bmp_image, $thumb_destination, 80); // Compress at 80% quality
                    imagedestroy($bmp_image);
                    
                    // The Card uses the JPG copy
                    $newArtwork['thumbnailUrl'] = 'artworks/' . $id . '/' . $thumb_filename; 
                } else {
                    // Fallback if conversion fails
                    $newArtwork['thumbnailUrl'] = $public_path_original;
                }
            } else {
                // If it's ALREADY a JPG, JPEG, or PNG, no need for duplication. 
                // Both the Modal and the Card use the same original image.
                $newArtwork['thumbnailUrl'] = $public_path_original;
            }
        }
    }
}

// Save back to JSON
if ($isEditing && $artworkIndex !== -1) {
    $artworks[$artworkIndex] = $newArtwork; // Update
} else {
    array_unshift($artworks, $newArtwork); // Add at the beginning of the list
}

file_put_contents($json_file, json_encode($artworks, JSON_PRETTY_PRINT));
echo json_encode(['success' => true, 'data' => $artworks]);
?>