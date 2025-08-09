// client/src/pages/NewsDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import authStore from '../store/authStore';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = authStore();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`https://news-portal-public.onrender.com/api/news/${id}`);
        if (!res.data.isPublished && (!user || res.data.author._id !== user.id)) {
          throw new Error('This news is not published');
        }
        setNews(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, user]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-8 text-red-500">{error}</div>
        <div className="text-center">
          <Link to="/news" className="text-accent hover:text-blue-700">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-8">News not found</div>
        <div className="text-center">
          <Link to="/news" className="text-accent hover:text-blue-700">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
      
      <div className="flex items-center text-gray-600 mb-6">
        <span>By {news.author?.username || 'Unknown'}</span>
        <span className="mx-2">•</span>
        <span>{moment(news.createdAt).format('MMMM D, YYYY')}</span>
        <span className="mx-2">•</span>
        <span>{news.views} views</span>
        {!news.isPublished && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Draft
          </span>
        )}
      </div>
      
      {news.image && (
        <img 
          src={`https://news-portal-public.onrender.com${news.image}`} 
          alt={news.title} 
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      
      <div className="prose max-w-none">
        {news.content.split('\n').map((paragraph, i) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>

      {user && (user.id === news.author._id || user.role === 'admin') && (
        <div className="mt-8 flex space-x-4">
          <Link
            to={`/edit-news/${news._id}`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit News
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;