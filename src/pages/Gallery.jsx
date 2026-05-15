import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTimes, FaExpandAlt, FaPlayCircle } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import SEO from '../components/SEO';

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultImages = [
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.46.35 PM.jpeg', title: 'Field Visit', type: 'image' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.46.48 PM.jpeg', title: 'Product Showcase', type: 'image' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.11 PM.jpeg', title: 'Farmer Interaction', type: 'image' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.27 PM.jpeg', title: 'Crop Monitoring', type: 'image' },
    { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.48 PM.jpeg', title: 'Our Facility', type: 'image' }
  ];

  useEffect(() => {
    const gallRef = ref(db, 'gallery');
    const unsubscribe = onValue(gallRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setGallery(list);
      } else {
        setGallery(defaultImages);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
            {gallery.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-lg bg-gray-100"
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white gap-3">
                    <FaPlayCircle size={48} className="text-brand-green-500" />
                    <span className="font-bold text-sm">Play Video</span>
                  </div>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.title || "Gallery Item"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <div className="flex justify-between items-center text-white">
                    <p className="font-bold text-lg">{item.title || (item.type === 'video' ? 'Video Moment' : 'Gallery Image')}</p>
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
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
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
              {selectedItem.type === 'video' ? (
                <video controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-white/10">
                  <source src={selectedItem.url} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title} 
                  className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border-4 border-white/10" 
                />
              )}
            </motion.div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
              <h2 className="text-2xl font-bold">{selectedItem.title || (selectedItem.type === 'video' ? 'Video Moment' : 'Gallery Image')}</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
