import React from 'react';

const EditModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-blue-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-blue-700 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};
export default EditModal;
