// client/src/pages/NewsPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import SectionHeader from '../components/SectionHeader';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalPages: 1
  });
  const [error, setError] = useState(null);
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let url = `https://news-portal-public.onrender.com/api/news?page=${pagination.page}&limit=${pagination.limit}&isPublished=true`;
        if (category) {
          url += `&category=${category}`;
        }
        const res = await axios.get(url);
        setNews(res.data.docs || res.data);
        setPagination(prev => ({
          ...prev,
          totalPages: res.data.totalPages || 1
        }));
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader 
        title={category ? `${category.charAt(0).toUpperCase() + category.slice(1)} News` : 'All News (latest 6)'} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(item => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No news found{category ? ` in ${category} category` : ''}.
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-md ${pagination.page === page ? 'bg-accent text-white' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NewsPage;