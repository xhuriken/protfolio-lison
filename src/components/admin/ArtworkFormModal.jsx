// src/components/admin/ArtworkFormModal.jsx
import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { saveArtworkAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ArtworkFormModal({ isOpen, onClose, artworkToEdit, setArtworks }) {
  const [formData, setFormData] = useState({
    title: '', description: '', timeSpent: '', date: '', category: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // If we open the modal to EDIT, we fill the form with existing data
  useEffect(() => {
    if (artworkToEdit) {
      setFormData({
        title: artworkToEdit.title,
        description: artworkToEdit.description,
        timeSpent: artworkToEdit.timeSpent,
        date: artworkToEdit.date,
        category: artworkToEdit.category
      });
    } else {
      // If adding NEW, we clear the form
      setFormData({ title: '', description: '', timeSpent: '', date: '', category: '' });
    }
    setSelectedFile(null); // Always reset file selection
  }, [artworkToEdit, isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Saving artwork...');

    const dataToSend = new FormData();
    // If editing, we send the ID so PHP knows which one to update
    if (artworkToEdit) dataToSend.append('id', artworkToEdit.id);
    
    // Add all text fields
    Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
    
    // Add image if selected
    if (selectedFile) dataToSend.append('image', selectedFile);

    try {
      const result = await saveArtworkAPI(dataToSend);
      if (result.success) {
        toast.success('Artwork saved!', { id: toastId });
        setArtworks(result.data); // Update the gallery list
        onClose(); // Close modal
      } else {
        toast.error('Error: ' + result.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Server error!', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80" onClick={onClose} />
        
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative bg-card p-6 md:p-8 rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center"><FaTimes /></button>
          
          <h2 className="text-2xl font-bold text-primary mb-6">
            {artworkToEdit ? 'Edit Artwork' : 'Add New Artwork'}
          </h2>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-3 bg-page text-text-main rounded-xl outline-none" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description..." rows="3" className="w-full p-3 bg-page text-text-main rounded-xl outline-none resize-none" />
            
            <div className="flex gap-4">
              <input type="text" name="timeSpent" value={formData.timeSpent} onChange={handleChange} placeholder="Time (ex: 2h 30m)" className="flex-1 p-3 bg-page text-text-main rounded-xl outline-none" />
              <input type="text" name="date" value={formData.date} onChange={handleChange} placeholder="January 2026" className="flex-1 p-3 bg-page text-text-main rounded-xl outline-none" />
            </div>
            
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category (ex: Sketch, Digital)" className="w-full p-3 bg-page text-text-main rounded-xl outline-none" />

            <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-secondary/40 text-secondary bg-secondary/5 rounded-2xl cursor-pointer">
              <FaImage />
              <span className="font-bold">{selectedFile ? selectedFile.name : (artworkToEdit ? "Upload new image (optional)" : "Upload Artwork (JPG, PNG, BMP)")}</span>
              <input type="file" accept=".jpg,.jpeg,.png,.bmp,.webp" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
            </label>

            <button type="submit" disabled={isSaving} className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-primary text-card font-bold rounded-xl hover:scale-[1.02]">
              <FaSave /> {isSaving ? 'Saving...' : 'Save Artwork'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}