import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaSignInAlt, FaMapMarkerAlt, FaPhoneAlt, FaBoxOpen, FaTimes, FaGoogle } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SEO from '../components/SEO';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Dealers = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Email Auth States
  const [email, setEmail] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);

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

  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    // Check if the user is returning from the email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      signInWithEmailLink(auth, emailForSignIn, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          setUser(result.user);
        })
        .catch((error) => {
          console.error("Error signing in with email link", error);
        });
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchDealers();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEmailLinkLogin = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSendingLink(true);
    const actionCodeSettings = {
      url: window.location.href, // Redirect back to this page
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert(`A sign-in link has been sent to ${email}. Please check your inbox and click the link to log in.`);
      setShowLogin(false);
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      alert("Failed to send sign-in link. Ensure Email Auth is enabled in Firebase.");
    } finally {
      setIsSendingLink(false);
    }
  };

  const fetchDealers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "dealers"));
      const dealersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDealers(dealersList);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLogin(false);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newDealer = {
        name: formData.name,
        area: formData.area,
        phone: formData.phone,
        stock: formData.stock,
        email: user.email,
        uid: user.uid,
        // Assigning a random location near Hyderabad for demo
        lat: 17.3850 + (Math.random() - 0.5) * 0.1,
        lng: 78.4867 + (Math.random() - 0.5) * 0.1,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "dealers", user.uid), newDealer);
      setShowRegister(false);
      fetchDealers(); // Refresh list
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register. Please try again.");
    }
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
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-20 text-center max-w-3xl mx-auto">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green-600 mx-auto mb-4"></div>
             <p className="text-gray-500">Loading dealer information...</p>
          </div>
        ) : !user ? (
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
              <div className="flex items-center gap-3">
                <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-brand-green-200" />
                <div>
                  <h2 className="text-xl font-bold text-brand-green-900 leading-none">{user.displayName}</h2>
                  <p className="text-xs text-brand-green-600">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 px-4 py-2 rounded-lg transition-colors"
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
              
              {!user ? (
                <div className="p-10 text-center">
                  <FaGoogle className="text-5xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-6">You must login with Google first to register as a dealer.</p>
                  <button 
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all w-full shadow-sm"
                  >
                    <FaGoogle className="text-red-500" /> Sign in with Google
                  </button>
                </div>
              ) : (
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
              )}
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
                <button 
                  onClick={() => {
                    setShowLogin(false);
                    setEmail("");
                  }} 
                  className="text-white hover:text-brand-green-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all w-full shadow-sm"
                >
                  <FaGoogle className="text-red-500" /> Sign in with Google
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
                </div>

                <form onSubmit={handleEmailLinkLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 outline-none" 
                      placeholder="dealer@example.com" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSendingLink}
                    className={`w-full bg-brand-green-600 text-white font-bold py-3 rounded-lg hover:bg-brand-green-700 transition-colors ${isSendingLink ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSendingLink ? "Sending Link..." : "Send Login Link"}
                  </button>
                  <p className="text-[10px] text-center text-gray-500 italic">
                    We'll send a magic link to your email for a secure, passwordless login.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Dealers;
