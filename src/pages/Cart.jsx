import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { 
  FaShoppingCart, FaTrash, FaPlus, FaMinus, FaUser, FaBuilding, 
  FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaCheckCircle, FaExclamationTriangle,
  FaArrowLeft, FaInfoCircle, FaRupeeSign
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { ref, get, push, set } from 'firebase/database';
import SEO from '../components/SEO';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  // Tabs: 'customer' or 'dealer'
  const [activeTab, setActiveTab] = useState('customer');

  // Customer Form State
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    area: '',
  });

  // Dealer Form State
  const [dealerForm, setDealerForm] = useState({
    storeName: '',
    branchArea: '',
    contactPerson: '',
    phone: '',
    address: '',
  });

  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unit Pricing Table according to size categories:
  // 100ml = ₹150, 250ml = ₹350, 500ml = ₹650, 1L = ₹1,200
  const getUnitPrice = (size) => {
    const cleanSize = size.trim().toLowerCase().replace(/\s+/g, '');
    if (cleanSize.includes('100ml')) return 150;
    if (cleanSize.includes('250ml')) return 350;
    if (cleanSize.includes('500ml')) return 650;
    if (cleanSize.includes('1l') || cleanSize.includes('1 L')) return 1200;
    return 150; // default fallback
  };

  // Packing Case Multipliers
  // 100ml = 50 nos, 250ml = 40 nos, 500ml = 20 nos, 1L = 10 nos
  const getCaseMultiplier = (size) => {
    const cleanSize = size.trim().toLowerCase().replace(/\s+/g, '');
    if (cleanSize.includes('100ml')) return 50;
    if (cleanSize.includes('250ml')) return 40;
    if (cleanSize.includes('500ml')) return 20;
    if (cleanSize.includes('1l') || cleanSize.includes('1 L')) return 10;
    return 10; // Default fallback
  };

  // State to hold Dealer Case Quantities (key: item.id + size)
  const [dealerCases, setDealerCases] = useState({});

  // Check Auth & Fetch Dealer profile if registered
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoadingProfile(true);
        const dealerRef = ref(db, 'dealers/' + currentUser.uid);
        get(dealerRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // Auto fill address details for registered dealer
              setDealerForm({
                storeName: data.name || '',
                branchArea: data.area || '',
                contactPerson: currentUser.displayName || data.name || '',
                phone: data.phone || '',
                address: data.address || '',
              });
              // Switch tab to dealer automatically for registered dealers convenience
              setActiveTab('dealer');
            }
          })
          .catch((err) => console.error("Error fetching dealer profile:", err))
          .finally(() => setLoadingProfile(false));
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize dealerCases state when cartItems changes
  useEffect(() => {
    const initialCases = {};
    cartItems.forEach(item => {
      const key = `${item.id}-${item.size}`;
      // Initialize with calculated cases from unit count, rounded up, min 1
      const multiplier = getCaseMultiplier(item.size);
      initialCases[key] = Math.max(1, Math.ceil(item.quantity / multiplier));
    });
    setDealerCases(initialCases);
  }, [cartItems]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDealerChange = (e) => {
    const { name, value } = e.target;
    setDealerForm(prev => ({ ...prev, [name]: value }));
  };

  // Adjust dealer cases quantity
  const handleCaseQtyChange = (itemId, size, val) => {
    const key = `${itemId}-${size}`;
    setDealerCases(prev => {
      const current = prev[key] || 1;
      const updated = Math.max(1, current + val);
      return { ...prev, [key]: updated };
    });
  };

  // Calculate customer cart total
  const getCustomerTotal = () => {
    return cartItems.reduce((acc, item) => acc + (getUnitPrice(item.size) * item.quantity), 0);
  };

  // Calculate dealer cart total
  const getDealerTotal = () => {
    return cartItems.reduce((acc, item) => {
      const key = `${item.id}-${item.size}`;
      const cases = dealerCases[key] || 1;
      const multiplier = getCaseMultiplier(item.size);
      const casePrice = getUnitPrice(item.size) * multiplier;
      return acc + (casePrice * cases);
    }, 0);
  };

  // Build and Send Customer WhatsApp Message
  const handleCustomerCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    
    const totalAmount = getCustomerTotal();
    const orderItems = cartItems.map(item => ({
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: getUnitPrice(item.size),
      total: getUnitPrice(item.size) * item.quantity
    }));

    // Payload to save in Admin panel database
    const orderPayload = {
      type: 'Customer',
      name: customerForm.name,
      phone: customerForm.phone,
      area: customerForm.area,
      address: customerForm.address,
      items: orderItems,
      totalAmount: totalAmount,
      totalQuantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      // Save order to Firebase Realtime Database
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderPayload);

      // Construct WhatsApp message
      let message = `*PRINSTAN AGRICARE - CUSTOMER INQUIRY*\n`;
      message += `===============================\n`;
      message += `*Name:* ${customerForm.name}\n`;
      message += `*Phone:* ${customerForm.phone}\n`;
      message += `*Area:* ${customerForm.area}\n`;
      message += `*Address:* ${customerForm.address}\n\n`;
      message += `*ORDER ITEMS:*\n`;
      
      orderItems.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (${item.size})\n`;
        message += `   Quantity: ${item.quantity} bottles @ ₹${item.price} each\n`;
        message += `   Subtotal: ₹${item.total}\n`;
      });
      
      message += `\n*Total Order Value:* ₹${totalAmount}\n`;
      message += `===============================\n`;
      message += `Submitted via Prinstan Agritech Portal.`;

      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917569598929?text=${encoded}`;
      
      window.open(whatsappUrl, '_blank');
      clearCart();
      alert("Order saved & inquiry message sent to corporate WhatsApp!");
      navigate('/products');
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Checkout failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build and Send Dealer WhatsApp Message
  const handleDealerCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    const totalAmount = getDealerTotal();
    const orderItems = cartItems.map(item => {
      const key = `${item.id}-${item.size}`;
      const cases = dealerCases[key] || 1;
      const multiplier = getCaseMultiplier(item.size);
      const unitPrice = getUnitPrice(item.size);
      const casePrice = unitPrice * multiplier;
      const unitsCount = cases * multiplier;
      const subtotal = casePrice * cases;

      return {
        name: item.name,
        size: item.size,
        cases: cases,
        multiplier: multiplier,
        totalUnits: unitsCount,
        unitPrice: unitPrice,
        casePrice: casePrice,
        total: subtotal
      };
    });

    const totalCasesCount = orderItems.reduce((acc, item) => acc + item.cases, 0);
    const totalUnitsCount = orderItems.reduce((acc, item) => acc + item.totalUnits, 0);

    // Payload to save in Admin panel database
    const orderPayload = {
      type: 'Dealer',
      storeName: dealerForm.storeName,
      branchArea: dealerForm.branchArea,
      contactPerson: dealerForm.contactPerson,
      phone: dealerForm.phone,
      address: dealerForm.address,
      isRegistered: !!user,
      items: orderItems,
      totalCases: totalCasesCount,
      totalQuantity: totalUnitsCount,
      totalAmount: totalAmount,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      // Save order to Firebase Realtime Database
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderPayload);

      // Construct WhatsApp message
      let message = `*PRINSTAN AGRICARE - DEALER ORDER*\n`;
      message += `===============================\n`;
      message += `*Store Name:* ${dealerForm.storeName}\n`;
      message += `*Branch/Area:* ${dealerForm.branchArea}\n`;
      message += `*Contact Person:* ${dealerForm.contactPerson}\n`;
      message += `*Phone:* ${dealerForm.phone}\n`;
      message += `*Delivery Address:* ${dealerForm.address}\n`;
      message += `*Dealer Registered:* ${user ? 'Yes (Authenticated)' : 'No (Guest Dealer)'}\n\n`;
      message += `*ORDER DETAILS (IN CASES):*\n`;

      orderItems.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (${item.size})\n`;
        message += `   Cases: ${item.cases} ctn (${item.totalUnits} bottles)\n`;
        message += `   Wholesale Rate: ₹${item.casePrice} per case (₹${item.unitPrice}/bottle)\n`;
        message += `   Subtotal: ₹${item.total}\n`;
      });

      message += `\n*Order Summary:*\n`;
      message += `*Total Cases:* ${totalCasesCount} Carton Cases\n`;
      message += `*Total Bottles:* ${totalUnitsCount} Units\n`;
      message += `*Total Order Value:* ₹${totalAmount}\n`;
      message += `===============================\n`;
      message += `Submitted via Prinstan Agritech Portal.`;

      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917569598929?text=${encoded}`;

      window.open(whatsappUrl, '_blank');
      clearCart();
      alert("Dealer order logged in database & sent to corporate WhatsApp!");
      navigate('/products');
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Checkout failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-light min-h-screen pb-28">
        <SEO title="Shopping Cart | Prinstan Agri Care" description="Review items in your Prinstan Agricare shopping cart." url="/cart" />

        {/* Header */}
        <div className="bg-brand-green-900 text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Shopping Inquiry Cart</h1>
            <p className="text-sm text-emerald-100/80 mt-2">Adjust quantities and check out directly via WhatsApp</p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 mt-20 text-center">
          <div className="bg-white rounded-[32px] border border-gray-150 shadow-xl p-8 space-y-6">
            <div className="w-20 h-20 bg-brand-green-50 rounded-full flex items-center justify-center text-primary text-3xl mx-auto">
              <FaShoppingCart />
            </div>
            <h2 className="text-2xl font-black text-dark uppercase tracking-tight">Your Cart is Empty</h2>
            <p className="text-gray-500 text-sm font-semibold">
              You haven't added any premium agritech products to your inquiry list yet.
            </p>
            <Link
              to="/products"
              className="inline-block w-full bg-brand-green-900 hover:bg-brand-green-950 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-brand-green-900/10 cursor-pointer"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen pb-28">
      <SEO title="Shopping Cart | Prinstan Agri Care" description="Review items in your Prinstan Agricare shopping cart." url="/cart" />

      {/* Header */}
      <div className="bg-brand-green-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Shopping Inquiry Cart</h1>
          <p className="text-sm text-emerald-100/80 mt-2">Adjust quantities and check out directly via WhatsApp</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Cart Items (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-150 shadow-md p-6 md:p-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-black text-dark uppercase tracking-tight">Selected Products</h2>
                <button 
                  onClick={clearCart}
                  className="text-xs font-bold text-red-505 hover:text-red-650 flex items-center gap-1.5 transition-colors"
                >
                  <FaTrash /> Clear All
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const multiplier = getCaseMultiplier(item.size);
                  const key = `${item.id}-${item.size}`;
                  const cases = dealerCases[key] || 1;
                  const unitPrice = getUnitPrice(item.size);
                  const casePrice = unitPrice * multiplier;

                  return (
                    <div key={key} className="py-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-brand-green-50/15 p-2 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0">
                          <img src={item.image} alt={item.name} className="h-full object-contain mix-blend-multiply" />
                        </div>
                        <div>
                          <span className="text-[10px] bg-brand-green-50 text-primary border border-brand-green-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{item.category}</span>
                          <h3 className="text-lg font-black text-dark uppercase tracking-tight mt-1.5">{item.name}</h3>
                          <div className="flex flex-col mt-1 space-y-0.5">
                            <span className="text-xs font-bold text-secondary uppercase">Size: {item.size}</span>
                            <span className="text-xs text-gray-500 font-semibold flex items-center gap-0.5">
                              Rate: <FaRupeeSign className="text-[10px]" /> {unitPrice} / bottle
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Control Panel depending on Tab */}
                      {activeTab === 'customer' ? (
                        /* Customer Unit Quantity Controller */
                        <div className="flex flex-col sm:items-end gap-2">
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-400 uppercase">Qty (Bottles):</span>
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-light">
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="p-2.5 text-gray-500 hover:bg-gray-250 transition-colors"
                              >
                                <FaMinus size={9} />
                              </button>
                              <span className="px-4 text-xs font-black text-dark">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="p-2.5 text-gray-500 hover:bg-gray-250 transition-colors"
                              >
                                <FaPlus size={9} />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-gray-400 hover:text-red-500 p-2.5"
                              title="Remove item"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                          {/* Unit Total Price */}
                          <span className="text-xs font-black text-dark flex items-center gap-0.5 mt-1">
                            Subtotal: <FaRupeeSign className="text-[10px]" /> {unitPrice * item.quantity}
                          </span>
                        </div>
                      ) : (
                        /* Dealer Case-based Quantity Controller */
                        <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase">Carton Cases:</span>
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-light">
                              <button 
                                onClick={() => handleCaseQtyChange(item.id, item.size, -1)}
                                className="p-2.5 text-gray-500 hover:bg-gray-250 transition-colors"
                              >
                                <FaMinus size={9} />
                              </button>
                              <span className="px-4 text-xs font-black text-dark">{cases}</span>
                              <button 
                                onClick={() => handleCaseQtyChange(item.id, item.size, 1)}
                                className="p-2.5 text-gray-500 hover:bg-gray-250 transition-colors"
                              >
                                <FaPlus size={9} />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-gray-400 hover:text-red-500 p-2.5"
                              title="Remove item"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                          {/* Case specs display */}
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-[9px] font-bold text-primary uppercase bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                              {cases} Cases = {cases * multiplier} bottles ({multiplier} nos/case)
                            </span>
                            <span className="text-xs font-black text-dark flex items-center gap-0.5">
                              Subtotal: <FaRupeeSign className="text-[10px]" /> {casePrice * cases}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Address, User Selector & Checkout Forms (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-150 shadow-md p-6 md:p-8">
              
              {/* Tab Selector buttons */}
              <div className="flex gap-2 mb-8 bg-light p-1.5 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('customer')}
                  className={`flex-1 py-3 text-center rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'customer'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  <FaUser size={12} /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dealer')}
                  className={`flex-1 py-3 text-center rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'dealer'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  <FaBuilding size={12} /> Wholesale Dealer
                </button>
              </div>

              {/* Order total amount visual summary card */}
              <div className="bg-brand-green-950 text-white rounded-2xl p-5 mb-6 border border-emerald-500/20 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12">
                  <FaShoppingCart size={100} />
                </div>
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest block">Estimated Order Value</span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-3xl font-black flex items-center gap-0.5">
                    <FaRupeeSign className="text-2xl mt-1 text-secondary" /> 
                    {activeTab === 'customer' ? getCustomerTotal().toLocaleString('en-IN') : getDealerTotal().toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-100/50">INR</span>
                </div>
                <div className="text-[10px] text-emerald-100/70 mt-3 font-semibold flex items-center gap-1.5">
                  <FaCheckCircle className="text-secondary" />
                  <span>
                    {activeTab === 'customer' 
                      ? `${cartItems.reduce((acc, item) => acc + item.quantity, 0)} total bottles in cart`
                      : `${cartItems.reduce((acc, item) => acc + (dealerCases[`${item.id}-${item.size}`] || 1), 0)} total cases in cart`
                    }
                  </span>
                </div>
              </div>

              {/* Checkout Forms Container */}
              {activeTab === 'customer' ? (
                /* CUSTOMER CHECKOUT SECTION */
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-dark uppercase tracking-tight">Customer Checkout</h3>
                    <p className="text-gray-400 text-xs mt-1">Deliver individual crop products directly to your farm</p>
                  </div>
                  
                  <form onSubmit={handleCustomerCheckout} className="space-y-4">
                    <div>
                      <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your Name</label>
                      <input 
                        required 
                        type="text" 
                        name="name" 
                        value={customerForm.name} 
                        onChange={handleCustomerChange}
                        placeholder="e.g. Anand Rao" 
                        className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Phone</label>
                      <input 
                        required 
                        type="tel" 
                        name="phone" 
                        value={customerForm.phone} 
                        onChange={handleCustomerChange}
                        placeholder="e.g. +91 9999999999" 
                        className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target Area / Village</label>
                      <input 
                        required 
                        type="text" 
                        name="area" 
                        value={customerForm.area} 
                        onChange={handleCustomerChange}
                        placeholder="e.g. Suryapet, Telangana" 
                        className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Shipping Address</label>
                      <textarea 
                        required 
                        rows="3" 
                        name="address" 
                        value={customerForm.address} 
                        onChange={handleCustomerChange}
                        placeholder="Provide detailed village name, house number, landmarks..." 
                        className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm resize-none" 
                      />
                    </div>

                    <div className="bg-brand-green-50/20 border border-brand-green-100 rounded-xl p-4 flex gap-3 text-xs text-brand-green-800">
                      <FaInfoCircle className="mt-0.5 shrink-0" />
                      <span>This order will be logged in our database and forwarded to our customer desk for regional delivery.</span>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 cursor-pointer"
                    >
                      <FaWhatsapp size={16} /> {isSubmitting ? 'Processing...' : 'Send order to WhatsApp'}
                    </button>
                  </form>
                </div>
              ) : (
                /* DEALER CHECKOUT SECTION */
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-black text-dark uppercase tracking-tight">Dealer Checkout</h3>
                      {user && (
                        <span className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-primary/20">
                          Autofilled Account
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Order in Carton Cases with bulk business distribution rules</p>
                  </div>

                  {/* Registered check alert info */}
                  {user ? (
                    <div className="bg-brand-green-50/50 border border-brand-green-200 rounded-xl p-3.5 flex gap-3 text-xs text-primary font-medium items-center">
                      <FaCheckCircle className="text-lg shrink-0" />
                      <div>
                        <span>Logged in as <strong>{user.email}</strong>. Profile coordinates loaded!</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-brand-gold-50 border border-brand-gold-200 rounded-xl p-3.5 flex gap-3 text-xs text-brand-gold-800 font-medium items-center">
                      <FaExclamationTriangle className="text-lg shrink-0" />
                      <div>
                        <span>You are checking out as a Guest. To autofill store coordinates, <Link to="/dealers" className="underline font-bold text-dark hover:text-primary">Log in / Register here</Link>.</span>
                      </div>
                    </div>
                  )}

                  {loadingProfile ? (
                    <div className="text-center py-6 text-gray-500 text-xs">Loading registered profile details...</div>
                  ) : (
                    <form onSubmit={handleDealerCheckout} className="space-y-4">
                      <div>
                        <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dealer Store / Shop Name</label>
                        <input 
                          required 
                          type="text" 
                          name="storeName" 
                          value={dealerForm.storeName} 
                          onChange={handleDealerChange}
                          placeholder="e.g. Laxmi Agro Agencies" 
                          className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Branch / Area</label>
                          <input 
                            required 
                            type="text" 
                            name="branchArea" 
                            value={dealerForm.branchArea} 
                            onChange={handleDealerChange}
                            placeholder="e.g. Guntur, AP" 
                            className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Person</label>
                          <input 
                            required 
                            type="text" 
                            name="contactPerson" 
                            value={dealerForm.contactPerson} 
                            onChange={handleDealerChange}
                            placeholder="e.g. P. Venkatesh" 
                            className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Phone</label>
                        <input 
                          required 
                          type="tel" 
                          name="phone" 
                          value={dealerForm.phone} 
                          onChange={handleDealerChange}
                          placeholder="e.g. +91 9999999999" 
                          className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm" 
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">Store Address</label>
                        <textarea 
                          required 
                          rows="3" 
                          name="address" 
                          value={dealerForm.address} 
                          onChange={handleDealerChange}
                          placeholder="Complete registered store warehouse location details..." 
                          className="w-full px-4 py-3 border border-gray-200 bg-light rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm resize-none" 
                        />
                      </div>

                      <div className="bg-brand-gold-50/20 border border-brand-gold-200/50 rounded-xl p-4 space-y-2 text-xs text-brand-gold-800">
                        <div className="font-extrabold uppercase tracking-wider flex items-center gap-1.5"><FaInfoCircle /> Dealer Carton Packaging Rules & Pricing:</div>
                        <ul className="list-disc pl-4 space-y-1.5 font-semibold text-[10px]">
                          <li>100 ml Category: 50 bottles/case (₹150/bottle | ₹7,500/case)</li>
                          <li>250 ml Category: 40 bottles/case (₹350/bottle | ₹14,000/case)</li>
                          <li>500 ml Category: 20 bottles/case (₹650/bottle | ₹13,000/case)</li>
                          <li>1 L Category: 10 bottles/case (₹1,200/bottle | ₹12,000/case)</li>
                        </ul>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 cursor-pointer"
                      >
                        <FaWhatsapp size={16} /> {isSubmitting ? 'Logging Order...' : 'Place Dealer Order via WhatsApp'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
