// src/components/ui/EditButton.jsx
import React from 'react';

const EditButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
  >
    Edit
  </button>
);

export default EditButton;
