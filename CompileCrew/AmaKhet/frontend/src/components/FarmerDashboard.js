import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaLeaf, FaSignOutAlt, FaUser, FaMapMarkerAlt, FaSeedling, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import CropHealthCard from './dashboard/CropHealthCard';
import SoilTestingCard from './dashboard/SoilTestingCard';
import WeatherCard from './dashboard/WeatherCard';
import IrrigationCard from './dashboard/IrrigationCard';
import MandiPricesCard from './dashboard/MandiPricesCard';
import CropPlannerCard from './dashboard/CropPlannerCard';
import MarketOffersCard from './dashboard/MarketOffersCard';
import ChatbotCard from './dashboard/ChatbotCard';
import CropDiseaseCard from './dashboard/CropDiseaseCard';
import FuturePlansCard from './dashboard/FuturePlansCard';
import ContactSupportCard from './dashboard/ContactSupportCard';
import GovernmentSchemeCard from './dashboard/GovernmentSchemeCard';

import './FarmerDashboard.css';

const FarmerDashboard = ({ farmerData, onLogout }) => {
  const { t, language } = useLanguage();
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainRef = useRef(null);
  const cardsRef = useRef(null);
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  const CountUp = ({ from = 0, to = 0, duration = 1500, prefix = '', suffix = '', decimals = 0, onceSessionKey }) => {
    const [value, setValue] = useState(from);
    const startRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
      let skipAnimation = false;
      try {
        if (onceSessionKey && typeof window !== 'undefined') {
          skipAnimation = sessionStorage.getItem(onceSessionKey) === '1';
        }
      } catch (_) {}

      if (skipAnimation) {
        setValue(to);
        return;
      }

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp;
        const progress = Math.min((timestamp - startRef.current) / duration, 1);
        const eased = easeOutCubic(progress);
        const current = from + (to - from) * eased;
        const factor = Math.pow(10, decimals);
        setValue(Math.round(current * factor) / factor);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          try {
            if (onceSessionKey && typeof window !== 'undefined') {
              sessionStorage.setItem(onceSessionKey, '1');
            }
          } catch (_) {}
        }
      };

      rafRef.current = requestAnimationFrame(step);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [from, to, duration, decimals, onceSessionKey]);

    return (
      <>
        {prefix}{decimals ? value.toFixed(decimals) : Math.round(value)}{suffix}
      </>
    );
  };


  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      // Simulate chatbot response based on the message
      const response = generateChatResponse(chatMessage);
      setChatResponse(response);
      setChatMessage('');
    }
  };
  const scrollToMain = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);



  const generateChatResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('irrigat') || lowerMessage.includes('water')) {
      return "Based on current soil moisture and weather forecast, no irrigation is needed today. Schedule irrigation in 2 days when soil moisture drops below 30%.";
    } else if (lowerMessage.includes('fertiliz') || lowerMessage.includes('nutrient')) {
      return "Your soil test shows low Nitrogen levels. Apply 20 kg urea per acre within the next week for optimal crop growth.";
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      return "Your wheat crop shows no signs of pests or diseases. Continue monitoring and maintain current preventive measures.";
    } else if (lowerMessage.includes('harvest') || lowerMessage.includes('when')) {
      return "Based on current growth stage, your wheat crop will be ready for harvest in approximately 3-4 weeks.";
    } else {
      return "I'm here to help with your farming questions! Ask me about irrigation, fertilizers, pests, harvest timing, or any other farming concerns.";
    }
  };


  const hoverTexts = {
    'crop-health': t('cards.cropHealthHover'),
    'soil-testing': t('cards.soilTestingHover'),
    'weather': t('cards.weatherHover'),
    'irrigation': t('cards.irrigationHover'),
    'mandi-prices': t('cards.mandiPricesHover'),
    'crop-planner': t('cards.cropPlannerHover'),
    'market-offers': t('cards.marketOffersHover'),
    'chatbot': t('cards.chatbotHover'),
    'crop-disease': t('cards.cropDiseaseHover'),
    'scheme': 'Explore government agricultural schemes and subsidies',
    'contact-support': t('cards.contactSupportHover'),
    'future-plans': t('cards.futurePlansHover')
  };

  const dashboardCards = [
    {
      id: 'crop-health',
      title: t('cards.cropHealth'),
      bg: '/ci/croph.png',
      component: <CropHealthCard crop={farmerData.crop} />
    },
    {
      id: 'soil-testing',
      title: t('cards.soilTesting'),
      bg: '/ci/soil.png',
      component: <SoilTestingCard />
    },
    {
      id: 'weather',
      title: t('cards.weather'),
      bg: '/ci/weather.png',
      component: <WeatherCard location={farmerData.location} />
    },
    
    {
      id: 'irrigation',
      title: t('cards.smartIrrigation'),
      bg: '/ci/smartiri.png',
      component: <IrrigationCard />
    },
    
    {
      id: 'mandi-prices',
      title: t('cards.mandiPrices'),
      bg: '/ci/mandi.png',
      component: <MandiPricesCard crop={farmerData.crop} />
    },
    {
      id: 'crop-planner',
      title: t('cards.cropPlanner'),
      bg: '/ci/crop_planner.png',
      component: <CropPlannerCard />
    },
    
    {
      id: 'market-offers',
      title: t('cards.marketOffers'),
      bg: '/ci/market.png',
      component: <MarketOffersCard crop={farmerData.crop} />
    },
    {
      id: 'chatbot',
      title: t('cards.aiAssistant'),
      bg: '/ci/ai.png',
      component: (
        <ChatbotCard 
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          chatResponse={chatResponse}
          onSubmit={handleChatSubmit}
        />
      )
    },
    {
      id: 'crop-disease',
      title: t('cards.cropDisease'),
      bg: '/ci/disease.jpg',
      component: <CropDiseaseCard />
    },
    {
      id: 'scheme',
      title: t('cards.governmentScheme'),
      bg: '/ci/schemeImage.webp',
      component: <GovernmentSchemeCard />
    },
    {
      id: 'contact-support',
      title: t('cards.contactSupport'),
      bg: '/ci/support.jpg',
      component: <ContactSupportCard />
    },

    {
      id: 'future-plans',
      title: t('cards.futurePlans'),
      bg: '/ci/fp.jpg',
      component: <FuturePlansCard />
    }
  ];

  const handleCardClick = (cardId) => {
    if (cardId === 'mandi-prices') {
      window.open('https://mandi-price.vercel.app/', '_blank');
      return;
    }
    setSelectedCard(cardId);
  };

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const speakCardName = (cardId) => {
    const card = dashboardCards.find(card => card.id === cardId);
    if (card && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.title);
      
      // Set language based on current language selection
      const languageMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'or': 'or-IN',
        'pa': 'pa-IN',
        'bn': 'bn-IN',
        'ta': 'ta-IN',
        'te': 'te-IN',
        'kn': 'kn-IN'
      };
      
      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const closeCard = () => {
    setSelectedCard(null);
  };


  // If a card is selected and it's not the chatbot, show full screen
  if (selectedCard && selectedCard !== 'chatbot') {
    const selectedCardData = dashboardCards.find(card => card.id === selectedCard);
    return (
      <div className="fullscreen-view">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fullscreen-header"
        >
          <div className="container">
            <div className="fullscreen-header-content">
              <button onClick={closeCard} className="back-btn">
                <FaArrowLeft />
                {t('dashboard.backToDashboard')}
              </button>
              <div className="fullscreen-title">
                <span className="fullscreen-icon">{selectedCardData.icon}</span>
                <h1><span className="text-gradient">{selectedCardData.title}</span></h1>
              </div>
              <div className="farmer-info-mini">
                <span>{farmerData.name}</span>
                <span>•</span>
                <span>{farmerData.crop}</span>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="fullscreen-main">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="fullscreen-content"
            >
              {selectedCardData.component}
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Cursor Sphere */}
      <motion.div
        className="cursor-sphere"
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.8,
        }}
        style={{
          position: 'fixed',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.1) 50%, rgba(16, 185, 129, 0.05) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
          mixBlendMode: 'multiply',
        }}
      />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`dashboard-header ${headerScrolled ? 'header-scrolled' : ''}`}
      >
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <FaLeaf className="header-logo" />
              <h1 className="header-title">AmaKhet</h1>
            </div>
            <div className="header-right">
              <div className="farmer-info">
                <FaUser className="farmer-icon" />
                <span className="farmer-name">{farmerData.name}</span>
                <FaMapMarkerAlt className="location-icon" />
                <span className="farmer-location">
                  {farmerData.location}
                </span>
                <FaSeedling className="crop-icon" />
                <span className="farmer-crop">{farmerData.crop}</span>
              </div>

              <button onClick={onLogout} className="logout-btn">
                <FaSignOutAlt />
                {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </div>
      </motion.header>



      {/* Full-page Hero Section */}
      <section className="hero-section">
        {/* Background video (place hero.mp4 in public/) */}
        <div className="hero-video-wrapper" aria-hidden="true">
          <video className="hero-video" src="/farmerbg.mp4" autoPlay muted loop playsInline preload="auto" />
        </div>
        {/* Overlay for readability */}
        <div className="hero-overlay" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-content"
          >
            <h1 
              className="hero-title"
              dangerouslySetInnerHTML={{
                __html: t('dashboard.predictYields').replace('Crop Yields', '<span class="gradient-text">Crop Yields</span>')
              }}
            />
            <p className="hero-subtitle">
              {t('dashboard.harnessPower')}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={scrollToMain}>{t('dashboard.startPredicting')}</button>
              <button className="btn btn-secondary">{t('dashboard.learnMore')}</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-label">{t('dashboard.accuracyRate')}</div>
                <div className="stat-value"><CountUp to={95} suffix="%+" duration={1500} onceSessionKey="heroStatsCounted" /></div>
              </div>
              <div className="stat">
                <div className="stat-label">{t('dashboard.farmersTrust')}</div>
                <div className="stat-value"><CountUp to={10} suffix="K+" duration={1500} onceSessionKey="heroStatsCounted" /></div>
              </div>
              <div className="stat">
                <div className="stat-label">{t('dashboard.cropTypes')}</div>
                <div className="stat-value"><CountUp to={50} suffix="+" duration={1500} onceSessionKey="heroStatsCounted" /></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agri Stack Information Section */}
      <section className="agri-stack-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="agri-stack-content"
          >
            <div className="agri-stack-text">
              <h2 className="agri-stack-title">What is AmaKhet?</h2>
              <div className="agri-stack-description">
                <p>
                  AmaKhet is a farmer-focused digital portal designed to empower the agricultural community with modern tools and resources. It provides farmers with essential features such as a crop planner for better sowing and harvesting decisions, crop health monitoring to track plant growth and prevent losses, and soil testing to recommend the right fertilizers and nutrients for maximum yield. The portal also integrates weather updates and smart irrigation systems, ensuring that farmers can optimize water usage and safeguard crops against climate uncertainties.
                </p>
                <p>
                  Beyond cultivation support, AmaKhet helps farmers stay connected with the market. Through Mandi price and market price insights, farmers can make informed decisions about selling their produce at the best rates. The platform also comes with an AI assistant that provides quick answers, personalized advice, and solutions to common farming queries. With features like crop disease identification and remedies, as well as information about government schemes, AmaKhet ensures that farmers have access to both financial and technical support in one place.
                </p>
              </div>
            </div>
            <div className="agri-stack-visuals">
              <div className="agri-stack-image-container">
                <img 
                  src="/ci/kishan.jpg" 
                  alt="Agricultural field" 
                  className="agri-stack-field-image"
                />
                <img 
                  src="/ci/paddy.jpg" 
                  alt="Farmer portrait" 
                  className="agri-stack-farmer-image"
                />
                <div className="agri-stack-icon">
                  <div className="icon-circle">
                    <div className="icon-symbol"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main ref={mainRef} className="dashboard-main">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.2, 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="welcome-section"
          >
            <motion.h2 
              className="welcome-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="text-gradient">{t('dashboard.welcomeBack')}, {farmerData.name.toUpperCase()}! </span>👋
            </motion.h2>
            <motion.p 
              className="welcome-subtitle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {t('dashboard.clickCards')}
            </motion.p>
          </motion.div>




          {/* Simple Card Grid */}
          <div ref={cardsRef} className="simple-cards-grid">
            {dashboardCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  y: 50,
                  rotateX: -15
                }}
                animate={isCardsInView ? { 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotateX: 0
                } : { 
                  opacity: 0, 
                  scale: 0.8, 
                  y: 50,
                  rotateX: -15
                }}
                transition={{ 
                  delay: 0.1 * index,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className={`simple-card ${card.bg ? 'image-card' : ''}`}
                style={{ 
                  '--card-color': card.color,
                  backgroundImage: card.bg ? `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.5)), url(${card.bg})` : undefined,
                  backgroundSize: card.bg ? 'cover' : undefined,
                  backgroundPosition: card.bg ? 'center' : undefined
                }}
                onClick={() => handleCardClick(card.id)}
                onMouseEnter={() => handleCardHover(card.id)}
                onMouseLeave={handleCardLeave}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.h3 
                  className="card-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isCardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 + (0.1 * index), duration: 0.4 }}
                >
                  {card.title}
                </motion.h3>
                <motion.div 
                  className="card-hover-info"
                  initial={{ opacity: 0 }}
                  animate={isCardsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + (0.1 * index), duration: 0.4 }}
                >
                  {hoverTexts[card.id]}
                </motion.div>
                
                {/* Text-to-Speech Button - appears on hover */}
                {hoveredCard === card.id && (
                  <motion.button
                    className="tts-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakCardName(card.id);
                    }}
                    initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🔊
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          

          {/* AI Assistant Modal Only */}
          <AnimatePresence>
            {selectedCard === 'chatbot' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-modal-overlay"
                onClick={closeCard}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="card-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h2 className="modal-title">{t('cards.aiAssistant')}</h2>
                    <button className="close-btn" onClick={closeCard}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="modal-content">
                    {dashboardCards.find(card => card.id === 'chatbot')?.component}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>




          


        </div>
      </main>
      

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-brand">AmaKhet</h3>
              <p className="footer-desc">{t('footer.empoweringFarmers')}</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">{t('footer.quickLinks')}</h4>
              <ul className="footer-links">
                <li><a href="#">{t('footer.home')}</a></li>
                <li><a href="#">{t('footer.predictYield')}</a></li>
                <li><a href="#">{t('footer.aboutUs')}</a></li>
                <li><a href="#">{t('footer.contact')}</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">{t('footer.resources')}</h4>
              <ul className="footer-links">
                <li><a href="#">{t('footer.documentation')}</a></li>
                <li><a href="#">{t('footer.apiReference')}</a></li>
                <li><a href="#">{t('footer.supportCenter')}</a></li>
                <li><a href="#">{t('footer.privacyPolicy')}</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">{t('footer.contactInfo')}</h4>
              <ul className="footer-links">
                <li>{t('footer.email')}</li>
                <li>{t('footer.phone')}</li>
                <li>{t('footer.address')}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <p>{t('footer.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
};

export default FarmerDashboard;
