import { useState } from 'react';
// We import FontAwesome icons from react-icons
import { FaEnvelope, FaPhone, FaCheck, FaRegCopy } from 'react-icons/fa';
import Meteors from './ui/meteors';
import ImageLoader from './ImageLoader';


export default function Hero({ data }) {
  // State to know which button was copied ('email', 'phone', or null)
  const [copiedItem, setCopiedItem] = useState(null);

  // Function to copy text to clipboard
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);

    // Reset the icon after 2 seconds
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

 if (!data) return null;

  return (
    <div className="relative isolate flex flex-col md:flex-row items-center gap-8 py-12 px-4 md:px-8 bg-card/60 rounded-[32px] shadow-sm mb-12">
      <Meteors></Meteors>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
        {/* Profile Image */}
        <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 scale-110 hover:scale-115 transition-all">
          <ImageLoader 
            src={`${import.meta.env.BASE_URL}${data.imageUrl}`}
            alt="Profile Image" 
            className="w-full h-full object-cover rounded-4xl border-4 border-accent/20 shadow-md" 
          />
          {/* <img 
            src={`${import.meta.env.BASE_URL}${data.imageUrl}`}
            alt="Profile" 
            className="w-full h-full object-cover rounded-4xl border-4 border-accent/20 shadow-md"
          /> */}
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {data.name}
          </h1>
          <p className="text-lg text-text-sub mb-6 max-w-2xl whitespace-pre-line">
            {data.description}
          </p>

          {/* Contact Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            
            <button 
              onClick={() => handleCopy(data.email, 'email')}
              className="group flex items-center justify-between gap-3 px-5 py-3 bg-secondary/10 hover:scale-105 hover:bg-secondary/20 text-secondary rounded-2xl transition-all duration-300 w-full sm:w-auto cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <span className="font-semibold">{data.email}</span>
              </div>
              {copiedItem === 'email' ? <FaCheck className="text-green-500 scale-110 transition-transform" /> : <FaRegCopy className="opacity-50 group-hover:opacity-100 transition-opacity" />}
            </button>

            <button 
              onClick={() => handleCopy(data.phone, 'phone')}
              className="group flex items-center justify-between gap-3 px-5 py-3 bg-accent/10 hover:scale-105 hover:bg-accent/20 text-accent rounded-2xl transition-all duration-300 w-full sm:w-auto cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FaPhone />
                <span className="font-semibold">{data.phone}</span>
              </div>
              {copiedItem === 'phone' ? <FaCheck className="text-green-500 scale-110 transition-transform" /> : <FaRegCopy className="opacity-50 group-hover:opacity-100 transition-opacity" />}
            </button>

          </div>
        </div>
      </div>

      {/* Elle voulait pas mon ptit smiley... */}
      {/* <div 
        className="absolute bottom-1 right-6 w-24 md:w-36 h-24 md:h-36 -rotate-12 bg-accent/30"
        style={{
          maskImage: 'url(hero.svg)',
          WebkitMaskImage: 'url(hero.svg)',
          maskRepeat: 'no-repeat',
          maskSize: 'contain'
        }}
      /> */}

    </div>
  );
}