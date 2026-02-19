// src/pages/BlogAdmin.jsx
import ThemeSwitcher from '../components/admin/ThemeSwitcher';
import HeroForm from '../components/admin/HeroForm';
// We will import ArtworkManager here later!

export default function BlogAdmin({ heroData, setHeroData }) {
  
  // Wait for data to load before displaying forms
  if (!heroData) {
    return <div className="text-center p-10 font-bold text-primary">Loading Admin Data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-text-sub mt-2">Manage your portfolio, themes, and artworks.</p>
      </header>

      {/* 1. Theme Module */}
      <ThemeSwitcher />

      {/* 2. Hero Profile Module */}
      <HeroForm heroData={heroData} setHeroData={setHeroData} />

      {/* 3. Artworks Module (Coming Next!) */}
      <section className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm">
        <h2 className="text-2xl font-bold text-primary mb-6 border-b border-black/5 pb-4">
          Manage Artworks (Next Step)
        </h2>
        <div className="text-center p-10 bg-page rounded-2xl border-2 border-dashed border-secondary/30">
          <p className="text-text-sub font-bold">Here we will add the form to upload new drawings, edit them, and delete them!</p>
        </div>
      </section>

    </div>
  );
}