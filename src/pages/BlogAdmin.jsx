// src/pages/BlogAdmin.jsx
import { useState } from 'react';
import ThemeSwitcher from '../components/admin/ThemeSwitcher';
import HeroForm from '../components/admin/HeroForm';
import ArtworkManager from '../components/admin/ArtworkManager';
import toast from 'react-hot-toast';
/**
 * BlogAdmin - Main Dashboard for the portfolio
 * This page assembles the different modules: Theme, Profile, and Artworks.
 */
export default function BlogAdmin({ heroData, setHeroData, artworks, setArtworks }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Simple password check
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'caca') { // Bon, si tu trouve ça, t'es pas sympa, alors touche pas stp
      setIsAuthenticated(true);
      toast.success('Welcome back sister!');
    } else {
      toast.error("Mauvais mot de passe, ce n'est pas de chance hein !");
    }
  };

  // 1. If not authenticated, show the login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-card/60 p-8 rounded-[32px] shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Secret Access</h2>
          <input 
            type="password" 
            placeholder="Enter password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-page rounded-2xl mb-4 outline-none border-2 border-transparent focus:border-primary transition-all text-center font-bold"
          />
          <button type="submit" className="w-full py-4 bg-primary text-card font-bold rounded-2xl hover:scale-105 transition-transform cursor-pointer">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  // 2. If authenticated, show the dashboard
  if (!heroData || !artworks) {
    return <div className="text-center p-10 font-bold text-primary animate-pulse">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      
      {/* 1. Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Girl Power Mode</h1>
        <p className="text-text-sub text-lg italic">
          Welcome back! Here you can customize your universe.
        </p>
      </header>

      {/* 2. Theme Module
          Handles color switching for the entire app.
      */}
      <div className="mb-10">
        <ThemeSwitcher />
      </div>

      {/* 3. Hero Profile Module
          Handles name, description, and profile picture updates.
      */}
      <div className="mb-10">
        <HeroForm heroData={heroData} setHeroData={setHeroData} />
      </div>

      {/* 4. Artworks Management Module
          Handles Adding, Editing, and Deleting drawings.
          It also manages the .bmp to .jpg conversion via PHP.
      */}
      <div>
        <ArtworkManager artworks={artworks} setArtworks={setArtworks} />
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center border-t border-black/6 pt-8">
        <p className="text-xs text-text-sub uppercase tracking-widest opacity-70">
          Attention meuf si quelqu'un a accès à cette page, t'es foutu
        </p>
      </footer>

    </div>
  );
}