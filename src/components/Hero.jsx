import { useState } from 'react';
// We import FontAwesome icons from react-icons
import { FaEnvelope, FaPhone, FaCheck, FaRegCopy } from 'react-icons/fa';

export default function Hero() {
  // Data for the hero section (later, this will come from our JSON)
  const heroData = {
    name: "Artiste 2 zinzin",
    description: "Welcome to my pastel universe. I draw a lot of KAWAINEE things.",
    email: "meuf@zigobar.com",
    phone: "+33 6 66 66 66 66",
    imageUrl: "/me.jpg" // Cute SHREK
  };

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

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 py-12 px-4 md:px-8 bg-card rounded-3xl shadow-sm border border-black/5 mb-12">
      
      {/* Profile Image */}
      <div className="w-32 h-32 md:w-48 md:h-48 shrink-0">
        <img 
          src={heroData.imageUrl} 
          alt="Profile" 
          className="w-full h-full object-cover rounded-full border-4 border-accent/20 shadow-md"
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          {heroData.name}
        </h1>
        <p className="text-lg text-textsub mb-6 max-w-2xl">
          {heroData.description}
        </p>

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          
          {/* Email Button */}
          <button 
            onClick={() => handleCopy(heroData.email, 'email')}
            className="group flex items-center justify-between gap-3 px-5 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-2xl transition-all duration-300 w-full sm:w-auto cursor-pointer"
            title="Copy Email"
          >
            <div className="flex items-center gap-2">
              <FaEnvelope />
              <span className="font-semibold">{heroData.email}</span>
            </div>
            {copiedItem === 'email' ? <FaCheck className="text-green-500 scale-110 transition-transform" /> : <FaRegCopy className="opacity-50 group-hover:opacity-100 transition-opacity" />}
          </button>

          {/* Phone Button */}
          <button 
            onClick={() => handleCopy(heroData.phone, 'phone')}
            className="group flex items-center justify-between gap-3 px-5 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-2xl transition-all duration-300 w-full sm:w-auto cursor-pointer"
            title="Copy Phone"
          >
            <div className="flex items-center gap-2">
              <FaPhone />
              <span className="font-semibold">{heroData.phone}</span>
            </div>
            {copiedItem === 'phone' ? <FaCheck className="text-green-500 scale-110 transition-transform" /> : <FaRegCopy className="opacity-50 group-hover:opacity-100 transition-opacity" />}
          </button>

        </div>
      </div>
    </div>
  );
}