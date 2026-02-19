// src/components/admin/ThemeSwitcher.jsx
import { FaPalette } from 'react-icons/fa';
import { saveThemeAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ThemeSwitcher() {
  
  const themes = [
    { id: 'theme-sakura', label: 'Sakura Choco', colors: 'bg-[#F2CFCB] text-[#443025]' },
    { id: 'theme-forest', label: 'Forest Moss', colors: 'bg-[#F7F4D5] text-[#0A3323]' },
    { id: 'theme-blossom', label: 'Pastel Blossom', colors: 'bg-[#F4DFE6] text-[#7a4a5f]' }
  ];

  const changeTheme = async (t) => {
    // 1. Immediate visual feedback
    document.body.className = t.id;
    
    // 2. Save to server
    try {
      const result = await saveThemeAPI(t.id);
      if (result.success) {
        toast.success(`Theme updated to ${t.label}!`);
      }
    } catch (error) {
      toast.error("Failed to save theme on server");
    }
  };

  return (
    <section className="bg-card/60 p-6 rounded-[32px] shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FaPalette className="text-accent text-xl" />
        <h2 className="text-2xl font-bold text-primary">Theme Switcher !</h2>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {themes.map(t => (
          <button 
            key={t.id}
            onClick={() => changeTheme(t)} 
            className={`px-6 py-3 rounded-2xl font-bold transition-transform hover:scale-105 cursor-pointer ${t.colors}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </section>
  );
}