// client/src/components/SectionHeader.jsx
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, link }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
      {link && (
        <Link 
          to={link}
          className="text-accent hover:text-blue-700 font-medium flex items-center text-sm sm:text-base"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;