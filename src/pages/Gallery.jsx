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
  FaFilter,
  FaFolderOpen
} from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import SEO from '../components/SEO';
import preloadedImages from '../data/gallery.json';

const CATEGORIES = [
  'All',
  'Field Trials',
  'Farmer Meetings',
  'Crop Care',
  'Dealer Network',
  'Product Demos'
];

const getCategoryColor = (category) => {
  switch (category) {
    case 'Field Trials':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Farmer Meetings':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Crop Care':
      return 'bg-lime-100 text-lime-800 border-lime-200';
    case 'Dealer Network':
      return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'Product Demos':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
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
          ...data[key],
          category: data[key].category || 'Field Trials' // Fallback category
        }));
      }
      
      // Combine custom uploaded images first, followed by our optimized set
      const combinedList = [...firebaseList, ...preloadedImages];
      setGallery(combinedList);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Filter gallery items by selected category
  const filteredGallery = gallery.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  // Get currently visible items
  const visibleItems = filteredGallery.slice(0, visibleCount);

  // Load more handler
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 16);
  };

  // Reset pagination on category change
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(16);
    setActiveIndex(null);
    setIsPlaying(false);
  };

  // Lightbox navigation functions
  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredGallery.length - 1));
  }, [activeIndex, filteredGallery.length]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex(prev => (prev < filteredGallery.length - 1 ? prev + 1 : 0));
  }, [activeIndex, filteredGallery.length]);

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
  const activeItem = activeIndex !== null ? filteredGallery[activeIndex] : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <SEO 
        title="Gallery | Prinstan Agri Care" 
        description="Explore the gallery of Prinstan Agri Care Pvt Ltd, showcasing our field work, products, and direct impact on Indian agriculture."
      />
      
      {/* Page Header - Premium Logi Style */}
      <div className="bg-white py-32 px-4 relative overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h2 className="logi-label text-brand-green-600 mb-6 flex items-center gap-2">
              <FaImages className="text-sm" /> Visualizing Our Journey
            </h2>
            <h1 className="text-[10vw] sm:text-[8vw] md:text-[6vw] logi-heading text-brand-green-900 mb-8 leading-none">
              OUR<br />
              <span className="text-brand-green-500">GALLERY.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
              Explore frames of direct field research, product applications, dealer meetups, and local farmer training events across India since 2017.
            </p>
          </motion.div>
        </div>
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-green-50/50 to-transparent -z-10 rounded-l-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Filter Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3 text-brand-green-800 font-bold">
            <FaFilter className="text-sm opacity-80" />
            <span className="uppercase tracking-widest text-xs">Filter By Activity</span>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'text-white bg-brand-green-600 shadow-md shadow-brand-green-600/10' 
                      : 'text-gray-600 bg-white border border-gray-200 hover:text-brand-green-600 hover:border-brand-green-200 shadow-sm'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-brand-green-600 rounded-full -z-10"
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-600"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading gallery records...</p>
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -8 }}
                    onClick={() => {
                      setActiveIndex(idx);
                      setIsPlaying(false);
                    }}
                    className="group relative aspect-square rounded-logi overflow-hidden cursor-pointer shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(34,197,94,0.12)] bg-white border border-gray-100 transition-all duration-300"
                  >
                    {/* Image Element */}
                    <img 
                      src={item.thumbnailUrl || item.url} 
                      alt={item.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
                    />
                    
                    {/* Category Overlay Badge (Top Left) */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Gradient Info Overlay (Emerges on hover) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex justify-between items-end text-white">
                        <div className="max-w-[80%]">
                          <p className="font-bold text-base leading-tight tracking-wide mb-1 line-clamp-2">{item.title.split(' (')[0]}</p>
                          <span className="text-[10px] text-gray-300 font-semibold opacity-90">{item.id}</span>
                        </div>
                        <div className="bg-brand-green-500/80 p-3 rounded-full hover:bg-brand-green-500 transition-colors shadow-lg">
                          <FaExpandAlt className="text-white text-sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredGallery.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-logi border border-gray-150 p-20 text-center max-w-xl mx-auto shadow-sm"
              >
                <div className="bg-brand-green-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-green-600">
                  <FaFolderOpen size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Images Available</h3>
                <p className="text-gray-500 mb-6">There are currently no photos uploaded or configured under the "{activeCategory}" category.</p>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="bg-brand-green-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-brand-green-700 transition-colors"
                >
                  View All Images
                </button>
              </motion.div>
            )}

            {/* Load More Button */}
            {filteredGallery.length > visibleCount && (
              <div className="mt-16 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-gray-250 text-gray-800 font-bold hover:text-brand-green-600 hover:border-brand-green-500 hover:bg-brand-green-50/20 rounded-full transition-all duration-300 shadow-sm text-sm tracking-wide"
                >
                  <FaImages /> Load More Images ({filteredGallery.length - visibleCount} remaining)
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
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm mr-3 ${getCategoryColor(activeItem.category)}`}>
                  {activeItem.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {activeIndex + 1} of {filteredGallery.length}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Slideshow Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isPlaying 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
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
              className="absolute left-6 z-20 bg-white/10 hover:bg-brand-green-500 hover:scale-105 p-5 rounded-full text-white transition-all shadow-lg flex items-center justify-center md:flex hidden"
            >
              <FaChevronLeft size={20} />
            </button>

            {/* Main Visual Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full max-h-[75vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={activeItem.url} 
                alt={activeItem.title} 
                className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain border border-white/10" 
              />
            </motion.div>

            {/* Right Navigation Arrow */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
                setIsPlaying(false);
              }}
              className="absolute right-6 z-20 bg-white/10 hover:bg-brand-green-500 hover:scale-105 p-5 rounded-full text-white transition-all shadow-lg flex items-center justify-center md:flex hidden"
            >
              <FaChevronRight size={20} />
            </button>

            {/* Bottom Bar Info Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h2 className="text-xl md:text-2xl font-bold tracking-wide max-w-2xl mx-auto">{activeItem.title.split(' (')[0]}</h2>
              <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-semibold">{activeItem.id}</p>
              
              {/* Mobile swipe indicator & simple buttons */}
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
                <span className="text-xs text-gray-300">{activeIndex + 1} / {filteredGallery.length}</span>
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
