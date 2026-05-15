import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTimes, FaExpandAlt } from 'react-icons/fa';
import SEO from '../components/SEO';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.46.35 PM.jpeg', title: 'Field Visit' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.46.48 PM.jpeg', title: 'Product Showcase' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.11 PM.jpeg', title: 'Farmer Interaction' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.27 PM.jpeg', title: 'Crop Monitoring' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.48 PM.jpeg', title: 'Our Facility' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO 
        title="Gallery | Prinstan Agri Care" 
        description="Explore the gallery of Prinstan Agri Care, showcasing our field work, products, and impact on Indian agriculture."
      />
      
      {/* Header */}
      <div className="bg-brand-brown-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Gallery</h1>
        <p className="text-brand-brown-200 max-w-xl mx-auto">Moments of innovation and impact across the fields of India.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-lg"
              >
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <div className="flex justify-between items-center text-white">
                    <p className="font-bold text-lg">{image.title}</p>
                    <FaExpandAlt />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
          >
            <button className="absolute top-8 right-8 text-white text-3xl hover:text-brand-green-400 transition-colors">
              <FaTimes />
            </button>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border-4 border-white/10" 
              />
            </motion.div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
              <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
