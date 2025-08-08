// client/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import SectionHeader from '../components/SectionHeader';

const HomePage = () => {
  const [topNews, setTopNews] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [healthNews, setHealthNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [
          topRes, 
          techRes, 
          sportsRes, 
          entertainmentRes, 
          healthRes
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/news/top?limit=6'),
          axios.get('http://localhost:5000/api/news?category=technology&limit=4'),
          axios.get('http://localhost:5000/api/news?category=sports&limit=4'),
          axios.get('http://localhost:5000/api/news?category=entertainment&limit=4'),
          axios.get('http://localhost:5000/api/news?category=health&limit=4')
        ]);
        
        setTopNews(topRes.data);
        setTechNews(techRes.data.docs || techRes.data);
        setSportsNews(sportsRes.data.docs || sportsRes.data);
        setEntertainmentNews(entertainmentRes.data.docs || entertainmentRes.data);
        setHealthNews(healthRes.data.docs || healthRes.data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-20 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Stay Updated with the Latest News</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Your trusted source for breaking news and in-depth reporting from around the world
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for news..." 
                className="w-full px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent text-white p-2 rounded-full hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Top News Section */}
        <section className="mb-12">
          <SectionHeader title="Top Stories" link="/news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(topNews) && topNews.map(news => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
        </section>

        {/* Technology News Section */}
        <section className="mb-12">
          <SectionHeader title="Technology" link="/news?category=technology" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(techNews) && techNews.map(news => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
        </section>

        {/* Sports News Section */}
        <section className="mb-12">
          <SectionHeader title="Sports" link="/news?category=sports" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(sportsNews) && sportsNews.map(news => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
        </section>

        {/* Entertainment News Section */}
        <section className="mb-12">
          <SectionHeader title="Entertainment" link="/news?category=entertainment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(entertainmentNews) && entertainmentNews.map(news => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
        </section>

        {/* Health News Section */}
        <section className="mb-12">
          <SectionHeader title="Health" link="/news?category=health" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(healthNews) && healthNews.map(news => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gray-100 rounded-xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Get the latest news delivered directly to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;