// src/components/admin/ArtworkManager.jsx
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

import SortableArtworkCard from './SortableArtworkCard';
import ArtworkFormModal from './ArtworkFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteArtworkAPI, reorderArtworksAPI } from '../../services/api';

export default function ArtworkManager({ artworks, setArtworks }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [artworkToEdit, setArtworkToEdit] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);

  const handleAddNew = () => { setArtworkToEdit(null); setIsFormOpen(true); };
  const handleEdit = (art) => { setArtworkToEdit(art); setIsFormOpen(true); };
  const handleDeleteClick = (art) => { setArtworkToDelete(art); setIsDeleteOpen(true); };

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

  const moveArtwork = async (index, direction) => {
    const newArtworks = [...artworks];
    if (direction === -1 && index > 0) {
      [newArtworks[index - 1], newArtworks[index]] = [newArtworks[index], newArtworks[index - 1]];
    } else if (direction === 1 && index < newArtworks.length - 1) {
      [newArtworks[index + 1], newArtworks[index]] = [newArtworks[index], newArtworks[index + 1]];
    } else return;

    setArtworks(newArtworks);
    saveOrder(newArtworks);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = artworks.findIndex((art) => art.id === active.id);
      const newIndex = artworks.findIndex((art) => art.id === over.id);
      const newArtworks = arrayMove(artworks, oldIndex, newIndex);
      
      setArtworks(newArtworks);
      saveOrder(newArtworks);
    }
  };

  const saveOrder = async (newArray) => {
    try {
      const result = await reorderArtworksAPI(newArray);
      if (!result.success) toast.error("Failed to save order on server");
    } catch (e) {
      toast.error("Server error while reordering");
    }
  };

  // Require a 5px drag distance before firing a drag event (allows clicking buttons)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <section className="bg-card/60 p-6 md:p-8 rounded-[32px] shadow-sm mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-black/5 pb-6">
        <h2 className="text-2xl font-bold text-primary">Organize Your Gallery</h2>
        <button onClick={handleAddNew} className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-secondary text-card font-bold rounded-xl hover:scale-105 transition-transform">
          <FaPlus /> Add New Artwork
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={artworks.map(art => art.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      <ArtworkFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} artworkToEdit={artworkToEdit} setArtworks={setArtworks} />
      <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} />
    </section>
  );
}