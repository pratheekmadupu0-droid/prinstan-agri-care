import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import productsData from '../data/products.json';

const Products = () => {
  const { t } = useTranslation();

  const products = productsData;

  const categories = ['All', 'Bios', 'Fertilizers', 'Pesticides'];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      {/* Page Header with Video */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/products.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-brand-green-900/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl"
          >
            {t('products.title')}
          </motion.h1>
          <p className="text-xl md:text-2xl text-brand-green-50 max-w-2xl mx-auto font-medium drop-shadow-lg">{t('products.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder={t('products.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                    ? 'bg-brand-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-brand-green-100 hover:text-brand-green-700'
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-green-700">
                    {t(`products.categories.${product.category}`)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-green-600 transition-colors">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 h-10 overflow-hidden line-clamp-2">{product.description || product.desc}</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-brand-green-50 text-brand-green-700 hover:bg-brand-green-600 hover:text-white py-3 rounded-xl font-medium transition-colors">
                    <FaShoppingCart /> {t('products.inquiry')}
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
              className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full flex flex-col md:flex-row relative overflow-hidden border-2 border-brand-green-50"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-green-600 hover:text-white transition-colors z-10"
              >
                ✕
              </button>
              
              <div className="md:w-1/2 p-6 md:p-10 flex items-center justify-center relative bg-brand-green-50/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green-100 rounded-full blur-3xl -z-10 opacity-50"></div>
                <div className="w-full h-full min-h-[300px] rounded-3xl flex items-center justify-center overflow-hidden">
                   <img
                     src={selectedProduct.image}
                     alt={selectedProduct.name}
                     className="w-full h-full object-contain mix-blend-multiply"
                   />
                </div>
              </div>
              
              <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{selectedProduct.name}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm whitespace-pre-wrap overflow-y-auto max-h-40 pr-2">
                  {selectedProduct.description || selectedProduct.desc}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-brand-green-100 rounded-xl p-4 bg-brand-green-50/30">
                    <h4 className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Crop</h4>
                    <p className="text-sm font-bold text-gray-900">{selectedProduct.crop || "Cotton, Chilli, Vegetables & Other Field Crops"}</p>
                  </div>
                  <div className="border border-brand-green-100 rounded-xl p-4 bg-brand-green-50/30">
                    <h4 className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Dosage</h4>
                    <p className="text-sm font-bold text-gray-900">{selectedProduct.dosage || "1 - 1.5 ml per Liter of water"}</p>
                  </div>
                  <div className="border border-brand-green-100 rounded-xl p-4 bg-brand-green-50/30">
                    <h4 className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Packing</h4>
                    <p className="text-sm font-bold text-gray-900">{selectedProduct.packing || "100 ml | 250 ml | 500 ml | 1 L"}</p>
                  </div>
                  <div className="border border-brand-green-100 rounded-xl p-4 bg-brand-green-50/30">
                    <h4 className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Category</h4>
                    <p className="text-sm font-bold text-gray-900">{t(`products.categories.${selectedProduct.category}`) || selectedProduct.category}</p>
                  </div>
                </div>

                <div className="flex">
                  <button className="flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-green-500/30">
                    <FaWhatsapp className="text-xl" /> Product Enquiry
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
