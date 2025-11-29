import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUser, FaPhone, FaMapMarkerAlt, FaSeedling } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    crop: ''
  });

  const { t } = useLanguage();

  const bgUrl = process.env.PUBLIC_URL + '/sunrise3.png';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.mobile && formData.location && formData.crop) {
      onLogin(formData);
    }
  };

  return (
    <div className="login-container login-split">
      <div
        className="login-left"
        style={{
          backgroundImage:
            `linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.35) 100%), url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="floating-wheat">🌾</div>
        <div className="floating-seedling">🌱</div>
        <div className="floating-farmer">👨‍🌾</div>
        <div className="floating-sun">☀️</div>
        <div className="floating-cloud">☁️</div>

        <div className="left-overlay-card">
          <h2 className="left-overlay-title">{t('login.transformFarming')}</h2>
          <p className="left-overlay-text">
            {t('login.joinThousands')}
          </p>
        </div>
      </div>

      <div className="login-right">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="login-card"
        >
        <div className="login-header header-compact">
          <div className="login-header-top">
            <LanguageSelector />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="logo-container"
          >
            <FaLeaf className="logo-icon" />
          </motion.div>
          <h1 className="login-title title-compact">{t('login.title')}</h1>
          <p className="login-subtitle subtitle-compact">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form form-compact">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="form-group group-compact"
          >
            <label htmlFor="name" className="form-label label-compact">
              <FaUser className="input-icon" />
              {t('login.farmerName')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input input-compact"
              placeholder={t('login.enterName')}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="form-group group-compact"
          >
            <label htmlFor="mobile" className="form-label label-compact">
              <FaPhone className="input-icon" />
              {t('login.mobileNumber')}
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input input-compact"
              placeholder={t('login.enterMobile')}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="form-group group-compact"
          >
            <label htmlFor="location" className="form-label label-compact">
              <FaMapMarkerAlt className="input-icon" />
              {t('login.location')}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input input-compact"
              placeholder={t('login.enterVillage')}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="form-group group-compact"
          >
            <label htmlFor="crop" className="form-label label-compact">
              <FaSeedling className="input-icon" />
              {t('login.currentCrop')}
            </label>
            <select
              id="crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              className="form-input input-compact"
              required
            >
              <option value="">{t('login.selectCrop')}</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
              <option value="cotton">Cotton</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="pulses">Pulses</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
            </select>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            type="submit"
            className="login-button button-compact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseMove={(e) => {
              const target = e.currentTarget;
              const rect = target.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              target.style.setProperty('--mx', x + '%');
              target.style.setProperty('--my', y + '%');
            }}
          >
            <FaLeaf className="button-icon" />
            {t('login.enterDashboard')}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="login-footer"
        >
          <p>{t('login.empoweringFarmers')}</p>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
