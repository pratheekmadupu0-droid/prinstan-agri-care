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
    { number: '25+', label: t('home.stats.exp') },
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

      {/* Hero Section with Text and Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Farming Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Welcome to Prinstan Agri Care Pvt Ltd
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl mb-6 text-gray-200"
          >
            {t('home.heroDesc')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block text-sm text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            Empowering Indian agriculture support with advanced agricultural solutions, superior crop protection, premium fertilizers, and cutting-edge farming innovation.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/products" className="bg-brand-green-600 hover:bg-brand-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-brand-green-500/50">
              {t('home.explore')}
            </Link>
            <Link to="/contact" className="bg-white hover:bg-gray-100 text-brand-green-800 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg">
              {t('home.contactUs')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-brand-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeIn} className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-brand-green-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600 font-medium text-lg">{stat.label}</p>
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
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-brand-green-600 tracking-widest uppercase mb-2">{t('home.expertise')}</h2>
            <h3 className="text-4xl font-bold text-gray-900">{t('home.premiumServices')}</h3>
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
                whileHover={{ y: -10 }}
                onClick={() => setSelectedService(service)}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:border-brand-green-200 transition-all group flex flex-col cursor-pointer"
              >
                <div className="h-56 w-full overflow-hidden relative">
                   <img src={service.image} alt={`Prinstan Agri Care ${service.title} - Agricultural solutions and farming innovation`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute bottom-4 left-4 w-12 h-12 bg-brand-green-500 rounded-full flex items-center justify-center text-2xl text-white shadow-lg">
                      {service.icon}
                   </div>
                </div>
                <div className="p-8 flex-grow">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                  <button className="mt-6 text-brand-green-600 font-semibold group-hover:text-brand-green-700 flex items-center gap-2">
                    Learn More <span className="transition-transform group-hover:translate-x-1">→</span>
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
                  className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white md:text-gray-800 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>

                  <div className="h-64 w-full relative">
                    <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-brand-green-500 rounded-full flex items-center justify-center text-2xl text-white">
                          {selectedService.icon}
                        </div>
                        <h3 className="text-3xl font-bold text-white">{selectedService.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-lg text-brand-green-600 font-semibold mb-4">{selectedService.desc}</p>
                    <div className="h-px bg-gray-100 mb-6"></div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedService.detail}
                    </p>
                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={() => setSelectedService(null)}
                        className="bg-brand-green-600 hover:bg-brand-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
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
      <section className="py-24 bg-brand-brown-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-brand-green-500 tracking-widest uppercase mb-2">{t('home.testimonials')}</h2>
            <h3 className="text-4xl font-bold">{t('home.whatFarmersSay')}</h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.2 }}
                className="bg-brand-brown-800 p-8 rounded-2xl relative"
              >
                <div className="text-brand-green-500 text-4xl absolute top-4 right-6 opacity-30">"</div>
                <p className="text-gray-300 italic mb-6 relative z-10">
                  {t('home.t1')}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-500 rounded-full overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?img=${item * 10}`} alt="Prinstan Agri Care satisfied farmer in India" />
                  </div>
                  <div>
                    <h5 className="font-bold">Rangayaa</h5>
                    <p className="text-sm text-brand-green-400">Farm Owner, Punjab, India</p>
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
