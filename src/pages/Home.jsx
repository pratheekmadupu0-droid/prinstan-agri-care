import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaLeaf, FaTractor, FaSeedling, FaShieldAlt, FaFlask, FaDna, FaChartLine, 
  FaTimes, FaChevronLeft, FaChevronRight, FaWhatsapp, FaAward, FaMapMarkerAlt, 
  FaCheckCircle, FaFileDownload, FaStar, FaHandshake, FaGlobe, FaArrowRight,
  FaQrcode, FaCheck, FaExclamationCircle, FaShoppingCart, FaBuilding, FaUserCheck, FaMap, FaCertificate
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';

// Smooth Animated Counter component using Framer Motion
const AnimatedCounter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 2.5, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, value]);

  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
};

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Custom Toast state
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // State Management
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [selectedFeaturedProduct, setSelectedFeaturedProduct] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // Interactive Order Preview State
  const [previewCaseQty, setPreviewCaseQty] = useState(5);
  const [previewSize, setPreviewSize] = useState("100ml");
  const [previewCalculatedUnits, setPreviewCalculatedUnits] = useState(250);

  // Stats Data
  const stats = [
    { number: 10, suffix: '+', label: 'Years of Experience' },
    { number: 50000, suffix: '+', label: 'Farmers Served' },
    { number: 100, suffix: '+', label: 'Products Available' },
    { number: 500, suffix: '+', label: 'Dealer Network' },
    { number: 15, suffix: '+', label: 'States Covered' },
  ];

  // Product Categories
  const categories = [
    {
      title: 'Crop Protection',
      desc: 'Highly efficient pesticides, insecticides, and weed control formulations engineered to secure plant immunity.',
      image: '/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0003.jpg',
      color: 'from-emerald-800 to-emerald-950',
      badge: 'Insecticides & Fungicides'
    },
    {
      title: 'Plant Nutrition',
      desc: 'Formulated crop vitalizers and trace minerals designed to stimulate physiological growth and soil flora.',
      image: '/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0008.jpg',
      color: 'from-green-800 to-green-950',
      badge: 'Micronutrient Blends'
    },
    {
      title: 'Bio Products',
      desc: 'Natural biological stimulants and organic plant activators which nurture the soil rhizosphere sustainably.',
      image: '/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0001.jpg',
      color: 'from-emerald-900 to-emerald-950',
      badge: 'Organic Certified'
    },
    {
      title: 'Growth Promoters',
      desc: 'Hormonal triggers and biological stimulators designed to increase flowering, cell division, and final crop biomass.',
      image: '/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0010.jpg',
      color: 'from-teal-800 to-teal-950',
      badge: 'Yield Enhancers'
    },
    {
      title: 'Specialty Products',
      desc: 'Highly tailored adjuvant sprays and target-specific correctors designed to address acute field issues.',
      image: '/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0015.jpg',
      color: 'from-green-900 to-green-950',
      badge: 'Adjuvant Formulations'
    }
  ];

  // Featured Products (with size and qty states)
  const [featuredProductStates, setFeaturedProductStates] = useState({
    1: { size: '100ml', qty: 1 },
    3: { size: '250ml', qty: 1 },
    8: { size: '500ml', qty: 1 }
  });

  const handleSizeChange = (prodId, size) => {
    setFeaturedProductStates(prev => ({
      ...prev,
      [prodId]: { ...prev[prodId], size }
    }));
  };

  const handleQtyChange = (prodId, val) => {
    setFeaturedProductStates(prev => {
      const current = prev[prodId]?.qty || 1;
      const updated = Math.max(1, current + val);
      return {
        ...prev,
        [prodId]: { ...prev[prodId], qty: updated }
      };
    });
  };

  const getPriceBySize = (size) => {
    if (size === '100ml') return 150;
    if (size === '250ml') return 350;
    if (size === '500ml') return 650;
    if (size === '1L') return 1200;
    return 150;
  };

  const handleAddToCartClick = (prod) => {
    const state = featuredProductStates[prod.id];
    const finalSize = state?.size || '250ml';
    const finalQty = state?.qty || 1;
    
    // Add to global CartContext
    addToCart(prod, finalSize, finalQty);
    showToast(`Added ${finalQty}x ${prod.name} (${finalSize}) to Cart!`);
  };

  const featuredProducts = [
    {
      id: 1,
      name: "Super Cobra",
      tagline: "Biological Yield Stimulant",
      category: "Bios",
      image: "/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0001.jpg",
      description: "Super Cobra is an elite organic growth booster containing high-efficacy biological triggers. It stimulates vegetative growth, prevents early flower drop, and boosts fruit size.",
      crop: "Cotton, Chillies, Maize, Vegetables",
      packing: "100ml | 250ml | 500ml | 1L"
    },
    {
      id: 3,
      name: "Hunter",
      tagline: "Broad Spectrum Protection",
      category: "Pesticides",
      image: "/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0003.jpg",
      description: "Hunter delivers instant knockdown control against armyworms, stem borers, and sucking pests. Formulated with advanced carriers to ensure high rain-fastness.",
      crop: "Paddy, Cotton, Chillies, Horticulture",
      packing: "100ml | 250ml | 500ml | 1L"
    },
    {
      id: 8,
      name: "Mantra",
      tagline: "Essential Soil Vitalizer",
      category: "Fertilizers",
      image: "/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0008.jpg",
      description: "Mantra is an premium crop vitalizer enriched with multi-micronutrients. It repairs root systems, boosts nutrient transport, and activates biological soil flora.",
      crop: "All Crops & Plantations",
      packing: "250ml | 500ml | 1L"
    }
  ];

  // Why Choose Prinstan Features
  const features = [
    {
      title: 'Scientific Formulations',
      desc: 'Engineered at molecular levels with premium stabilizers to ensure maximum effectiveness on targeting pests.',
      icon: <FaFlask className="text-3xl text-secondary" />
    },
    {
      title: 'Proven Results',
      desc: 'Extensively tested in multi-location field trials to ensure yield boosts under varying climate conditions.',
      icon: <FaChartLine className="text-3xl text-secondary" />
    },
    {
      title: 'Dealer Support',
      desc: 'Comprehensive supply assistance, priority logistics, and local agronomic training events.',
      icon: <FaHandshake className="text-3xl text-secondary" />
    },
    {
      title: 'Research Driven',
      desc: 'In-house R&D wing constantly iterating to develop biological alternatives with lower chemical traces.',
      icon: <FaDna className="text-3xl text-secondary" />
    },
    {
      title: 'Pan India Distribution',
      desc: 'A robust channel network of 500+ dealers ensures timely delivery of crop vitalizers.',
      icon: <FaGlobe className="text-3xl text-secondary" />
    },
    {
      title: 'Quality Assurance',
      desc: 'Adhering to strict compliance standards to ensure every batch exceeds standard efficacy.',
      icon: <FaAward className="text-3xl text-secondary" />
    }
  ];

  // Timeline process steps
  const timelineSteps = [
    { title: 'Laboratory Research', desc: 'Synthesizing novel bio-organic molecules and testing physical compatibility.', icon: <FaFlask /> },
    { title: 'Product Testing', desc: 'In-vitro screening of formulations against pests and pathogens.', icon: <FaAward /> },
    { title: 'Field Trials', desc: 'Rigorous multi-location testing across Indian farms to verify dosage rules.', icon: <FaTractor /> },
    { title: 'Farmer Feedback', desc: 'Collecting real-world efficacy reports and optimizing packaging sizes.', icon: <FaSeedling /> },
    { title: 'Product Launch', desc: 'Deploying commercial batches with regional dealer networks.', icon: <FaCheckCircle /> }
  ];

  // Success Stories (carousel)
  const successStories = [
    {
      farmerName: "Rajesh Kumar",
      location: "Warangal, Telangana",
      cropType: "Chilli & Cotton",
      results: "35% Yield Boost",
      testimonial: "Prinstan's Super Cobra and Hunter resolved severe leaf curl issues. Crop health improved dramatically, allowing me to secure premium prices at the local market.",
      image: "/farmers/1.jpeg",
      cropImage: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      farmerName: "Lauro Clark",
      location: "Guntur, Andhra Pradesh",
      cropType: "Red Chilli",
      results: "40% Yield Boost",
      testimonial: "Severe flower drop due to dry spells threatened my output. Feeding the field with Mantra vitalizers strengthened crop roots, securing my harvest completely.",
      image: "/farmers/4.jpeg",
      cropImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const handleNextStory = () => {
    setActiveStoryIndex(prev => (prev + 1) % successStories.length);
  };

  const handlePrevStory = () => {
    setActiveStoryIndex(prev => (prev - 1 + successStories.length) % successStories.length);
  };

  // Live Carton Calculator logic
  const calculatePreviewUnits = (cases, size) => {
    let multiplier = 10;
    if (size === "100ml") multiplier = 50;
    if (size === "250ml") multiplier = 40;
    if (size === "500ml") multiplier = 20;
    if (size === "1L") multiplier = 10;
    return cases * multiplier;
  };

  const handlePreviewCaseChange = (val) => {
    const updated = Math.max(1, previewCaseQty + val);
    setPreviewCaseQty(updated);
    setPreviewCalculatedUnits(calculatePreviewUnits(updated, previewSize));
  };

  const handlePreviewSizeChange = (size) => {
    setPreviewSize(size);
    setPreviewCalculatedUnits(calculatePreviewUnits(previewCaseQty, size));
  };

  return (
    <div className="bg-white min-h-screen text-dark relative overflow-hidden">
      <SEO 
        title="Prinstan Agricare | Premium Agritech Corporate Platform" 
        description="Premium crop protection, plant nutrition, and growth solutions trusted by dealers and farmers across India." 
        url="/" 
      />

      {/* Floating custom toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-8 right-8 bg-brand-green-950 text-white border border-emerald-500/25 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 font-bold text-xs"
          >
            <FaCheckCircle className="text-secondary text-lg" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 bg-brand-green-950 overflow-hidden">
        {/* Soft Background Drone Video backdrop */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-30"
          >
            <source src="/pac.mp4" type="video/mp4" />
          </video>
          {/* Savaxa styled radial overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950 via-brand-green-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-950 via-transparent to-brand-green-950/30" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green-500/10 border border-brand-green-500/30 text-brand-green-500 text-[10px] font-black uppercase tracking-widest">
              <FaLeaf /> Leading the Agritech Revolution
            </div>
            
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Empowering Agriculture <br />
              <span className="text-brand-green-500 bg-clip-text text-transparent bg-gradient-to-r from-brand-green-500 to-brand-green-600">
                Through Innovation
              </span>
            </h1>

            <p className="text-gray-300 text-sm md:text-lg max-w-2xl leading-relaxed font-semibold">
              Advanced crop protection, plant nutrition, and growth solutions trusted by farmers and regional distributors across India.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/products" 
                className="bg-primary hover:bg-brand-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/25 flex items-center gap-2 group cursor-pointer"
              >
                Explore Products <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/dealers" 
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                Become a Dealer
              </Link>
            </div>
          </motion.div>

          {/* Right Column Floating 3D Bottles */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative h-[380px] md:h-[480px] flex items-center justify-center"
          >
            {/* Super Cobra (Left Floating) */}
            <motion.div 
              animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-4 w-32 md:w-44 z-10 hover:scale-105 transition-transform duration-300 cursor-pointer"
              title="Super Cobra Growth Promoters"
            >
              <img src="/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0001.jpg" alt="Super Cobra" className="w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10" />
            </motion.div>

            {/* Hunter (Center Large Floating) */}
            <motion.div 
              animate={{ y: [15, -15, 15], rotate: [2, -2, 2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 md:w-56 z-20 hover:scale-105 transition-transform duration-300 cursor-pointer"
              title="Hunter Crop Protection"
            >
              <img src="/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0003.jpg" alt="Hunter" className="w-full object-contain drop-shadow-[0_35px_45px_rgba(0,0,0,0.6)] rounded-3xl border border-white/20" />
            </motion.div>

            {/* Mantra (Right Floating) */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [-1, 1, -1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-4 w-28 md:w-40 z-10 hover:scale-105 transition-transform duration-300 cursor-pointer"
              title="Mantra Plant Nutrition"
            >
              <img src="/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-0008.jpg" alt="Mantra" className="w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. COMPANY TRUST SECTION (Animated Counters) */}
      <section className="relative -mt-10 z-30 px-4">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-gray-150 rounded-[35px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {stats.map((stat, idx) => (
              <div key={idx} className={`space-y-2 ${idx > 0 && idx % 2 === 0 ? 'pt-6 md:pt-0' : ''}`}>
                <div className="text-3xl md:text-5xl font-black text-brand-green-900 tracking-tight flex items-center justify-center">
                  <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE PRINSTAN SECTION (Orbital Visual Interface) */}
      <section className="py-28 bg-[#020A05] text-white relative overflow-hidden">
        {/* Style block for orbiting animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes orbit-rot {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes orbit-counter-rot {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          .orbit-animate-ring {
            animation: orbit-rot 25s linear infinite;
          }
          .orbit-animate-node {
            animation: orbit-counter-rot 25s linear infinite;
          }
        `}} />

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left side text and details */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase italic text-white">
                  WHY CHOOSE <span className="text-brand-green-500 bg-clip-text text-transparent bg-gradient-to-r from-brand-green-400 to-brand-green-600">PRINSTAN?</span>
                </h2>
                <div className="h-1 w-20 bg-brand-green-500 rounded-full mt-3 mb-6" />
                <p className="text-gray-300 text-sm md:text-base leading-relaxed font-semibold">
                  We bridge the gap between advanced scientific research and practical farming. Our formulations undergo rigorous trials to ensure they deliver maximum efficacy while preserving soil health.
                </p>
              </div>

              {/* Grid of four benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Scientifically Formulated', icon: <FaFlask className="text-brand-green-400" />, desc: 'Engineered at molecular levels with premium stabilizers.' },
                  { title: 'Eco-Safe Profile', icon: <FaLeaf className="text-emerald-400" />, desc: 'Formulated to preserve vital soil flora and ecology.' },
                  { title: 'Affordable Pricing', icon: <FaAward className="text-blue-400" />, desc: 'Premium molecules delivered at competitive rates.' },
                  { title: 'Expert Support', icon: <FaHandshake className="text-cyan-400" />, desc: 'Comprehensive field training and customer coordinates.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:border-brand-green-500/35 transition-all">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side interactive Orbiting visual */}
            <div className="lg:col-span-5 flex items-center justify-center h-[420px] relative">
              {/* Outer Orbit Path ring */}
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full border border-white/10 relative flex items-center justify-center">
                
                {/* Rotating Container */}
                <div className="absolute inset-0 orbit-animate-ring rounded-full">
                  
                  {/* Orbiting Node 1: Top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-gray-150 rounded-full flex items-center justify-center shadow-xl orbit-animate-node cursor-pointer group" title="Scientific Trials">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-primary text-base group-hover:scale-110 transition-transform">
                      <FaFlask className="text-[#0F6B3A]" />
                    </div>
                  </div>

                  {/* Orbiting Node 2: Right */}
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-gray-150 rounded-full flex items-center justify-center shadow-xl orbit-animate-node cursor-pointer group" title="Eco Protection">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-primary text-base group-hover:scale-110 transition-transform">
                      <FaLeaf className="text-emerald-500" />
                    </div>
                  </div>

                  {/* Orbiting Node 3: Bottom */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 bg-white border border-gray-150 rounded-full flex items-center justify-center shadow-xl orbit-animate-node cursor-pointer group" title="Pan India">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-primary text-base group-hover:scale-110 transition-transform">
                      <FaGlobe className="text-blue-500" />
                    </div>
                  </div>

                  {/* Orbiting Node 4: Left */}
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-gray-150 rounded-full flex items-center justify-center shadow-xl orbit-animate-node cursor-pointer group" title="Partnership">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-primary text-base group-hover:scale-110 transition-transform">
                      <FaHandshake className="text-cyan-500" />
                    </div>
                  </div>

                </div>

                {/* Central Brand Ring */}
                <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-full p-2.5 flex items-center justify-center shadow-2xl relative z-10 border border-emerald-500/25">
                  <img src="/logo.png" alt="Prinstan logo" className="w-full h-full object-contain" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCIENTIFIC PRODUCT CATALOG */}
      <section className="py-28 bg-[#030E08] text-white relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase leading-none text-white italic">
              SCIENTIFIC PRODUCT CATALOG
            </h2>
            <div className="h-1 w-24 bg-[#0F6B3A] mx-auto rounded-full mt-4 mb-6" />
            <p className="text-gray-400 text-sm md:text-base font-semibold">
              Explore our highly targeted protective systems designed to safeguard cash crop networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Insecticides */}
            <div className="bg-[#05160E] border border-emerald-500/15 hover:border-emerald-500/30 rounded-[32px] p-8 flex flex-col items-center text-center justify-between group hover:-translate-y-2 transition-all duration-300 shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-950/50 rounded-2xl flex items-center justify-center text-primary text-2xl border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <FaShieldAlt className="text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4 italic">Insecticides</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                  High-efficacy targeting against chewing and sucking crop pests.
                </p>
              </div>
              <Link 
                to="/products?category=Pesticides" 
                className="text-cyan-400 font-extrabold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                VIEW PRODUCTS <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            {/* Herbicides */}
            <div className="bg-[#05160E] border border-emerald-500/15 hover:border-emerald-500/30 rounded-[32px] p-8 flex flex-col items-center text-center justify-between group hover:-translate-y-2 transition-all duration-300 shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-950/50 rounded-2xl flex items-center justify-center text-primary text-2xl border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <FaLeaf className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4 italic">Herbicides</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                  Selective weed blockades tailored for rich crop yields.
                </p>
              </div>
              <Link 
                to="/products?category=Fertilizers" 
                className="text-emerald-400 font-extrabold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                VIEW PRODUCTS <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            {/* Fungicides */}
            <div className="bg-[#05160E] border border-emerald-500/15 hover:border-emerald-500/30 rounded-[32px] p-8 flex flex-col items-center text-center justify-between group hover:-translate-y-2 transition-all duration-300 shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-950/50 rounded-2xl flex items-center justify-center text-primary text-2xl border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <FaAward className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4 italic">Fungicides</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                  Advanced defense systems preventing severe fungal spreads.
                </p>
              </div>
              <Link 
                to="/products?category=Pesticides" 
                className="text-blue-400 font-extrabold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                VIEW PRODUCTS <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RESEARCH & INNOVATION SECTION */}
      <section id="research" className="py-28 bg-[#031309] text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-brand-green-400 text-[10px] font-black uppercase tracking-widest block mb-2">Scientific Pipeline</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-none">
              Research & Innovation Process
            </h2>
            <div className="h-1.5 w-16 bg-brand-green-500 mx-auto rounded-full mt-4 mb-6" />
            <p className="text-emerald-100/70 text-sm">
              From organic synthesis to field testing and regional deployment - our rigorous scientific flow ensures batch efficacy.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative mt-12">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
            
            <div className="space-y-12">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row gap-6 md:gap-0 items-center relative ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Badge center */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-primary border-4 border-[#031309] rounded-full flex items-center justify-center text-white text-xs shadow-md hidden md:flex">
                    {idx + 1}
                  </div>

                  <div className="w-full md:w-1/2 px-0 md:px-12">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] shadow-xl space-y-3 hover:border-brand-green-500/30 transition-all">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-green-400 text-lg">
                        {step.icon}
                      </div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed font-semibold">{step.desc}</p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FARMER SUCCESS STORIES */}
      <section className="py-28 bg-[#020A05] text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-brand-green-400 text-[10px] font-black uppercase tracking-widest block mb-2">Voice of the Fields</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-none">
              Farmer Success Stories
            </h2>
            <div className="h-1.5 w-16 bg-brand-green-500 mx-auto rounded-full mt-4 mb-6" />
          </div>

          <div className="relative max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[35px] shadow-2xl p-6 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Farmer Info */}
              <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-md">
                  <img src={successStories[activeStoryIndex].image} alt="Farmer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">
                    {successStories[activeStoryIndex].farmerName}
                  </h4>
                  <span className="text-xs font-bold text-emerald-100/60 uppercase tracking-wider">
                    {successStories[activeStoryIndex].location}
                  </span>
                </div>
                <div className="bg-white/10 text-brand-green-400 border border-brand-green-500/35 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {successStories[activeStoryIndex].cropType}
                </div>
              </div>

              {/* Story Description */}
              <div className="md:col-span-7 space-y-4">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md inline-block">
                  {successStories[activeStoryIndex].results}
                </span>
                <p className="text-gray-200 text-sm md:text-base italic leading-relaxed font-medium">
                  "{successStories[activeStoryIndex].testimonial}"
                </p>
                <div className="h-0.5 bg-white/10 my-4" />
                
                {/* Crop preview */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                    <img src={successStories[activeStoryIndex].cropImage} alt="Crop" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Harvest Quality</span>
                    <span className="text-xs font-black text-white uppercase">Premium Grade Yield</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider triggers */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
              <button 
                onClick={handlePrevStory}
                className="w-10 h-10 border border-white/15 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FaChevronLeft />
              </button>
              <span className="text-xs font-black text-gray-400">
                0{activeStoryIndex + 1} / 0{successStories.length}
              </span>
              <button 
                onClick={handleNextStory}
                className="w-10 h-10 border border-white/15 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
