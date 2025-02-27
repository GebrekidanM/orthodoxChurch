import React, { useEffect, useState } from "react";
import api from "../utilities/axiosConfig";
import Post from "../components/Post";
import { NavLink } from "react-router-dom";
import PopularPosts from "../components/PopularPost";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [tenPosts, setTenPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/post/posts");
        setPosts(response.data);
      } catch (err) {
        setError("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTenPosts = async () => {
      try {
        const response = await api.get("/post/posts/ten");
        setTenPosts(response.data);
      } catch (err) {
        setError("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    fetchTenPosts();
  }, []);

  // Filter only the posts (grid view)
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="w-full mx-auto mt-10 p-6">
      {/* Search Bar */}
      <div className="w-3/5 mb-4 ml-auto relative">
      <input
        type="text"
        placeholder="Search posts..."
        className="w-full p-2 border border-gray-400 rounded-md outline-none pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
        >
          ✖
        </button>
      )}
    </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available.</p>
      ) : (
        <div className="w-full flex flex-col lg:flex-row justify-between overflow-visible gap-6">
          {/* Left Side: Recent Posts List */}
          <div className="flex flex-col sticky top-20 gap-3 w-full min-h-screen lg:w-1/5">
            <h1 className="font-bold">Latest Blog Posts</h1>
            {tenPosts.map((post) => (
              <div key={post._id} className="flex gap-4 pb-3">
                <img
                  src={post.image && `http://localhost:5000/uploads/${post.image}`}
                  alt="Post"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <small className="text-gray-500">
                    {post.author?.username} • {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                  <NavLink to={`/postdetail/${post._id}`} className="text-yellow-600 text-sm mt-1">
                    See more . . .
                  </NavLink>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Grid View (Filtered) */}
          <div className="flex flex-wrap gap-6 w-full lg:w-3/5">
            {filteredPosts.length === 0 ? (
              <p className="text-center text-gray-600 w-full">No matching posts found.</p>
            ) : (
              filteredPosts.map((post) => (
                <div className="w-[45%]" key={post._id}>
                  <Post
                    title={post.title}
                    author={post.author?.username}
                    date={new Date(post.createdAt).toLocaleDateString()}
                    summary={post.summary}
                    image={post.image}
                    id={post._id}
                  />
                </div>
              ))
            )}
          </div>

          <div className="w-1/5 sticky top-20 min-h-screen">
            <PopularPosts />
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
