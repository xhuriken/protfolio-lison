import { useState } from 'react';

export default function Scotch({ icon: Icon, text, colorClass }) {
  
  // Main label rotation: between -8 and +8 degrees
  const [rotation] = useState(() => (Math.random() * 16) - 8);
  
  // Tape rotation: between -6 and +6 degrees for extra messiness!
  const [tapeRotation] = useState(() => (Math.random() * 16) - 10);

  return (
    <span 
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm hover:scale-110 hover:shadow-md transition-all z-10 hover:z-20 cursor-pointer  ${colorClass}`}
      // Apply the label rotation
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* The Tape Wrapper
        We use a wrapper to keep it perfectly centered at the top (-translate-x-1/2)
      */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
        {/* The actual piece of tape 
          More visible now: bg-white/80, a tiny border, and a subtle shadow!
        */}
        <div 
          className="w-4 h-2.5 bg-white/90 shadow-[0_1px_2px_rgba(0,0,0,0.3)] border border-black/5 rounded-[2px]"
          style={{ transform: `rotate(${tapeRotation}deg)` }}
        />
      </div>
      
      {/* Render the icon if provided */}
      {Icon && <Icon className="text-sm opacity-80" />}
      
      {text}
    </span>
  );
}