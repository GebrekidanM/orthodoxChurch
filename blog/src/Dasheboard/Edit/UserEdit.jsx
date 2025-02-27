import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utilities/axiosConfig';
import Input from '../../components/Input';
import Card from '../../components/Card';

const UserEdit = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      } catch (err) {
        setError(err || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim()) {
      return setError("All fields are required!");
    }

    try {
      setLoading(true);
      await api.put(`/manage/edit/${userId}`, { username, email, role });
      navigate('/mainadmin?page=manage-user', { replace: true });
    } catch (err) {
      setError(err || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full flex justify-center mt-4'>
      <Card title="Edit User">
        {!loading &&
        <form onSubmit={handleSubmit} className='w-full p-4 flex flex-col gap-3'>
          <Input type="text" change={e => setUsername(e.target.value)} value={username} disable={loading} label="Username" />
          <Input type="email" change={e => setEmail(e.target.value)} value={email} disable={loading} label="Email" />
          <Input type="text" change={e => setRole(e.target.value)} value={role} disable={loading} label="Role" />
          
          {error && <p className='text-red-600 font-light'>{error}</p>}
          <div className='flex flex-col gap-2'>
            <input 
              type='submit' 
              value={loading ? 'Saving...' : 'Update User'} 
              className='w-1/2 ml-[25%] cursor-pointer p-2 rounded-sm bg-blue-700' 
              disabled={loading}
            />
          </div>
        </form>}
      </Card>
    </div>
  );
};

export default UserEdit;
