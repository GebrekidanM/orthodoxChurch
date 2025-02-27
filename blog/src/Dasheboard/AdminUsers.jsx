import React, { useEffect, useState } from 'react';
import api from '../utilities/axiosConfig';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get logged-in user and logout function

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/manage/users');
        setUsers(res.data);
      } catch (err) {
        setError(err || 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle Delete User
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;
  
    try {
      const res = await api.delete(`/manage/delete/${id}`);
  
      if (res.data.selfDeleted) {
        alert("Your account has been deleted. You will be logged out.");
        logout(); // Log out the user
        navigate('/login'); // Redirect to login page
        return;
      }
  
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user.');
    }
  };

  // Handle Edit User (Example: Redirect to Edit Page)
  const handleEdit = (id) => {
    navigate(`/mainadmin?page=manage-user&idedit=${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Show loading state */}
      {loading && <p>Loading users...</p>}

      {/* Show error message */}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-neutral-900 text-white">
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Status</th> {/* Added Status Column */}
              <th className="border p-2 w-2xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem._id} className="text-center">
                <td className="border p-2">{userItem.username}</td>
                <td className="border p-2">{userItem.email}</td>
                <td className="border p-2">{userItem.role}</td>
                <td className="border p-2">{userItem.deleted ? 'Deleted' : 'Active'}</td> {/* Display Status */}
                <td className="border p-2 w-2xs flex justify-evenly">
                  {/* Allow editing only if the logged-in user is an admin or the user is editing their own account */}
                  {(user.role === 'admin' || user._id === userItem._id) && (
                    <button
                      onClick={() => handleEdit(userItem._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(userItem._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
