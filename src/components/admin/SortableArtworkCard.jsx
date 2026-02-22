// src/components/admin/SortableArtworkCard.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ImageLoader from '../ImageLoader';

export default function SortableArtworkCard({ art, index, totalItems, moveArtwork, handleEdit, handleDeleteClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: art.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`relative aspect-square bg-black/5 rounded-2xl overflow-hidden group shadow-sm transition-shadow touch-none select-none cursor-grab active:cursor-grabbing
        ${isDragging ? 'shadow-2xl scale-105 ring-4 ring-primary opacity-80' : 'hover:shadow-md'}`}
    >
      <ImageLoader 
        src={import.meta.env.BASE_URL + art.imageUrl}
        alt={art.title}  
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" 
      />
      {/* <img 
        src={import.meta.env.BASE_URL + (art.thumbnailUrl || art.imageUrl)} 
        alt={art.title} 
        draggable="false"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" 
      /> */}

      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs font-bold rounded-lg backdrop-blur-sm z-10 pointer-events-none">
        #{index + 1}
      </div>

      <div className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-20 ${isDragging ? 'hidden' : ''}`}>
        <div className="flex justify-between">
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => moveArtwork(index, -1)} 
            disabled={index === 0}
            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-black rounded-full transition-colors disabled:opacity-20 cursor-pointer"
          >
            <FaArrowLeft />
          </button>
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => moveArtwork(index, 1)} 
            disabled={index === totalItems - 1}
            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-black rounded-full transition-colors disabled:opacity-20 cursor-pointer"
          >
            <FaArrowRight />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => handleEdit(art)} 
            className="flex-1 py-2 bg-secondary/80 hover:bg-secondary text-white rounded-xl text-sm font-bold transition-colors cursor-pointer flex justify-center items-center"
          >
            <FaEdit />
          </button>
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => handleDeleteClick(art)} 
            className="flex-1 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer flex justify-center items-center"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}