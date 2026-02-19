import { FaRegClock, FaCalendarAlt, FaPalette } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ArtworkCard({ artwork }) {
  return (
    // break-inside-avoid prevents the card from splitting across columns
    <Link 
      to={`/artwork/${artwork.id}`}
      className="block break-inside-avoid mb-6 bg-card rounded-3xl p-3 shadow-sm border border-black/5 hover:shadow-md transition-all cursor-pointer group"
    > 
      {/* Image without cropping! 
        w-full makes it take the card's width, h-auto keeps the original ratio 
      */}
      <div className="overflow-hidden rounded-2xl">
        <img 
          // We use thumbnailUrl if it exists (for converted BMPs), otherwise imageUrl
          // We use thumbnailUrl if it exists (for converted BMPs), otherwise imageUrl
          src={artwork.thumbnailUrl || artwork.imageUrl} 
          alt={artwork.title}
          className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-3 mt-2">
        {/* Only show title if it exists */}
        {artwork.title && <h3 className="text-xl font-bold text-primary mb-1">{artwork.title}</h3>}
        
        {/* Only show description if it exists */}
        {artwork.description && <p className="text-sm text-text-sub mb-4">{artwork.description}</p>}
        
        <div className="flex flex-wrap gap-2">
          {/* Conditional rendering for each pin */}
          {artwork.timeSpent && (
            <span className="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
              <FaRegClock /> {artwork.timeSpent}
            </span>
          )}

          {artwork.date && (
            <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
              <FaCalendarAlt /> {artwork.date}
            </span>
          )}

          {artwork.category && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
              <FaPalette /> {artwork.category}
            </span>
          )}
        </div>
      </div>

    </Link>
  );
}