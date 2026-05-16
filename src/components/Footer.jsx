import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaLeaf, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-brown-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-1 text-white mb-6">
              <div className="bg-white p-2 rounded-xl">
                <img src="/logo.png" alt="Prinstan Agri Care Logo" className="h-16 w-auto object-contain" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="font-bold text-2xl tracking-tight leading-none uppercase">Prinstan Agri Care</span>
                <span className="text-xs text-brand-green-500 font-bold uppercase tracking-[0.2em] mt-1">Pvt. Ltd.</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-brown-800 flex items-center justify-center text-gray-300 hover:bg-brand-green-600 hover:text-white transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-brown-800 flex items-center justify-center text-gray-300 hover:bg-brand-green-600 hover:text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-brown-800 flex items-center justify-center text-gray-300 hover:bg-brand-green-600 hover:text-white transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-brown-800 flex items-center justify-center text-gray-300 hover:bg-brand-green-600 hover:text-white transition-colors">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-brand-green-500 transition-colors">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-green-500 transition-colors">{t('nav.products')}</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-brand-green-500 transition-colors">{t('nav.projects')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-green-500 transition-colors">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b-2 border-brand-green-500 pb-2 inline-block">Services</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-brand-green-500 transition-colors">{t('home.services.s1Title')}</a></li>
              <li><a href="#" className="hover:text-brand-green-500 transition-colors">{t('home.services.s2Title')}</a></li>
              <li><a href="#" className="hover:text-brand-green-500 transition-colors">{t('home.services.s3Title')}</a></li>
              <li><a href="#" className="hover:text-brand-green-500 transition-colors">{t('home.services.s4Title')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-brand-green-500 mt-1 flex-shrink-0" />
                <span>Prinstan agri care pvt ltd office, 3rd floor, sri rama nilayam,<br/>Vijayasri Colony, Chitraseema Nagar, Auto Nagar,<br/>Hyderabad, Vanasthalipuram, Telangana 500068</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-brand-green-500 flex-shrink-0" />
                <a href="tel:+919550758929" className="hover:text-brand-green-500 transition-colors">+91 95507 58929</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-brand-green-500 flex-shrink-0" />
                <a href="mailto:prinstanagricarepvtltd2025@gmail.com" className="hover:text-brand-green-500 transition-colors">prinstanagricarepvtltd2025@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-brown-800 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {t('footer.rights')} <span className="text-brand-green-500">&hearts;</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
