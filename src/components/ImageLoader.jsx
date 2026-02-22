// src/components/ImageLoader.jsx
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function ImageLoader({ src, alt, className }) {
  // State to track if the image has finished downloading
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* Loading Overlay (Visible only when isLoaded is false) */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-xs z-10">
          <FaSpinner className="text-primary text-3xl animate-spin opacity-50" />
        </div>
      )}

      {/* The actual Image */}
      <img
        src={src}
        alt={alt}
        // This React event fires automatically when the image is fully downloaded
        onLoad={() => setIsLoaded(true)}
        // We combine your custom classes with the blur/fade transition
        className={`${className} transition-all duration-700 ease-in-out
          ${isLoaded ? 'blur-0 opacity-100' : 'blur-sm opacity-0'}
        `}
      />
    </div>
  );
}