import React from 'react';
import { X } from 'lucide-react';
import { ModalContent } from '../types';

interface ModalProps {
  content: ModalContent;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ content, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="modal" 
      style={{ display: 'block' }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-content">
        <button 
          className="close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        <div>
          {content.title && <h3 style={{ marginBottom: '20px' }}>{content.title}</h3>}
          {content.content}
          {content.onConfirm && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className="btn btn-primary" onClick={content.onConfirm}>
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;