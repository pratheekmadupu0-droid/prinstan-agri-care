import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaWhatsapp, FaPlus, FaMinus, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import SEO from '../components/SEO';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';

const Products = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState(productsData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selection states inside modal
  const [selectedSize, setSelectedSize] = useState('100 ml');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(null);

  const categories = ['All', 'Bio', 'Nutrients', 'Pesticides'];

  const getUnitPrice = (size) => {
    if (!size) return 150;
    const cleanSize = size.trim().toLowerCase().replace(/\s+/g, '');
    if (cleanSize.includes('100ml')) return 150;
    if (cleanSize.includes('250ml')) return 350;
    if (cleanSize.includes('500ml')) return 650;
    if (cleanSize.includes('1l') || cleanSize.includes('1 L')) return 1200;
    return 150; // default fallback
  };

  useEffect(() => {
    const prodRef = ref(db, 'products');
    const unsubscribe = onValue(prodRef, (snapshot) => {
      const data = snapshot.val();
      const categoryMap = { 'Fertilizers': 'Nutrients', 'Bios': 'Bio', 'Bio Nutrious': 'Bio' };
      const normalize = (p) => ({ ...p, category: categoryMap[p.category] || p.category });
      if (data) {
        const list = Object.keys(data).map(key => normalize({ id: key, ...data[key] }));
        setProducts(list);
      } else {
        setProducts(productsData.map(normalize));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    // Parse default selected size if possible
    if (product.packing) {
      const parts = product.packing.split('|').map(s => s.trim());
      if (parts.length > 0) {
        setSelectedSize(parts[0]);
      } else {
        setSelectedSize('100 ml');
      }
    } else {
      setSelectedSize('100 ml');
    }
    setQuantity(1);
  };

  const handleAddToCart = (product, size, qty) => {
    addToCart(product, size, qty);
    setAddedToast({ name: product.name, size, qty });
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation(); // prevent opening modal
    let defaultSize = '100 ml';
    if (product.packing) {
      const parts = product.packing.split('|').map(s => s.trim());
      if (parts.length > 0) defaultSize = parts[0];
    }
    addToCart(product, defaultSize, 1);
    setAddedToast({ name: product.name, size: defaultSize, qty: 1 });
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 min-h-screen pb-20"
    >
      <SEO 
        title="Products | Prinstan Agri Care Pvt Ltd | Fertilizers & Crop Care"
        description="Browse the complete catalog of Prinstan Agri Care premium crop care solutions, insecticides, plant nutrients, and organic bio stimulants."
        url="/products"
      />

      {/* Header */}
      <div className="bg-brand-green-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tight"
          >
            {t('products.title', 'Our Product Catalog')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100 max-w-2xl mx-auto"
          >
            {t('products.subtitle', 'Scientific solutions for healthy crops and higher yields')}
          </motion.p>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-150/70 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <input
                type="text"
                placeholder={t('products.searchPlaceholder', 'Search for premium crop products...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-450"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-3 rounded-xl logi-label text-xs tracking-wider transition-all transform hover:scale-105 ${
                    activeCategory === category
                      ? 'bg-primary text-white border border-primary shadow-lg shadow-primary/25'
                      : 'bg-gray-100 text-gray-650 border border-transparent hover:bg-gray-200'
                  }`}
                >
                  {t('products.categories.' + category, category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              // Parse default packaging sizes
              const packSizes = product.packing ? product.packing.split('|').map(s => s.trim()) : ['100 ml', '250 ml', '500 ml', '1 L'];
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-150/60 transition-all group cursor-pointer flex flex-col justify-between"
                  onClick={() => handleOpenModal(product)}
                >
                  {/* Top Media Container */}
                  <div className="relative h-72 overflow-hidden bg-brand-green-50/10 p-6 flex items-center justify-center border-b border-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="logi-label bg-white px-3 py-1.5 rounded-full text-primary border border-gray-150 text-[9px] shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Details & Actions Container */}
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-dark uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                        {product.description || product.desc}
                      </p>
                    </div>

                    {/* Quick Select & Add */}
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                        <span>{t('products.sizesAvailable', 'Sizes Available:')}</span>
                        <span className="text-dark">{packSizes.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                        <span>{t('products.priceRange', 'Price Range:')}</span>
                        <span className="text-brand-green-900 font-extrabold">₹150 - ₹1,200</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="flex-1 bg-light hover:bg-gray-200 text-dark py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border border-gray-200 transition-colors"
                        >
                          {t('products.viewDetails', 'View Details')}
                        </button>
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="bg-primary hover:bg-brand-green-600 text-white p-3 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors flex items-center justify-center shadow-md shadow-primary/15"
                          title="Add 100ml to Cart"
                        >
                          <FaShoppingCart size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-2xl font-bold mb-2">{t('products.noProducts', 'No Products Found')}</h3>
            <p>{t('products.tryAdjusting', 'Try adjusting your keywords or category filters.')}</p>
          </div>
        )}
      </div>

      {/* Product Details Modal with Size/Qty selection */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full flex flex-col md:flex-row relative overflow-hidden max-h-[90vh] md:max-h-[80vh] border border-gray-250"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors z-20 shadow-md border border-gray-150"
              >
                ✕
              </button>
              
              {/* Left Column: Image Showcase */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center bg-brand-green-50/10 border-r border-gray-100">
                <div className="w-full h-56 md:h-full rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              </div>
              
              {/* Right Column: Information & Add-to-Cart */}
              <div className="p-8 md:p-10 w-full md:w-1/2 flex flex-col justify-center overflow-y-auto max-h-[50vh] md:max-h-none">
                <span className="text-xs font-extrabold text-secondary uppercase tracking-widest">{selectedProduct.category}</span>
                <h2 className="text-3xl font-black text-dark uppercase tracking-tight mt-1 mb-4">{selectedProduct.name}</h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {selectedProduct.description || selectedProduct.desc}
                </p>
                
                {/* Product packing specifications */}
                <div className="space-y-4 mb-6">
                  {/* Category Size Picker */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-wider">{t('products.selectPacking', 'Select Packing Category:')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProduct.packing ? selectedProduct.packing.split('|').map(s => s.trim()) : ['100 ml', '250 ml', '500 ml', '1 L']).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                            selectedSize === size
                              ? 'bg-primary text-white border-primary shadow-md shadow-primary/10'
                              : 'bg-light text-gray-600 border-gray-250 hover:bg-gray-150'
                          }`}
                        >
                          {size} (₹{getUnitPrice(size)})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t('products.quantity', 'Quantity:')}</h4>
                    <div className="flex items-center border border-gray-250 rounded-xl overflow-hidden bg-light">
                      <button 
                        type="button" 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="p-3 text-gray-600 hover:bg-gray-250 transition-colors"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-5 text-sm font-black text-dark">{quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="p-3 text-gray-600 hover:bg-gray-250 transition-colors"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-4 mb-5 text-xs border-t border-gray-100 pt-4 font-bold">
                  <div className="text-gray-400">{t('products.dosage', 'Dosage:')} <span className="text-dark block font-semibold text-xs mt-0.5">{selectedProduct.dosage || '1 - 1.5 ml/L'}</span></div>
                  <div className="text-gray-400">{t('products.targetCrops', 'Target Crops:')} <span className="text-dark block font-semibold text-xs mt-0.5 truncate">{selectedProduct.crop || 'All Crops'}</span></div>
                </div>

                {/* Cost Display box */}
                <div className="bg-brand-green-50/20 border border-brand-green-100 rounded-2xl p-4 flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t('products.unitPrice', 'Unit Price')}</span>
                    <span className="text-sm font-black text-brand-green-950">₹{getUnitPrice(selectedSize)} {t('products.perBottle', '/ bottle')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t('products.totalEstimation', 'Total Estimation')}</span>
                    <span className="text-base font-black text-brand-green-900">₹{getUnitPrice(selectedSize) * quantity}</span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedProduct, selectedSize, quantity);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-primary hover:bg-brand-green-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> {t('products.addToCart', 'Add to Cart')}
                  </button>
                  <a 
                    href={`https://wa.me/917569598929?text=Hello,%20I%20am%20inquiring%20about%20Prinstan%20${selectedProduct.name}%20(${selectedSize}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold transition-all shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp /> {t('products.whatsappInquiry', 'WhatsApp Inquiry')}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Success Toast notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-50 bg-[#052614] text-white border border-secondary/25 p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm backdrop-blur-md"
          >
            <div className="p-2.5 bg-brand-gold-500 rounded-xl text-dark">
              <FaShoppingBag size={20} />
            </div>
            <div>
              <span className="block text-xs font-black uppercase text-secondary tracking-widest">{t('products.addedToCart', 'Added to Cart!')}</span>
              <span className="block text-xs font-semibold text-emerald-100/80 mt-0.5">{addedToast.qty}x {addedToast.name} ({addedToast.size})</span>
            </div>
            <button 
              onClick={() => setAddedToast(null)} 
              className="ml-auto text-white/50 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Products;
