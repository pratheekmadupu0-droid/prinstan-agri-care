import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaTractor, FaSeedling, FaWater, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import organicImg from '../assets/services/organic.png';
import smartImg from '../assets/services/smart.png';
import cropImg from '../assets/services/crop.png';
import irrigationImg from '../assets/services/irrigation.png';
import SEO from '../components/SEO';

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const Home = () => {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState(null);

  const scrollContainerRef = useRef(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const farmerStories = [
    {
      id: 1,
      image: "/farmers/1.jpeg",
      name: "Lauro Clark",
      role: "Agronomist",
    },
    {
      id: 2,
      image: "/farmers/2.jpeg",
      name: "Devid Rian",
      role: "Soil Conservationist",
    },
    {
      id: 3,
      image: "/farmers/3.jpeg",
      name: "Sohel Tanvir",
      role: "Senior Farmer",
    },
    {
      id: 4,
      image: "/farmers/4.jpeg",
      name: "Rajesh Kumar",
      role: "Organic Farmer",
    },
    {
      id: 5,
      image: "/farmers/5.jpeg",
      name: "Venkat Rao",
      role: "Crop Consultant",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 300;
          scrollContainerRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.children[0]?.clientWidth || 300;
    const index = Math.round(scrollLeft / (cardWidth + 24));
    setActiveStoryIndex(Math.min(index, farmerStories.length - 1));
  };

  const scrollToStory = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 300;
      scrollContainerRef.current.scrollTo({ left: index * (cardWidth + 24), behavior: 'smooth' });
    }
  };
  const stats = [
    { number: '10+', label: t('home.stats.exp') },
    { number: '10k+', label: t('home.stats.farmers') },
    { number: '5k+', label: t('home.stats.products') },
    { number: '150+', label: t('home.stats.projects') },
  ];

  const services = [
    { 
      icon: <FaLeaf />, 
      title: t('home.services.s1Title'), 
      desc: t('home.services.s1Desc'), 
      detail: t('home.services.s1Detail'),
      image: organicImg 
    },
    { 
      icon: <FaTractor />, 
      title: t('home.services.s2Title'), 
      desc: t('home.services.s2Desc'), 
      detail: t('home.services.s2Detail'),
      image: smartImg 
    },
    { 
      icon: <FaSeedling />, 
      title: t('home.services.s3Title'), 
      desc: t('home.services.s3Desc'), 
      detail: t('home.services.s3Detail'),
      image: cropImg 
    },
    { 
      icon: <FaWater />, 
      title: t('home.services.s4Title'), 
      desc: t('home.services.s4Desc'), 
      detail: t('home.services.s4Detail'),
      image: irrigationImg 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white -mt-20"
    >
      <SEO 
        title="Prinstan Agri Care Pvt Ltd | Agricultural Solutions & Crop Care in India"
        description="Prinstan Agri Care Pvt Ltd provides premium agricultural products, crop care solutions, fertilizers, farming support, and agri innovations across India."
        keywords="Prinstan, Prinstan Agri Care, Prinstan Agri Care Pvt Ltd, agriculture company India, fertilizers, crop care, agri products, farming innovation"
        url="/"
      />
      {/* Clean Intro Video Section */}
      <section className="relative w-full h-[60vh] md:h-screen overflow-hidden bg-black">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/pac.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Ticker / Marquee */}
      <div className="bg-brand-green-900 text-white py-2 overflow-hidden whitespace-nowrap relative z-[60]">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center text-xs font-bold uppercase tracking-[0.3em]"
        >
          <span>• INNOVATING INDIAN AGRICULTURE</span>
          <span>• PREMIUM CROP PROTECTION</span>
          <span>• SUSTAINABLE FARMING SOLUTIONS</span>
          <span>• 25+ YEARS OF EXCELLENCE</span>
          <span>• EMPOWERING 10k+ FARMERS</span>
          {/* Duplicate for seamless loop */}
          <span>• INNOVATING INDIAN AGRICULTURE</span>
          <span>• PREMIUM CROP PROTECTION</span>
          <span>• SUSTAINABLE FARMING SOLUTIONS</span>
          <span>• 25+ YEARS OF EXCELLENCE</span>
          <span>• EMPOWERING 10k+ FARMERS</span>
        </motion.div>
      </div>

      {/* Hero Section - Logi Style */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden bg-white">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="logi-label text-brand-green-600 mb-6">Pioneering Sustainable Agriculture</h2>
              <h1 className="text-[12vw] lg:text-[10vw] logi-heading text-brand-green-900 mb-8">
                PRINSTAN<br />
                <span className="text-brand-green-500">AGRI CARE PVT. LTD.</span>
              </h1>
              <div className="max-w-xl">
                <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                  {t('home.heroDesc')}
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link to="/products" className="bg-brand-green-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-brand-green-800 transition-all transform hover:scale-105 shadow-xl">
                    {t('home.explore')}
                  </Link>
                  <Link to="/contact" className="border-2 border-brand-green-900 text-brand-green-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-brand-green-50 transition-all transform hover:scale-105">
                    {t('home.contactUs')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-4 relative h-[500px] lg:h-[700px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full h-full rounded-logi overflow-hidden shadow-2xl relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Farming Background" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-green-900/10 mix-blend-multiply"></div>
            </motion.div>
            
            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-white p-8 rounded-logi shadow-2xl z-20 hidden md:block border border-gray-100"
            >
              <div className="text-4xl font-black text-brand-green-600 mb-1">25+</div>
              <div className="logi-label text-gray-500">Years of Experience</div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-green-50/50 -z-10 rounded-l-[100px]"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 bg-brand-green-50 p-12 rounded-logi border border-brand-green-100 shadow-inner"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeIn} className="text-center">
                <h3 className="text-5xl md:text-6xl font-black text-brand-green-900 mb-2">{stat.number}</h3>
                <p className="logi-label text-brand-green-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-left mb-20"
          >
            <h2 className="logi-label text-brand-green-600 mb-4">{t('home.expertise')}</h2>
            <h3 className="text-6xl md:text-8xl logi-heading text-brand-green-900">{t('home.premiumServices')}</h3>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -20 }}
                onClick={() => setSelectedService(service)}
                className="bg-white rounded-logi overflow-hidden shadow-2xl border border-gray-100 hover:border-brand-green-200 transition-all group flex flex-col cursor-pointer"
              >
                <div className="h-72 w-full overflow-hidden relative">
                   <img src={service.image} alt={`Prinstan Agri Care ${service.title} - Agricultural solutions and farming innovation`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-brand-green-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
                   <div className="absolute top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl text-brand-green-600 shadow-2xl transform group-hover:rotate-12 transition-transform">
                      {service.icon}
                   </div>
                </div>
                <div className="p-10 flex-grow bg-white">
                  <div className="logi-label text-brand-green-500 mb-4">Service {index + 1}</div>
                  <h4 className="text-3xl font-black text-brand-green-900 uppercase tracking-tight mb-4">{service.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">{service.desc}</p>
                  <button className="text-brand-green-900 font-black uppercase tracking-widest text-xs flex items-center gap-3 group-hover:gap-5 transition-all">
                    Explore Details <span className="text-xl">→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {selectedService && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedService(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white rounded-logi overflow-hidden max-w-4xl w-full shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white md:text-gray-900 transition-colors"
                  >
                    <FaTimes size={24} />
                  </button>

                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 h-80 md:h-auto relative">
                      <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-brand-green-900/20 mix-blend-multiply"></div>
                    </div>
                    
                    <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                      <div className="logi-label text-brand-green-600 mb-4">Service Details</div>
                      <h3 className="text-4xl font-black text-brand-green-900 uppercase tracking-tight mb-6">{selectedService.title}</h3>
                      <div className="w-16 h-2 bg-brand-green-500 mb-8 rounded-full"></div>
                      
                      <p className="text-gray-600 leading-relaxed text-xl mb-10">
                        {selectedService.detail}
                      </p>
                      
                      <button 
                        onClick={() => setSelectedService(null)}
                        className="bg-brand-green-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-brand-green-800 transition-all self-start shadow-xl shadow-brand-green-900/20"
                      >
                        Close Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-left mb-20"
          >
            <h2 className="logi-label text-brand-green-600 mb-4">{t('home.testimonials')}</h2>
            <h3 className="text-6xl md:text-8xl logi-heading text-brand-green-900">{t('home.whatFarmersSay')}</h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                name: 'Rangaya', 
                place: 'Surya pet',
                review: "The quality of Bio-fertilizers from Prinstan has significantly improved my cotton yield. Their technical support team guided me throughout the season, ensuring optimal crop health."
              },
              { 
                name: 'Yadayya', 
                place: 'Domalaguda',
                review: "Switching to Prinstan's organic solutions was the best decision for my farm. I've seen a noticeable reduction in pest attacks and a substantial increase in the quality of my chili harvest."
              },
              { 
                name: 'Pullayaa', 
                place: 'Kariminagar',
                review: "Prinstan Agri Care provides more than just products; they provide real solutions. Their commitment to sustainable farming has helped me reduce chemical usage while maintaining high productivity."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-12 rounded-[40px] relative group border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(34,197,94,0.15)] transition-all duration-700 flex flex-col h-full"
              >
                <div className="absolute top-8 right-10 text-brand-green-100 text-8xl opacity-30 font-serif leading-none group-hover:text-brand-green-200 transition-colors">"</div>
                
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>

                <p className="text-gray-700 text-xl leading-relaxed mb-10 relative z-10 font-medium italic flex-grow">
                  "{item.review}"
                </p>

                <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <h5 className="text-xl font-black text-brand-green-900 uppercase tracking-tight">{item.name}</h5>
                    <p className="text-xs font-black text-brand-green-600 uppercase tracking-widest mt-1">{item.place}</p>
                  </div>
                  <div className="bg-brand-green-50 text-brand-green-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter border border-brand-green-100">
                    Verified Farmer
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Stories from Farmers Carousel */}
      <section className="py-24 bg-[#F5F7F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-[#78A84B]"></div>
            <h2 className="text-[#78A84B] font-bold tracking-widest uppercase text-sm">REAL STORIES FROM FARMERS</h2>
            <div className="h-px w-16 bg-[#78A84B]"></div>
          </div>
          <h3 className="text-5xl md:text-6xl font-black text-[#1A2639] mb-4 tracking-tight">Real Stories from Farmers</h3>
          <p className="text-[#78A84B] font-bold mb-2">Trusted By Farmers Across Telangana</p>
          <p className="text-gray-500 max-w-3xl mx-auto text-sm md:text-base">
            Farmers Across Telangana Share Their Real Stories Of Success Using Prinstan Crop Care Solutions To Achieve Healthier, Higher-Yielding Crops.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 relative group">
          <button 
            onClick={() => scrollToStory(Math.max(0, activeStoryIndex - 1))}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#78A84B] hover:bg-[#78A84B] hover:text-white transition-colors"
          >
            <FaChevronLeft size={20} />
          </button>
          
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {farmerStories.map((story) => (
              <div 
                key={story.id} 
                className="min-w-[85vw] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="w-full aspect-square md:h-72 rounded-[24px] overflow-hidden mb-6 bg-gray-100">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-2xl font-black text-[#1A2639] mb-1">{story.name}</h4>
                <p className="text-gray-500 text-sm font-medium mb-6">{story.role}</p>
                <button className="bg-[#78A84B] hover:bg-[#65913D] text-white px-8 py-3.5 rounded-2xl font-bold transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                  View Story <FaChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scrollToStory(Math.min(farmerStories.length - 1, activeStoryIndex + 1))}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#78A84B] hover:bg-[#78A84B] hover:text-white transition-colors"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {farmerStories.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToStory(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${activeStoryIndex === index ? 'w-8 bg-[#78A84B]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
      </section>
    </motion.div>
  );
};

export default Home;
