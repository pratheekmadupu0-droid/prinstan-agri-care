import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, FaBoxOpen, 
  FaTimes, FaGoogle, FaWhatsapp, FaStore, FaInfoCircle
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 p-8 md:p-12">
          <div className="flex justify-between items-center mb-12 flex-wrap gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <FaStore className="text-brand-green-600" /> Dealer Directory
              </h2>
              <p className="text-gray-500 mt-2 font-medium">Currently showing {dealers.length} verified distribution partners</p>
            </div>
            
            <div className="flex gap-4">
              {!user ? (
                <>
                  <button onClick={() => setShowLogin(true)} className="text-sm font-bold text-gray-600 hover:text-brand-green-600 px-6 py-3 border border-gray-200 rounded-2xl transition-all hover:bg-gray-50">Login</button>
                  <button onClick={() => setShowRegister(true)} className="bg-brand-green-600 text-white text-sm font-bold px-8 py-3 rounded-2xl hover:bg-brand-green-700 transition-all shadow-lg shadow-brand-green-500/30">Join Network</button>
                </>
              ) : (
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <button onClick={() => setShowRegister(true)} className="bg-brand-green-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-brand-green-700 transition-all">My Registration</button>
                  <div className="hidden sm:block px-2">
                    <span className="text-xs font-bold text-gray-700">{user.displayName || user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors">Logout</button>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="py-32 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-brand-green-200 border-t-brand-green-600 rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-400 font-bold">Connecting to Dealer Network...</p>
            </div>
          ) : dealers.length === 0 ? (
            <div className="py-32 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <FaStore className="text-6xl text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No dealers registered in this region yet.</h3>
              <p className="text-gray-400 mt-2">Be the first to join our growing network!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dealers.map(dealer => (
                <motion.div 
                  key={dealer.id}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedDealer(dealer)}
                  className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl cursor-pointer transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green-50 rounded-bl-[4rem] -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-brand-green-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-brand-green-500/20">
                        <FaStore />
                      </div>
                      <span className="text-[10px] font-bold bg-brand-green-100 text-brand-green-700 px-3 py-1 rounded-full uppercase tracking-widest">Verified</span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-brand-green-600 transition-colors">{dealer.name}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-2 mb-6 font-medium">
                      <FaMapMarkerAlt className="text-brand-green-500" /> {dealer.area}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">
                            {i === 1 ? 'B' : i === 2 ? 'F' : 'P'}
                          </div>
                        ))}
                      </div>
                      <div className="text-brand-green-600 font-bold text-sm flex items-center gap-2">
                        View Details <FaInfoCircle />
                      </div>
                    </div>
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
                      <div className="text-xl font-bold text-brand-green-600 leading-none">{selectedDealer.stock?.bios || 0}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Bios</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-brand-green-600 leading-none">{selectedDealer.stock?.fertilizers || 0}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Fert</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-brand-green-600 leading-none">{selectedDealer.stock?.pesticides || 0}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Pest</div>
                    </div>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${(selectedDealer.phone || '').replace(/[^0-9]/g, '')}?text=Hello ${selectedDealer.name}, I am interested in Prinstan products.`}
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
