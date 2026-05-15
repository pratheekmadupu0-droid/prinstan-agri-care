import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, FaImages, FaUsers, FaChartLine, 
  FaPlus, FaTrash, FaEdit, FaSave, 
  FaSignOutAlt, FaLock, FaUpload, FaCheckCircle,
  FaArrowLeft, FaEye, FaSync
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import productsData from '../data/products.json';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Data States
  const [products, setProducts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Bios', description: '', 
    crop: '', dosage: '', packing: '', image: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        // You can add an admin email check here
        // if (u.email === 'admin@prinstan.com') { ... }
        setUser(u);
      } else {
        setUser(null);
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

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const prodRef = ref(db, 'products');
      await push(prodRef, newProduct);
      setNewProduct({ name: '', category: 'Bios', description: '', crop: '', dosage: '', packing: '', image: '' });
      alert("Product added!");
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await remove(ref(db, `products/${id}`));
    }
  };

  const syncProducts = async () => {
    if (window.confirm("This will import all products from the local file to the database. Continue?")) {
      const prodRef = ref(db, 'products');
      const updates = {};
      productsData.forEach(p => {
        const newKey = push(prodRef).key;
        updates[newKey] = p;
      });
      await update(prodRef, updates);
      alert("Sync Complete!");
    }
  };

  // --- Gallery Functions ---
  const handleGalleryUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = sRef(storage, `gallery/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await push(ref(db, 'gallery'), { url, type, createdAt: new Date().toISOString() });
      alert("Media added to gallery!");
    } catch (err) {
      alert("Upload failed");
    }
  };

  const deleteGalleryItem = async (id) => {
    if (window.confirm("Delete this item?")) {
      await remove(ref(db, `gallery/${id}`));
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin...</div>;

  if (!user) {
    return (
      <div className="h-screen bg-brand-green-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-brand-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-green-600 text-3xl">
            <FaLock />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-500 mb-8 font-medium">Please sign in with your authorized account to manage the website.</p>
          <button onClick={handleLogin} className="w-full bg-brand-green-600 text-white py-4 rounded-2xl font-bold hover:bg-brand-green-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-green-500/30">
            Sign in with Google
          </button>
          <Link to="/" className="inline-block mt-6 text-gray-400 hover:text-brand-green-600 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <FaArrowLeft /> Back to Website
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand-green-600 rounded-xl flex items-center justify-center text-white">
              <FaBox />
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">Prinstan <span className="text-brand-green-600">Admin</span></span>
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
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand-green-600 text-white shadow-lg shadow-brand-green-500/20' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-green-600'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <img src={user.photoURL} alt="Admin" className="w-10 h-10 rounded-full border-2 border-brand-green-100" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user.displayName}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 py-3 rounded-xl transition-all">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900">System Overview</h2>
                <button onClick={syncProducts} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                  <FaSync /> Sync Local Data
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Total Products</p>
                  <p className="text-5xl font-black text-brand-green-600">{products.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Distribution Partners</p>
                  <p className="text-5xl font-black text-brand-green-600">{dealers.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Gallery Assets</p>
                  <p className="text-5xl font-black text-brand-green-600">{gallery.length}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900">Manage Catalog</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Add Form */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-10 h-fit">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaPlus className="text-brand-green-600" /> New Product</h3>
                  <form onSubmit={addProduct} className="space-y-4">
                    <input required placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-green-500 outline-none transition-all font-medium" />
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-green-500 outline-none transition-all font-medium">
                      <option>Bios</option><option>Fertilizers</option><option>Pesticides</option>
                    </select>
                    <textarea required placeholder="Description" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-green-500 outline-none transition-all font-medium" />
                    <input placeholder="Crops (e.g. Cotton, Chilli)" value={newProduct.crop} onChange={e => setNewProduct({...newProduct, crop: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-green-500 outline-none transition-all font-medium" />
                    <input placeholder="Dosage" value={newProduct.dosage} onChange={e => setNewProduct({...newProduct, dosage: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-green-500 outline-none transition-all font-medium" />
                    <input placeholder="Packing" value={newProduct.packing} onChange={e => setNewProduct({...newProduct, packing: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-green-500 outline-none transition-all font-medium" />
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Product Image</label>
                      {newProduct.image ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-gray-200">
                          <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={() => setNewProduct({...newProduct, image: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg text-xs"><FaTrash /></button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-brand-green-400 transition-all text-gray-400">
                          {uploadingImage ? <div className="animate-spin h-6 w-6 border-2 border-brand-green-600 border-t-transparent rounded-full mb-2"></div> : <FaUpload className="text-2xl mb-2" />}
                          <span className="text-sm font-bold">{uploadingImage ? "Uploading..." : "Click to Upload"}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleProductImageUpload} disabled={uploadingImage} />
                        </label>
                      )}
                    </div>

                    <button type="submit" className="w-full bg-brand-green-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-brand-green-700 transition-all">Create Product</button>
                  </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
                      <img src={p.image} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{p.name}</h4>
                        <p className="text-xs text-brand-green-600 font-bold uppercase">{p.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 text-gray-400 hover:text-brand-green-600 hover:bg-brand-green-50 rounded-xl transition-all"><FaEdit /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FaTrash /></button>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900">Gallery Assets</h2>
                <div className="flex gap-4">
                   <label className="bg-brand-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-green-700 cursor-pointer flex items-center gap-2">
                      <FaPlus /> Add Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryUpload(e, 'image')} />
                   </label>
                   <label className="bg-brand-brown-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-brown-700 cursor-pointer flex items-center gap-2">
                      <FaPlus /> Add Video
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => handleGalleryUpload(e, 'video')} />
                   </label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {gallery.map(item => (
                  <div key={item.id} className="group relative aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100">
                    {item.type === 'image' ? (
                      <img src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">Video</div>
                    )}
                    <button onClick={() => deleteGalleryItem(item.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                      <FaTrash size={12} />
                    </button>
                  </div>
                )).reverse()}
              </div>
            </motion.div>
          )}

          {activeTab === 'dealers' && (
            <motion.div key="dealers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900">Dealer Directory</h2>
              </div>
              
              <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Dealer Name</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Location</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Phone</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Stock (B|F|P)</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {dealers.map(d => (
                      <tr key={d.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-900">{d.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{d.email}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-gray-600">{d.area}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-gray-600">{d.phone}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex gap-1">
                              <span className="w-8 h-8 rounded-lg bg-brand-green-50 text-brand-green-600 flex items-center justify-center text-xs font-black">{d.stock?.bios || 0}</span>
                              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">{d.stock?.fertilizers || 0}</span>
                              <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-black">{d.stock?.pesticides || 0}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={async () => { if(window.confirm("Remove this dealer?")) await remove(ref(db, `dealers/${d.id}`)); }} className="p-3 text-gray-400 hover:text-red-500 rounded-xl transition-all">
                              <FaTrash />
                           </button>
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
