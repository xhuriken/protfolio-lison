// src/components/admin/ArtworkManager.jsx
import { useState, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaGripVertical } from 'react-icons/fa';
import ArtworkFormModal from './ArtworkFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteArtworkAPI, reorderArtworksAPI } from '../../services/api'; // Add reorder API
import toast from 'react-hot-toast';

export default function ArtworkManager({ artworks, setArtworks }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [artworkToEdit, setArtworkToEdit] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);

  // --- DRAG AND DROP REFS ---
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleAddNew = () => {
    setArtworkToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (artwork) => {
    setArtworkToEdit(artwork);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (artwork) => {
    setArtworkToDelete(artwork);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleteOpen(false);
    const toastId = toast.loading('Deleting...');
    
    try {
      const result = await deleteArtworkAPI(artworkToDelete.id);
      if (result.success) {
        toast.success('Artwork deleted!', { id: toastId });
        setArtworks(result.data);
      } else {
        toast.error('Error: ' + result.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Server error!', { id: toastId });
    }
  };

  // --- DRAG AND DROP  ---
  const handleSort = async () => {
    // Clone the current array
    const _artworks = [...artworks];
    
    // Remove the dragged item from its original position
    const draggedItemContent = _artworks.splice(dragItem.current, 1)[0];
    
    // Insert it into the new position
    _artworks.splice(dragOverItem.current, 0, draggedItemContent);

    // Reset refs
    dragItem.current = null;
    dragOverItem.current = null;

    // Update UI immediately so it feels snappy
    setArtworks(_artworks);

    // Save the new array order to the server silently
    try {
      const result = await reorderArtworksAPI(_artworks);
      if (!result.success) {
        toast.error("Failed to save the new order on server");
      }
    } catch (error) {
      toast.error("Server error while reordering");
    }
  };

  return (
    <section className="bg-card/60 p-6 md:p-8 rounded-[32px] shadow-sm mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-black/5 pb-6">
        <h2 className="text-2xl font-bold text-primary">Here Is Your Art &#60;3</h2>
        <button onClick={handleAddNew} className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-secondary text-card font-bold rounded-xl hover:scale-105 transition-transform">
          <FaPlus /> Add New Artwork
        </button>
      </div>

      {/* List of existing artworks */}
      <div className="flex flex-col gap-4"> 
        {/* Changed grid to flex-col for better drag & drop visual flow */}
        {artworks.map((art, index) => (
          <div 
            key={art.id} 
            // Drag and Drop Events
            draggable
            onDragStart={(e) => (dragItem.current = index)}
            onDragEnter={(e) => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()} // Necessary to allow dropping
            className="flex items-center justify-between p-4 bg-accent/50 rounded-2xl cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {/* Drag Handle Icon */}
              <div className="text-text-sub/50 hover:text-text-main transition-colors px-2">
                <FaGripVertical className="text-xl" />
              </div>
              
              <img src={`${import.meta.env.BASE_URL}${art.thumbnailUrl || art.imageUrl}`} alt={art.title} className="w-16 h-16 object-cover rounded-xl pointer-events-none" />
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

      {/* Modals */}
      <ArtworkFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} artworkToEdit={artworkToEdit} setArtworks={setArtworks} />
      <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} />
    </section>
  );
}