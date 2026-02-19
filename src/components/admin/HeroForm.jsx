// src/components/admin/HeroForm.jsx
import { useState } from 'react';
import { FaUserEdit, FaImage, FaSave } from 'react-icons/fa';
import { saveHeroAPI } from '../../services/api'; // Import our API logic
import toast from 'react-hot-toast';

export default function HeroForm({ heroData, setHeroData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Update text values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({ ...prev, [name]: value }));
  };

  // Handle local image preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const localPreviewUrl = URL.createObjectURL(file);
      setHeroData(prev => ({ ...prev, imageUrl: localPreviewUrl }));
    }
  };

  // Send data to API
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const toastId = toast.loading('Saving profile...');

    // Create the package (FormData)
    const formData = new FormData();
    formData.append('name', heroData.name);
    formData.append('description', heroData.description);
    formData.append('email', heroData.email);
    formData.append('phone', heroData.phone);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      // Call the clean API function
      const result = await saveHeroAPI(formData);
      
      if (result.success) {
        toast.success('C ok le sang !', { id: toastId });
        setHeroData(result.data); 
        setSelectedFile(null); 
      } else {
        // 3. Show an error toast
        toast.error('[ERREUR] Ya soussi apel celest1 cheri: ' + result.message, { id: toastId });
      }
    } catch (error) {
      toast.error('[ERREUR] Ya soussi apel celest1 cheri: ', error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-6">
        <FaUserEdit className="text-secondary text-xl" />
        <h2 className="text-2xl font-bold text-primary">Edit Profile (Hero)</h2>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-bold text-text-sub mb-1">Artist Name</label>
          <input type="text" name="name" value={heroData.name} onChange={handleChange} className="w-full p-3 bg-page text-text-main rounded-xl border-none outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
        </div>

        <div>
          <label className="block text-sm font-bold text-text-sub mb-1">Description</label>
          <textarea name="description" value={heroData.description} onChange={handleChange} rows="3" className="w-full p-3 bg-page text-text-main rounded-xl border-none outline-none focus:ring-2 focus:ring-secondary/50 transition-all resize-none" />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <label className="block text-sm font-bold text-text-sub mb-1">Email</label>
            <input type="email" name="email" value={heroData.email} onChange={handleChange} className="w-full p-3 bg-page text-text-main rounded-xl border-none outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-bold text-text-sub mb-1">Phone</label>
            <input type="text" name="phone" value={heroData.phone} onChange={handleChange} className="w-full p-3 bg-page text-text-main rounded-xl border-none outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-bold text-text-sub mb-2">Profile Image</label>
          <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-secondary/40 text-secondary bg-secondary/5 rounded-2xl cursor-pointer hover:bg-secondary/10 transition-colors">
            <FaImage />
            <span className="font-bold">{selectedFile ? selectedFile.name : "Upload new photo"}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        <button type="submit" disabled={isSaving} className={`mt-4 flex items-center justify-center gap-2 w-full py-4 text-card font-bold rounded-xl transition-transform cursor-pointer ${isSaving ? 'bg-secondary' : 'bg-primary hover:scale-[1.02]'}`}>
          <FaSave className="text-xl" />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </section>
  );
}