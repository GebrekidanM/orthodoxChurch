import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utilities/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [noPost, setNoPost] = useState('');
  const [commentCount,setCommentCount] = useState('')
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth()
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const loggedInUserId = user.userId;
    setUserId(loggedInUserId);
  }, []);

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/post/posts/recent');
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Get the Total Post Count
  useEffect(() => {
    const countPost = async () => {
      try {
        const { data } = await api.get('/post/count/all');
        setNoPost(data.totalPosts || 0);
      } catch (err) {
        setError('Failed to fetch total posts count');
      }
    };

    const fetchCommentCount = async () => {
      try {
        const res = await api.get('/comments/count');
        setCommentCount(res.data.count || 0);
      } catch (err) {
        setError(err.error);
      }
    };

    const fetchTotalLikes = async () => {
      try {
        const res = await api.get("/post/total-likes");
        setTotalLikes(res.data.totalLikes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };
    const fetchTotalViews = async () => {
      try {
        const response = await api.get("/post/views/count");
        setTotalViews(response.data.totalViews);
      } catch (error) {
        console.error("Failed to fetch total views", error);
      }
    };

    fetchTotalViews();
    fetchTotalLikes();
    fetchCommentCount();
    countPost();
  }, []);

  // Handle Post Editing
  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  // Handle Post Deletion (Mark as Deleted)
  const handleDelete = async (postId) => {
    try {
      await api.put(`/post/delete/${postId}`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, status: 'Deleted' } : post
      ));
    } catch (err) {
      setError('Failed to delete post');
    }
  };


  // Handle Viewing a Post
  const handleView = (postId) => {
    navigate(`/postdetail/${postId}`);
  };

  return (
    <div className="text-neutral-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Blogs</h2>
          <p className="text-2xl">{noPost}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Likes</h2>
          <p className="text-2xl">{totalLikes}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Comments</h2>
          <p className="text-2xl">{commentCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Views</h2>
          <p className="text-2xl">{totalViews}</p>
        </div>
      </div>

      {/* Recent Blogs Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Blogs</h2>
        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {posts?.length === 0 && !loading && <p>No posts available</p>}
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-neutral-700 text-neutral-300">
              <th className="border border-neutral-500 px-4 py-2">Title</th>
              <th className="border border-neutral-500 px-4 py-2">Author</th>
              <th className="border border-neutral-500 px-4 py-2">Summary</th>
              <th className="border border-neutral-500 px-4 py-2 w-3xs">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts?.map((post) => (
              <tr key={post._id}>
                <td className="border border-neutral-500 px-4 py-2">{post.title}</td>
                <td className="border border-neutral-500 px-4 py-2">{post.author?.username}</td>
                <td className="border border-neutral-500 px-4 py-2">{post.summary}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2 justify-center">
                  {/* Show Edit/Delete buttons only if the post is authored by the logged-in user */}
                  {post.author?._id === userId && post.status !== 'Deleted' && (
                    <>
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="bg-blue-500 text-white cursor-pointer px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 text-white cursor-pointer px-2 py-1 rounded ml-2"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleView(post._id)}
                    className="bg-green-500 text-white cursor-pointer px-2 py-1 rounded ml-2"
                  >
                    View
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/create-post')}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Create Blog
        </button>
        <button
          onClick={() => navigate('/analysis')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          View Analytics
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
