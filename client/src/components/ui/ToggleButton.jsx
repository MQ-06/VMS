import React from 'react';

const ToggleButton = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200
        ${isActive ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}
      `}
    >
      {isActive ? 'Deactivate' : 'Activate'}
    </button>
  );
};

export default ToggleButton;
