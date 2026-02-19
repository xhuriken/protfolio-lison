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
        <h3 className="text-xl font-bold text-primary mb-1">{artwork.title}</h3>
        <p className="text-sm text-textsub mb-4">{artwork.description}</p>
        
        {/* Cute Pins using FontAwesome */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full flex items-center gap-1">
            <FaRegClock /> {artwork.timeSpent}
          </span>
          <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full flex items-center gap-1">
            <FaCalendarAlt /> {artwork.date}
          </span>
          <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full flex items-center gap-1">
            <FaPalette /> {artwork.category}
          </span>
        </div>
      </div>

    </Link>
  );
}