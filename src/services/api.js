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

// We will add saveArtworkAPI and deleteArtworkAPI here later!