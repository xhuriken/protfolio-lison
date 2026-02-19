// src/components/admin/ThemeSwitcher.jsx
import { FaPalette } from 'react-icons/fa';

export default function ThemeSwitcher() {
  
  // Change the CSS class on the body to switch colors
  const changeTheme = (themeClass) => {
    document.body.className = themeClass;
  };

  return (
    <section className="bg-card p-6 rounded-[32px] shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FaPalette className="text-accent text-xl" />
        <h2 className="text-2xl font-bold text-primary">Change Theme</h2>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <button onClick={() => changeTheme('theme-sakura')} className="px-6 py-3 rounded-2xl font-bold bg-[#F2CFCB] text-[#443025] hover:scale-105 transition-transform cursor-pointer">Sakura Choco</button>
        <button onClick={() => changeTheme('theme-forest')} className="px-6 py-3 rounded-2xl font-bold bg-[#F7F4D5] text-[#0A3323] hover:scale-105 transition-transform cursor-pointer">Forest Moss</button>
        <button onClick={() => changeTheme('theme-blossom')} className="px-6 py-3 rounded-2xl font-bold bg-[#F4DFE6] text-[#7a4a5f] hover:scale-105 transition-transform cursor-pointer">Pastel Blossom</button>
      </div>
    </section>
  );
}