import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t } = useTranslation();

  const products = [
    { id: 1, name: t('products.items.p1Name'), category: 'Bios', image: '/product_1.jpeg', desc: t('products.items.p1Desc') },
    { id: 2, name: t('products.items.p2Name'), category: 'Fertilizers', image: '/product_2.jpeg', desc: t('products.items.p2Desc') },
    { id: 3, name: t('products.items.p3Name'), category: 'Pesticides', image: '/product_3.jpeg', desc: t('products.items.p3Desc') },
    { id: 4, name: t('products.items.p4Name'), category: 'Bios', image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0a5015?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: t('products.items.p4Desc') },
    { id: 5, name: t('products.items.p5Name'), category: 'Fertilizers', image: 'https://images.unsplash.com/photo-1563514253386-4b2a3c748c08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: t('products.items.p5Desc') },
    { id: 6, name: t('products.items.p6Name'), category: 'Pesticides', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: t('products.items.p6Desc') },
    { id: 7, name: t('products.items.p7Name'), category: 'Fertilizers', image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: t('products.items.p7Desc') },
    { id: 8, name: t('products.items.p8Name'), category: 'Bios', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: t('products.items.p8Desc') },
    ...Array.from({ length: 56 }, (_, i) => ({
      id: i + 9,
      name: `Prinstan Product ${i + 1}`,
      category: ['Bios', 'Fertilizers', 'Pesticides'][i % 3],
      image: `/prinstan_products/Prinstan Single Page Mokups_pages-to-jpg-${String(i + 1).padStart(4, '0')}.jpg`,
      desc: `Prinstan Product Image ${i + 1}`
    }))
  ];

  const categories = ['All', 'Bios', 'Fertilizers', 'Pesticides'];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      {/* Page Header */}
      <div className="bg-brand-green-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('products.title')}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t('products.subtitle')}</p>
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
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100"
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
                  <p className="text-gray-600 text-sm mb-6 h-10">{product.desc}</p>
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
    </motion.div>
  );
};

export default Products;
