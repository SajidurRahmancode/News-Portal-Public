// client/src/components/NewsCard.jsx
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {news.image && (
        <img 
          src={`https://news-portal-public.onrender.com${news.image}`} 
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full mb-2 capitalize">
          {news.category}
        </span>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{news.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.content.substring(0, 150)}...</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{news.author?.username || 'Unknown'}</span>
          <Link 
            to={`/news/${news._id}`}
            className="text-accent hover:text-blue-700 text-sm font-medium"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;