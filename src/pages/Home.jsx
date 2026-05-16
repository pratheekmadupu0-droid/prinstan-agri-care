import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaTractor, FaSeedling, FaWater, FaTimes } from 'react-icons/fa';

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
      className="bg-white"
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
          <source src="/intro.mp4" type="video/mp4" />
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
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.2 }}
                className="bg-brand-green-50 p-12 rounded-logi relative group border border-brand-green-100 shadow-xl"
              >
                <div className="text-brand-green-200 text-9xl absolute -top-4 -right-4 opacity-50 group-hover:rotate-12 transition-transform font-serif leading-none">"</div>
                <p className="text-gray-600 text-xl leading-relaxed mb-10 relative z-10 font-medium">
                  {t('home.t1')}
                </p>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-full overflow-hidden border-2 border-brand-green-500 shadow-lg">
                    <img src={`https://i.pravatar.cc/150?img=${item * 10}`} alt="Prinstan Agri Care satisfied farmer in India" />
                  </div>
                  <div>
                    <h5 className="text-xl font-black text-brand-green-900 uppercase tracking-tight">Rangayaa</h5>
                    <p className="logi-label text-brand-green-600">Farmer, Punjab</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
