// src/components/SmartGallery.jsx
import { useState, useEffect } from 'react';
import ArtworkCard from './ArtworkCard';

export default function SmartGallery({ artworks }) {
  // Default to 3 columns
  const [columnsCount, setColumnsCount] = useState(3);

  // Update column count based on screen width
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumnsCount(3); // lg
      else if (window.innerWidth >= 768) setColumnsCount(2); // md
      else setColumnsCount(1); // mobile
    };
    
    // Check on first load
    updateColumns();
    
    // Listen for window resize
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute artworks LEFT TO RIGHT across the available columns
  const columns = Array.from({ length: columnsCount }, () => []);
  artworks.forEach((art, index) => {
    columns[index % columnsCount].push(art);
  });

  return (
    <div className="flex gap-6 items-start">
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6 w-full">
          {col.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      ))}
    </div>
  );
}