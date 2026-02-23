// src/components/admin/ArtworkManager.jsx
import { useState, useCallback } from 'react';
import { FaPlus, FaMobileAlt, FaTabletAlt, FaDesktop } from 'react-icons/fa';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

import SortableArtworkCard from './SortableArtworkCard';
import ArtworkFormModal from './ArtworkFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteArtworkAPI, reorderArtworksAPI } from '../../services/api';

export default function ArtworkManager({ artworks, setArtworks }) {
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [artworkToEdit, setArtworkToEdit] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);

  // NEW STATE: Manage the number of columns for the preview grid (default is 3 for PC)
  const [previewCols, setPreviewCols] = useState(3);

  const handleAddNew = () => { 
    setArtworkToEdit(null); 
    setIsFormOpen(true); 
  };
  
  // useCallback prevents re-creating these functions, saving memory and keeping animations smooth
  const handleEdit = useCallback((art) => { 
    setArtworkToEdit(art); 
    setIsFormOpen(true); 
  }, []);
  
  const handleDeleteClick = useCallback((art) => { 
    setArtworkToDelete(art); 
    setIsDeleteOpen(true); 
  }, []);

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
    } catch (e) { 
      toast.error('Server error!', { id: toastId }); 
    }
  };

  const saveOrder = useCallback(async (newArray) => {
    try {
      const result = await reorderArtworksAPI(newArray);
      if (!result.success) toast.error("Failed to save order on server");
    } catch (e) {
      toast.error("Server error while reordering");
    }
  }, []);

  const moveArtwork = useCallback((index, direction) => {
    setArtworks(prev => {
      const newArtworks = [...prev];
      if (direction === -1 && index > 0) {
        [newArtworks[index - 1], newArtworks[index]] = [newArtworks[index], newArtworks[index - 1]];
      } else if (direction === 1 && index < newArtworks.length - 1) {
        [newArtworks[index + 1], newArtworks[index]] = [newArtworks[index], newArtworks[index + 1]];
      } else return prev;

      saveOrder(newArtworks);
      return newArtworks;
    });
  }, [saveOrder, setArtworks]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setArtworks(prev => {
        const oldIndex = prev.findIndex((art) => art.id === active.id);
        const newIndex = prev.findIndex((art) => art.id === over.id);
        const newArtworks = arrayMove(prev, oldIndex, newIndex);
        
        saveOrder(newArtworks);
        return newArtworks;
      });
    }
  }, [saveOrder, setArtworks]);

  // Retour au déclenchement par distance (5px) ! 
  // Il suffit de bouger la souris de 5 pixels avec le clic enfoncé pour attraper l'image.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <section className="bg-card/60 p-6 md:p-8 rounded-[32px] shadow-sm mb-12">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-black/5 pb-6">
        <h2 className="text-2xl font-bold text-primary">Organize Your Gallery</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          
          {/* SCREEN SIMULATOR BUTTONS */}
          <div className="flex bg-black/5 rounded-xl p-1">
            <button 
              onClick={() => setPreviewCols(1)}
              className={`p-3 rounded-lg transition-colors cursor-pointer ${previewCols === 1 ? 'bg-card shadow text-primary' : 'text-text-sub hover:text-text-main'}`}
              title="Mobile View (1 Column)"
            >
              <FaMobileAlt />
            </button>
            <button 
              onClick={() => setPreviewCols(2)}
              className={`p-3 rounded-lg transition-colors cursor-pointer ${previewCols === 2 ? 'bg-card shadow text-primary' : 'text-text-sub hover:text-text-main'}`}
              title="Tablet View (2 Columns)"
            >
              <FaTabletAlt />
            </button>
            <button 
              onClick={() => setPreviewCols(3)}
              className={`p-3 rounded-lg transition-colors cursor-pointer ${previewCols === 3 ? 'bg-card shadow text-primary' : 'text-text-sub hover:text-text-main'}`}
              title="Desktop View (3 Columns)"
            >
              <FaDesktop />
            </button>
          </div>

          <button onClick={handleAddNew} className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-card font-bold rounded-xl hover:scale-105 transition-transform w-full sm:w-auto">
            <FaPlus /> Add Artwork
          </button>
        </div>
      </div>

      {/* DRAG AND DROP CONTEXT */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={artworks.map(art => art.id)} strategy={rectSortingStrategy}>
          
          {/* DYNAMIC GRID: Adapts columns and max-width based on the preview state */}
          <div 
            className="grid gap-4 transition-all duration-300 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${previewCols}, minmax(0, 1fr))`,
              maxWidth: previewCols === 1 ? '350px' : previewCols === 2 ? '600px' : '100%'
            }}
          >
            {artworks.map((art, index) => (
              <SortableArtworkCard 
                key={art.id} 
                art={art} 
                index={index} 
                totalItems={artworks.length}
                moveArtwork={moveArtwork}
                handleEdit={handleEdit}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </div>

        </SortableContext>
      </DndContext>

      {/* Modals */}
      <ArtworkFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} artworkToEdit={artworkToEdit} setArtworks={setArtworks} />
      <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} />
    </section>
  );
}