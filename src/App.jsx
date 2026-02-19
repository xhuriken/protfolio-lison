import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { FaArrowLeft, FaUserShield } from 'react-icons/fa';
import ArtworkCard from './components/ArtworkCard';
import Hero from './components/Hero';
import ArtworkModal from './components/ArtworkModal';
import BlogAdmin from './pages/BlogAdmin';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { getThemeAPI } from './services/api';
import { SnowBackground } from "./components/ui/snow"

// Home Component separated for cleanliness
function Home({ heroData, artworks }) {
  return (
    <div className="max-w-7xl mx-auto relative">
      <Hero data={heroData} />
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      <Outlet />
      
      {/* Little secret button to go to admin */}
      <Link 
        to="/blog" 
        className="fixed bottom-6 right-6 p-4 bg-primary text-card rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center z-50 group"
      >
        <FaUserShield className="text-xl" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-bold text-xs uppercase tracking-widest">
          Edit&nbsp;me
        </span>
      </Link>
    </div>
  );
}

function App() {
  // States to store our fetched data
  const [heroData, setHeroData] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const themeData = await getThemeAPI();
        // Apply the theme from the server directly to the body
        if (themeData && themeData.currentTheme) {
          document.body.className = themeData.currentTheme;
        }
      } catch (e) {
        console.error("Theme fetch failed");
      }
    };
    initApp();
  }, []);

  // Fetch data when the app starts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // We add '?t=...' to prevent the browser from keeping the old JSON in cache
        const cacheBuster = new Date().getTime();
        
        const heroRes = await fetch(`/data/hero.json?t=${cacheBuster}`);
        const heroJson = await heroRes.json();
        
        const artRes = await fetch(`/data/artworks.json?t=${cacheBuster}`);
        const artJson = await artRes.json();

        setHeroData(heroJson);
        setArtworks(artJson);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show a loading screen while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-text-main font-cute">
        <p className="text-2xl font-bold animate-pulse">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-page text-text-main font-cute transition-colors duration-500">

      <SnowBackground />

      <Toaster 
        position="bottom-center" 
        toastOptions={{
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-text-main)',
            borderRadius: '16px',
            fontWeight: 'bold'
          }
        }} 
      />

      <BrowserRouter>
        <Routes>
          {/* We pass the fetched data to Home */}
          <Route path="/" element={<Home heroData={heroData} artworks={artworks} />}>
            {/* We also pass artworks to the Modal so it can find the right image */}
            <Route path="artwork/:id" element={<ArtworkModal artworks={artworks} />} />
          </Route>
          
          <Route path="/blog" element={
            <div className="relative">
              <Link 
                to="/" 
                className="fixed top-6 left-6 px-4 py-3 bg-card text-primary rounded-2xl shadow-md font-bold text-sm hover:scale-105 transition-all z-50 flex items-center gap-2 group border border-black/5"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Gallery</span>
              </Link>
                <BlogAdmin heroData={heroData} setHeroData={setHeroData} artworks={artworks} setArtworks={setArtworks} />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;