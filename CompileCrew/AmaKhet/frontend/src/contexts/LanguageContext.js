import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const languages = {
    en: { name: 'English', code: 'en' },
    hi: { name: 'हिन्दी', code: 'hi' },
    or: { name: 'ଓଡ଼ିଆ', code: 'or' },
    pa: { name: 'ਪੰਜਾਬੀ', code: 'pa' },
    bn: { name: 'বাংলা', code: 'bn' },
    ta: { name: 'தமிழ்', code: 'ta' },
    te: { name: 'తెలుగు', code: 'te' },
    kn: { name: 'ಕನ್ನಡ', code: 'kn' }
  };

  const translations = {
    en: {
      // Login Page
      'login.title': 'AmaKhet',
      'login.subtitle': 'Your Smart Farming Companion',
      'login.farmerName': 'Farmer Name',
      'login.mobileNumber': 'Mobile Number',
      'login.location': 'Location',
      'login.currentCrop': 'Current Crop',
      'login.enterName': 'Enter your full name',
      'login.enterMobile': 'Enter your mobile number',
      'login.enterVillage': 'Enter your village/city',
      'login.selectCrop': 'Select your crop',
      'login.enterDashboard': 'Enter Dashboard',
      'login.empoweringFarmers': 'Empowering farmers with smart technology',
      'login.transformFarming': 'Transform Your Farming',
      'login.joinThousands': 'Join thousands of farmers using smart technology to maximize crop yields and optimize farming practices.',
      
      // Dashboard
      'dashboard.welcomeBack': 'WELCOME BACK',
      'dashboard.clickCards': 'CLICK ON ANY CARD BELOW TO SEE DETAILED INFORMATION',
      'dashboard.predictYields': 'Predict Your Crop Yields with AI',
      'dashboard.harnessPower': 'Harness the power of machine learning to optimize your farming decisions. Get accurate yield predictions based on soil conditions, weather patterns, and crop data.',
      'dashboard.startPredicting': 'Start Predicting',
      'dashboard.learnMore': 'Learn More',
      'dashboard.accuracyRate': 'Accuracy Rate',
      'dashboard.farmersTrust': 'Farmers Trust Us',
      'dashboard.cropTypes': 'Crop Types',
      'dashboard.backToDashboard': 'Back to Dashboard',
      'dashboard.logout': 'Logout',
      
      // Cards
      'cards.cropHealth': 'Crop Health',
      'cards.soilTesting': 'Soil Testing',
      'cards.weather': 'Weather',
      'cards.smartIrrigation': 'Smart Irrigation',
      'cards.mandiPrices': 'Mandi Prices',
      'cards.cropPlanner': 'Crop Planner',
      'cards.marketOffers': 'Market Offers',
      'cards.aiAssistant': 'AI Assistant',
      'cards.cropDisease': 'Crop Disease',
      'cards.futurePlans': 'Future Plans',
      'cards.contactSupport': 'Contact & Support',
      'cards.governmentScheme': 'Government Scheme',
      'cards.resources': 'Resources',
      
      // Government Scheme Card
      'govScheme.title': 'Government Agricultural Schemes',
      'govScheme.subtitle': 'Explore available subsidies, schemes, and insurance for farmers',
      'govScheme.subsidies': 'Subsidies',
      'govScheme.schemes': 'Schemes',
      'govScheme.insurance': 'Insurance',
      'govScheme.footerNote': 'For more information and application details, visit your nearest agricultural office or check the official government portal.',
      
      // Weather
      'weather.conditions': 'Weather Conditions',
      'weather.forecast': '7-Day Weather Forecast with Storm & Rain Alerts',
      'weather.feelsLike': 'Feels like',
      'weather.humidity': 'Humidity',
      'weather.wind': 'Wind',
      'weather.rainExpected': 'Rain Expected',
      'weather.thunderstormAlert': 'Thunderstorm Alert',
      'weather.farmingRecommendations': 'Farming Recommendations',
      'weather.rainExpectedDelay': 'Rain expected - delay irrigation and pesticide application',
      'weather.thunderstormSecure': 'Thunderstorm alert - secure farm equipment and avoid field work',
      'weather.highTempIrrigation': 'High temperature - increase irrigation frequency',
      'weather.lowTempProtect': 'Low temperature - protect sensitive crops',
      'weather.highHumidityMonitor': 'High humidity - monitor for fungal diseases',
      
      // Footer
      'footer.empoweringFarmers': 'Empowering farmers worldwide with AI-driven crop yield predictions for smarter agriculture.',
      'footer.quickLinks': 'Quick Links',
      'footer.resources': 'Resources',
      'footer.contactInfo': 'Contact Info',
      'footer.allRightsReserved': 'All rights reserved. Built with ❤️ for farmers worldwide.',
      
      // Dashboard Cards
      'cards.aiAssistant': 'AI Assistant',
      'cards.aiFarmingAssistant': 'AI Farming Assistant',
      'cards.online': 'Online',
      'cards.namaste': 'Namaste! 🙏',
      'cards.aiIntro': 'I\'m your AI farming assistant. Ask me anything about your crops, soil, weather, or farming practices.',
      'cards.quickQuestions': 'Quick Questions:',
      'cards.whenIrrigate': 'When should I irrigate?',
      'cards.howMuchFertilizer': 'How much fertilizer to apply?',
      'cards.isCropHealthy': 'Is my crop healthy?',
      'cards.whenHarvest': 'When to harvest?',
      'cards.bestPesticideTime': 'Best time for pesticide?',
      'cards.askFarming': 'Ask me about farming... (e.g., When should I irrigate?)',
      'cards.voiceInput': 'Voice Input',
      'cards.sendMessage': 'Send Message',
      
      // Soil Testing
      'soil.testing': 'Soil Testing',
      'soil.analyzeSoil': 'Analyze Soil',
      'soil.location': 'Location',
      'soil.cropType': 'Crop Type',
      'soil.testNow': 'Test Now',
      'soil.analysisResults': 'Soil Analysis Results:',
      'soil.ph': 'pH:',
      'soil.organicCarbon': 'Organic Carbon:',
      'soil.waterHolding': 'Water Holding:',
      'soil.surfaceMoisture': 'Surface Moisture:',
      'soil.rootzoneMoisture': 'Rootzone Moisture:',
      'soil.recommendations': 'Recommendations:',
      'soil.refreshAnalysis': 'Refresh Analysis',
      'soil.newAnalysis': 'New Analysis',
      
      // Crop Health
      'crop.health': 'Crop Health',
      'crop.analyzeCrop': 'Analyze Crop Health',
      'crop.cropType': 'Crop Type',
      'crop.growthStage': 'Growth Stage',
      'crop.analyzeNow': 'Analyze Now',
      'crop.healthResults': 'Crop Health Results:',
      'crop.healthStatus': 'Health Status:',
      'crop.diseaseRisk': 'Disease Risk:',
      'crop.pestRisk': 'Pest Risk:',
      'crop.nutrientStatus': 'Nutrient Status:',
      'crop.refreshAnalysis': 'Refresh Analysis',
      'crop.newAnalysis': 'New Analysis',
      
      // Mandi Prices
      'mandi.prices': 'Mandi Prices',
      'mandi.livePrices': 'Live Mandi Crop Prices',
      'mandi.searchPrices': 'Search Prices',
      'mandi.state': 'State',
      'mandi.district': 'District',
      'mandi.market': 'Market',
      'mandi.commodity': 'Commodity',
      'mandi.search': 'Search',
      'mandi.smartSearch': 'Smart Search',
      'mandi.allStates': 'All States',
      'mandi.error': 'Error:',
      
      // Weather Card
      'weather.currentConditions': 'Current Conditions',
      'weather.temperature': 'Temperature',
      'weather.condition': 'Condition',
      'weather.humidity': 'Humidity',
      'weather.windSpeed': 'Wind Speed',
      'weather.feelsLike': 'Feels Like',
      'weather.uvIndex': 'UV Index',
      'weather.forecast': '7-Day Forecast',
      'weather.day': 'Day',
      'weather.high': 'High',
      'weather.low': 'Low',
      'weather.precipitation': 'Precipitation',
      'weather.alerts': 'Weather Alerts',
      'weather.noAlerts': 'No weather alerts for the next 7 days',
      'weather.farmingTips': 'Farming Tips',
      'weather.refresh': 'Refresh Weather',
      'weather.thunderstorm': 'Thunderstorm',
      'weather.rainTimes': 'Rain Times',
      'weather.thunderstormAlerts': 'Thunderstorm Alerts',
      'weather.thunderstormExpected': 'Thunderstorm expected on',
      'weather.rainAlerts': 'Rain Alerts',
      'weather.rainExpected': 'Rain expected on',
      
      // Additional Dashboard Elements
      'dashboard.cropYields': 'Crop Yields',
      'dashboard.withAI': 'with AI',
      
      // Card Hover Texts
      'cards.cropHealthHover': 'View crop health indicators and tips',
      'cards.soilTestingHover': 'Analyze soil pH, carbon, and moisture',
      'cards.weatherHover': 'See today\'s weather and 7-day forecast',
      'cards.irrigationHover': 'Get smart irrigation recommendations',
      'cards.mandiPricesHover': 'Track live mandi prices for your crop',
      'cards.cropPlannerHover': 'Plan crops, inputs, and expected yields',
      'cards.marketOffersHover': 'Discover local market offers and demand',
      'cards.chatbotHover': 'Chat with the AI assistant for quick help',
      'cards.cropDiseaseHover': 'Identify crop diseases by uploading images',
      'cards.futurePlansHover': 'View upcoming features and development roadmap',
      'cards.contactSupportHover': 'Get help and contact our support team',
      'cards.resourcesComingSoon': 'Useful guides, best practices, and research links coming soon.',
      
      // Footer Links
      'footer.home': 'Home',
      'footer.predictYield': 'Predict Yield',
      'footer.aboutUs': 'About Us',
      'footer.contact': 'Contact',
      'footer.documentation': 'Documentation',
      'footer.apiReference': 'API Reference',
      'footer.supportCenter': 'Support Center',
      'footer.privacyPolicy': 'Privacy Policy',
      'footer.email': 'info@croppredict.com',
      'footer.phone': '+1 (555) 123-4567',
      'footer.address': 'Agricultural Tech Center, CA',
      
      // Mandi Prices
      'mandi.findBestPrice': 'Find the Best Price Nearby',
      
      // Crop Planner
      'planner.yieldPrediction': 'Yield Prediction',
      'planner.fertilizerRecommendation': 'Fertilizer Recommendation',
      'planner.cropRecommendation': 'Crop Recommendation',
      'planner.nitrogen': 'Nitrogen',
      'planner.phosphorous': 'Phosphorous',
      'planner.potassium': 'Potassium',
      'planner.temperature': 'Temperature',
      'planner.humidity': 'Humidity',
      'planner.moisture': 'Moisture',
      'planner.soilType': 'Soil Type',
      'planner.cropType': 'Crop Type',
      'planner.phLevel': 'pH Level',
      'planner.rainfall': 'Rainfall',
      'planner.state': 'State',
      'planner.district': 'District',
      'planner.season': 'Season',
      'planner.crop': 'Crop',
      'planner.area': 'Area',
      'planner.futureExpansion': 'Future Expansion',
      'planner.inputParameters': 'Input Parameters',
      'planner.soilEnvironmentalParameters': 'Soil & Environmental Parameters',
      'planner.environmentalParameters': 'Environmental Parameters',
      'planner.productionPrediction': 'Production Prediction',
      'planner.recommendedFertilizer': 'Recommended Fertilizer',
      'planner.recommendedCrops': 'Recommended Crops',
      'planner.selectState': 'Select State',
      'planner.selectDistrict': 'Select District',
      'planner.selectSeason': 'Select Season',
      'planner.selectCrop': 'Select Crop',
      'planner.selectSoilType': 'Select Soil Type',
      'planner.selectCropType': 'Select Crop',
      'planner.enterArea': 'Enter area',
      'planner.kgHa': 'kg/ha',
      'planner.hectares': 'Hectares',
      
      // Irrigation
      'irrigation.lastIrrigation': 'Last Irrigation',
      'irrigation.nextIrrigation': 'Next Irrigation',
      'irrigation.recommendations': 'Irrigation Recommendations:',
      
      // Market Offers
      'market.contactBuyer': 'Contact Buyer'
    },
    hi: {
      // Login Page
      'login.title': 'अमखेत',
      'login.subtitle': 'आपका स्मार्ट फार्मिंग साथी',
      'login.farmerName': 'किसान का नाम',
      'login.mobileNumber': 'मोबाइल नंबर',
      'login.location': 'स्थान',
      'login.currentCrop': 'वर्तमान फसल',
      'login.enterName': 'अपना पूरा नाम दर्ज करें',
      'login.enterMobile': 'अपना मोबाइल नंबर दर्ज करें',
      'login.enterVillage': 'अपना गाँव/शहर दर्ज करें',
      'login.selectCrop': 'अपनी फसल चुनें',
      'login.enterDashboard': 'डैशबोर्ड में प्रवेश करें',
      'login.empoweringFarmers': 'स्मार्ट तकनीक के साथ किसानों को सशक्त बनाना',
      'login.transformFarming': 'अपनी खेती को बदलें',
      'login.joinThousands': 'हजारों किसानों के साथ जुड़ें जो स्मार्ट तकनीक का उपयोग करके फसल उत्पादन को अधिकतम करते हैं।',
      
      // Dashboard
      'dashboard.welcomeBack': 'वापस स्वागत है',
      'dashboard.clickCards': 'विस्तृत जानकारी के लिए नीचे किसी भी कार्ड पर क्लिक करें',
      'dashboard.predictYields': 'AI के साथ अपनी फसल उत्पादन का अनुमान लगाएं',
      'dashboard.harnessPower': 'अपने खेती के निर्णयों को अनुकूलित करने के लिए मशीन लर्निंग की शक्ति का उपयोग करें।',
      'dashboard.startPredicting': 'अनुमान लगाना शुरू करें',
      'dashboard.learnMore': 'और जानें',
      'dashboard.accuracyRate': 'सटीकता दर',
      'dashboard.farmersTrust': 'किसान हम पर भरोसा करते हैं',
      'dashboard.cropTypes': 'फसल प्रकार',
      'dashboard.backToDashboard': 'डैशबोर्ड पर वापस जाएं',
      'dashboard.logout': 'लॉग आउट',
      
      // Cards
      'cards.cropHealth': 'फसल स्वास्थ्य',
      'cards.soilTesting': 'मिट्टी परीक्षण',
      'cards.weather': 'मौसम',
      'cards.smartIrrigation': 'स्मार्ट सिंचाई',
      'cards.mandiPrices': 'मंडी कीमतें',
      'cards.cropPlanner': 'फसल योजनाकार',
      'cards.marketOffers': 'बाजार प्रस्ताव',
      'cards.aiAssistant': 'AI सहायक',
      'cards.cropDisease': 'फसल रोग',
      'cards.futurePlans': 'भविष्य की योजनाएं',
      'cards.contactSupport': 'संपर्क और सहायता',
      'cards.governmentScheme': 'सरकारी योजना',
      'cards.resources': 'संसाधन',
      
      // Government Scheme Card
      'govScheme.title': 'सरकारी कृषि योजनाएं',
      'govScheme.subtitle': 'किसानों के लिए उपलब्ध सब्सिडी, योजनाओं और बीमा का अन्वेषण करें',
      'govScheme.subsidies': 'सब्सिडी',
      'govScheme.schemes': 'योजनाएं',
      'govScheme.insurance': 'बीमा',
      'govScheme.footerNote': 'अधिक जानकारी और आवेदन विवरण के लिए, अपने निकटतम कृषि कार्यालय में जाएं या आधिकारिक सरकारी पोर्टल देखें।',
      
      // Weather
      'weather.conditions': 'मौसम की स्थिति',
      'weather.forecast': 'तूफान और बारिश की चेतावनी के साथ 7-दिवसीय मौसम पूर्वानुमान',
      'weather.feelsLike': 'महसूस होता है',
      'weather.humidity': 'आर्द्रता',
      'weather.wind': 'हवा',
      'weather.rainExpected': 'बारिश की उम्मीद',
      'weather.thunderstormAlert': 'तूफान चेतावनी',
      'weather.farmingRecommendations': 'खेती की सिफारिशें',
      'weather.rainExpectedDelay': 'बारिश की उम्मीद - सिंचाई और कीटनाशक आवेदन में देरी करें',
      'weather.thunderstormSecure': 'तूफान चेतावनी - खेत के उपकरण सुरक्षित करें और खेत के काम से बचें',
      'weather.highTempIrrigation': 'उच्च तापमान - सिंचाई की आवृत्ति बढ़ाएं',
      'weather.lowTempProtect': 'कम तापमान - संवेदनशील फसलों की सुरक्षा करें',
      'weather.highHumidityMonitor': 'उच्च आर्द्रता - फंगल रोगों की निगरानी करें',
      
      // Footer
      'footer.empoweringFarmers': 'स्मार्ट कृषि के लिए AI-संचालित फसल उत्पादन पूर्वानुमान के साथ दुनिया भर के किसानों को सशक्त बनाना।',
      'footer.quickLinks': 'त्वरित लिंक',
      'footer.resources': 'संसाधन',
      'footer.contactInfo': 'संपर्क जानकारी',
      'footer.allRightsReserved': 'सभी अधिकार सुरक्षित। किसानों के लिए ❤️ के साथ बनाया गया।',
      
      // Dashboard Cards
      'cards.aiAssistant': 'AI सहायक',
      'cards.aiFarmingAssistant': 'AI कृषि सहायक',
      'cards.online': 'ऑनलाइन',
      'cards.namaste': 'नमस्ते! 🙏',
      'cards.aiIntro': 'मैं आपका AI कृषि सहायक हूं। अपनी फसलों, मिट्टी, मौसम या कृषि प्रथाओं के बारे में कुछ भी पूछें।',
      'cards.quickQuestions': 'त्वरित प्रश्न:',
      'cards.whenIrrigate': 'मुझे कब सिंचाई करनी चाहिए?',
      'cards.howMuchFertilizer': 'कितना उर्वरक लगाना है?',
      'cards.isCropHealthy': 'क्या मेरी फसल स्वस्थ है?',
      'cards.whenHarvest': 'कब कटाई करें?',
      'cards.bestPesticideTime': 'कीटनाशक का सबसे अच्छा समय?',
      'cards.askFarming': 'कृषि के बारे में पूछें... (जैसे, मुझे कब सिंचाई करनी चाहिए?)',
      'cards.voiceInput': 'आवाज इनपुट',
      'cards.sendMessage': 'संदेश भेजें',
      
      // Soil Testing
      'soil.testing': 'मिट्टी परीक्षण',
      'soil.analyzeSoil': 'मिट्टी का विश्लेषण',
      'soil.location': 'स्थान',
      'soil.cropType': 'फसल प्रकार',
      'soil.testNow': 'अभी परीक्षण करें',
      'soil.analysisResults': 'मिट्टी विश्लेषण परिणाम:',
      'soil.ph': 'pH:',
      'soil.organicCarbon': 'कार्बनिक कार्बन:',
      'soil.waterHolding': 'जल धारण:',
      'soil.surfaceMoisture': 'सतह नमी:',
      'soil.rootzoneMoisture': 'जड़ क्षेत्र नमी:',
      'soil.recommendations': 'सिफारिशें:',
      'soil.refreshAnalysis': 'विश्लेषण ताज़ा करें',
      'soil.newAnalysis': 'नया विश्लेषण',
      
      // Crop Health
      'crop.health': 'फसल स्वास्थ्य',
      'crop.analyzeCrop': 'फसल स्वास्थ्य विश्लेषण',
      'crop.cropType': 'फसल प्रकार',
      'crop.growthStage': 'विकास चरण',
      'crop.analyzeNow': 'अभी विश्लेषण करें',
      'crop.healthResults': 'फसल स्वास्थ्य परिणाम:',
      'crop.healthStatus': 'स्वास्थ्य स्थिति:',
      'crop.diseaseRisk': 'रोग जोखिम:',
      'crop.pestRisk': 'कीट जोखिम:',
      'crop.nutrientStatus': 'पोषक तत्व स्थिति:',
      'crop.refreshAnalysis': 'विश्लेषण ताज़ा करें',
      'crop.newAnalysis': 'नया विश्लेषण',
      
      // Mandi Prices
      'mandi.prices': 'मंडी कीमतें',
      'mandi.livePrices': 'लाइव मंडी फसल कीमतें',
      'mandi.searchPrices': 'कीमतें खोजें',
      'mandi.state': 'राज्य',
      'mandi.district': 'जिला',
      'mandi.market': 'बाजार',
      'mandi.commodity': 'वस्तु',
      'mandi.search': 'खोजें',
      'mandi.smartSearch': 'स्मार्ट खोज',
      'mandi.allStates': 'सभी राज्य',
      'mandi.error': 'त्रुटि:',
      
      // Weather Card
      'weather.currentConditions': 'वर्तमान स्थिति',
      'weather.temperature': 'तापमान',
      'weather.condition': 'स्थिति',
      'weather.humidity': 'आर्द्रता',
      'weather.windSpeed': 'हवा की गति',
      'weather.feelsLike': 'महसूस होता है',
      'weather.uvIndex': 'UV सूचकांक',
      'weather.forecast': '7-दिवसीय पूर्वानुमान',
      'weather.day': 'दिन',
      'weather.high': 'उच्च',
      'weather.low': 'निम्न',
      'weather.precipitation': 'वर्षा',
      'weather.alerts': 'मौसम चेतावनी',
      'weather.noAlerts': 'अगले 7 दिनों के लिए कोई मौसम चेतावनी नहीं',
      'weather.farmingTips': 'कृषि सुझाव',
      'weather.refresh': 'मौसम ताज़ा करें',
      'weather.thunderstorm': 'गरज',
      'weather.rainTimes': 'बारिश का समय',
      'weather.thunderstormAlerts': 'गरज की चेतावनी',
      'weather.thunderstormExpected': 'गरज की उम्मीद',
      'weather.rainAlerts': 'बारिश की चेतावनी',
      'weather.rainExpected': 'बारिश की उम्मीद',
      
      // Additional Dashboard Elements
      'dashboard.cropYields': 'फसल उपज',
      'dashboard.withAI': 'AI के साथ',
      
      // Card Hover Texts
      'cards.cropHealthHover': 'फसल स्वास्थ्य संकेतक और सुझाव देखें',
      'cards.soilTestingHover': 'मिट्टी का pH, कार्बन और नमी का विश्लेषण करें',
      'cards.weatherHover': 'आज का मौसम और 7-दिन का पूर्वानुमान देखें',
      'cards.irrigationHover': 'स्मार्ट सिंचाई सिफारिशें प्राप्त करें',
      'cards.mandiPricesHover': 'अपनी फसल के लिए लाइव मंडी कीमतें ट्रैक करें',
      'cards.cropPlannerHover': 'फसलों, इनपुट और अपेक्षित उपज की योजना बनाएं',
      'cards.marketOffersHover': 'स्थानीय बाजार प्रस्ताव और मांग की खोज करें',
      'cards.chatbotHover': 'त्वरित सहायता के लिए AI सहायक से चैट करें',
      'cards.cropDiseaseHover': 'छवियां अपलोड करके फसल रोगों की पहचान करें',
      'cards.futurePlansHover': 'आगामी सुविधाएं और विकास रोडमैप देखें',
      'cards.contactSupportHover': 'सहायता प्राप्त करें और हमारी सहायता टीम से संपर्क करें',
      'cards.resourcesComingSoon': 'उपयोगी गाइड, सर्वोत्तम प्रथाएं और अनुसंधान लिंक जल्द आ रहे हैं।',
      
      // Footer Links
      'footer.home': 'होम',
      'footer.predictYield': 'उपज भविष्यवाणी',
      'footer.aboutUs': 'हमारे बारे में',
      'footer.contact': 'संपर्क',
      'footer.documentation': 'दस्तावेज़ीकरण',
      'footer.apiReference': 'API संदर्भ',
      'footer.supportCenter': 'सहायता केंद्र',
      'footer.privacyPolicy': 'गोपनीयता नीति',
      'footer.email': 'info@croppredict.com',
      'footer.phone': '+1 (555) 123-4567',
      'footer.address': 'कृषि प्रौद्योगिकी केंद्र, CA',
      
      // Mandi Prices
      'mandi.findBestPrice': 'पास में सबसे अच्छी कीमत खोजें',
      
      // Crop Planner
      'planner.yieldPrediction': 'उपज भविष्यवाणी',
      'planner.fertilizerRecommendation': 'उर्वरक सिफारिश',
      'planner.cropRecommendation': 'फसल सिफारिश',
      'planner.nitrogen': 'नाइट्रोजन',
      'planner.phosphorous': 'फॉस्फोरस',
      'planner.potassium': 'पोटेशियम',
      'planner.temperature': 'तापमान',
      'planner.humidity': 'आर्द्रता',
      'planner.moisture': 'नमी',
      'planner.soilType': 'मिट्टी का प्रकार',
      'planner.cropType': 'फसल का प्रकार',
      'planner.phLevel': 'pH स्तर',
      'planner.rainfall': 'वर्षा',
      'planner.state': 'राज्य',
      'planner.district': 'जिला',
      'planner.season': 'मौसम',
      'planner.crop': 'फसल',
      'planner.area': 'क्षेत्र',
      'planner.futureExpansion': 'भविष्य का विस्तार',
      'planner.inputParameters': 'इनपुट पैरामीटर',
      'planner.soilEnvironmentalParameters': 'मिट्टी और पर्यावरणीय पैरामीटर',
      'planner.environmentalParameters': 'पर्यावरणीय पैरामीटर',
      'planner.productionPrediction': 'उत्पादन भविष्यवाणी',
      'planner.recommendedFertilizer': 'अनुशंसित उर्वरक',
      'planner.recommendedCrops': 'अनुशंसित फसलें',
      'planner.selectState': 'राज्य चुनें',
      'planner.selectDistrict': 'जिला चुनें',
      'planner.selectSeason': 'मौसम चुनें',
      'planner.selectCrop': 'फसल चुनें',
      'planner.selectSoilType': 'मिट्टी का प्रकार चुनें',
      'planner.selectCropType': 'फसल चुनें',
      'planner.enterArea': 'क्षेत्र दर्ज करें',
      'planner.kgHa': 'किलो/हेक्टेयर',
      'planner.hectares': 'हेक्टेयर',
      
      // Irrigation
      'irrigation.lastIrrigation': 'अंतिम सिंचाई',
      'irrigation.nextIrrigation': 'अगली सिंचाई',
      'irrigation.recommendations': 'सिंचाई सिफारिशें:',
      
      // Market Offers
      'market.contactBuyer': 'खरीदार से संपर्क करें'
    },
    or: {
      // Login Page
      'login.title': 'ଅମଖେତ',
      'login.subtitle': 'ଆପଣଙ୍କର ସ୍ମାର୍ଟ କୃଷି ସାଥୀ',
      'login.farmerName': 'କୃଷକର ନାମ',
      'login.mobileNumber': 'ମୋବାଇଲ ନମ୍ବର',
      'login.location': 'ଅବସ୍ଥାନ',
      'login.currentCrop': 'ବର୍ତ୍ତମାନର ଫସଲ',
      'login.enterName': 'ଆପଣଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ ନାମ ପ୍ରବେଶ କରନ୍ତୁ',
      'login.enterMobile': 'ଆପଣଙ୍କର ମୋବାଇଲ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ',
      'login.enterVillage': 'ଆପଣଙ୍କର ଗାଁ/ସହର ପ୍ରବେଶ କରନ୍ତୁ',
      'login.selectCrop': 'ଆପଣଙ୍କର ଫସଲ ଚୟନ କରନ୍ତୁ',
      'login.enterDashboard': 'ଡ୍ୟାସବୋର୍ଡରେ ପ୍ରବେଶ କରନ୍ତୁ',
      'login.empoweringFarmers': 'ସ୍ମାର୍ଟ ଟେକ୍ନୋଲୋଜି ସହିତ କୃଷକମାନଙ୍କୁ ସଶକ୍ତ କରିବା',
      'login.transformFarming': 'ଆପଣଙ୍କର କୃଷିକୁ ପରିବର୍ତ୍ତନ କରନ୍ତୁ',
      'login.joinThousands': 'ହଜାର ହଜାର କୃଷକମାନଙ୍କ ସହିତ ଯୋଗ ଦିଅନ୍ତୁ ଯେଉଁମାନେ ସ୍ମାର୍ଟ ଟେକ୍ନୋଲୋଜି ବ୍ୟବହାର କରି ଫସଲ ଉତ୍ପାଦନକୁ ସର୍ବାଧିକ କରନ୍ତି।',
      
      // Dashboard
      'dashboard.welcomeBack': 'ପୁନର୍ବାର ସ୍ୱାଗତ',
      'dashboard.clickCards': 'ବିସ୍ତୃତ ସୂଚନା ପାଇଁ ନିମ୍ନରେ ଯେକୌଣସି କାର୍ଡରେ କ୍ଲିକ୍ କରନ୍ତୁ',
      'dashboard.predictYields': 'AI ସହିତ ଆପଣଙ୍କର ଫସଲ ଉତ୍ପାଦନର ଅନୁମାନ କରନ୍ତୁ',
      'dashboard.harnessPower': 'ଆପଣଙ୍କର କୃଷି ନିର୍ଣ୍ଣୟକୁ ଅନୁକୂଳ କରିବା ପାଇଁ ମେସିନ ଲର୍ନିଂର ଶକ୍ତି ବ୍ୟବହାର କରନ୍ତୁ।',
      'dashboard.startPredicting': 'ଅନୁମାନ କରିବା ଆରମ୍ଭ କରନ୍ତୁ',
      'dashboard.learnMore': 'ଅଧିକ ଜାଣନ୍ତୁ',
      'dashboard.accuracyRate': 'ସଠିକତା ହାର',
      'dashboard.farmersTrust': 'କୃଷକମାନେ ଆମ ଉପରେ ବିଶ୍ୱାସ କରନ୍ତି',
      'dashboard.cropTypes': 'ଫସଲ ପ୍ରକାର',
      'dashboard.backToDashboard': 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରିଯାନ୍ତୁ',
      'dashboard.logout': 'ଲଗ୍ ଆଉଟ୍',
      
      // Cards
      'cards.cropHealth': 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ',
      'cards.soilTesting': 'ମାଟି ପରୀକ୍ଷା',
      'cards.weather': 'ପାଗ',
      'cards.smartIrrigation': 'ସ୍ମାର୍ଟ ସିଞ୍ଚାଇ',
      'cards.mandiPrices': 'ମଣ୍ଡି ମୂଲ୍ୟ',
      'cards.cropPlanner': 'ଫସଲ ଯୋଜନାକାର',
      'cards.marketOffers': 'ବଜାର ପ୍ରସ୍ତାବ',
      'cards.aiAssistant': 'AI ସହାୟକ',
      'cards.cropDisease': 'ଫସଲ ରୋଗ',
      'cards.futurePlans': 'ଭବିଷ୍ୟତ ଯୋଜନା',
      'cards.contactSupport': 'ସମ୍ପର୍କ ଏବଂ ସହାୟତା',
      'cards.governmentScheme': 'ସରକାରୀ ଯୋଜନା',
      'cards.resources': 'ସମ୍ବଳ',
      
      // Government Scheme Card
      'govScheme.title': 'ସରକାରୀ କୃଷି ଯୋଜନା',
      'govScheme.subtitle': 'କୃଷକମାନଙ୍କ ପାଇଁ ଉପଲବ୍ଧ ସବସିଡି, ଯୋଜନା ଏବଂ ବୀମା ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
      'govScheme.subsidies': 'ସବସିଡି',
      'govScheme.schemes': 'ଯୋଜନା',
      'govScheme.insurance': 'ବୀମା',
      'govScheme.footerNote': 'ଅଧିକ ସୂଚନା ଏବଂ ଆବେଦନ ବିବରଣୀ ପାଇଁ, ଆପଣଙ୍କର ନିକଟତମ କୃଷି କାର୍ଯ୍ୟାଳୟରେ ଯାଆନ୍ତୁ କିମ୍ବା ଅଧିକାରିକ ସରକାରୀ ପୋର୍ଟାଲ ଦେଖନ୍ତୁ।',
      
      // Weather
      'weather.conditions': 'ପାଗର ଅବସ୍ଥା',
      'weather.forecast': 'ଝଡ଼ ଏବଂ ବର୍ଷା ସତର୍କତା ସହିତ 7-ଦିନିଆ ପାଗ ପୂର୍ବାନୁମାନ',
      'weather.feelsLike': 'ଅନୁଭବ ହୁଏ',
      'weather.humidity': 'ଆର୍ଦ୍ରତା',
      'weather.wind': 'ପବନ',
      'weather.rainExpected': 'ବର୍ଷା ଆଶା',
      'weather.thunderstorm': 'ବଜ୍ରପାତ',
      'weather.rainTimes': 'ବର୍ଷାର ସମୟ',
      'weather.thunderstormAlerts': 'ବଜ୍ରପାତ ସତର୍କତା',
      'weather.thunderstormExpected': 'ବଜ୍ରପାତ ଆଶା କରାଯାଏ',
      'weather.rainAlerts': 'ବର୍ଷା ସତର୍କତା',
      'weather.thunderstormAlert': 'ଝଡ଼ ସତର୍କତା',
      'weather.farmingRecommendations': 'କୃଷି ସୁପାରିଶ',
      'weather.rainExpectedDelay': 'ବର୍ଷା ଆଶା - ସିଞ୍ଚାଇ ଏବଂ କୀଟନାଶକ ପ୍ରୟୋଗରେ ବିଳମ୍ବ କରନ୍ତୁ',
      'weather.thunderstormSecure': 'ଝଡ଼ ସତର୍କତା - କ୍ଷେତ୍ର ଉପକରଣ ସୁରକ୍ଷିତ କରନ୍ତୁ ଏବଂ କ୍ଷେତ୍ର କାମରୁ ଦୂରେଇ ରୁହନ୍ତୁ',
      'weather.highTempIrrigation': 'ଉଚ୍ଚ ତାପମାତ୍ରା - ସିଞ୍ଚାଇ ଆବୃତ୍ତି ବୃଦ୍ଧି କରନ୍ତୁ',
      'weather.lowTempProtect': 'ନିମ୍ନ ତାପମାତ୍ରା - ସମ୍ବେଦନଶୀଳ ଫସଲଗୁଡ଼ିକୁ ସୁରକ୍ଷା କରନ୍ତୁ',
      'weather.highHumidityMonitor': 'ଉଚ୍ଚ ଆର୍ଦ୍ରତା - ଫଙ୍ଗଲ ରୋଗ ନିରୀକ୍ଷଣ କରନ୍ତୁ',
      
      // Footer
      'footer.empoweringFarmers': 'ସ୍ମାର୍ଟ କୃଷି ପାଇଁ AI-ଚାଳିତ ଫସଲ ଉତ୍ପାଦନ ପୂର୍ବାନୁମାନ ସହିତ ବିଶ୍ୱବ୍ୟାପୀ କୃଷକମାନଙ୍କୁ ସଶକ୍ତ କରିବା।',
      'footer.quickLinks': 'ଦ୍ରୁତ ଲିଙ୍କ',
      'footer.resources': 'ସମ୍ବଳ',
      'footer.contactInfo': 'ଯୋଗାଯୋଗ ସୂଚନା',
      'footer.allRightsReserved': 'ସମସ୍ତ ଅଧିକାର ସୁରକ୍ଷିତ। କୃଷକମାନଙ୍କ ପାଇଁ ❤️ ସହିତ ନିର୍ମିତ।',
      
      // Additional Dashboard Elements
      'dashboard.cropYields': 'ଫସଲ ଉତ୍ପାଦନ',
      'dashboard.withAI': 'AI ସହିତ',
      
      // Card Hover Texts
      'cards.cropHealthHover': 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚକ ଏବଂ ସୁପାରିଶ ଦେଖନ୍ତୁ',
      'cards.soilTestingHover': 'ମାଟିର pH, କାର୍ବନ ଏବଂ ଆର୍ଦ୍ରତା ବିଶ୍ଳେଷଣ କରନ୍ତୁ',
      'cards.weatherHover': 'ଆଜିର ପାଣିପାଗ ଏବଂ 7-ଦିନର ପୂର୍ବାନୁମାନ ଦେଖନ୍ତୁ',
      'cards.irrigationHover': 'ସ୍ମାର୍ଟ ଜଳସେଚନ ସୁପାରିଶ ପାଆନ୍ତୁ',
      'cards.mandiPricesHover': 'ଆପଣଙ୍କ ଫସଲ ପାଇଁ ଲାଇଭ୍ ମଣ୍ଡି ମୂଲ୍ୟ ଟ୍ରାକ୍ କରନ୍ତୁ',
      'cards.cropPlannerHover': 'ଫସଲ, ଇନପୁଟ୍ ଏବଂ ଅପେକ୍ଷିତ ଉତ୍ପାଦନ ଯୋଜନା କରନ୍ତୁ',
      'cards.marketOffersHover': 'ସ୍ଥାନୀୟ ବଜାର ଅଫର୍ ଏବଂ ଚାହିଦା ଖୋଜନ୍ତୁ',
      'cards.chatbotHover': 'ଦ୍ରୁତ ସାହାଯ୍ୟ ପାଇଁ AI ସହାୟକ ସହିତ ଚାଟ୍ କରନ୍ତୁ',
      'cards.cropDiseaseHover': 'ଛବି ଅପଲୋଡ୍ କରି ଫସଲ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ',
      'cards.futurePlansHover': 'ଆଗାମୀ ସୁବିଧା ଏବଂ ବିକାଶ ରୋଡମ୍ୟାପ୍ ଦେଖନ୍ତୁ',
      'cards.contactSupportHover': 'ସାହାଯ୍ୟ ପାଆନ୍ତୁ ଏବଂ ଆମର ସହାୟତା ଦଳ ସହିତ ସମ୍ପର୍କ କରନ୍ତୁ',
      'cards.resourcesComingSoon': 'ଉପଯୋଗୀ ଗାଇଡ୍, ସର୍ବୋତ୍ତମ ଅଭ୍ୟାସ ଏବଂ ଗବେଷଣା ଲିଙ୍କ୍ ଶୀଘ୍ର ଆସୁଛି।',
      
      // Footer Links
      'footer.home': 'ହୋମ୍',
      'footer.predictYield': 'ଉତ୍ପାଦନ ଭବିଷ୍ୟତବାଣୀ',
      'footer.aboutUs': 'ଆମ ବିଷୟରେ',
      'footer.contact': 'ଯୋଗାଯୋଗ',
      'footer.documentation': 'ଡକ୍ୟୁମେଣ୍ଟେସନ୍',
      'footer.apiReference': 'API ସନ୍ଦର୍ଭ',
      'footer.supportCenter': 'ସହାୟତା କେନ୍ଦ୍ର',
      'footer.privacyPolicy': 'ଗୋପନୀୟତା ନୀତି',
      'footer.email': 'info@croppredict.com',
      'footer.phone': '+1 (555) 123-4567',
      'footer.address': 'କୃଷି ପ୍ରଯୁକ୍ତି କେନ୍ଦ୍ର, CA',
      
      // Mandi Prices
      'mandi.findBestPrice': 'ନିକଟରେ ସର୍ବୋତ୍ତମ ମୂଲ୍ୟ ଖୋଜନ୍ତୁ',
      
      // Crop Planner
      'planner.yieldPrediction': 'ଉତ୍ପାଦନ ଭବିଷ୍ୟତବାଣୀ',
      'planner.fertilizerRecommendation': 'ସାର ସୁପାରିଶ',
      'planner.cropRecommendation': 'ଫସଲ ସୁପାରିଶ',
      'planner.nitrogen': 'ନାଇଟ୍ରୋଜେନ୍',
      'planner.phosphorous': 'ଫସ୍ଫରସ୍',
      'planner.potassium': 'ପୋଟାସିୟମ୍',
      'planner.temperature': 'ତାପମାତ୍ରା',
      'planner.humidity': 'ଆର୍ଦ୍ରତା',
      'planner.moisture': 'ନମୀ',
      'planner.soilType': 'ମାଟିର ପ୍ରକାର',
      'planner.cropType': 'ଫସଲର ପ୍ରକାର',
      'planner.phLevel': 'pH ସ୍ତର',
      'planner.rainfall': 'ବର୍ଷା',
      'planner.state': 'ରାଜ୍ୟ',
      'planner.district': 'ଜିଲ୍ଲା',
      'planner.season': 'ଋତୁ',
      'planner.crop': 'ଫସଲ',
      'planner.area': 'କ୍ଷେତ୍ର',
      'planner.futureExpansion': 'ଭବିଷ୍ୟତ ବିସ୍ତାର',
      'planner.inputParameters': 'ଇନପୁଟ୍ ପାରାମିଟର',
      'planner.soilEnvironmentalParameters': 'ମାଟି ଏବଂ ପରିବେଶ ପାରାମିଟର',
      'planner.environmentalParameters': 'ପରିବେଶ ପାରାମିଟର',
      'planner.productionPrediction': 'ଉତ୍ପାଦନ ଭବିଷ୍ୟତବାଣୀ',
      'planner.recommendedFertilizer': 'ସୁପାରିଶ କରାଯାଇଥିବା ସାର',
      'planner.recommendedCrops': 'ସୁପାରିଶ କରାଯାଇଥିବା ଫସଲ',
      'planner.selectState': 'ରାଜ୍ୟ ଚୟନ କରନ୍ତୁ',
      'planner.selectDistrict': 'ଜିଲ୍ଲା ଚୟନ କରନ୍ତୁ',
      'planner.selectSeason': 'ଋତୁ ଚୟନ କରନ୍ତୁ',
      'planner.selectCrop': 'ଫସଲ ଚୟନ କରନ୍ତୁ',
      'planner.selectSoilType': 'ମାଟିର ପ୍ରକାର ଚୟନ କରନ୍ତୁ',
      'planner.selectCropType': 'ଫସଲ ଚୟନ କରନ୍ତୁ',
      'planner.enterArea': 'କ୍ଷେତ୍ର ପ୍ରବେଶ କରନ୍ତୁ',
      'planner.kgHa': 'କିଲୋ/ହେକ୍ଟର',
      'planner.hectares': 'ହେକ୍ଟର',
      
      // Irrigation
      'irrigation.lastIrrigation': 'ଶେଷ ଜଳସେଚନ',
      'irrigation.nextIrrigation': 'ପରବର୍ତ୍ତୀ ଜଳସେଚନ',
      'irrigation.recommendations': 'ଜଳସେଚନ ସୁପାରିଶ:',
      
      // Market Offers
      'market.contactBuyer': 'କ୍ରେତାଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ'
    }
    // Add more languages as needed...
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = {
    language,
    setLanguage,
    languages,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
