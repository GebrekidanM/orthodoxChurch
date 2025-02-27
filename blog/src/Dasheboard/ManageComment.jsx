import React, { useEffect, useState } from 'react';
import api from '../utilities/axiosConfig';

const ManageComment = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get('/comments/all');
        setComments(res.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchComments();
  }, []);

  // Handle Delete Comment
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter((comment) => comment._id !== id));
    } catch (err) {
      setError('Failed to delete the comment.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Comments</h2>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-neutral-600">
        <thead>
          <tr className="bg-neutral-900 text-white">
            <th className="border p-2">Content</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Post Title</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment._id}>
              <td className="border p-2">{comment.content}</td>
              <td className="border p-2">{comment.user.username}</td>
              <td className="border p-2">{comment.post.title}</td>
              <td className="border p-2 flex justify-center">
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageComment;
