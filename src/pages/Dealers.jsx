import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, FaBoxOpen, 
  FaTimes, FaGoogle, FaWhatsapp, FaStore, FaInfoCircle,
  FaPhoneAlt, FaClock, FaEnvelope, FaUpload, FaChevronRight,
  FaCheckCircle, FaAward, FaBuilding
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { auth, googleProvider, db, storage } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Beautiful, high-end presets for dealerships if they don't upload a custom photo
const STORE_PRESETS = [
  "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800", // Modern green storefront
  "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800", // Glasshouse plant center
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800", // Natural farm supplies
  "https://images.unsplash.com/photo-1464226184884-fa280b87c3a9?auto=format&fit=crop&q=80&w=800"  // Eco farm outlet
];

const Dealers = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Email Auth States
  const [email, setEmail] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    address: '',
    phone: '',
    hours: '9:00 AM - 6:00 PM',
    category: 'Authorized Dealer',
    image: '',
    stock: {
      bios: 10,
      fertilizers: 10,
      pesticides: 10
    }
  });

  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    // Real-time listener for dealers
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
      unsubscribeDealers();
      unsubscribeAuth();
    };
  }, []);

  // Pre-populate registration form if user is already a registered dealer
  useEffect(() => {
    if (user && dealers.length > 0) {
      const existing = dealers.find(d => d.uid === user.uid);
      if (existing) {
        setFormData({
          name: existing.name || '',
          area: existing.area || '',
          address: existing.address || '',
          phone: existing.phone || '',
          hours: existing.hours || '9:00 AM - 6:00 PM',
          category: existing.category || 'Authorized Dealer',
          image: existing.image || '',
          stock: {
            bios: existing.stock?.bios ?? 10,
            fertilizers: existing.stock?.fertilizers ?? 10,
            pesticides: existing.stock?.pesticides ?? 10
          }
        });
      }
    }
  }, [user, dealers]);

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

  const handleDealerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const storageRef = sRef(storage, `dealers/${user.uid}_${Date.now()}_${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, image: url }));
      alert("Storefront photo uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsRegistering(true);
    
    // Assign a random preset if they didn't upload a custom image
    const finalImage = formData.image || STORE_PRESETS[Math.floor(Math.random() * STORE_PRESETS.length)];
    
    try {
      const newDealer = {
        name: formData.name,
        area: formData.area,
        address: formData.address || '',
        phone: formData.phone,
        hours: formData.hours || '9:00 AM - 6:00 PM',
        category: formData.category || 'Authorized Dealer',
        image: finalImage,
        stock: formData.stock,
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      };
      // Save/Update in Realtime Database
      await set(ref(db, 'dealers/' + user.uid), newDealer);
      alert("Dealer Registration Saved Successfully!");
      setShowRegister(false);
    } catch (error) {
      alert(`Failed to save: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // Helper to determine color and text alerts for stock levels
  const getStockStatus = (val) => {
    if (val >= 25) return { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', text: 'High Volume', bar: 'bg-emerald-500' };
    if (val >= 8) return { color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'Adequate', bar: 'bg-blue-500' };
    if (val > 0) return { color: 'text-amber-600 bg-amber-50 border-amber-200', text: 'Low Stock', bar: 'bg-amber-500' };
    return { color: 'text-red-600 bg-red-50 border-red-200', text: 'Out of Stock', bar: 'bg-red-300' };
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen pb-32">
      <SEO title="Dealers | Prinstan Agri Care" />
      
      {/* Luxury Curved Hero Header */}
      <div className="bg-gradient-to-br from-[#081e13] via-[#0b281a] to-[#040e09] text-white py-28 px-4 md:px-8 text-center relative overflow-hidden border-b border-[#113824]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green-950/80 border border-brand-green-500/30 text-brand-green-400 font-extrabold uppercase tracking-widest text-[9px] mb-6">
              <FaStore className="text-xs" /> Authorized Channel Partners
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              PRINSTAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-400 to-emerald-300">DISTRIBUTORS.</span>
            </h1>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto font-light leading-relaxed">
              Find verified regional dealers, consult real-time product stock, and establish direct communication for agricultural supplies.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 p-6 md:p-12">
          
          {/* Header Action Row */}
          <div className="flex justify-between items-center mb-16 flex-wrap gap-6 border-b border-gray-50 pb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <FaBuilding className="text-brand-green-600" /> Distributor Network
              </h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-2">Currently showing {dealers.length} Verified Outlets</p>
            </div>
            
            <div className="flex gap-4">
              {!user ? (
                <>
                  <button onClick={() => setShowLogin(true)} className="text-xs font-bold text-gray-600 hover:text-brand-green-600 px-6 py-3.5 border border-gray-200 rounded-2xl transition-all hover:bg-gray-50 uppercase tracking-widest">Dealer Sign In</button>
                  <button onClick={() => { setShowRegister(true); }} className="bg-brand-green-600 text-white text-xs font-bold px-8 py-3.5 rounded-2xl hover:bg-brand-green-700 transition-all shadow-lg shadow-brand-green-500/20 uppercase tracking-widest">Register Store</button>
                </>
              ) : (
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-150">
                  <button onClick={() => setShowRegister(true)} className="bg-brand-green-600 text-white text-xs font-extrabold px-5 py-3 rounded-xl hover:bg-brand-green-700 transition-all shadow-sm">
                    {dealers.some(d => d.uid === user.uid) ? 'Update My Store' : 'Complete Registration'}
                  </button>
                  <div className="hidden md:block px-2 text-left">
                    <span className="text-[10px] block font-bold text-gray-400 uppercase tracking-wider">Logged In As</span>
                    <span className="text-xs font-black text-gray-800 truncate max-w-[150px] block">{user.displayName || user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors">Sign Out</button>
                </div>
              )}
            </div>
          </div>

          {/* Core Content Grid */}
          {isLoading ? (
            <div className="py-44 text-center">
              <div className="animate-spin h-14 w-14 border-4 border-brand-green-150 border-t-brand-green-600 rounded-full mx-auto"></div>
              <p className="mt-6 text-gray-400 font-extrabold uppercase tracking-widest text-xs animate-pulse">Syncing Distributor Inventory...</p>
            </div>
          ) : dealers.length === 0 ? (
            <div className="py-32 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <FaStore className="text-7xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-500">No verified distributors registered yet.</h3>
              <p className="text-gray-400 mt-2 max-w-sm mx-auto text-sm">Become a channel partner and link your agricultural dealership to farmers in your region!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dealers.map(dealer => {
                const partnerLevel = dealer.category || 'Authorized Dealer';
                
                return (
                  <motion.div 
                    key={dealer.id}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedDealer(dealer)}
                    className="group bg-white border border-gray-150/70 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_25px_50px_rgba(20,50,30,0.08)] transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Dealership Storefront Header Image */}
                    <div className="h-44 w-full overflow-hidden relative bg-gray-100 border-b border-gray-100">
                      <img 
                        src={dealer.image || STORE_PRESETS[0]} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 ease-out" 
                        alt={dealer.name}
                      />
                      
                      {/* Partner Grade Floating Badge */}
                      <span className={`absolute top-4 left-4 text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md ${
                        partnerLevel === 'Platinum Partner' 
                          ? 'bg-amber-500 text-white border border-amber-400/30' 
                          : partnerLevel === 'Gold Distributor'
                          ? 'bg-slate-700 text-white border border-slate-600/30'
                          : 'bg-brand-green-600 text-white border border-brand-green-500/30'
                      }`}>
                        {partnerLevel}
                      </span>
                    </div>

                    {/* Dealership Info Body */}
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-brand-green-600 transition-colors">
                          {dealer.name}
                        </h3>
                        <p className="text-gray-500 text-xs flex items-center gap-2 mb-6 font-semibold">
                          <FaMapMarkerAlt className="text-brand-green-500" /> {dealer.area}
                        </p>

                        {/* Store Details Snippet */}
                        <div className="space-y-2 mb-6 text-xs text-gray-600 font-medium">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400" /> {dealer.hours || '9:00 AM - 6:00 PM'}
                          </div>
                          {dealer.address && (
                            <div className="flex items-start gap-2 truncate">
                              <FaBuilding className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="truncate">{dealer.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Summary Mini Section */}
                      <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Profile:</span>
                          <div className="flex gap-1.5">
                            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-[9px] font-black" title="Bio-Stimulants">B</span>
                            <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-[9px] font-black" title="Fertilizers">F</span>
                            <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center text-[9px] font-black" title="Crop Protection">P</span>
                          </div>
                        </div>
                        
                        <div className="text-brand-green-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Inspect <FaChevronRight size={10} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modern Detailed Side-sheet Modal */}
      <AnimatePresence>
        {selectedDealer && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05110a]/75 backdrop-blur-md"
            onClick={() => setSelectedDealer(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-y-auto max-h-[90vh] relative border border-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedDealer(null)} 
                className="absolute top-4 right-4 bg-black/40 hover:bg-red-500 text-white p-2.5 rounded-full transition-all shadow-md z-30"
              >
                <FaTimes size={14} />
              </button>
              
              {/* Detailed Header Card */}
              <div className="relative h-52 bg-brand-green-950 text-white">
                <img 
                  src={selectedDealer.image || STORE_PRESETS[0]} 
                  className="w-full h-full object-cover opacity-75"
                  alt={selectedDealer.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 border border-amber-400/20 text-white text-[9px] font-black uppercase tracking-wider mb-2">
                    <FaAward /> {selectedDealer.category || 'Authorized Dealer'}
                  </span>
                  <h2 className="text-2xl font-black tracking-wide leading-tight">{selectedDealer.name}</h2>
                  <p className="text-emerald-300 text-xs flex items-center gap-1 mt-1 font-bold">
                    <FaMapMarkerAlt /> {selectedDealer.area}
                  </p>
                </div>
              </div>

              {/* Informative Details Panel */}
              <div className="p-8 space-y-6">
                
                {/* 1. Dealership Meta Parameters */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700 bg-gray-50/70 p-4 rounded-2xl border border-gray-150">
                  <div className="space-y-3">
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Operating Hours</span>
                      <span className="flex items-center gap-1.5 text-gray-800"><FaClock className="text-brand-green-600" /> {selectedDealer.hours || '9:00 AM - 6:00 PM'}</span>
                    </div>
                    {selectedDealer.email && (
                      <div className="truncate">
                        <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Direct Email</span>
                        <span className="flex items-center gap-1.5 text-gray-800"><FaEnvelope className="text-brand-green-600" /> {selectedDealer.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 border-l border-gray-200 pl-4">
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Registered Location</span>
                      <span className="flex items-start gap-1.5 text-gray-800 leading-tight">
                        <FaBuilding className="text-brand-green-600 mt-0.5" /> {selectedDealer.address || 'Address on file'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Professional Stock Meters */}
                <div className="bg-white rounded-2xl p-5 border border-gray-150/70 shadow-sm space-y-4">
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <FaBoxOpen className="text-brand-green-600" /> Real-time Stock Profile
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Bio stock */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-gray-700">Bio-Stimulants</span>
                        <span className="text-gray-400">{selectedDealer.stock?.bios || 0} Units</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                          <div className={`h-full ${getStockStatus(selectedDealer.stock?.bios || 0).bar}`} style={{ width: `${Math.min(((selectedDealer.stock?.bios || 0) / 40) * 100, 100)}%` }}></div>
                        </div>
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStockStatus(selectedDealer.stock?.bios || 0).color}`}>
                          {getStockStatus(selectedDealer.stock?.bios || 0).text}
                        </span>
                      </div>
                    </div>

                    {/* Fert stock */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-gray-700">Liquid Fertilizers</span>
                        <span className="text-gray-400">{selectedDealer.stock?.fertilizers || 0} Units</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                          <div className={`h-full ${getStockStatus(selectedDealer.stock?.fertilizers || 0).bar}`} style={{ width: `${Math.min(((selectedDealer.stock?.fertilizers || 0) / 40) * 100, 100)}%` }}></div>
                        </div>
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStockStatus(selectedDealer.stock?.fertilizers || 0).color}`}>
                          {getStockStatus(selectedDealer.stock?.fertilizers || 0).text}
                        </span>
                      </div>
                    </div>

                    {/* Pest stock */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-gray-700">Crop Protection (Pesticides)</span>
                        <span className="text-gray-400">{selectedDealer.stock?.pesticides || 0} Units</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                          <div className={`h-full ${getStockStatus(selectedDealer.stock?.pesticides || 0).bar}`} style={{ width: `${Math.min(((selectedDealer.stock?.pesticides || 0) / 40) * 100, 100)}%` }}></div>
                        </div>
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStockStatus(selectedDealer.stock?.pesticides || 0).color}`}>
                          {getStockStatus(selectedDealer.stock?.pesticides || 0).text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={`tel:${selectedDealer.phone}`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 py-3.5 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all text-xs uppercase tracking-wider"
                  >
                    <FaPhoneAlt size={12} className="text-brand-green-600" /> Direct Call
                  </a>
                  
                  <a 
                    href={`https://wa.me/${(selectedDealer.phone || '').replace(/[^0-9]/g, '')}?text=Hello ${selectedDealer.name}, I am interested in inquiring about Prinstan product stocks at your dealership.`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-bold shadow-md shadow-green-500/20 hover:bg-[#128C7E] transition-all text-xs uppercase tracking-wider"
                  >
                    <FaWhatsapp size={14} /> Send WhatsApp
                  </a>
                </div>
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#05110a]/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ y: 55, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 55, opacity: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
            >
              <div className="bg-brand-green-950 p-6 flex justify-between items-center text-white border-b border-brand-green-900">
                <h2 className="text-lg font-black uppercase tracking-wider">{showLogin ? "Dealer Sign In" : "Register Storefront"}</h2>
                <button 
                  onClick={() => { setShowLogin(false); setShowRegister(false); }} 
                  className="bg-white/10 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              {showLogin ? (
                <div className="p-8 space-y-6">
                  <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-xl font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                    <FaGoogle className="text-red-500" /> Sign in with Google
                  </button>
                  <div className="relative text-center"><span className="bg-white px-3 text-gray-400 text-[10px] font-black uppercase tracking-widest">Or Secure Link</span></div>
                  
                  <form onSubmit={handleEmailLinkLogin} className="space-y-4">
                    <input 
                      required 
                      type="email" 
                      placeholder="Enter dealer email address" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-green-500 focus:bg-white text-sm" 
                    />
                    <button type="submit" disabled={isSendingLink} className="w-full bg-brand-green-600 hover:bg-brand-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-brand-green-500/10 uppercase tracking-widest text-xs">
                      {isSendingLink ? "Sending link..." : "Receive Sign-In Link"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-8 max-h-[75vh] overflow-y-auto">
                   {!user ? (
                     <div className="text-center py-6 space-y-4">
                        <p className="text-gray-500 text-sm font-semibold">Please authenticate first to access store registration.</p>
                        <button onClick={() => { setShowRegister(false); setShowLogin(true); }} className="bg-brand-green-100 hover:bg-brand-green-200 text-brand-green-800 font-extrabold px-8 py-3 rounded-xl transition-all text-xs uppercase tracking-wider">Secure Login</button>
                     </div>
                   ) : (
                     <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Store / Dealership Name</label>
                          <input required name="name" value={formData.name} onChange={handleRegisterChange} placeholder="e.g. Balaji Agro Centers" className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:bg-white text-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Region / Area (District, State)</label>
                          <input required name="area" value={formData.area} onChange={handleRegisterChange} placeholder="e.g. Guntur, Andhra Pradesh" className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:bg-white text-sm" />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dealership Full Address</label>
                          <input required name="address" value={formData.address} onChange={handleRegisterChange} placeholder="e.g. Shop No 4, Main Road, Guntur" className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:bg-white text-sm" />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Direct Contact Number</label>
                          <input required name="phone" value={formData.phone} onChange={handleRegisterChange} placeholder="e.g. +91 9876543210" className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:bg-white text-sm" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Operating Hours</label>
                            <input required name="hours" value={formData.hours} onChange={handleRegisterChange} placeholder="e.g. 9:00 AM - 7:00 PM" className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:bg-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Partner Grade</label>
                            <select name="category" value={formData.category} onChange={handleRegisterChange} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:bg-white text-sm">
                              <option>Authorized Dealer</option>
                              <option>Gold Distributor</option>
                              <option>Platinum Partner</option>
                            </select>
                          </div>
                        </div>

                        {/* Storefront Image Uploader */}
                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Storefront Photo</label>
                          <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center bg-gray-50">
                            {formData.image ? (
                              <div className="relative group">
                                <img src={formData.image} className="w-full h-24 object-cover rounded-lg" alt="" />
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors text-xs"><FaTimes /></button>
                              </div>
                            ) : (
                              <label className="cursor-pointer text-[10px] font-bold text-gray-400 py-3 block hover:text-brand-green-600 transition-colors">
                                {uploadingImage ? 'Uploading Photo...' : <><FaUpload className="mx-auto mb-2 text-lg text-gray-400" /> Click to Upload Custom Photo</>}
                                <input type="file" accept="image/*" className="hidden" onChange={handleDealerImageUpload} disabled={uploadingImage} />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Stock Slider Fields */}
                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-150">
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1.5"><FaBoxOpen /> Stock Quantities (Units)</label>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bios</span>
                              <input type="number" name="bios" value={formData.stock.bios} onChange={handleRegisterChange} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs text-center font-bold" />
                            </div>
                            <div>
                              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Fert</span>
                              <input type="number" name="fertilizers" value={formData.stock.fertilizers} onChange={handleRegisterChange} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs text-center font-bold" />
                            </div>
                            <div>
                              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pest</span>
                              <input type="number" name="pesticides" value={formData.stock.pesticides} onChange={handleRegisterChange} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs text-center font-bold" />
                            </div>
                          </div>
                        </div>

                        <button type="submit" disabled={isRegistering} className="w-full bg-brand-green-600 hover:bg-brand-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-brand-green-500/10 uppercase tracking-widest text-xs">
                          {isRegistering ? "Saving Profile..." : "Save Store Details"}
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
