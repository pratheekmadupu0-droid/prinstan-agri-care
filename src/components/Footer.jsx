import { Link } from 'react-router-dom';
import { 
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, 
  FaPhoneAlt, FaEnvelope, FaPaperPlane, FaAward, FaCheckCircle
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(i18n.language === 'en' ? "Thank you for subscribing to Prinstan Corporate Updates!" : "ప్రిన్స్టాన్ కార్పొరేట్ అప్‌డేట్‌లకు సబ్‌స్క్రైబ్ చేసినందుకు ధన్యవాదాలు!");
  };

  return (
    <footer className="bg-[#052614] text-white border-t-4 border-white pt-20 pb-8 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg border border-emerald-500/20 shrink-0">
                <img src="/logo.png" alt="Prinstan Agri Care Logo" className="h-14 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight leading-none uppercase text-white">
                  {i18n.language === 'en' ? 'Prinstan Agri Care' : 'ప్రిన్స్టాన్ అగ్రి కేర్'}
                </span>
                <span className="text-[10px] text-white/75 font-bold uppercase tracking-[0.25em] mt-1">Pvt. Ltd.</span>
              </div>
            </Link>
            
            <p className="text-emerald-100/60 text-sm leading-relaxed max-w-md">
              {i18n.language === 'en' 
                ? 'Redefining agricultural success with premium crop protection, plant nutrition, high-yield seeds, and sustainable farming solutions across India.'
                : 'భారతదేశం అంతటా ప్రీమియం పంట రక్షణ, మొక్కల పోషణ, అధిక దిగుబడినిచ్చే విత్తనాలు మరియు స్థిరమైన వ్యవసాయ పరిష్కారాలతో వ్యవసాయ విజయాన్ని తిరిగి నిర్వచిస్తున్నాము.'}
            </p>

            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, url: "#" },
                { icon: <FaTwitter />, url: "#" },
                { icon: <FaInstagram />, url: "#" },
                { icon: <FaLinkedinIn />, url: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-100 hover:bg-white hover:text-dark hover:border-white transition-all transform hover:-translate-y-0.5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Col */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-lg font-black uppercase tracking-tight text-white">
              {i18n.language === 'en' ? 'Subscribe to Corporate Press' : 'కార్పొరేట్ అప్‌డేట్‌ల కోసం సబ్‌స్క్రైబ్ చేయండి'}
            </h4>
            <p className="text-emerald-100/60 text-sm max-w-xl">
              {i18n.language === 'en'
                ? 'Get direct alerts on our latest crop formulations, scientific releases, distribution hub updates, and seasonal farmer guidelines.'
                : 'మా తాజా పంట సూత్రీకరణలు, శాస్త్రీయ విడుదలలు, పంపిణీ కేంద్రాల నవీకరణలు మరియు కాలానుగుణ రైతు మార్గదర్శకాలపై నేరుగా హెచ్చరికలను పొందండి.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl pt-2">
              <input 
                required
                type="email" 
                placeholder={i18n.language === 'en' ? "Enter corporate email address" : "ఈమెయిల్ చిరునామాను నమోదు చేయండి"} 
                className="flex-grow px-5 py-3.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-white focus:bg-white/10 text-sm"
              />
              <button 
                type="submit" 
                className="bg-white hover:bg-white/90 text-dark font-bold px-8 py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
              >
                {i18n.language === 'en' ? 'Subscribe' : 'సబ్‌స్క్రైబ్'} <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Link Col 1 */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-white border-l-2 border-white pl-3">
              {i18n.language === 'en' ? 'Product Portfolio' : 'ఉత్పత్తుల శ్రేణి'}
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-emerald-100/60">
              <li>
                <Link to="/products" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'High-Yield Seeds' : 'అధిక దిగుబడి విత్తనాలు'}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Crop Protection' : 'పంట రక్షణ'}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Plant Nutrition' : 'మొక్కల పోషణ'}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Bio Stimulants' : 'బయో స్టిమ్యులేంట్లు'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Link Col 2 */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-white border-l-2 border-white pl-3">
              {i18n.language === 'en' ? 'Dealer Networks' : 'డీలర్ నెట్‌వర్క్'}
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-emerald-100/60">
              <li>
                <Link to="/dealers" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Dealers Directory' : 'డీలర్ డైరెక్టరీ'}
                </Link>
              </li>
              <li>
                <a href="/#become-dealer" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Become a Partner' : 'భాగస్వామి అవ్వండి'}
                </a>
              </li>
              <li>
                <a href="/#dealer-network" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'interactive Coverage Map' : 'ఇంటరాక్టివ్ కవరేజ్ మ్యాప్'}
                </a>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Field Gallery' : 'ఫీల్డ్ గ్యాలరీ'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Link Col 3 */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-white border-l-2 border-white pl-3">
              {i18n.language === 'en' ? 'Quick Navigation' : 'త్వరిత నావిగేషన్'}
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-emerald-100/60">
              <li>
                <Link to="/" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Home Overview' : 'హోమ్ అవలోకనం'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'About Our Legacy' : 'మా వారసత్వం'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Contact Support' : 'మమ్మల్ని సంప్రదించండి'}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {i18n.language === 'en' ? 'Dealer Dashboard' : 'డీలర్ డాష్‌బోర్డ్'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Link Col 4: Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-white border-l-2 border-white pl-3">
              {i18n.language === 'en' ? 'Regional Support' : 'ప్రాంతీయ మద్దతు'}
            </h4>
            <ul className="space-y-4 text-xs font-semibold text-emerald-100/70">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-white mt-1 shrink-0" />
                <span className="leading-relaxed">
                  {i18n.language === 'en' 
                    ? '3rd Floor, Sri Rama Nilayam, Vijayasri Colony, Auto Nagar, Hyderabad, Telangana 500068'
                    : '3వ అంతస్తు, శ్రీ రామ నిలయం, విజయశ్రీ కాలనీ, ఆటో నగర్, హైదరాబాద్, తెలంగాణ 500068'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-white shrink-0" />
                <a href="tel:+917569598929" className="hover:text-white transition-colors">+91 75695 98929</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-white shrink-0" />
                <a href="mailto:prinstanagricarepvtltd2025@gmail.com" className="hover:text-white transition-colors break-all">prinstanagricarepvtltd2025@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Compliance */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-emerald-100/40">
          <p>
            &copy; {new Date().getFullYear()} {i18n.language === 'en' ? 'Prinstan Agricare Pvt Ltd. All rights reserved.' : 'ప్రిన్స్టాన్ అగ్రి కేర్ ప్రైవేట్ లిమిటెడ్. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.'}
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <span className="flex items-center gap-1.5"><FaCheckCircle className="text-white text-sm" /> ISO 9001:2015</span>
            <span className="flex items-center gap-1.5"><FaCheckCircle className="text-white text-sm" /> ICAR Standard</span>
            <span className="flex items-center gap-1.5"><FaCheckCircle className="text-white text-sm" /> Organic NPOP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
