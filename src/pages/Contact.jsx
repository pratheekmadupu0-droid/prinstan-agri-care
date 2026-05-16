import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 pb-20"
    >
      {/* Page Header */}
      <div className="bg-brand-green-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('contact.info')}</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-green-50 rounded-full flex items-center justify-center text-brand-green-600 flex-shrink-0">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('contact.location')}</h4>
                  <p className="text-gray-600 mt-1">Prinstan agri care pvt ltd office, 3rd floor, sri rama nilayam<br />Vijayasri Colony, Chitraseema Nagar, Auto Nagar, Hyderabad<br />Vanasthalipuram, Telangana 500068</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-green-50 rounded-full flex items-center justify-center text-brand-green-600 flex-shrink-0">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('contact.phone')}</h4>
                  <p className="text-gray-600 mt-1">
                    <a href="tel:+919550758929" className="hover:text-brand-green-600 transition-colors">+91 95507 58929</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-green-50 rounded-full flex items-center justify-center text-brand-green-600 flex-shrink-0">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('contact.email')}</h4>
                  <p className="text-gray-600 mt-1">
                    <a href="mailto:prinstanagricarepvtltd2025@gmail.com" className="hover:text-brand-green-600 transition-colors break-all">prinstanagricarepvtltd2025@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="font-bold text-gray-900 mb-4">{t('contact.follow')}</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-green-600 hover:text-white transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-green-600 hover:text-white transition-colors">
                  <FaTwitter />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-green-600 hover:text-white transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-green-600 hover:text-white transition-colors">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100"
          >
            <div className="space-y-6">
              <p className="text-gray-600 text-lg">Prefer instant messaging? Connect with us directly on WhatsApp for quick assistance.</p>
              <a 
                href="https://wa.me/919550758929" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black uppercase tracking-widest text-xs py-5 rounded-xl transition-all shadow-xl shadow-green-500/20"
              >
                <FaWhatsapp className="text-xl" /> Send Us A Message on WhatsApp
              </a>
              <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-gray-100 flex-grow"></div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Or use the form</span>
                <div className="h-px bg-gray-100 flex-grow"></div>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.name')}</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all outline-none" placeholder={t('contact.form.namePlace')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.email')}</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all outline-none" placeholder={t('contact.form.emailPlace')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.phone')}</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all outline-none" placeholder={t('contact.form.phonePlace')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.message')}</label>
                  <textarea rows="5" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all outline-none resize-none" placeholder={t('contact.form.msgPlace')}></textarea>
                </div>
                <button type="button" className="w-full bg-brand-green-900 hover:bg-brand-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
                  {t('contact.form.send')}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Embedded Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-96"
        >
          <iframe
            src="https://maps.google.com/maps?q=Prinstan+agri+care+pvt+ltd+office,3rd+floor,sri+rama+nilayam,+Vijayasri+Colony,+Chitraseema+Nagar,+Auto+Nagar,+Hyderabad,+Vanasthalipuram,+Telangana+500068&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
