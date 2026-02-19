import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaTimes, FaRegClock, FaCalendarAlt, FaPalette } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Scotch from './Scotch';

export default function ArtworkModal({ artworks }) {
  // Get the ID from the URL
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVertical, setIsVertical] = useState(false);

  // Find the specific artwork
  const artwork = artworks.find((art) => art.id === parseInt(id));

  // Close function
  const handleClose = () => navigate('/');

  // Detect image dimensions to adapt layout
  useEffect(() => {
    if (artwork) {
      const img = new Image();
      img.src = artwork.imageUrl;
      img.onload = () => {
        setIsVertical(img.height > img.width);
      };
    }
  }, [artwork]);

  if (!artwork) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-8">
        
        {/* Background overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className={`bg-card w-fit max-w-[95vw] md:max-w-[90vw] max-h-[95vh] rounded-[32px] overflow-y-auto overflow-x-hidden flex relative shadow-2xl z-10
            ${isVertical ? 'flex-col md:flex-row' : 'flex-col'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-20 w-10 h-10 bg-black/10 hover:bg-black/20 text-text-main rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Image Section */}
          <div className={`bg-black/5 flex items-start justify-center shrink-0
            ${isVertical ? 'w-full md:w-auto' : 'w-full'}
          `}>
            <img 
              src={`${import.meta.env.BASE_URL}${artwork.imageUrl}`}
              alt={artwork.title} 
              className={`block object-contain
                ${isVertical 
                  ? 'w-full h-auto md:w-auto md:h-[90vh]' 
                  // FIXED: md:max-h-[75vh] prevents square images from growing taller than the screen
                  : 'w-full h-auto md:w-auto md:max-h-[75vh]'
                }
              `}
            />
          </div>

          {/* Details Section */}
          <div className={`p-6 md:p-10 bg-card shrink-0 flex flex-col
            ${isVertical ? 'w-full md:w-[400px] lg:w-[450px]' : 'w-full max-w-4xl'}
          `}>
            {/* Only show Title if not empty */}
            {artwork.title && <h2 className="text-3xl font-bold text-primary mb-4 pr-8">{artwork.title}</h2>}
            
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Conditional badges with the cute Scotch component */}
              
              {artwork.timeSpent && (
                <Scotch 
                  icon={FaRegClock} 
                  text={artwork.timeSpent} 
                  colorClass="bg-secondary/20 text-secondary" 
                />
              )}
              
              {artwork.date && (
                <Scotch 
                  icon={FaCalendarAlt} 
                  text={artwork.date} 
                  colorClass="bg-accent/20 text-accent" 
                />
              )}
              
              {artwork.category && (
                <Scotch 
                  icon={FaPalette} 
                  text={artwork.category} 
                  colorClass="bg-primary/10 text-primary" 
                />
              )}
              
            </div>

            {/* Only show Description if not empty */}
            {artwork.description && (
              <p className="text-text-sub leading-relaxed whitespace-pre-line text-base md:text-lg">
                {artwork.description}
              </p>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}