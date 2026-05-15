import { motion } from 'framer-motion';
import { FaEye, FaBullseye, FaHandshake, FaLeaf, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const About = () => {
  const { t } = useTranslation();

  const team = [
    { name: 'Managing Director', role: t('about.roles.ceo'), image: '/md_image.jpeg' },
    { name: 'GM', role: t('about.roles.gm'), image: '' },
    { name: 'AGM', role: t('about.roles.agm'), image: '' },
    { name: 'Branch Manager', role: t('about.roles.branchManager'), image: '' },
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
        title="About Us | Prinstan Agri Care Pvt Ltd | Agriculture Company India"
        description="Learn about Prinstan Agri Care Pvt Ltd, our mission to transform Indian agriculture, and our premium crop care and fertilizer solutions."
        keywords="About Prinstan Agri Care, agriculture company India, crop protection, fertilizers, farming support"
        url="/about"
      />
      {/* Page Header */}
      <div className="bg-brand-brown-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center"></div>
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
            {t('about.subtitle')}
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
            <p className="text-gray-600 mb-4 leading-relaxed">
              {t('about.story1')}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {t('about.story2')}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a5015?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Farming field" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-brand-green-50 p-10 rounded-2xl border border-brand-green-100"
            >
              <FaEye className="text-5xl text-brand-green-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('about.visionDesc')}</p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-brand-brown-50 p-10 rounded-2xl border border-brand-brown-100"
            >
              <FaBullseye className="text-5xl text-brand-brown-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('about.missionDesc')}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('about.coreValues')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: idx * 0.2 } }
                }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="w-16 h-16 mx-auto bg-brand-green-100 rounded-full flex items-center justify-center text-2xl text-brand-green-600 mb-6">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.leadership')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('about.leadershipSub')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <span className="text-gray-400 text-5xl">👤</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                  <p className="text-brand-green-400 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
