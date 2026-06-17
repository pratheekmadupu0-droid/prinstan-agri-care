import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiMenuAlt3 } from 'react-icons/hi';
import { FaGlobe, FaBuilding, FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();
  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

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

  // Close menu on page transition
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('nav.home', 'HOME'), path: '/' },
    { name: t('nav.about', 'ABOUT'), path: '/about' },
    { name: t('nav.products', 'PRODUCTS'), path: '/products' },
    { name: t('nav.gallery', 'GALLERY'), path: '/gallery' },
    { name: t('nav.dealers', 'DEALERS'), path: '/dealers' },
    { name: t('nav.contact', 'CONTACT US'), path: '/contact' }
  ];

  return (
    <div className="fixed w-full z-50 px-4 sm:px-6 pt-4 pointer-events-none">
      <nav 
        className="w-full max-w-7xl mx-auto pointer-events-auto transition-all duration-300 rounded-full bg-white/30 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-2 px-4 sm:px-8 flex items-center justify-between"
      >
        
        {/* Left Side: Logo & Brand Name */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="bg-white p-1.5 rounded-2xl shadow-md border border-white/40 shrink-0">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="font-extrabold text-sm md:text-base tracking-tight leading-none uppercase text-brand-green-950">
              PRINSTAN AGRI CARE
            </span>
            <span className="text-[10px] leading-none mt-1 font-extrabold uppercase tracking-widest text-brand-green-500">
              PVT. LTD.
            </span>
          </div>
        </Link>

        {/* Center: Desktop Menu Links */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-black uppercase tracking-widest transition-all py-1.5 px-0.5 relative ${
                  isActive 
                    ? 'text-brand-green-900 border-b-2 border-brand-green-500 font-bold' 
                    : 'text-brand-green-950 hover:text-brand-green-500'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side CTAs */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Vertical Separator */}
          <div className="h-6 w-px bg-brand-green-950/20"></div>

          {/* Lang switch */}
          <button
            onClick={toggleLanguage}
            className="text-xs font-black uppercase tracking-wider text-brand-green-900 hover:text-brand-green-500 transition-colors flex items-center gap-1.5"
          >
            <FaGlobe className="text-brand-green-600" />
            {i18n.language === 'en' ? 'తెలుగు' : 'EN'}
          </button>

          {/* Cart Icon Button beside language switcher */}
          <Link
            to="/cart"
            className="relative p-2 text-brand-green-900 hover:text-brand-green-500 transition-colors flex items-center"
            title="Cart"
          >
            <FaShoppingCart className={`h-5 w-5 ${cartCount > 0 ? 'text-brand-green-600 animate-pulse' : 'text-current'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Get a Quote button */}
          <Link
            to="/contact"
            className="bg-brand-green-900 hover:bg-brand-green-950 text-white font-extrabold uppercase tracking-widest px-6 py-2.5 rounded-full text-[10px] transition-colors shadow-md"
          >
            {t('nav.getQuote', 'GET A QUOTE')}
          </Link>
        </div>

        {/* Mobile Navigation controls */}
        <div className="lg:hidden flex items-center gap-3 shrink-0">
          {/* Lang switch */}
          <button
            onClick={toggleLanguage}
            className="text-xs font-black text-brand-green-900"
          >
            {i18n.language === 'en' ? 'తెలుగు' : 'EN'}
          </button>

          {/* Cart Icon Button beside language switcher on mobile */}
          <Link
            to="/cart"
            className="relative p-1.5 text-brand-green-900 hover:text-brand-green-500 transition-colors flex items-center"
            title="Cart"
          >
            <FaShoppingCart className={`h-5 w-5 ${cartCount > 0 ? 'text-brand-green-600 animate-pulse' : 'text-current'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-brand-green-900 transition-colors"
          >
            {isOpen ? <HiX className="h-7 w-7" /> : <HiMenuAlt3 className="h-7 w-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[30px] mt-3 p-5 flex flex-col space-y-3 shadow-2xl overflow-hidden pointer-events-auto"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`text-sm font-black uppercase tracking-wider py-1 ${
                    isActive ? 'text-brand-green-600' : 'text-brand-green-900 hover:text-brand-green-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-px bg-gray-100 my-2"></div>
            
            <Link 
              to="/contact" 
              className="w-full bg-brand-green-900 hover:bg-brand-green-950 text-white text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              GET A QUOTE
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
