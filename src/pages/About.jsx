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

  const processes = [
    { 
      title: 'Testing', 
      video: '/testing.mp4', 
      desc: 'Rigorous quality control and soil testing in our advanced laboratories to ensure the highest safety standards.' 
    },
    { 
      title: 'Production', 
      video: '/creating.mp4', 
      desc: 'Advanced production and research into innovative crop protection solutions tailored for Indian farmers.' 
    },
    { 
      title: 'Manufacturing', 
      video: '/manufacturing.mp4', 
      desc: 'Precision engineering and sustainable manufacturing processes at our state-of-the-art facilities.' 
    },
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
      
      {/* Page Header - Logi Style */}
      <div className="bg-white py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-left"
          >
            <h2 className="logi-label text-brand-green-600 mb-6">Our Legacy Since 2017</h2>
            <h1 className="text-[10vw] logi-heading text-brand-green-900 mb-8">
              ABOUT<br />
              <span className="text-brand-green-500">PRINSTAN.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-brand-green-50/50 -z-10 rounded-l-[100px]"></div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="logi-label text-brand-green-600 mb-8">{t('about.ourStory')}</h2>
            <h3 className="text-5xl font-black text-brand-green-900 uppercase tracking-tight mb-8">Nurturing Growth Across Generations</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-xl">
              Established in **2017**, Prinstan Agri Care Pvt Ltd was founded with a deep-rooted commitment to serving the Indian farming community.
            </p>
            <p className="text-gray-500 leading-relaxed text-lg">
              We focus on delivering premium crop protection and nutrient management products that help farmers achieve record-breaking yields while maintaining soil health for future generations.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-logi overflow-hidden shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Farming field" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-green-900/10 mix-blend-multiply"></div>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-brand-green-50 py-32 rounded-logi mx-4 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-20">
            <h2 className="logi-label text-brand-green-600 mb-4">The Team</h2>
            <h3 className="text-6xl md:text-8xl logi-heading text-brand-green-900">{t('about.leadership')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -20 }}
                onClick={() => setSelectedMember(member)}
                className="group relative overflow-hidden rounded-logi shadow-2xl cursor-pointer aspect-[3/4] bg-white border border-brand-green-100"
              >
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full bg-brand-green-50 flex items-center justify-center">
                    <span className="text-brand-green-200 text-8xl opacity-30 uppercase font-black">{member.role[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-brand-green-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                  <h4 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{member.name}</h4>
                  <p className="logi-label text-brand-green-400">{member.role}</p>
                  <div className="mt-6 flex items-center gap-3 text-white font-black uppercase tracking-widest text-[10px]">
                    Read Bio <span>→</span>
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
              className={`bg-white rounded-[2.5rem] shadow-2xl ${selectedMember.name === 'C. Viswanth Reddy' ? 'max-w-3xl' : 'max-w-2xl'} w-full overflow-hidden flex flex-col relative`}
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 z-20 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>

              {/* Media Section */}
              <div className={`w-full ${selectedMember.name === 'C. Viswanth Reddy' ? 'aspect-video' : 'h-80 md:h-96'} relative bg-black`}>
                {selectedMember.name === 'C. Viswanth Reddy' ? (
                  <video 
                    autoPlay 
                    loop
                    muted
                    playsInline 
                    className="w-full h-full object-cover"
                  >
                    <source src="/main.mp4" type="video/mp4" />
                  </video>
                ) : selectedMember.image ? (
                  <img src={selectedMember.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-green-100 flex items-center justify-center text-8xl text-brand-green-200">👤</div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-brand-green-600 font-bold text-xs uppercase tracking-widest block">{selectedMember.role}</span>
                  {selectedMember.name === 'C. Viswanth Reddy' && (
                    <span className="bg-brand-green-100 text-brand-green-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Founder</span>
                  )}
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">{selectedMember.name}</h2>
                <div className="w-12 h-1.5 bg-brand-green-500 mb-8 rounded-full"></div>
                
                <p className="text-gray-600 leading-relaxed text-lg mb-8 italic relative">
                  <span className="text-6xl text-brand-green-50 absolute -top-10 -left-6 -z-10 font-serif opacity-50">"</span>
                  {selectedMember.bio}
                  <span className="text-6xl text-brand-green-50 absolute -bottom-14 -right-6 -z-10 font-serif opacity-50">"</span>
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


      {/* Cinematic Overview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-white">
        <div className="text-left mb-20">
          <h2 className="logi-label text-brand-green-600 mb-4">Corporate Film</h2>
          <h3 className="text-6xl md:text-8xl logi-heading text-brand-green-900">COMPANY<br /><span className="text-brand-green-500">OVERVIEW.</span></h3>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-full aspect-video rounded-[40px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] bg-black"
        >
          <video 
            controls 
            loop
            playsInline 
            className="w-full h-full object-cover"
            poster="/md.png"
          >
            <source src="/main.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="mt-12 max-w-3xl">
          <p className="text-2xl text-gray-600 leading-relaxed font-medium">
            Take an immersive journey through our facilities and witness the dedication that goes into every Prinstan solution. Our corporate film showcases the synergy between advanced technology and sustainable agriculture.
          </p>
        </div>
      </div>

      {/* Process & Innovation Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-white">
        <div className="text-left mb-20">
          <h2 className="logi-label text-brand-green-600 mb-4">Our Operations</h2>
          <h3 className="text-6xl md:text-8xl logi-heading text-brand-green-900">PROCESS &<br /><span className="text-brand-green-500">INNOVATION.</span></h3>
        </div>
        
        <div className="flex flex-col gap-32">
          {processes.map((item, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}
            >
              <div className="w-full lg:w-3/5 relative aspect-video rounded-logi overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] bg-black group">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100 transition-transform duration-1000"
                >
                  <source src={item.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-brand-green-900/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute top-10 left-10">
                  <span className="logi-label bg-white text-brand-green-900 px-6 py-3 rounded-full shadow-2xl text-sm">{item.title}</span>
                </div>
              </div>
              <div className="w-full lg:w-2/5">
                <h4 className="text-5xl md:text-6xl font-black text-brand-green-900 uppercase tracking-tight mb-8 leading-tight">{item.title}</h4>
                <p className="text-gray-500 text-2xl leading-relaxed font-medium mb-8">{item.desc}</p>
                <div className="w-20 h-2 bg-brand-green-500 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div variants={fadeIn} className="bg-brand-green-50 p-16 rounded-logi border border-brand-green-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <FaEye size={120} className="text-brand-green-900" />
              </div>
              <h3 className="text-4xl font-black text-brand-green-900 uppercase tracking-tight mb-8">{t('about.vision')}</h3>
              <p className="text-gray-600 leading-relaxed text-xl">{t('about.visionDesc')}</p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-brand-green-900 p-16 rounded-logi relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <FaBullseye size={120} className="text-white" />
              </div>
              <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-8">{t('about.mission')}</h3>
              <p className="text-brand-green-100 leading-relaxed text-xl opacity-90">{t('about.missionDesc')}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
