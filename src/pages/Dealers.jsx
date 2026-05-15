import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaSignInAlt, FaMapMarkerAlt, FaPhoneAlt, FaBoxOpen, FaTimes } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SEO from '../components/SEO';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Dealers = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    phone: '',
    stock: {
      bios: 0,
      fertilizers: 0,
      pesticides: 0
    }
  });

  const [dealers, setDealers] = useState([
    // Mock dealer for demonstration purposes after login
    {
      id: 1,
      name: 'AgriPro Solutions',
      area: 'Hyderabad, Telangana',
      phone: '+91 9876543210',
      stock: { bios: 120, fertilizers: 300, pesticides: 150 },
      lat: 17.3850,
      lng: 78.4867
    }
  ]);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (['bios', 'fertilizers', 'pesticides'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        stock: { ...prev.stock, [name]: parseInt(value) || 0 }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newDealer = {
      id: Date.now(),
      ...formData,
      // Assigning a random location near Hyderabad for demo
      lat: 17.3850 + (Math.random() - 0.5) * 0.1,
      lng: 78.4867 + (Math.random() - 0.5) * 0.1,
    };
    setDealers([...dealers, newDealer]);
    setShowRegister(false);
    setIsLoggedIn(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setShowLogin(false);
    setIsLoggedIn(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 min-h-screen pb-20"
    >
      <SEO 
        title="Dealers | Prinstan Agri Care Pvt Ltd"
        description="Find Prinstan Agri Care dealers near you or register as a new dealer to distribute our premium agricultural products."
        keywords="Prinstan dealers, agri care dealers, register dealer, agricultural distributors"
        url="/dealers"
      />
      
      {/* Page Header */}
      <div className="bg-brand-green-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1592982537447-6f296cb161a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Dealers</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Connect with our trusted partners or become one.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {!isLoggedIn ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-3xl mx-auto">
            <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">As of now, no one is here</h2>
            <p className="text-gray-600 mb-8">Please login to view dealers or register to become a Prinstan dealer.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center justify-center gap-2 bg-brand-green-100 text-brand-green-700 hover:bg-brand-green-200 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                <FaSignInAlt /> Login
              </button>
              <button 
                onClick={() => setShowRegister(true)}
                className="flex items-center justify-center gap-2 bg-brand-green-600 text-white hover:bg-brand-green-700 px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-brand-green-500/30"
              >
                <FaUserPlus /> Register as Dealer
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-brand-green-50 border-b border-brand-green-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-brand-green-900">Dealer Locations</h2>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="text-sm font-medium text-brand-green-600 hover:text-brand-green-800"
              >
                Logout
              </button>
            </div>
            <div className="h-[600px] w-full relative z-0">
              <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {dealers.map(dealer => (
                  <Marker key={dealer.id} position={[dealer.lat, dealer.lng]}>
                    <Popup className="custom-popup">
                      <div className="p-2 min-w-[200px]">
                        <h3 className="text-lg font-bold text-brand-green-700 mb-1">{dealer.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-brand-green-500" /> {dealer.area}
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                            <FaBoxOpen /> Current Stock
                          </h4>
                          <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                              <div className="font-bold text-brand-green-600">{dealer.stock.bios}</div>
                              <div className="text-[10px] text-gray-500">Bios</div>
                            </div>
                            <div>
                              <div className="font-bold text-brand-green-600">{dealer.stock.fertilizers}</div>
                              <div className="text-[10px] text-gray-500">Fertilizers</div>
                            </div>
                            <div>
                              <div className="font-bold text-brand-green-600">{dealer.stock.pesticides}</div>
                              <div className="text-[10px] text-gray-500">Pesticides</div>
                            </div>
                          </div>
                        </div>

                        <a 
                          href={`tel:${dealer.phone}`}
                          className="w-full flex items-center justify-center gap-2 bg-brand-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-brand-green-700 transition-colors"
                        >
                          <FaPhoneAlt /> Products Contact
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-brand-green-600 p-6 flex justify-between items-center text-white">
                <h2 className="text-2xl font-bold">Register as Dealer</h2>
                <button onClick={() => setShowRegister(false)} className="text-white hover:text-brand-green-200">
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name / Business Name</label>
                  <input required type="text" name="name" onChange={handleRegisterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area / Location</label>
                  <input required type="text" name="area" onChange={handleRegisterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input required type="tel" name="phone" onChange={handleRegisterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent outline-none" />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-800 mb-3">Stock Information (Quantity)</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Bios</label>
                      <input type="number" min="0" name="bios" onChange={handleRegisterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 outline-none" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fertilizers</label>
                      <input type="number" min="0" name="fertilizers" onChange={handleRegisterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 outline-none" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Pesticides</label>
                      <input type="number" min="0" name="pesticides" onChange={handleRegisterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 outline-none" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-brand-green-600 text-white font-bold py-3 rounded-lg hover:bg-brand-green-700 transition-colors shadow-lg shadow-brand-green-500/30">
                    Complete Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="bg-brand-green-600 p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold">Dealer Login</h2>
                <button onClick={() => setShowLogin(false)} className="text-white hover:text-brand-green-200">
                  <FaTimes size={20} />
                </button>
              </div>
              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input required type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 outline-none" placeholder="+91" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OTP / Password</label>
                  <input required type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 outline-none" placeholder="Enter password" />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-brand-green-600 text-white font-bold py-3 rounded-lg hover:bg-brand-green-700 transition-colors">
                    Login
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Dealers;
