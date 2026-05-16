import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, FaImages, FaUsers, FaChartLine, 
  FaPlus, FaTrash, FaEdit, FaSave, 
  FaSignOutAlt, FaLock, FaUpload, FaCheckCircle,
  FaArrowLeft, FaEye, FaSync, FaTimes, FaPlayCircle,
  FaBars
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import productsData from '../data/products.json';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const authorizedEmails = [
    'pratheekmadupu0@gmail.com', 
    'admin@prinstan.com',
    'c.viswanthreddy@gmail.com',
    'prinstanagricarepvtltd2025@gmail.com'
  ];

  // Data States
  const [products, setProducts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Bios', description: '', 
    crop: '', dosage: '', packing: '', image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Gallery Form State
  const [galleryTitle, setGalleryTitle] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setIsAuthorized(authorizedEmails.includes(u.email?.toLowerCase()));
      } else {
        setUser(null);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    // Fetch Products
    const prodRef = ref(db, 'products');
    onValue(prodRef, (snapshot) => {
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
    onValue(dealRef, (snapshot) => {
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
    onValue(gallRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setGallery(list);
      } else {
        setGallery([]);
      }
    });

    return () => unsubscribe();
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
    setNewProduct({ name: '', category: 'Bios', description: '', crop: '', dosage: '', packing: '', image: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (p) => {
    setNewProduct({
      name: p.name || '',
      category: p.category || 'Bios',
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
    if (window.confirm("Import default images to the gallery database?")) {
      const gallRef = ref(db, 'gallery');
      const defaultItems = [
        { url: '/gallery/WhatsApp Image 2026-05-15 at 7.46.35 PM.jpeg', title: 'Field Visit', type: 'image' },
        { url: '/gallery/WhatsApp Image 2026-05-15 at 7.46.48 PM.jpeg', title: 'Product Showcase', type: 'image' },
        { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.11 PM.jpeg', title: 'Farmer Interaction', type: 'image' },
        { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.27 PM.jpeg', title: 'Crop Monitoring', type: 'image' },
        { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.48 PM.jpeg', title: 'Our Facility', type: 'image' },
        { url: '/main.mp4', title: 'Company Overview', type: 'video' }
      ];
      
      const updates = {};
      defaultItems.forEach(item => {
        const exists = gallery.find(existing => existing.url === item.url);
        if (!exists) {
          const newKey = push(gallRef).key;
          updates[newKey] = item;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        await update(gallRef, updates);
        alert("Gallery sync complete!");
      } else {
        alert("Gallery is already synced.");
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
            {!user ? "Please sign in to continue." : "Access Denied. You are not an authorized admin."}
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
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <h2 className="text-2xl md:text-3xl font-black">Dashboard</h2>
                <div className="flex flex-wrap gap-2">
                  <button onClick={syncProducts} className="bg-white px-3 py-1.5 rounded-lg border font-bold text-[10px] md:text-xs flex items-center gap-2 hover:bg-gray-50"><FaSync /> Sync Products</button>
                  <button onClick={syncGallery} className="bg-white px-3 py-1.5 rounded-lg border font-bold text-[10px] md:text-xs flex items-center gap-2 hover:bg-gray-50"><FaSync /> Sync Gallery</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
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
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-2xl md:text-3xl font-black mb-10">Manage Catalog</h2>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 bg-white p-6 rounded-3xl border h-fit lg:sticky lg:top-24">
                    <h3 className="font-bold mb-6 flex items-center gap-2">{isEditing ? <FaEdit /> : <FaPlus />} {isEditing ? 'Edit' : 'New'} Product</h3>
                    <form onSubmit={saveProduct} className="space-y-3">
                       <input required placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm" />
                       <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none text-sm">
                          <option>Bios</option><option>Fertilizers</option><option>Pesticides</option>
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
                  {gallery.map(item => (
                     <div key={item.id} className="group relative aspect-square bg-white rounded-2xl md:rounded-3xl border overflow-hidden shadow-sm">
                        {item.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white"><FaPlayCircle size={32} /></div>
                        ) : (
                          <img src={item.url} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-3 md:p-4">
                           <div className="flex justify-end gap-1 md:gap-2">
                              <button onClick={() => updateGalleryTitle(item.id, item.title)} className="bg-white p-1.5 md:p-2 rounded-lg text-brand-green-600"><FaEdit size={12} /></button>
                              <button onClick={() => deleteGalleryItem(item.id)} className="bg-red-500 p-1.5 md:p-2 rounded-lg text-white"><FaTrash size={12} /></button>
                           </div>
                           <p className="text-white text-[10px] md:text-xs font-bold truncate">{item.title}</p>
                        </div>
                     </div>
                  )).reverse()}
               </div>
            </motion.div>
          )}

          {activeTab === 'dealers' && (
            <motion.div key="deal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-2xl md:text-3xl font-black mb-10">Dealer Partners</h2>
               <div className="bg-white rounded-3xl border overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                     <thead className="bg-gray-50 border-b">
                        <tr>
                           <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest">Name</th>
                           <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest">Location</th>
                           <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest">Phone</th>
                           <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest text-center">Stock</th>
                           <th className="p-5 font-bold text-[10px] uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {dealers.map(d => (
                           <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-5">
                                 <p className="font-bold text-sm text-gray-900">{d.name}</p>
                                 <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{d.email}</p>
                              </td>
                              <td className="p-5 text-xs font-medium text-gray-600">{d.area}</td>
                              <td className="p-5 text-xs font-medium text-gray-600">{d.phone}</td>
                              <td className="p-5">
                                 <div className="flex justify-center gap-1">
                                    <span className="w-6 h-6 flex items-center justify-center bg-brand-green-50 text-brand-green-600 rounded-lg text-[9px] font-black" title="Bios">{d.stock?.bios || 0}</span>
                                    <span className="w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black" title="Fertilizers">{d.stock?.fertilizers || 0}</span>
                                    <span className="w-6 h-6 flex items-center justify-center bg-orange-50 text-orange-600 rounded-lg text-[9px] font-black" title="Pesticides">{d.stock?.pesticides || 0}</span>
                                 </div>
                              </td>
                              <td className="p-5 text-right">
                                 <button onClick={() => remove(ref(db, `dealers/${d.id}`))} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><FaTrash size={14} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
