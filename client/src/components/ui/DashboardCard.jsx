import { Link } from 'react-router-dom';

const DashboardCard = ({ to, icon: Icon, label }) => {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition hover:scale-105 text-center"
    >
      <Icon size={28} className="text-blue-600" />
      <span className="text-md font-medium text-gray-700">{label}</span>
    </Link>
  );
};

export default DashboardCard;
