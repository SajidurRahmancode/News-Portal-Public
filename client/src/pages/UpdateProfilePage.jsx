// client/src/pages/UpdateProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authStore from '../store/authStore';

const UpdateProfilePage = () => {
  const { user, setUser } = authStore(); // Now properly destructured
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/users/${user?._id}`,
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the user in the auth store
      setUser(res.data); // Now using the setUser from authStore
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
          Profile updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
            minLength="3"
            maxLength="30"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-accent text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfilePage;