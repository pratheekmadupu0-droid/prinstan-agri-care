import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaLeaf, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.about', path: '/about' },
    { key: 'nav.products', path: '/products' },
    { key: 'nav.gallery', path: '/gallery' },
    { key: 'nav.dealers', path: '/dealers' },
    { key: 'nav.contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-md' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-1 overflow-hidden">
            <img src="https://i.ibb.co/nsmX0hZp/logo.png" alt="Prinstan Agri Care Logo" className="h-12 md:h-16 w-auto object-contain -translate-y-1.5 -mr-2" />
            <span className="font-bold text-lg md:text-2xl tracking-tight text-gray-900 truncate">Prinstan <span className="hidden sm:inline text-brand-green-600">Agri Care Pvt. Ltd.</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`font-medium transition-colors hover:text-brand-green-600 ${location.pathname === link.path ? 'text-brand-green-600' : 'text-gray-700'
                  }`}
              >
                {t(link.key)}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-gray-700 hover:text-brand-green-600 font-medium transition-colors"
            >
              <FaGlobe /> {i18n.language === 'en' ? 'తెలుగు' : 'English'}
            </button>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-brand-green-700 transition-colors shadow-lg shadow-brand-green-500/30"
              >
                {t('nav.getQuote')}
              </motion.button>
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-brand-green-600 focus:outline-none"
            >
              {isOpen ? <HiX className="h-8 w-8" /> : <HiMenu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 px-4 flex flex-col space-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className={`block text-lg font-medium ${location.pathname === link.path ? 'text-brand-green-600' : 'text-gray-700'
                }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-lg font-medium text-brand-green-600 py-2"
          >
            <FaGlobe /> {i18n.language === 'en' ? 'తెలుగు' : 'English'}
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
