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
    <div className="fixed w-full z-50 px-4 pt-4 pointer-events-none">
      <nav className={`w-full max-w-[98vw] xl:max-w-[1400px] mx-auto transition-all duration-500 pointer-events-auto ${scrolled ? 'glass rounded-full py-2 px-4 xl:px-6 shadow-2xl scale-95 md:scale-100' : 'bg-white/50 backdrop-blur-sm rounded-[30px] md:rounded-full py-4 px-4 xl:px-12'}`}>
        <div className="flex justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-white p-1.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg border border-brand-green-50 shrink-0">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col shrink-0">
              <span className="font-black text-lg xl:text-xl tracking-tighter text-brand-green-900 leading-none uppercase whitespace-nowrap">Prinstan Agri Care</span>
              <span className="logi-label text-[10px] text-brand-green-600 leading-none mt-1">Pvt. Ltd.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`logi-label transition-all hover:text-brand-green-600 relative group ${location.pathname === link.path ? 'text-brand-green-600' : 'text-brand-green-900'
                  }`}
              >
                {t(link.key)}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-green-600 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
            
            <div className="flex items-center gap-3 xl:gap-4 border-l border-gray-200 pl-4 xl:pl-8">
              <button
                onClick={toggleLanguage}
                className="logi-label text-brand-green-900 hover:text-brand-green-600 transition-colors flex items-center gap-2"
              >
                <FaGlobe className="text-brand-green-600" /> {i18n.language === 'en' ? 'తెలుగు' : 'EN'}
              </button>
              
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-brand-green-900 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-brand-green-800 transition-all shadow-xl shadow-brand-green-900/20"
                >
                  {t('nav.getQuote')}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="lg:hidden flex items-center shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-brand-green-600 focus:outline-none"
            >
              {isOpen ? <HiX className="h-8 w-8" /> : <HiMenu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 px-4 flex flex-col space-y-4 rounded-3xl mt-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`logi-label py-2 ${location.pathname === link.path ? 'text-brand-green-600' : 'text-brand-green-900'
                  }`}
              >
                {t(link.key)}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="logi-label flex items-center gap-2 text-brand-green-600 py-2"
            >
              <FaGlobe /> {i18n.language === 'en' ? 'తెలుగు' : 'English'}
            </button>
          </motion.div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
