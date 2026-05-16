import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const predefinedResponses = {
  greetings: ['hi', 'hello', 'hey', 'start'],
  company: ['company', 'about', 'who are you', 'prinstan'],
  products: ['products', 'buy', 'seeds', 'fertilizers', 'equipment', 'irrigation'],
  projects: ['projects', 'work', 'portfolio', 'success'],
};

const Chatbot = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const isContactPage = location.pathname === '/contact';

  // Initialize first message
  useEffect(() => {
    setMessages([
      { sender: 'bot', text: t('chatbot.welcome') }
    ]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    setTimeout(() => {
      let botResponse = t('chatbot.fallback');
      const lowerInput = userMessage.toLowerCase();

      if (predefinedResponses.greetings.some(keyword => lowerInput.includes(keyword))) {
        botResponse = t('chatbot.replyGreetings');
      } else if (predefinedResponses.company.some(keyword => lowerInput.includes(keyword))) {
        botResponse = t('chatbot.replyCompany');
      } else if (predefinedResponses.products.some(keyword => lowerInput.includes(keyword))) {
        botResponse = t('chatbot.replyProducts');
      } else if (predefinedResponses.projects.some(keyword => lowerInput.includes(keyword))) {
        botResponse = t('chatbot.replyProjects');
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  if (isContactPage) {
    return (
      <motion.a
        href="https://wa.me/919550758929"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:bg-[#128C7E] transition-all z-50 cursor-pointer"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
        <span className="absolute -top-2 -right-2 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
        </span>
      </motion.a>
    );
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-green-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-brand-green-700 transition-colors z-50"
        onClick={() => setIsOpen(true)}
      >
        <FaCommentDots className="text-2xl" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100 flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            <div className="bg-brand-green-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FaRobot />
                </div>
                <div>
                  <h3 className="font-bold">{t('chatbot.header')}</h3>
                  <p className="text-xs text-brand-green-100">{t('chatbot.online')}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                      ? 'bg-brand-green-600 text-white rounded-br-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.input')}
                className="flex-1 bg-gray-100 text-sm px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all outline-none"
              />
              <button 
                type="submit" 
                className="w-10 h-10 bg-brand-green-600 rounded-full flex items-center justify-center text-white hover:bg-brand-green-700 transition-colors flex-shrink-0"
                disabled={!input.trim()}
              >
                <FaPaperPlane className="text-sm ml-[-2px]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
