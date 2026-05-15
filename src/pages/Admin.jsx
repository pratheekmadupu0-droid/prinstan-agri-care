import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, FaImages, FaUsers, FaChartLine, 
  FaPlus, FaTrash, FaEdit, FaSave, 
  FaSignOutAlt, FaLock, FaUpload, FaCheckCircle,
  FaArrowLeft, FaEye, FaSync, FaTimes, FaPlayCircle
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
        { url: '/gallery/WhatsApp Image 2026-05-15 at 7.47.48 PM.jpeg', title: 'Our Facility', type: 'image' }
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

  if (!user) {
    return (
      <div className="h-screen bg-brand-green-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-brand-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-green-600 text-3xl">
            <FaLock />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-500 mb-8 font-medium">Authorized login required.</p>
          <button onClick={handleLogin} className="w-full bg-brand-green-600 text-white py-4 rounded-2xl font-bold hover:bg-brand-green-700 transition-all flex items-center justify-center gap-3">
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 text-brand-green-600 font-black text-xl">
             Prinstan Admin
          </div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
              { id: 'products', icon: <FaBox />, label: 'Products' },
              { id: 'gallery', icon: <FaImages />, label: 'Gallery' },
              { id: 'dealers', icon: <FaUsers />, label: 'Dealers' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand-green-600 text-white' : 'text-gray-400 hover:text-brand-green-600'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t">
          <button onClick={handleLogout} className="w-full text-red-500 font-bold flex items-center gap-2"><FaSignOutAlt /> Logout</button>
        </div>
      </div>

      <div className="flex-1 ml-64 p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black">Dashboard</h2>
                <div className="flex gap-4">
                  <button onClick={syncProducts} className="bg-white px-4 py-2 rounded-lg border font-bold text-xs flex items-center gap-2"><FaSync /> Sync Products</button>
                  <button onClick={syncGallery} className="bg-white px-4 py-2 rounded-lg border font-bold text-xs flex items-center gap-2"><FaSync /> Sync Gallery</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                 <div className="bg-white p-8 rounded-3xl border">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Products</p>
                    <p className="text-4xl font-black text-brand-green-600">{products.length}</p>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Gallery</p>
                    <p className="text-4xl font-black text-brand-green-600">{gallery.length}</p>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Dealers</p>
                    <p className="text-4xl font-black text-brand-green-600">{dealers.length}</p>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-3xl font-black mb-10">Manage Products</h2>
               <div className="grid grid-cols-3 gap-10">
                  <div className="col-span-1 bg-white p-6 rounded-3xl border h-fit sticky top-10">
                    <h3 className="font-bold mb-6 flex items-center gap-2">{isEditing ? <FaEdit /> : <FaPlus />} {isEditing ? 'Edit' : 'New'} Product</h3>
                    <form onSubmit={saveProduct} className="space-y-3">
                       <input required placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 outline-none" />
                       <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 outline-none">
                          <option>Bios</option><option>Fertilizers</option><option>Pesticides</option>
                       </select>
                       <textarea required placeholder="Description" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 outline-none" />
                       <input placeholder="Crops" value={newProduct.crop} onChange={e => setNewProduct({...newProduct, crop: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 outline-none" />
                       <input placeholder="Dosage" value={newProduct.dosage} onChange={e => setNewProduct({...newProduct, dosage: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 outline-none" />
                       <input placeholder="Packing" value={newProduct.packing} onChange={e => setNewProduct({...newProduct, packing: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 outline-none" />
                       
                       <div className="border-2 border-dashed p-4 rounded-xl text-center">
                          {newProduct.image ? (
                             <div className="relative">
                                <img src={newProduct.image} className="w-full h-32 object-cover rounded-lg" />
                                <button onClick={() => setNewProduct({...newProduct, image: ''})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"><FaTimes /></button>
                             </div>
                          ) : (
                             <label className="cursor-pointer">
                                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                <input type="file" className="hidden" onChange={handleProductImageUpload} disabled={uploadingImage} />
                             </label>
                          )}
                       </div>
                       <button type="submit" className="w-full bg-brand-green-600 text-white py-3 rounded-xl font-bold">{isEditing ? 'Update' : 'Add'} Product</button>
                       {isEditing && <button onClick={resetProductForm} className="w-full py-2 text-gray-400 font-bold">Cancel</button>}
                    </form>
                  </div>
                  <div className="col-span-2 space-y-3">
                     {products.map(p => (
                        <div key={p.id} className="bg-white p-3 rounded-2xl border flex items-center gap-4">
                           <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                           <div className="flex-1"><p className="font-bold">{p.name}</p><p className="text-[10px] text-gray-400">{p.category}</p></div>
                           <div className="flex gap-2">
                              <button onClick={() => handleEditClick(p)} className="p-2 text-gray-400 hover:text-brand-green-600"><FaEdit /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500"><FaTrash /></button>
                           </div>
                        </div>
                     )).reverse()}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div key="gall" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-3xl font-black mb-10">Manage Gallery</h2>
               <div className="bg-white p-8 rounded-3xl border mb-10">
                  <h3 className="font-bold mb-4">Add New Media</h3>
                  <div className="flex gap-4 items-end">
                     <div className="flex-1">
                        <input placeholder="Title for the image/video" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                     </div>
                     <label className="bg-brand-green-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer flex items-center gap-2">
                        {uploadingGallery ? '...' : <><FaPlus /> Add Image</>}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryUpload(e, 'image')} disabled={uploadingGallery} />
                     </label>
                     <label className="bg-brand-brown-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer flex items-center gap-2">
                        {uploadingGallery ? '...' : <><FaPlus /> Add Video</>}
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => handleGalleryUpload(e, 'video')} disabled={uploadingGallery} />
                     </label>
                  </div>
               </div>

               <div className="grid grid-cols-4 gap-6">
                  {gallery.map(item => (
                     <div key={item.id} className="group relative aspect-square bg-white rounded-3xl border overflow-hidden">
                        {item.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white"><FaPlayCircle size={32} /></div>
                        ) : (
                          <img src={item.url} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-4">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => updateGalleryTitle(item.id, item.title)} className="bg-white p-2 rounded-lg text-brand-green-600"><FaEdit /></button>
                              <button onClick={() => deleteGalleryItem(item.id)} className="bg-red-500 p-2 rounded-lg text-white"><FaTrash /></button>
                           </div>
                           <p className="text-white text-sm font-bold truncate">{item.title}</p>
                        </div>
                     </div>
                  )).reverse()}
               </div>
            </motion.div>
          )}

          {activeTab === 'dealers' && (
            <motion.div key="deal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-3xl font-black mb-10">Dealers</h2>
               <div className="bg-white rounded-3xl border overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b">
                        <tr>
                           <th className="p-5 font-bold text-xs uppercase text-gray-400">Name</th>
                           <th className="p-5 font-bold text-xs uppercase text-gray-400">Location</th>
                           <th className="p-5 font-bold text-xs uppercase text-gray-400">Phone</th>
                           <th className="p-5 font-bold text-xs uppercase text-gray-400">Stock</th>
                           <th className="p-5 font-bold text-xs uppercase text-gray-400">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {dealers.map(d => (
                           <tr key={d.id}>
                              <td className="p-5 font-bold">{d.name}</td>
                              <td className="p-5 text-sm">{d.area}</td>
                              <td className="p-5 text-sm">{d.phone}</td>
                              <td className="p-5">
                                 <div className="flex gap-1">
                                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-[10px] font-black">{d.stock?.bios || 0}</span>
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black">{d.stock?.fertilizers || 0}</span>
                                    <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-[10px] font-black">{d.stock?.pesticides || 0}</span>
                                 </div>
                              </td>
                              <td className="p-5">
                                 <button onClick={() => remove(ref(db, `dealers/${d.id}`))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><FaTrash /></button>
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
