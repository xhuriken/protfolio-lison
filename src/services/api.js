// src/services/api.js

// The base URL of our PHP server (Laragon)
// Easy to change here when going to production!
// const API_BASE_URL = 'https://honvault.com/lison/api/';
// const API_BASE_URL = 'https://localhost/public/api/';

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost/public/api/' 
  : `${import.meta.env.BASE_URL}api/`;

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

// Fetch the current theme from server
export const getThemeAPI = async () => {
  const response = await fetch(`${API_BASE_URL}theme_manager.php`);
  return await response.json();
};

// Save new theme to server
export const saveThemeAPI = async (themeName) => {
  const response = await fetch(`${API_BASE_URL}theme_manager.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme: themeName }),
  });
  return await response.json();
};

// Function to save the new order of artworks
export const reorderArtworksAPI = async (newArtworksArray) => {
  try {
    const response = await fetch(`${API_BASE_URL}reorder_artworks.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artworks: newArtworksArray }),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Cannot connect to PHP server");
  }
};