import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utilities/axiosConfig';
import Input from '../../components/Input';
import Card from '../../components/Card';

const UserEdit = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null); // State for image
  const [imageUrl, setImageUrl] = useState(''); // State to store uploaded image URL
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("idedit");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/manage/user/${userId}`);
        setUsername(data.username || '');
        setEmail(data.email || '');
        setRole(data.role || '');
        setImageUrl(data.profileImage || ''); // Set existing profile image
      } catch (err) {
        setError(err?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!username.trim() || !email.trim() || !role.trim()) {
      return setError("All fields are required!");
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('role', role);
    if (image) formData.append('image', image); // Append the image file

    try {
      setLoading(true);
      await api.put(`/manage/edit/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/mainadmin?page=manage-user', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full flex justify-center mt-4'>
      <Card title="Edit User">
        {!loading && !success && (
          <form onSubmit={handleSubmit} className='w-full p-4 flex flex-col gap-3'>
            <Input
              type="text"
              change={e => setUsername(e.target.value)}
              value={username}
              disable={loading}
              label="Username"
            />
            <Input
              type="email"
              change={e => setEmail(e.target.value)}
              value={email}
              disable={loading}
              label="Email"
            />
            {/* Role as a select dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                disabled={loading}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {imageUrl && (
              <img src={imageUrl} alt="Profile" className="mt-3 w-32 h-32 object-cover rounded-full" />
            )}

            {error && <p className='text-red-600 font-light'>{error}</p>}
            <div className='flex flex-col gap-2'>
              <input
                type='submit'
                value={loading ? 'Saving...' : 'Update User'}
                className='w-1/2 ml-[25%] cursor-pointer p-2 rounded-sm bg-blue-700'
                disabled={loading}
              />
            </div>
          </form>
        )}

        {/* Success message */}
        {success && (
          <p className='text-green-600 font-light text-center'>
            User updated successfully!
          </p>
        )}
      </Card>
    </div>
  );
};

export default UserEdit;
