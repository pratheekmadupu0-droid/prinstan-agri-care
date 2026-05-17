import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaExpandAlt, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaPause, 
  FaImages,
  FaArrowDown
} from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import SEO from '../components/SEO';
import preloadedImages from '../data/gallery.json';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [visibleCount, setVisibleCount] = useState(16);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const slideshowTimer = useRef(null);

  // Load photos from Firebase & local preloaded JSON
  useEffect(() => {
    const gallRef = ref(db, 'gallery');
    const unsubscribe = onValue(gallRef, (snapshot) => {
      const data = snapshot.val();
      let firebaseList = [];
      
      if (data) {
        firebaseList = Object.keys(data).map(key => ({ 
          id: key, 
          ...data[key]
        }));
      }
      
      // Combine custom uploaded images first, followed by our optimized set
      const combinedList = [...firebaseList, ...preloadedImages];
      setGallery(combinedList);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Get currently visible items
  const visibleItems = gallery.slice(0, visibleCount);

  // Load more handler
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 16);
  };

  // Lightbox navigation functions
  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex(prev => (prev > 0 ? prev - 1 : gallery.length - 1));
  }, [activeIndex, gallery.length]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex(prev => (prev < gallery.length - 1 ? prev + 1 : 0));
  }, [activeIndex, gallery.length]);

  // Slideshow effect
  useEffect(() => {
    if (isPlaying && activeIndex !== null) {
      slideshowTimer.current = setInterval(() => {
        handleNext();
      }, 3000);
    } else {
      if (slideshowTimer.current) {
        clearInterval(slideshowTimer.current);
      }
    }
    
    return () => {
      if (slideshowTimer.current) {
        clearInterval(slideshowTimer.current);
      }
    };
  }, [isPlaying, activeIndex, handleNext]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setActiveIndex(null);
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handlePrev, handleNext]);

  // Keep track of active item details
  const activeItem = activeIndex !== null ? gallery[activeIndex] : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <SEO 
        title="Gallery | Prinstan Agri Care" 
        description="Explore the gallery of Prinstan Agri Care Pvt Ltd, showcasing our authentic field work, products, and direct impact on Indian agriculture."
      />
      
      {/* Page Header - Clean & Elegant Logi Style */}
      <div className="bg-white py-32 px-4 relative overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h2 className="logi-label text-brand-green-600 mb-6 flex items-center gap-2">
              <FaImages className="text-sm" /> Authentic Field Captures
            </h2>
            <h1 className="text-[10vw] sm:text-[8vw] md:text-[6vw] logi-heading text-brand-green-900 mb-8 leading-none">
              FIELD<br />
              <span className="text-brand-green-500">ARCHIVES.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
              An authentic collection of raw field work, crop monitoring, and local farmer moments captured directly from rural India since 2017.
            </p>
          </motion.div>
        </div>
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-green-50/50 to-transparent -z-10 rounded-l-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Loading Indicator */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-600"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading archive captures...</p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {visibleItems.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => {
                      setActiveIndex(idx);
                      setIsPlaying(false);
                    }}
                    className="group relative aspect-square rounded-logi overflow-hidden cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(34,197,94,0.1)] bg-white border border-gray-100 transition-all duration-300"
                  >
                    {/* Image Element */}
                    <img 
                      src={item.thumbnailUrl || item.url} 
                      alt={item.id} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                    
                    {/* Minimalist Glass Overlay (Visible on hover) */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex justify-between items-center text-white">
                        <div>
                          <p className="font-semibold text-sm tracking-widest uppercase">Prinstan Archive</p>
                          <span className="text-xs text-gray-300 opacity-90">{item.id}</span>
                        </div>
                        <div className="bg-white/10 hover:bg-brand-green-500 p-2.5 rounded-full transition-all shadow-sm">
                          <FaExpandAlt className="text-white text-xs" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {gallery.length > visibleCount && (
              <div className="mt-16 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 text-gray-800 font-bold hover:text-brand-green-600 hover:border-brand-green-500 hover:bg-brand-green-50/20 rounded-full transition-all duration-300 shadow-sm text-sm tracking-wider"
                >
                  <FaArrowDown className="text-xs animate-bounce" /> EXPLORE MORE CAPTURES ({gallery.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Advanced Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => {
              setActiveIndex(null);
              setIsPlaying(false);
            }}
          >
            {/* Top Bar Details */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white z-25 bg-gradient-to-b from-black/80 to-transparent">
              <div>
                <span className="text-xs tracking-widest uppercase font-bold text-brand-green-400">
                  Prinstan Archives
                </span>
                <span className="mx-2 text-gray-600">•</span>
                <span className="text-xs text-gray-400 font-semibold uppercase">
                  {activeIndex + 1} of {gallery.length}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Slideshow Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    isPlaying 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isPlaying ? <FaPause size={8} /> : <FaPlay size={8} />}
                  {isPlaying ? 'Pause Slideshow' : 'Autoplay'}
                </button>

                {/* Close Button */}
                <button 
                  onClick={() => {
                    setActiveIndex(null);
                    setIsPlaying(false);
                  }}
                  className="bg-white/10 hover:bg-brand-green-500 hover:text-white p-3 rounded-full text-white transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* Left Navigation Arrow */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
                setIsPlaying(false);
              }}
              className="absolute left-6 z-20 bg-white/5 hover:bg-brand-green-500 hover:scale-105 p-5 rounded-full text-white transition-all shadow-lg flex items-center justify-center md:flex hidden"
            >
              <FaChevronLeft size={20} />
            </button>

            {/* Main Visual Box */}
            <motion.div 
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full max-h-[75vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={activeItem.url} 
                alt={activeItem.id} 
                className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain border border-white/5" 
              />
            </motion.div>

            {/* Right Navigation Arrow */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
                setIsPlaying(false);
              }}
              className="absolute right-6 z-20 bg-white/5 hover:bg-brand-green-500 hover:scale-105 p-5 rounded-full text-white transition-all shadow-lg flex items-center justify-center md:flex hidden"
            >
              <FaChevronRight size={20} />
            </button>

            {/* Bottom Bar Info Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-gray-300">Prinstan Field Capture</h2>
              <p className="text-brand-green-400 text-lg mt-2 font-bold tracking-widest">{activeItem.id}</p>
              
              {/* Mobile simple navigation buttons */}
              <div className="flex md:hidden justify-center items-center gap-6 mt-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="bg-white/10 p-3 rounded-full"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-xs text-gray-300">{activeIndex + 1} / {gallery.length}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="bg-white/10 p-3 rounded-full"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
