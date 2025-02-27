import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utilities/axiosConfig";
import { useAuth } from "../context/AuthContext";

const ManagePost = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth()

  useEffect(() => {
    const loggedInUserId = user.userId;
    setUserId(loggedInUserId); 

    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/post/posts");
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts.");
      }
    };

    fetchPosts();
  }, []);

  // Handle Edit (Navigate to Edit Page)
  const handleEdit = (postId) => {
    navigate(`/mainadmin?page=manage-post&idedit=${postId}`);
  };

  // Handle Delete (Remove Post)
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/post/delete/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      setError("Failed to delete post.");
    }
  };

  // Handle View (Navigate to Post Details)
  const handleView = (postId) => {
    navigate(`/postdetail/${postId}`);
  };

  return (
    <div className="bg-white text-neutral-900 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Blogs</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-neutral-700 text-neutral-300">
            <th className="border border-neutral-500 px-4 py-2">Title</th>
            <th className="border border-neutral-500 px-4 py-2">Author</th>
            <th className="border border-neutral-500 px-4 py-2">Summary</th>
            <th className="border border-neutral-500 px-4 py-2 w-2xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td className="border border-neutral-500 px-4 py-2">{post.title}</td>
              <td className="border border-neutral-500 px-4 py-2">{post.author?.username}</td>
              <td className="border border-neutral-500 px-4 py-2">{post.summary}</td>
              <td className="border border-neutral-500 px-4 py-2">
                <div className="flex gap-2 justify-center">
                  {/* Only show Edit and Delete buttons if the logged-in user is the post author */}
                  {post.author?._id === userId && (
                    <>
                      <button
                        className="bg-blue-500 text-white cursor-pointer px-2 py-1 rounded"
                        onClick={() => handleEdit(post._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white cursor-pointer px-2 py-1 rounded"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    className="bg-green-500 text-white cursor-pointer px-2 py-1 rounded"
                    onClick={() => handleView(post._id)}
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
  );
};

export default ManagePost;
