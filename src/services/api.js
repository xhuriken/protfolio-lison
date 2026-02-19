// src/services/api.js

// The base URL of our PHP server (Laragon)
// Easy to change here when going to production!
const API_BASE_URL = 'http://localhost/public/api/';

// Function to save Hero data
export const saveHeroAPI = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}save_hero.php`, {
      method: 'POST',
      body: formData, // We send the package
    });
    
    return await response.json(); // We return the PHP response
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Cannot connect to PHP server");
  }
};

export const saveArtworkAPI = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}save_artwork.php`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    throw new Error("Cannot connect to PHP server");
  }
};

// Function to delete an Artwork
export const deleteArtworkAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}delete_artwork.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }), // We send the ID as JSON
    });
    return await response.json();
  } catch (error) {
    throw new Error("Cannot connect to PHP server");
  }
};