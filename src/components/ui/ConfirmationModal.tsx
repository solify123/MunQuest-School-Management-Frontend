import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmButtonColor = 'text-red-600'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 " style={{ marginTop: '0px' }}>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-black mb-4 text-center">
          {title}
        </h2>

        {/* Message */}
        <p className="text-black text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg text-sm font-bold ${confirmButtonColor} hover:opacity-80 transition-opacity`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
