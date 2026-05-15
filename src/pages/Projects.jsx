import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const Projects = () => {
  const { t } = useTranslation();

  const projects = [
    {
      id: 1,
      title: t('projects.items.pr1Title'),
      desc: t('projects.items.pr1Desc'),
      location: 'Maharashtra, India',
      date: 'August 2023',
      image: 'https://images.unsplash.com/photo-1563514253386-4b2a3c748c08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Irrigation'
    },
    {
      id: 2,
      title: t('projects.items.pr2Title'),
      desc: t('projects.items.pr2Desc'),
      location: 'Punjab, India',
      date: 'November 2023',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Crop Solutions'
    },
    {
      id: 3,
      title: t('projects.items.pr3Title'),
      desc: t('projects.items.pr3Desc'),
      location: 'Gujarat, India',
      date: 'January 2024',
      image: 'https://images.unsplash.com/photo-1559884732-b6957eb0a0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Smart Agriculture'
    },
    {
      id: 4,
      title: t('projects.items.pr4Title'),
      desc: t('projects.items.pr4Desc'),
      location: 'Karnataka, India',
      date: 'March 2024',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Infrastructure'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white pb-20"
    >
      <SEO 
        title="Projects | Prinstan Agri Care Pvt Ltd | Farming Innovation"
        description="Discover how Prinstan Agri Care Pvt Ltd is supporting Indian agriculture through innovative projects and farming solutions across the country."
        keywords="Prinstan projects, farming innovation, Indian agriculture support, agricultural solutions, Prinstan Agri Care Pvt Ltd"
        url="/projects"
      />
      {/* Page Header */}
      <div className="bg-brand-brown-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0a5015?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('projects.title')}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {t('projects.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-4 right-4 bg-brand-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  {project.category}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-green-600 transition-colors">{project.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{project.desc}</p>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-brand-green-500" /> {project.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-brand-green-500" /> {project.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-brand-green-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('projects.ready')}</h2>
          <p className="text-xl text-gray-600 mb-10">{t('projects.join')}</p>
          <button className="bg-brand-green-600 hover:bg-brand-green-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-brand-green-500/30 transition-all hover:-translate-y-1">
            {t('projects.start')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
