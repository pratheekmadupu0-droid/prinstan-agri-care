import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaBullseye, FaHandshake, FaLeaf, FaGlobe, FaTimes, FaLinkedin, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const About = () => {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);

  const team = [
    { 
      name: 'C. Viswanth Reddy', 
      role: 'Managing Director', 
      image: '/md_image.jpeg',
      bio: "A visionary leader with over a decade of expertise in the agricultural sector. C. Viswanth Reddy founded Prinstan Agri Care in 2017 with a singular mission: to empower Indian farmers with world-class crop solutions and sustainable farming practices."
    },
    { 
      name: 'General Manager', 
      role: 'GM', 
      image: '',
      bio: "Overseeing day-to-day operations and ensuring the highest standards of quality across all Prinstan distribution channels."
    },
    { 
      name: 'Asst. General Manager', 
      role: 'AGM', 
      image: '',
      bio: "Supporting strategic growth and managing regional dealer networks to empower local farmers."
    },
    { 
      name: 'Branch Manager', 
      role: 'BM', 
      image: '',
      bio: "Dedicated to local outreach and ensuring farmers have immediate access to our latest innovations."
    },
  ];

  const values = [
    { icon: <FaLeaf />, title: t('about.values.v1Title'), desc: t('about.values.v1Desc') },
    { icon: <FaGlobe />, title: t('about.values.v2Title'), desc: t('about.values.v2Desc') },
    { icon: <FaHandshake />, title: t('about.values.v3Title'), desc: t('about.values.v3Desc') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 pb-20"
    >
      <SEO 
        title="About Us | Prinstan Agri Care Pvt Ltd"
        description="Learn about Prinstan Agri Care Pvt Ltd, established in 2017, and our mission to transform Indian agriculture."
        url="/about"
      />
      
      {/* Page Header */}
      <div className="bg-brand-brown-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold mb-4"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Growing together since 2017
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-brand-green-500 pl-4">{t('about.ourStory')}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-lg">
              Established in **2017**, Prinstan Agri Care Pvt Ltd was founded with a deep-rooted commitment to serving the Indian farming community. What began as a local vision has blossomed into a trusted name in high-quality agricultural solutions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We focus on delivering premium crop protection and nutrient management products that help farmers achieve record-breaking yields while maintaining soil health for future generations.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
          >
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Farming field" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Our Roots</p>
              <h3 className="text-2xl font-bold">Innovation in every field</h3>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.leadership')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Click on any card to learn more about our leadership team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedMember(member)}
                className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer aspect-[3/4]"
              >
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-green-100 to-brand-brown-100 flex items-center justify-center">
                    <span className="text-gray-400 text-6xl opacity-30">👤</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-900/90 via-transparent to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h4 className="text-2xl font-bold text-white mb-1">{member.name}</h4>
                  <p className="text-brand-green-400 font-bold text-sm uppercase tracking-wider">{member.role}</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">View Profile</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white md:text-gray-400 transition-colors"
              >
                <FaTimes size={24} />
              </button>

              <div className="md:w-1/2 h-80 md:h-auto relative">
                {selectedMember.image ? (
                  <img src={selectedMember.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-green-100 flex items-center justify-center text-8xl">👤</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
              </div>

              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-brand-green-600 font-bold text-xs uppercase tracking-widest block">{selectedMember.role}</span>
                  {selectedMember.name === 'C. Viswanth Reddy' && (
                    <span className="bg-brand-green-100 text-brand-green-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Founder</span>
                  )}
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">{selectedMember.name}</h2>
                <div className="w-12 h-1.5 bg-brand-green-500 mb-8 rounded-full"></div>
                
                {selectedMember.name === 'C. Viswanth Reddy' && (
                  <h5 className="text-brand-green-600 font-bold text-sm mb-2 italic">Founder's Vision</h5>
                )}
                
                <p className="text-gray-600 leading-relaxed text-lg mb-8 italic relative">
                  <span className="text-6xl text-brand-green-100 absolute -top-8 -left-4 -z-10 font-serif">"</span>
                  {selectedMember.bio}
                  <span className="text-6xl text-brand-green-100 absolute -bottom-12 -right-4 -z-10 font-serif">"</span>
                </p>
                <div className="flex gap-4">
                  <button className="bg-brand-green-600 text-white p-3 rounded-xl hover:bg-brand-green-700 transition-colors">
                    <FaLinkedin size={20} />
                  </button>
                  <button className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <FaEnvelope size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vision & Mission */}
      <div className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={fadeIn} className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
              <FaEye className="text-6xl text-brand-green-600 mb-8" />
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('about.vision')}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{t('about.visionDesc')}</p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
              <FaBullseye className="text-6xl text-brand-brown-600 mb-8" />
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission')}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{t('about.missionDesc')}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
