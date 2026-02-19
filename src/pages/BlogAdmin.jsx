// src/pages/BlogAdmin.jsx
import ThemeSwitcher from '../components/admin/ThemeSwitcher';
import HeroForm from '../components/admin/HeroForm';
import ArtworkManager from '../components/admin/ArtworkManager'; // Import our new manager

/**
 * BlogAdmin - Main Dashboard for the portfolio
 * This page assembles the different modules: Theme, Profile, and Artworks.
 */
export default function BlogAdmin({ heroData, setHeroData, artworks, setArtworks }) {
  
  // Safety check: wait for data to be fetched from PHP before rendering
  if (!heroData || !artworks) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-bold animate-pulse text-lg">Loading Admin Panels...</p>
      </div>
    );
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
      <footer className="mt-12 text-center border-t border-black/5 pt-8">
        <p className="text-xs text-text-sub uppercase tracking-widest opacity-50">
          Attention meuf si quelqu'un a accès à cette page, t'es foutu
        </p>
      </footer>

    </div>
  );
}