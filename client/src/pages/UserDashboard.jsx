// client/src/pages/UserDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import authStore from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, isAuthenticated } = authStore();
  const [userNews, setUserNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserNews = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/news/user', {
          headers: {
            'x-auth-token': token
          }
        });
        setUserNews(res.data);
      } catch (err) {
        console.error('Error fetching user news:', err);
        setError('Failed to load your news. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserNews();
  }, [isAuthenticated, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/news/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setUserNews(userNews.filter(news => news._id !== id));
    } catch (err) {
      console.error('Error deleting news:', err);
      setError('Failed to delete news. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Username:</p>
            <p className="font-medium">{user?.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Role:</p>
            <p className="font-medium capitalize">{user?.role}</p>
          </div>
          <div>
            <Link 
              to="/update-profile" 
              className="text-accent hover:text-blue-700 font-medium"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your News</h2>
        <Link 
          to="/create-news" 
          className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create New News
        </Link>
      </div>
      
      {userNews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't created any news yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Views</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userNews.map(news => (
                <tr key={news._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{news.title}</td>
                  <td className="py-3 px-4 capitalize">{news.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${news.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {news.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{news.views}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/news/${news._id}`} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/edit-news/${news._id}`} 
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(news._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;