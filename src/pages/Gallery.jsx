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
  FaArrowDown,
  FaCalendarAlt,
  FaGlobe,
  FaCamera
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
  const [progress, setProgress] = useState(0);
  const slideshowTimer = useRef(null);
  const progressTimer = useRef(null);

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
      
      // Combine custom uploaded images first, followed by our optimized set, filtering out duplicates
      const firebaseUrls = new Set(firebaseList.map(item => item.url));
      const uniquePreloaded = preloadedImages.filter(item => !firebaseUrls.has(item.url));
      const combinedList = [...firebaseList, ...uniquePreloaded];
      
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
    setProgress(0);
  }, [activeIndex, gallery.length]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex(prev => (prev < gallery.length - 1 ? prev + 1 : 0));
    setProgress(0);
  }, [activeIndex, gallery.length]);

  // Slideshow effect
  useEffect(() => {
    if (isPlaying && activeIndex !== null) {
      // 3-second interval for slide changes
      slideshowTimer.current = setInterval(() => {
        handleNext();
      }, 3000);

      // Smooth progress bar update (every 30ms)
      const startTime = Date.now();
      progressTimer.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / 3000) * 100, 100);
        setProgress(percentage);
      }, 30);
    } else {
      if (slideshowTimer.current) clearInterval(slideshowTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
      setProgress(0);
    }
    
    return () => {
      if (slideshowTimer.current) clearInterval(slideshowTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [isPlaying, activeIndex, handleNext]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
        setIsPlaying(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
        setIsPlaying(false);
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
    <div className="bg-[#fcfdfc] min-h-screen pb-36 overflow-hidden">
      <SEO 
        title="Field Exhibition | Prinstan Agri Care" 
        description="Experience the visual archives of Prinstan Agri Care Pvt Ltd. An immersive exhibition showcasing agricultural field records across India."
      />
      
      {/* Cinematic Hero Exhibition Canvas */}
      <div className="relative bg-gradient-to-br from-[#081e13] via-[#0d2a1c] to-[#040e09] py-36 px-4 md:px-8 text-white overflow-hidden border-b border-[#143d28]">
        {/* Abstract Floating Ambient Particles & Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-brand-green-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute -bottom-10 right-10 w-[400px] h-[400px] bg-brand-green-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green-950/80 border border-brand-green-500/30 text-brand-green-400 font-semibold uppercase tracking-[0.25em] text-[10px] mb-8 shadow-inner">
              <FaCamera className="text-xs animate-pulse" /> Digital Field Exhibition
            </div>
            
            <h1 className="text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6.5vw] font-black uppercase tracking-tighter leading-[0.85] text-white mb-10 select-none">
              FIELD<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-400 via-emerald-300 to-teal-400 font-extrabold">EXHIBITION.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-emerald-100/70 max-w-2xl leading-relaxed font-light mb-16">
              Step into an authentic visual documentation of crops, soils, and farming environments. An unaltered photographic index preserved directly from rural Indian farmlands.
            </p>

            {/* Dynamic Exhibition Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-emerald-950/60 max-w-5xl">
              <div className="border-r border-emerald-900/40 pr-4">
                <span className="block text-[10px] uppercase tracking-widest text-brand-green-500 font-bold mb-1">Catalogued records</span>
                <span className="text-3xl font-extrabold tracking-tight text-white">{gallery.length} Captures</span>
              </div>
              <div className="border-r border-emerald-900/40 pr-4">
                <span className="block text-[10px] uppercase tracking-widest text-brand-green-500 font-bold mb-1">Resolution Standards</span>
                <span className="text-3xl font-extrabold tracking-tight text-white">Full-Scale</span>
              </div>
              <div className="border-r border-emerald-900/40 pr-4">
                <span className="block text-[10px] uppercase tracking-widest text-brand-green-500 font-bold mb-1">Established Chronology</span>
                <span className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <FaCalendarAlt className="text-sm text-brand-green-400" /> Since 2017
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-brand-green-500 font-bold mb-1">Regional Scope</span>
                <span className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <FaGlobe className="text-sm text-brand-green-400" /> Pan-India
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        
        {/* Loading Indicator */}
        {loading ? (
          <div className="py-44 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-green-600"></div>
              <div className="absolute inset-0 h-16 w-16 bg-brand-green-500/10 rounded-full blur-md"></div>
            </div>
            <p className="text-gray-400 text-sm tracking-widest font-semibold uppercase animate-pulse mt-4">Streaming High-Fidelity Archives...</p>
          </div>
        ) : (
          <>
            {/* Immersive Asymmetric Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8 [column-fill:_auto]">
              {visibleItems.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPlaying(false);
                  }}
                  className="group relative break-inside-avoid w-full bg-white rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(34,197,94,0.18)] border border-gray-150/70 p-2 md:p-3 hover:border-brand-green-500/20 transition-all duration-500 ease-out"
                >
                  {/* Aspect Ratio Preserver & Image */}
                  <div className="rounded-[1.5rem] overflow-hidden relative bg-gray-50 border border-gray-100">
                    <img 
                      src={item.thumbnailUrl || item.url} 
                      alt={item.id} 
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                    />
                    
                    {/* Glowing border highlight */}
                    <div className="absolute inset-0 border border-white/20 rounded-[1.5rem] pointer-events-none"></div>
                  </div>
                  
                  {/* Subtle Glassmorphic Archive Label Bottom */}
                  <div className="mt-4 px-3 pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-brand-green-600 block mb-0.5">Capture Record</span>
                      <h3 className="font-extrabold text-sm text-gray-900 tracking-wide">{item.id}</h3>
                    </div>
                    <div className="h-9 w-9 bg-brand-green-50 text-brand-green-600 group-hover:bg-brand-green-600 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-brand-green-100/50">
                      <FaExpandAlt size={11} className="transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium Load More Button */}
            {gallery.length > visibleCount && (
              <div className="mt-24 text-center">
                <button
                  onClick={handleLoadMore}
                  className="relative group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-brand-green-900 to-[#0d2a1c] text-white font-extrabold hover:from-brand-green-800 hover:to-[#143d28] rounded-full transition-all duration-300 shadow-xl shadow-brand-green-950/20 text-xs tracking-[0.25em] uppercase border border-brand-green-600/30 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  <FaArrowDown className="text-sm text-brand-green-400 group-hover:translate-y-1 transition-transform duration-300" /> Explore More Archives ({gallery.length - visibleCount} Remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Immersive Dark Room Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-8 bg-black/98 backdrop-blur-2xl"
            onClick={() => {
              setActiveIndex(null);
              setIsPlaying(false);
            }}
          >
            {/* Custom Glowing Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            {/* Top Bar Details */}
            <div className="w-full flex items-center justify-between text-white z-25 py-4 px-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.3em] uppercase font-black text-brand-green-400">
                  Prinstan Field Archives
                </span>
                <span className="text-white/20">|</span>
                <span className="text-xs text-gray-400 font-bold tracking-wider">
                  {activeIndex + 1} OF {gallery.length}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Slideshow Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isPlaying 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isPlaying ? <FaPause size={8} className="animate-pulse" /> : <FaPlay size={8} />}
                  {isPlaying ? 'Pause Show' : 'Autoplay'}
                </button>

                {/* Close Button */}
                <button 
                  onClick={() => {
                    setActiveIndex(null);
                    setIsPlaying(false);
                  }}
                  className="bg-white/10 hover:bg-red-500 hover:text-white p-3 rounded-full text-white transition-all shadow-md"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Immersive Center Core */}
            <div className="flex-1 flex items-center justify-center relative my-8">
              
              {/* Left Navigation Arrow */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                  setIsPlaying(false);
                }}
                className="absolute left-0 z-20 bg-white/5 hover:bg-brand-green-500 hover:scale-105 p-6 rounded-full text-white transition-all border border-white/5 shadow-2xl flex items-center justify-center md:flex hidden"
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Main Visual Display Frame */}
              <motion.div 
                key={activeIndex}
                initial={{ scale: 0.96, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: -10 }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="relative max-w-4xl w-full h-full flex items-center justify-center p-2"
                onClick={e => e.stopPropagation()}
              >
                <img 
                  src={activeItem.url} 
                  alt={activeItem.id} 
                  className="max-w-full max-h-[60vh] rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(34,197,94,0.15)] object-contain border-4 border-white/10" 
                />

                {/* Progress bar overlay during autoplay */}
                {isPlaying && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-brand-green-400 to-teal-400"
                      style={{ width: `${progress}%` }}
                    ></motion.div>
                  </div>
                )}
              </motion.div>

              {/* Right Navigation Arrow */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                  setIsPlaying(false);
                }}
                className="absolute right-0 z-20 bg-white/5 hover:bg-brand-green-500 hover:scale-105 p-6 rounded-full text-white transition-all border border-white/5 shadow-2xl flex items-center justify-center md:flex hidden"
              >
                <FaChevronRight size={20} />
              </button>
            </div>

            {/* Bottom Immersive Filmstrip & Details Bar */}
            <div 
              className="w-full flex flex-col items-center gap-6 z-20 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md"
              onClick={e => e.stopPropagation()}
            >
              {/* Image metadata */}
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-brand-green-400">Capture Core Reference</span>
                <h2 className="text-white text-xl font-black mt-1 tracking-wider">{activeItem.id}</h2>
              </div>

              {/* Interactive Horizontal Filmstrip Carousel */}
              <div className="w-full max-w-3xl overflow-x-auto py-2 px-4 scrollbar-thin scrollbar-thumb-white/10 flex justify-center gap-3">
                {gallery.map((thumb, tIdx) => {
                  const isCurrent = tIdx === activeIndex;
                  // Show current and 4 items before/after to avoid huge DOM rendering in filmstrip
                  if (Math.abs(tIdx - activeIndex) > 5) return null;
                  
                  return (
                    <button
                      key={thumb.id || tIdx}
                      onClick={() => {
                        setActiveIndex(tIdx);
                        setIsPlaying(false);
                      }}
                      className={`h-12 w-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${
                        isCurrent 
                          ? 'border-brand-green-400 scale-110 shadow-lg shadow-brand-green-400/20' 
                          : 'border-white/10 hover:border-white/40 opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={thumb.thumbnailUrl || thumb.url} className="w-full h-full object-cover" alt="" />
                    </button>
                  );
                })}
              </div>

              {/* Mobile control actions */}
              <div className="flex md:hidden justify-center items-center gap-6 w-full text-white border-t border-white/5 pt-4">
                <button 
                  onClick={() => { handlePrev(); setIsPlaying(false); }}
                  className="bg-white/5 hover:bg-white/10 p-3.5 rounded-full border border-white/5"
                >
                  <FaChevronLeft size={14} />
                </button>
                <span className="text-xs font-bold tracking-widest">{activeIndex + 1} / {gallery.length}</span>
                <button 
                  onClick={() => { handleNext(); setIsPlaying(false); }}
                  className="bg-white/5 hover:bg-white/10 p-3.5 rounded-full border border-white/5"
                >
                  <FaChevronRight size={14} />
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
