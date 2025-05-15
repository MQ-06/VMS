import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = "Back", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-black font-medium ${className}`}
    >
      <FaArrowLeft size={14} />
      {label}
    </button>
  );
};

export default BackButton;
