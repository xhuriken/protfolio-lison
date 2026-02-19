<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

$json_file = '../data/artworks.json';
$upload_dir = '../'; // Save in public folder

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
        $original_filename = 'artwork_' . $id . '_' . time() . '.' . $ext;
        $destination = $upload_dir . $original_filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $newArtwork['imageUrl'] = $original_filename;
            
            // MAGIC: If BMP, we create a compressed JPG thumbnail!
            if ($ext === 'bmp' && function_exists('imagecreatefrombmp')) {
                $bmp_image = imagecreatefrombmp($destination);
                if ($bmp_image !== false) {
                    $thumb_filename = 'artwork_' . $id . '_' . time() . '_thumb.jpg';
                    imagejpeg($bmp_image, $upload_dir . $thumb_filename, 80); // Compress at 80% quality
                    imagedestroy($bmp_image);
                    $newArtwork['thumbnailUrl'] = $thumb_filename; // Grid uses this
                }
            } else {
                // If JPG/PNG, no need for duplication, grid uses the original
                $newArtwork['thumbnailUrl'] = $original_filename;
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