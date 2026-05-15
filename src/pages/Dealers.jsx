import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, FaBoxOpen, 
  FaTimes, FaGoogle, FaWhatsapp, FaStore
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';

const Dealers = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Email Auth States
  const [email, setEmail] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

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
    // Real-time listener for dealers (Realtime Database version)
    const dealersRef = ref(db, 'dealers');
    const unsubscribeDealers = onValue(dealersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dealersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setDealers(dealersList);
      } else {
        setDealers([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to dealers:", error);
      setIsLoading(false);
    });

    // Check for email link sign-in
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
        .catch((error) => console.error("Error signing in with email link", error));
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      // unsubscribeDealers is a cleanup function returned by onValue? No, onValue returns a function to unsubscribe.
      unsubscribeDealers();
      unsubscribeAuth();
    };
  }, []);

  const handleEmailLinkLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSendingLink(true);
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert(`A sign-in link has been sent to ${email}. Check your inbox!`);
      setShowLogin(false);
    } catch (error) {
      console.error("Error sending link:", error);
      alert("Failed to send link. Ensure Email Auth is enabled.");
    } finally {
      setIsSendingLink(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLogin(false);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed.");
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
    setIsRegistering(true);
    
    try {
      const newDealer = {
        name: formData.name,
        area: formData.area,
        phone: formData.phone,
        stock: formData.stock,
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      };
      // Save to Realtime Database
      await set(ref(db, 'dealers/' + user.uid), newDealer);
      alert("Registration Successful!");
      setShowRegister(false);
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO title="Dealers | Prinstan Agri Care" />
      
      {/* Header */}
      <div className="bg-brand-green-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Registered Dealers</h1>
        <p className="text-gray-300 max-w-xl mx-auto">Browse our trusted dealer network and connect for your requirements.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Dealer Directory</h2>
            <div className="flex gap-3">
              {!user ? (
                <>
                  <button onClick={() => setShowLogin(true)} className="text-sm font-bold text-gray-600 hover:text-brand-green-600 px-4 py-2 transition-colors">Login</button>
                  <button onClick={() => setShowRegister(true)} className="bg-brand-green-600 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-brand-green-700 transition-all">Join Network</button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowRegister(true)} className="bg-brand-green-600 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-brand-green-700 transition-all">My Registration</button>
                  <div className="hidden sm:block">
                    <span className="text-sm font-bold text-gray-700">{user.displayName || user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg">Logout</button>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center"><div className="animate-spin h-10 w-10 border-b-2 border-brand-green-600 mx-auto"></div></div>
          ) : dealers.length === 0 ? (
            <div className="py-20 text-center text-gray-400">No dealers registered yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers.map(dealer => (
                <motion.div 
                  key={dealer.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedDealer(dealer)}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="bg-brand-green-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-brand-green-600 text-xl">
                    <FaStore />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{dealer.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                    <FaMapMarkerAlt className="text-brand-green-500" /> {dealer.area}
                  </p>
                  <div className="flex items-center gap-2 text-brand-green-600 font-bold text-sm">
                    View Details & Contact →
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dealer Detail Modal */}
      <AnimatePresence>
        {selectedDealer && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden relative"
            >
              <button onClick={() => setSelectedDealer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
              
              <div className="bg-brand-green-600 p-8 text-center text-white">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                  <FaStore />
                </div>
                <h2 className="text-2xl font-bold">{selectedDealer.name}</h2>
                <p className="text-brand-green-100 flex items-center justify-center gap-1 mt-1">
                  <FaMapMarkerAlt /> {selectedDealer.area}
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
                    <FaBoxOpen /> Available Stock
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xl font-bold text-brand-green-600 leading-none">{selectedDealer.stock.bios}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Bios</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-brand-green-600 leading-none">{selectedDealer.stock.fertilizers}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Fert</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-brand-green-600 leading-none">{selectedDealer.stock.pesticides}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Pest</div>
                    </div>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${selectedDealer.phone.replace(/[^0-9]/g, '')}?text=Hello ${selectedDealer.name}, I am interested in Prinstan products.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/30 hover:bg-[#128C7E] transition-all"
                >
                  <FaWhatsapp size={20} /> Send Requirement
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals (Login/Register) */}
      <AnimatePresence>
        {(showLogin || showRegister) && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="bg-brand-green-600 p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold">{showLogin ? "Login" : "Register"}</h2>
                <button onClick={() => { setShowLogin(false); setShowRegister(false); }} className="text-white">
                  <FaTimes />
                </button>
              </div>
              
              {showLogin ? (
                <div className="p-8 space-y-6">
                  <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-xl font-bold text-gray-700 shadow-sm">
                    <FaGoogle className="text-red-500" /> Sign in with Google
                  </button>
                  <div className="relative text-center"><span className="bg-white px-2 text-gray-400 text-xs font-bold uppercase">OR</span></div>
                  <form onSubmit={handleEmailLinkLogin} className="space-y-4">
                    <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-green-500" />
                    <button type="submit" disabled={isSendingLink} className="w-full bg-brand-green-600 text-white py-3 rounded-xl font-bold">
                      {isSendingLink ? "Sending..." : "Login with Link"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-8">
                   {!user ? (
                     <div className="text-center space-y-4">
                        <p className="text-gray-600">Please login first to register.</p>
                        <button onClick={() => { setShowRegister(false); setShowLogin(true); }} className="bg-brand-green-100 text-brand-green-700 font-bold px-6 py-2 rounded-lg">Go to Login</button>
                     </div>
                   ) : (
                     <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <input required name="name" placeholder="Name" onChange={handleRegisterChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" />
                        <input required name="area" placeholder="Area" onChange={handleRegisterChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" />
                        <input required name="phone" placeholder="Phone" onChange={handleRegisterChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" />
                        <div className="grid grid-cols-3 gap-2">
                           <input type="number" name="bios" placeholder="Bios" onChange={handleRegisterChange} className="w-full px-2 py-2 border rounded-lg" />
                           <input type="number" name="fertilizers" placeholder="Fert" onChange={handleRegisterChange} className="w-full px-2 py-2 border rounded-lg" />
                           <input type="number" name="pesticides" placeholder="Pest" onChange={handleRegisterChange} className="w-full px-2 py-2 border rounded-lg" />
                        </div>
                        <button type="submit" disabled={isRegistering} className="w-full bg-brand-green-600 text-white py-3 rounded-xl font-bold">
                          {isRegistering ? "Registering..." : "Complete"}
                        </button>
                     </form>
                   )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dealers;
