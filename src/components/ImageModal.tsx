import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImageModal;