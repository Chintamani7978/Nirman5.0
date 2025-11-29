import React, { useState } from 'react';
import { FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
  };

  const handleSelect = () => {
    setLanguage(selectedLang);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedLang(language);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaGlobe className="globe-icon" />
        <span className="language-text">{languages[language]?.name}</span>
        <FaChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="language-modal-overlay" onClick={handleCancel}>
          <div className="language-modal" onClick={(e) => e.stopPropagation()}>
            <div className="language-modal-header">
              <h3>Select Language</h3>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            
            <div className="language-modal-content">
              {Object.entries(languages).map(([code, lang]) => (
                <div
                  key={code}
                  className={`language-option ${selectedLang === code ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange(code)}
                >
                  <span className="language-name">{lang.name}</span>
                  {selectedLang === code && <FaCheck className="check-icon" />}
                </div>
              ))}
            </div>
            
            <div className="language-modal-footer">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="select-btn" onClick={handleSelect}>
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
