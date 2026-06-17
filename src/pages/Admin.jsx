import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, FaImages, FaUsers, FaChartLine, 
  FaPlus, FaTrash, FaEdit, FaSave, 
  FaSignOutAlt, FaLock, FaUpload, FaCheckCircle,
  FaArrowLeft, FaEye, FaSync, FaTimes, FaPlayCircle,
  FaBars, FaMapMarkerAlt, FaBoxOpen, FaAward, FaBuilding,
  FaClock, FaPhoneAlt, FaShoppingCart, FaWhatsapp, FaCalendarAlt,
  FaRupeeSign, FaCheck, FaTimesCircle, FaExclamationCircle
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import productsData from '../data/products.json';
import preloadedImages from '../data/gallery.json';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const authorizedEmails = [
    'pratheekmadupu0@gmail.com', 
    'pratheekmadupu2006@gmail.com',
    'admin@prinstan.com',
    'c.viswanthreddy@gmail.com',
    'prinstanagricarepvtltd2025@gmail.com'
  ];

  // Data States
  const [products, setProducts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Bio', description: '', 
    crop: '', dosage: '', packing: '', image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Gallery Form State
  const [galleryTitle, setGalleryTitle] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(15);

  // Dealer Form State
  const [newDealer, setNewDealer] = useState({
    name: '', area: '', address: '', phone: '',
    hours: '9:00 AM - 6:00 PM', category: 'Authorized Dealer',
    image: '', stock: { bioNutrious: 10, pesticides: 10 }
  });
  const [isEditingDealer, setIsEditingDealer] = useState(false);
  const [editDealerId, setEditDealerId] = useState(null);
  const [uploadingDealerImage, setUploadingDealerImage] = useState(false);
  const [dealersVisibleCount, setDealersVisibleCount] = useState(10);

  // Order List Filters
  const [orderTypeFilter, setOrderTypeFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const userEmail = u.email?.toLowerCase().trim();
        setIsAuthorized(authorizedEmails.map(e => e.toLowerCase().trim()).includes(userEmail));
      } else {
        setUser(null);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    // Fetch Products
    const prodRef = ref(db, 'products');
    const unsubscribeProd = onValue(prodRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(list);
      } else {
        setProducts([]);
      }
    });

    // Fetch Dealers
    const dealRef = ref(db, 'dealers');
    const unsubscribeDeal = onValue(dealRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setDealers(list);
      } else {
        setDealers([]);
      }
    });

    // Fetch Gallery
    const gallRef = ref(db, 'gallery');
    const unsubscribeGall = onValue(gallRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setGallery(list);
      } else {
        setGallery([]);
      }
    });

    // Fetch Orders
    const ordRef = ref(db, 'orders');
    const unsubscribeOrd = onValue(ordRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setOrders(list);
      } else {
        setOrders([]);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeProd();
      unsubscribeDeal();
      unsubscribeGall();
      unsubscribeOrd();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  const handleLogout = () => signOut(auth);

  // --- Product Functions ---
  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const storageRef = sRef(storage, `products/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setNewProduct({ ...newProduct, image: url });
      alert("Image uploaded!");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        await set(ref(db, `products/${editId}`), newProduct);
        alert("Product updated!");
      } else {
        await push(ref(db, 'products'), newProduct);
        alert("Product added!");
      }
      resetProductForm();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  const resetProductForm = () => {
    setNewProduct({ name: '', category: 'Bio', description: '', crop: '', dosage: '', packing: '', image: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (p) => {
    setNewProduct({
      name: p.name || '',
      category: p.category || 'Bio',
      description: p.description || p.desc || '',
      crop: p.crop || '',
      dosage: p.dosage || '',
      packing: p.packing || '',
      image: p.image || ''
    });
    setIsEditing(true);
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await remove(ref(db, `products/${id}`));
    }
  };

  const syncProducts = async () => {
    if (window.confirm("Import missing products from local file?")) {
      const prodRef = ref(db, 'products');
      const updates = {};
      productsData.forEach(p => {
        const exists = products.find(existing => existing.name === p.name);
        if (!exists) {
          const newKey = push(prodRef).key;
          updates[newKey] = p;
        }
      });
      if (Object.keys(updates).length > 0) {
        await update(prodRef, updates);
        alert("Sync Complete!");
      } else {
        alert("All products are already synced.");
      }
    }
  };

  // --- Gallery Functions ---
  const handleGalleryUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!galleryTitle) {
      alert("Please enter a title for this media first.");
      return;
    }
    setUploadingGallery(true);
    const storageRef = sRef(storage, `gallery/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await push(ref(db, 'gallery'), { 
        url, 
        type, 
        title: galleryTitle,
        createdAt: new Date().toISOString() 
      });
      setGalleryTitle('');
      alert("Media added to gallery!");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingGallery(false);
    }
  };

  const syncGallery = async () => {
    if (window.confirm(`Sync all ${preloadedImages.length} optimized archive captures to the gallery database?`)) {
      const gallRef = ref(db, 'gallery');
      const updates = {};
      
      preloadedImages.forEach(item => {
        const exists = gallery.find(existing => existing.id === item.id || existing.url === item.url);
        if (!exists) {
          const newKey = push(gallRef).key;
          updates[newKey] = {
            id: item.id,
            url: item.url,
            thumbnailUrl: item.thumbnailUrl,
            title: item.title,
            category: item.category || 'Field Trials',
            type: 'image',
            createdAt: new Date().toISOString()
          };
        }
      });
      
      const videoExists = gallery.find(existing => existing.url === '/main.mp4');
      if (!videoExists) {
        const newKey = push(gallRef).key;
        updates[newKey] = {
          id: 'main_video',
          url: '/main.mp4',
          title: 'Company Overview',
          type: 'video',
          category: 'Company Video',
          createdAt: new Date().toISOString()
        };
      }
      
      if (Object.keys(updates).length > 0) {
        await update(gallRef, updates);
        alert("Gallery sync complete! All captures are now live and fully editable in this portal.");
      } else {
        alert("All archive captures are already present in your live database.");
      }
    }
  };

  const deleteGalleryItem = async (id) => {
    if (window.confirm("Delete this gallery item?")) {
      await remove(ref(db, `gallery/${id}`));
    }
  };

  const updateGalleryTitle = async (id, currentTitle) => {
    const newTitle = window.prompt("Enter new title:", currentTitle);
    if (newTitle !== null) {
      await update(ref(db, `gallery/${id}`), { title: newTitle });
    }
  };

  // --- Dealer Functions ---
  const handleDealerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingDealerImage(true);
    const storageRef = sRef(storage, `dealers/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setNewDealer(prev => ({ ...prev, image: url }));
      alert("Dealer storefront photo uploaded!");
    } catch (err) {
      alert("Storefront photo upload failed!");
    } finally {
      setUploadingDealerImage(false);
    }
  };

  const saveDealer = async (e) => {
    e.preventDefault();
    try {
      const finalImage = newDealer.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800';
      const dealerPayload = {
        ...newDealer,
        image: finalImage,
        createdAt: new Date().toISOString()
      };
      
      if (isEditingDealer && editDealerId) {
        await set(ref(db, `dealers/${editDealerId}`), {
          ...dealerPayload,
          uid: editDealerId
        });
        alert("Dealer profile updated!");
      } else {
        const newKey = push(ref(db, 'dealers')).key;
        await set(ref(db, `dealers/${newKey}`), {
          ...dealerPayload,
          uid: newKey
        });
        alert("Dealer partner added!");
      }
      resetDealerForm();
    } catch (err) {
      alert("Failed to save dealer: " + err.message);
    }
  };

  const resetDealerForm = () => {
    setNewDealer({
      name: '', area: '', address: '', phone: '',
      hours: '9:00 AM - 6:00 PM', category: 'Authorized Dealer',
      image: '', stock: { bioNutrious: 10, pesticides: 10 }
    });
    setIsEditingDealer(false);
    setEditDealerId(null);
  };

  const handleEditDealerClick = (d) => {
    setNewDealer({
      name: d.name || '',
      area: d.area || '',
      address: d.address || '',
      phone: d.phone || '',
      hours: d.hours || '9:00 AM - 6:00 PM',
      category: d.category || 'Authorized Dealer',
      image: d.image || '',
      stock: {
        bioNutrious: d.stock?.bioNutrious ?? d.stock?.bios ?? 10,
        pesticides: d.stock?.pesticides ?? 10
      }
    });
    setIsEditingDealer(true);
    setEditDealerId(d.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Order Functions ---
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
      alert(`Order status updated to ${newStatus}!`);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to permanently delete this order log?")) {
      try {
        await remove(ref(db, `orders/${orderId}`));
        alert("Order deleted successfully.");
      } catch (err) {
        alert("Failed to delete order: " + err.message);
      }
    }
  };

  // Filtered Orders calculation
  const filteredOrders = orders.filter(order => {
    const matchesType = orderTypeFilter === 'All' || order.type === orderTypeFilter;
    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    return matchesType && matchesStatus;
  });

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin...</div>;

  if (!user || !isAuthorized) {
    return (
      <div className="h-screen bg-brand-green-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-brand-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-green-600 text-3xl">
            <FaLock />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-500 mb-8 font-medium">
            {!user ? "Please sign in to continue." : `Access Denied. ${user.email} is not an authorized admin.`}
          </p>
          {!user ? (
            <button onClick={handleLogin} className="w-full bg-brand-green-600 text-white py-4 rounded-2xl font-bold hover:bg-brand-green-700 transition-all flex items-center justify-center gap-3">
              Sign in with Google
            </button>
          ) : (
            <button onClick={handleLogout} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-3">
              Sign Out
            </button>
          )}
          <Link to="/" className="inline-block mt-6 text-gray-400 hover:text-brand-green-600 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <FaArrowLeft /> Back to Website
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-black text-xl text-brand-green-600">Prinstan Admin</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600">
           {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-40`}>
        <div className="p-8">
          <div className="hidden md:flex items-center gap-3 mb-10 text-brand-green-600 font-black text-xl">
             Prinstan Admin
          </div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
              { id: 'orders', icon: <FaShoppingCart />, label: 'Inquiries & Orders' },
              { id: 'products', icon: <FaBox />, label: 'Products' },
              { id: 'gallery', icon: <FaImages />, label: 'Gallery' },
              { id: 'dealers', icon: <FaUsers />, label: 'Dealers' },
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand-green-600 text-white shadow-lg shadow-brand-green-500/20' : 'text-gray-400 hover:text-brand-green-600'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t">
          <div className="flex items-center gap-3 mb-6 overflow-hidden">
            <img src={user.photoURL} alt="Admin" className="w-8 h-8 rounded-full" />
            <p className="text-xs font-bold truncate">{user.displayName}</p>
          </div>
          <button onClick={handleLogout} className="w-full text-red-500 font-bold flex items-center gap-2"><FaSignOutAlt /> Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-10 min-w-0">
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <h2 className="text-2xl md:text-3xl font-black">Dashboard</h2>
                <div className="flex flex-wrap gap-2">
                  <button onClick={syncProducts} className="bg-white px-3 py-1.5 rounded-lg border font-bold text-[10px] md:text-xs flex items-center gap-2 hover:bg-gray-50"><FaSync /> Sync Products</button>
                  <button onClick={syncGallery} className="bg-white px-3 py-1.5 rounded-lg border font-bold text-[10px] md:text-xs flex items-center gap-2 hover:bg-gray-50"><FaSync /> Sync Gallery</button>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 <div className="bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Total Orders</p>
                    <p className="text-3xl md:text-4xl font-black text-brand-green-600">{orders.length}</p>
                 </div>
                 <div className="bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Products</p>
                    <p className="text-3xl md:text-4xl font-black text-brand-green-600">{products.length}</p>
                 </div>
                 <div className="bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Gallery</p>
                    <p className="text-3xl md:text-4xl font-black text-brand-green-600">{gallery.length}</p>
                 </div>
                 <div className="bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Dealers</p>
                    <p className="text-3xl md:text-4xl font-black text-brand-green-600">{dealers.length}</p>
                 </div>
              </div>

              {/* Quick overview of latest orders */}
              <div className="bg-white rounded-3xl border shadow-sm p-6 md:p-8 mt-10">
                <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Recent Orders Logging</h3>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No orders recorded in database yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.slice().reverse().slice(0, 5).map(o => (
                      <div key={o.id} className="py-4 flex justify-between items-center text-sm">
                        <div>
                          <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded border mr-2.5 ${o.type === 'Dealer' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {o.type}
                          </span>
                          <span className="font-bold text-gray-800">{o.type === 'Dealer' ? o.storeName : o.name}</span>
                          <span className="text-xs text-gray-400 ml-2 font-medium">({o.branchArea || o.area})</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-extrabold text-gray-900 flex items-center gap-0.5"><FaRupeeSign className="text-[10px] mt-0.5" />{o.totalAmount.toLocaleString('en-IN')}</span>
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${o.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : o.status === 'Contacted' ? 'bg-brand-gold-50 text-brand-gold-600' : 'bg-red-50 text-red-500'}`}>{o.status || 'Pending'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div key="ord" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black">Customer & Dealer Orders</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Review, update fulfillment status, and follow up directly on WhatsApp</p>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  {/* Type filter selector */}
                  <select 
                    value={orderTypeFilter} 
                    onChange={e => setOrderTypeFilter(e.target.value)} 
                    className="p-2.5 border rounded-xl bg-white text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Customer">Customers</option>
                    <option value="Dealer">Dealers</option>
                  </select>

                  {/* Status filter selector */}
                  <select 
                    value={orderStatusFilter} 
                    onChange={e => setOrderStatusFilter(e.target.value)} 
                    className="p-2.5 border rounded-xl bg-white text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border p-12 text-center text-gray-500 shadow-sm">
                  <FaShoppingCart className="mx-auto text-gray-300 mb-4 text-4xl" />
                  <p className="font-bold text-lg">No Orders Found</p>
                  <p className="text-sm mt-1 text-gray-400">Try adjusting your filters or wait for customer entries.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.slice().reverse().map((order) => (
                    <div key={order.id} className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      
                      {/* Top Header Row */}
                      <div className="bg-gray-50/50 border-b p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                            order.type === 'Dealer' 
                              ? 'bg-purple-50 text-purple-600 border-purple-100' 
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {order.type === 'Dealer' ? 'Dealer Order' : 'Customer Inquiry'}
                          </span>
                          <span className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
                            <FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Status controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Status:</span>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Pending')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                              (order.status || 'Pending') === 'Pending' 
                                ? 'bg-red-500 text-white shadow-sm shadow-red-500/10' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            Pending
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Contacted')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                              order.status === 'Contacted' 
                                ? 'bg-brand-gold-500 text-dark shadow-sm' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            Contacted
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Completed')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                              order.status === 'Completed' 
                                ? 'bg-emerald-600 text-white shadow-sm' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            Completed
                          </button>
                        </div>
                      </div>

                      {/* Details Content Columns */}
                      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Side: Client Info (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                          <div>
                            <h3 className="text-xs font-bold text-gray-450 uppercase tracking-widest mb-1.5">Contact coordinates</h3>
                            <p className="font-extrabold text-lg text-gray-900 leading-snug">
                              {order.type === 'Dealer' ? order.storeName : order.name}
                            </p>
                            {order.type === 'Dealer' && (
                              <p className="text-xs text-primary font-bold mt-1">Contact Person: {order.contactPerson}</p>
                            )}
                          </div>

                          <div className="space-y-2.5 text-xs text-gray-700 font-semibold pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <FaPhoneAlt className="text-gray-400" />
                              <span>{order.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <FaMapMarkerAlt className="text-gray-400 mt-0.5 shrink-0" />
                              <div>
                                <span className="block text-gray-900 font-extrabold">{order.type === 'Dealer' ? order.branchArea : order.area}</span>
                                <span className="block text-gray-400 text-[11px] font-medium leading-relaxed mt-1">{order.address}</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="flex gap-2 pt-4">
                            <a 
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                            >
                              <FaWhatsapp size={14} /> WhatsApp Chat
                            </a>
                            <button 
                              onClick={() => deleteOrder(order.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-xl transition-colors border border-red-100 flex items-center justify-center"
                              title="Delete Order Log"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Right Side: Order Items Breakdown (7 cols) */}
                        <div className="lg:col-span-7 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                          <h3 className="text-xs font-bold text-gray-455 uppercase tracking-widest mb-1.5">Order Items & packing math</h3>
                          
                          <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-3 flex justify-between items-center text-xs">
                                <div>
                                  <p className="font-extrabold text-gray-800 uppercase tracking-tight">{item.name} ({item.size})</p>
                                  <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                    {order.type === 'Dealer' 
                                      ? `${item.cases} cases (${item.totalUnits} bottles @ ₹${item.unitPrice}/bottle)`
                                      : `${item.quantity} bottles @ ₹${item.price} each`
                                    }
                                  </p>
                                </div>
                                <span className="font-black text-gray-900 flex items-center gap-0.5">
                                  <FaRupeeSign className="text-[10px]" /> {item.total.toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Grand summary row */}
                          <div className="border-t pt-4 mt-2 flex justify-between items-center bg-brand-green-50/20 p-4 rounded-2xl border border-brand-green-100">
                            <div>
                              <span className="block text-[8px] font-black uppercase text-gray-400 tracking-wider">Total Quantity Ordered</span>
                              <span className="font-extrabold text-xs text-dark mt-0.5 block">
                                {order.type === 'Dealer' 
                                  ? `${order.totalCases} Cases (${order.totalQuantity} bottles)`
                                  : `${order.totalQuantity} bottles`
                                }
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[8px] font-black uppercase text-secondary tracking-wider">Calculated Grand Total</span>
                              <span className="font-black text-lg text-primary flex items-center justify-end gap-0.5 mt-0.5">
                                <FaRupeeSign className="text-sm mt-0.5 text-secondary" /> {order.totalAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-2xl md:text-3xl font-black mb-10">Manage Catalog</h2>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 bg-white p-6 rounded-3xl border h-fit lg:sticky lg:top-24">
                    <h3 className="font-bold mb-6 flex items-center gap-2">{isEditing ? <FaEdit /> : <FaPlus />} {isEditing ? 'Edit' : 'New'} Product</h3>
                    <form onSubmit={saveProduct} className="space-y-3">
                       <input required placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm" />
                       <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm">
                          <option>Bio</option><option>Nutrients</option><option>Pesticides</option>
                       </select>
                       <textarea required placeholder="Description" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm" />
                       <input placeholder="Crops" value={newProduct.crop} onChange={e => setNewProduct({...newProduct, crop: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm" />
                       <input placeholder="Dosage" value={newProduct.dosage} onChange={e => setNewProduct({...newProduct, dosage: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm" />
                       <input placeholder="Packing" value={newProduct.packing} onChange={e => setNewProduct({...newProduct, packing: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm" />
                       
                       <div className="border-2 border-dashed border-gray-100 p-4 rounded-xl text-center">
                          {newProduct.image ? (
                             <div className="relative group">
                                <img src={newProduct.image} className="w-full h-32 object-cover rounded-lg" />
                                <button onClick={() => setNewProduct({...newProduct, image: ''})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><FaTimes /></button>
                             </div>
                          ) : (
                             <label className="cursor-pointer text-xs font-bold text-gray-400 py-4 block">
                                {uploadingImage ? 'Uploading...' : <><FaUpload className="mx-auto mb-2 text-xl" /> Click to Upload Image</>}
                                <input type="file" className="hidden" onChange={handleProductImageUpload} disabled={uploadingImage} />
                             </label>
                          )}
                       </div>
                       <button type="submit" className="w-full bg-brand-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-green-500/20">{isEditing ? 'Update' : 'Add'} Product</button>
                       {isEditing && <button onClick={resetProductForm} className="w-full py-2 text-gray-400 font-bold text-sm">Cancel Edit</button>}
                    </form>
                  </div>
                  <div className="lg:col-span-2 space-y-3">
                     {products.map(p => (
                        <div key={p.id} className="bg-white p-3 rounded-2xl border flex items-center gap-4 hover:shadow-sm transition-all overflow-hidden">
                           <img src={p.image} className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover" />
                           <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm md:text-base truncate">{p.name}</p>
                              <p className="text-[10px] text-brand-green-600 font-bold uppercase tracking-wider">{p.category}</p>
                           </div>
                           <div className="flex gap-1 md:gap-2">
                              <button onClick={() => handleEditClick(p)} className="p-2 md:p-3 text-gray-400 hover:text-brand-green-600 hover:bg-brand-green-50 rounded-lg transition-all"><FaEdit /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 md:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><FaTrash /></button>
                           </div>
                        </div>
                     )).reverse()}
                  </div>
               </div>
            </motion.div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <motion.div key="gall" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-2xl md:text-3xl font-black mb-10">Manage Gallery</h2>
               <div className="bg-white p-6 md:p-8 rounded-3xl border shadow-sm mb-10">
                  <h3 className="font-bold mb-4 text-sm md:text-base">Add New Media</h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                     <div className="flex-1">
                        <input placeholder="Title for the media" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm" />
                     </div>
                     <div className="flex gap-2">
                        <label className="flex-1 sm:flex-none bg-brand-green-600 text-white px-4 py-3 rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2 text-xs md:text-sm">
                           {uploadingGallery ? '...' : <><FaPlus /> Image</>}
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryUpload(e, 'image')} disabled={uploadingGallery} />
                        </label>
                        <label className="flex-1 sm:flex-none bg-brand-brown-600 text-white px-4 py-3 rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2 text-xs md:text-sm">
                           {uploadingGallery ? '...' : <><FaPlus /> Video</>}
                           <input type="file" accept="video/*" className="hidden" onChange={(e) => handleGalleryUpload(e, 'video')} disabled={uploadingGallery} />
                        </label>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {[...gallery].reverse().slice(0, galleryVisibleCount).map(item => (
                     <div key={item.id} className="group relative aspect-square bg-white rounded-2xl md:rounded-3xl border overflow-hidden shadow-sm">
                        {item.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white"><FaPlayCircle size={32} /></div>
                        ) : (
                          <img src={item.thumbnailUrl || item.url} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-3 md:p-4">
                           <div className="flex justify-end gap-1 md:gap-2">
                              <button onClick={() => updateGalleryTitle(item.id, item.title)} className="bg-white p-1.5 md:p-2 rounded-lg text-brand-green-600"><FaEdit size={12} /></button>
                              <button onClick={() => deleteGalleryItem(item.id)} className="bg-red-505 p-1.5 md:p-2 rounded-lg text-white"><FaTrash size={12} /></button>
                           </div>
                           <p className="text-white text-[10px] md:text-xs font-bold truncate">{item.title}</p>
                        </div>
                     </div>
                  ))}
                  
                  {gallery.length > galleryVisibleCount && (
                     <div className="col-span-full text-center mt-6">
                        <button 
                           onClick={() => setGalleryVisibleCount(prev => prev + 15)} 
                           className="bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-brand-green-500/10"
                        >
                           Load More Archive Captures
                        </button>
                     </div>
                  )}
               </div>
            </motion.div>
          )}

          {/* DEALERS TAB */}
          {activeTab === 'dealers' && (
            <motion.div key="deal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h2 className="text-2xl md:text-3xl font-black text-gray-900">Dealer Network Administration</h2>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Configure partner profiles, storefront photos, and live inventory records</p>
                  </div>
                  {isEditingDealer && (
                     <button onClick={resetDealerForm} className="bg-gray-150 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
                        Cancel Edit
                     </button>
                  )}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-150 shadow-sm h-fit">
                     <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                        {isEditingDealer ? 'Edit Partner Profile' : 'Register New Partner'}
                     </h3>
                     
                     <form onSubmit={saveDealer} className="space-y-4">
                        <div>
                           <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dealership / Store Name</label>
                           <input required value={newDealer.name} onChange={e => setNewDealer({...newDealer, name: e.target.value})} placeholder="e.g. Balaji Agro Centers" className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-xs focus:bg-white focus:ring-2 focus:ring-brand-green-500" />
                        </div>
                        
                        <div>
                           <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">General Area / District (e.g. Guntur, AP)</label>
                           <input required value={newDealer.area} onChange={e => setNewDealer({...newDealer, area: e.target.value})} placeholder="e.g. Guntur, Andhra Pradesh" className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-xs focus:bg-white focus:ring-2 focus:ring-brand-green-500" />
                        </div>

                        <div>
                           <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Store Address</label>
                           <input required value={newDealer.address} onChange={e => setNewDealer({...newDealer, address: e.target.value})} placeholder="e.g. Shop 5, Main Bazaar Road" className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-xs focus:bg-white focus:ring-2 focus:ring-brand-green-500" />
                        </div>

                        <div>
                           <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Direct Contact Phone Number</label>
                           <input required value={newDealer.phone} onChange={e => setNewDealer({...newDealer, phone: e.target.value})} placeholder="e.g. +91 98765 43210" className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-xs focus:bg-white focus:ring-2 focus:ring-brand-green-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Operating Hours</label>
                              <input required value={newDealer.hours} onChange={e => setNewDealer({...newDealer, hours: e.target.value})} placeholder="9:00 AM - 6:00 PM" className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-xs focus:bg-white" />
                           </div>
                           <div>
                              <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Partner Tier</label>
                              <select value={newDealer.category} onChange={e => setNewDealer({...newDealer, category: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-xs focus:bg-white">
                                 <option>Authorized Dealer</option>
                                 <option>Gold Distributor</option>
                                 <option>Platinum Partner</option>
                              </select>
                           </div>
                        </div>

                        <div>
                           <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dealership Photo</label>
                           <div className="border border-dashed border-gray-200 p-4 rounded-xl text-center bg-gray-50">
                              {newDealer.image ? (
                                 <div className="relative">
                                    <img src={newDealer.image} className="w-full h-24 object-cover rounded-lg" alt="" />
                                    <button type="button" onClick={() => setNewDealer({...newDealer, image: ''})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors text-[9px]"><FaTimes /></button>
                                 </div>
                              ) : (
                                 <label className="cursor-pointer text-[10px] font-bold text-gray-400 py-3 block hover:text-brand-green-600 transition-colors">
                                    {uploadingDealerImage ? 'Uploading storefront...' : <><FaUpload className="mx-auto mb-1.5 text-base text-gray-400" /> Upload Storefront Photo</>}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleDealerImageUpload} disabled={uploadingDealerImage} />
                                 </label>
                              )}
                           </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-150/70">
                           <span className="block text-[9px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1.5 flex items-center gap-1.5"><FaBoxOpen /> Stock Quantities</span>
                           <div className="grid grid-cols-3 gap-2">
                              <div>
                                 <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 text-center">Bio</label>
                                 <input type="number" value={newDealer.stock.bioNutrious} onChange={e => setNewDealer({...newDealer, stock: {...newDealer.stock, bioNutrious: parseInt(e.target.value) || 0}})} className="w-full p-2 border border-gray-250 rounded-lg text-center text-xs font-bold" />
                              </div>
                              <div>
                                 <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 text-center">Nutrients</label>
                                 <input type="number" value={newDealer.stock.nutrients || 0} onChange={e => setNewDealer({...newDealer, stock: {...newDealer.stock, nutrients: parseInt(e.target.value) || 0}})} className="w-full p-2 border border-gray-250 rounded-lg text-center text-xs font-bold" />
                              </div>
                              <div>
                                 <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 text-center">Pest</label>
                                 <input type="number" value={newDealer.stock.pesticides} onChange={e => setNewDealer({...newDealer, stock: {...newDealer.stock, pesticides: parseInt(e.target.value) || 0}})} className="w-full p-2 border border-gray-250 rounded-lg text-center text-xs font-bold" />
                              </div>
                           </div>
                        </div>

                        <button type="submit" disabled={uploadingDealerImage} className="w-full bg-brand-green-600 hover:bg-brand-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-brand-green-500/10 uppercase tracking-widest text-[10px]">
                           {isEditingDealer ? 'Update Partner' : 'Register Partner'}
                        </button>
                     </form>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                           <thead className="bg-gray-50 border-b">
                              <tr>
                                 <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest">Dealer Partner</th>
                                 <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest">Area / Hours</th>
                                 <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest">Contact Details</th>
                                 <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest text-center">Stock Volume</th>
                                 <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {[...dealers].reverse().slice(0, dealersVisibleCount).map(d => (
                                 <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-5">
                                       <div className="flex items-center gap-3">
                                          <img 
                                             src={d.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=80'} 
                                             className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100 flex-shrink-0" 
                                             alt=""
                                          />
                                          <div>
                                             <p className="font-extrabold text-sm text-gray-900 leading-tight">{d.name}</p>
                                             <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5 shadow-sm border ${
                                                d.category === 'Platinum Partner' 
                                                   ? 'bg-amber-50 text-amber-600 border-amber-205' 
                                                    : d.category === 'Gold Distributor'
                                                   ? 'bg-slate-50 text-slate-600 border-slate-205'
                                                   : 'bg-emerald-50 text-emerald-600 border-emerald-250'
                                             }`}>
                                                {d.category || 'Authorized Dealer'}
                                             </span>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-5 text-xs font-semibold text-gray-700 leading-tight">
                                       <div className="flex items-center gap-1.5 text-gray-800"><FaMapMarkerAlt className="text-brand-green-500" /> {d.area}</div>
                                       <div className="flex items-center gap-1.5 text-gray-400 mt-1.5 font-medium"><FaClock /> {d.hours || '9:00 AM - 6:00 PM'}</div>
                                    </td>
                                    <td className="p-5 text-xs font-semibold text-gray-700">
                                       <div className="flex items-center gap-1.5 text-gray-800"><FaPhoneAlt className="text-gray-400" /> {d.phone}</div>
                                       <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[150px] font-medium">{d.email}</p>
                                    </td>
                                    <td className="p-5">
                                       <div className="flex justify-center gap-1.5">
                                          <span className="w-8 h-8 flex flex-col items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black" title="Bio">
                                             <span className="text-[7px] text-emerald-400 font-bold leading-none mb-0.5">B</span>
                                             {d.stock?.bioNutrious || d.stock?.bios || 0}
                                          </span>
                                          <span className="w-8 h-8 flex flex-col items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[9px] font-black" title="Nutrients">
                                             <span className="text-[7px] text-blue-400 font-bold leading-none mb-0.5">N</span>
                                             {d.stock?.nutrients || d.stock?.fertilizers || 0}
                                          </span>
                                          <span className="w-8 h-8 flex flex-col items-center justify-center bg-orange-50 text-orange-600 border border-orange-100 rounded-xl text-[9px] font-black" title="Pesticides">
                                             <span className="text-[7px] text-orange-400 font-bold leading-none mb-0.5">P</span>
                                             {d.stock?.pesticides || 0}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="p-5 text-right">
                                       <div className="flex justify-end gap-1">
                                          <button onClick={() => handleEditDealerClick(d)} className="text-gray-400 hover:text-brand-green-600 hover:bg-brand-green-50 p-2.5 rounded-xl transition-all" title="Edit Dealer"><FaEdit size={14} /></button>
                                          <button onClick={() => remove(ref(db, `dealers/${d.id}`))} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all" title="Delete Dealer"><FaTrash size={14} /></button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     {dealers.length > dealersVisibleCount && (
                        <div className="text-center mt-4">
                           <button 
                              onClick={() => setDealersVisibleCount(prev => prev + 10)} 
                              className="bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-brand-green-500/10"
                           >
                              Load More Distributor Profiles
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
