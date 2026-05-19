import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import SEO from '../components/SEO';
import productsData from '../data/products.json';

const Products = () => {
  const { t } = useTranslation();

  const [products, setProducts] = useState(productsData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Bios', 'Fertilizers', 'Pesticides'];

  useEffect(() => {
    const prodRef = ref(db, 'products');
    const unsubscribe = onValue(prodRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(list);
      } else {
        setProducts(productsData);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 min-h-screen pb-20"
    >
      <SEO 
        title="Products | Prinstan Agri Care Pvt Ltd | Fertilizers & Crop Care"
        description="Explore Prinstan Agri Care Pvt Ltd's premium agricultural products, including bio-fertilizers, pesticides, and crop protection solutions."
        keywords="Prinstan products, agri products, fertilizers, pesticides, crop care, Prinstan Agri Care"
        url="/products"
      />
      
      {/* Clean Products Video Section */}
      <section className="relative w-full h-[60vh] md:h-screen overflow-hidden bg-black">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/products.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Page Header - Logi Style */}
      <div className="bg-white py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-left"
          >
            <h2 className="logi-label text-brand-green-600 mb-6">Premium Agricultural Supplies</h2>
            <h1 className="text-[10vw] logi-heading text-brand-green-900 mb-8">
              OUR<br />
              <span className="text-brand-green-500">PRODUCTS.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
              {t('products.subtitle')}
            </p>
          </motion.div>
        </div>
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-brand-green-50/50 -z-10 rounded-l-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search and Filter */}
        <div className="bg-white rounded-logi shadow-2xl p-10 mb-20 border border-brand-green-100">
          <div className="flex flex-col lg:flex-row gap-10 justify-between items-center">
            {/* Search */}
            <div className="relative w-full lg:w-[450px]">
              <input
                type="text"
                placeholder={t('products.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-full border-2 border-brand-green-50 focus:outline-none focus:border-brand-green-500 transition-all font-medium text-lg placeholder:text-gray-300"
              />
              <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-brand-green-300 text-xl" />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-8 py-4 rounded-full logi-label transition-all transform hover:scale-105 ${activeCategory === category
                    ? 'bg-brand-green-900 text-white shadow-xl shadow-brand-green-900/30'
                    : 'bg-brand-green-50 text-brand-green-600 hover:bg-brand-green-100'
                    }`}
                >
                  {t(`products.categories.${category}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                key={product.id}
                className="bg-white rounded-logi overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-gray-100 cursor-pointer flex flex-col"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-80 overflow-hidden bg-brand-green-50/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="logi-label bg-white px-4 py-2 rounded-full text-brand-green-700 shadow-lg">
                      {t(`products.categories.${product.category}`)}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-grow">
                  <h3 className="text-3xl font-black text-brand-green-900 uppercase tracking-tight mb-4 group-hover:text-brand-green-500 transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-lg mb-8 line-clamp-2 leading-relaxed">{product.description || product.desc}</p>
                  <button className="text-brand-green-900 font-black uppercase tracking-widest text-xs flex items-center gap-3 group-hover:gap-5 transition-all">
                    View Product <span className="text-xl">→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-2xl font-bold mb-2">{t('products.noProducts')}</h3>
            <p>{t('products.tryAdjusting')}</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
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
              className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full flex flex-col md:flex-row relative overflow-y-auto md:overflow-hidden max-h-[90vh] md:max-h-[85vh] border-2 border-brand-green-50"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-green-600 hover:text-white transition-colors z-20 shadow-md border border-gray-100"
              >
                ✕
              </button>
              
              <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center relative bg-brand-green-50/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green-100 rounded-full blur-3xl -z-10 opacity-50"></div>
                <div className="w-full h-48 md:h-full md:min-h-[350px] rounded-3xl flex items-center justify-center overflow-hidden">
                   <img
                     src={selectedProduct.image}
                     alt={selectedProduct.name}
                     className="w-full h-full object-contain mix-blend-multiply"
                   />
                </div>
              </div>
              
              <div className="p-6 md:p-10 w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{selectedProduct.name}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm whitespace-pre-wrap md:overflow-y-auto md:max-h-40 pr-2">
                  {selectedProduct.description || selectedProduct.desc}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-brand-green-100 rounded-xl p-3 md:p-4 bg-brand-green-50/30">
                    <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Crop</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{selectedProduct.crop || "Cotton, Chilli, Vegetables & Other Field Crops"}</p>
                  </div>
                  <div className="border border-brand-green-100 rounded-xl p-3 md:p-4 bg-brand-green-50/30">
                    <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Dosage</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{selectedProduct.dosage || "1 - 1.5 ml per Liter of water"}</p>
                  </div>
                  <div className="border border-brand-green-100 rounded-xl p-3 md:p-4 bg-brand-green-50/30">
                    <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Packing</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{selectedProduct.packing || "100 ml | 250 ml | 500 ml | 1 L"}</p>
                  </div>
                  <div className="border border-brand-green-100 rounded-xl p-3 md:p-4 bg-brand-green-50/30">
                    <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Category</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{t(`products.categories.${selectedProduct.category}`) || selectedProduct.category}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={`https://wa.me/919999999999?text=Hello,%20I%20am%20interested%20in%20inquiring%20about%20the%20product:%20${encodeURIComponent(selectedProduct.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30 text-sm md:text-base cursor-pointer"
                  >
                    <FaWhatsapp className="text-xl" /> Product Enquiry
                  </a>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3.5 rounded-xl font-bold transition-all text-sm md:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Products;
