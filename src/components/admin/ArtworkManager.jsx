// src/components/admin/ArtworkManager.jsx
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ArtworkFormModal from './ArtworkFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteArtworkAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ArtworkManager({ artworks, setArtworks }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [artworkToEdit, setArtworkToEdit] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);

  // Open Form for Adding
  const handleAddNew = () => {
    setArtworkToEdit(null);
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const handleEdit = (artwork) => {
    setArtworkToEdit(artwork);
    setIsFormOpen(true);
  };

  // Open Delete Confirmation
  const handleDeleteClick = (artwork) => {
    setArtworkToDelete(artwork);
    setIsDeleteOpen(true);
  };

  // Process Deletion (When user clicks "Shrek je t'aime")
  const confirmDelete = async () => {
    setIsDeleteOpen(false);
    const toastId = toast.loading('Deleting...');
    
    try {
      const result = await deleteArtworkAPI(artworkToDelete.id);
      if (result.success) {
        toast.success('Artwork deleted!', { id: toastId });
        setArtworks(result.data); // Update gallery
      } else {
        toast.error('Error: ' + result.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Server error!', { id: toastId });
    }
  };

  return (
    <section className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-black/5 pb-6">
        <h2 className="text-2xl font-bold text-primary">Manage Artworks</h2>
        <button onClick={handleAddNew} className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-secondary text-card font-bold rounded-xl hover:scale-105 transition-transform">
          <FaPlus /> Add New Artwork
        </button>
      </div>

      {/* List of existing artworks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {artworks.map(art => (
          <div key={art.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <img src={art.thumbnailUrl || art.imageUrl} alt={art.title} className="w-16 h-16 object-cover rounded-xl" />
              <div>
                <h3 className="font-bold text-text-main">{art.title}</h3>
                <p className="text-xs text-text-sub">{art.date}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => handleEdit(art)} className="cursor-pointer p-3 bg-text-sub/20 text-text-sub rounded-xl hover:scale-110 transition-transform"><FaEdit /></button>
              <button onClick={() => handleDeleteClick(art)} className="cursor-pointer p-3 bg-red-100 text-red-600 rounded-xl hover:scale-110 transition-transform"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals are placed here but invisible until triggered */}
      <ArtworkFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} artworkToEdit={artworkToEdit} setArtworks={setArtworks} />
      <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} />
    </section>
  );
}