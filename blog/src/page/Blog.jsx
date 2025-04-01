import React, { useEffect, useState } from "react";
import api from "../utilities/axiosConfig";
import Post from "../components/Post";
import { NavLink } from "react-router-dom";
import PopularPosts from "../components/PopularPost";
import logo from '/logo.png'
import host from "../utilities/api";


const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [tenPosts, setTenPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tenPostsError, setTenPostsError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/post/posts");
        setPosts(response.data);
      } catch (err) {
        setError("Failed to load blog posts.");
      }
    };

    const fetchTenPosts = async () => {
      try {
        const response = await api.get("/post/posts/ten");
        setTenPosts(response.data);
      } catch (err) {
        setTenPostsError("Failed to load latest blog posts.");
      }
    };

    // Run both requests, then stop loading after both complete
    Promise.all([fetchPosts(), fetchTenPosts()]).finally(() => setLoading(false));
  }, []);

  // 🔎 **Filter Posts Based on Search**
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔄 **Loading State**
  if (loading) {
    return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin delay-200"></div>
      </div>
      <p className="mt-4 text-lg font-semibold text-yellow-500 animate-pulse">Loading questions...</p>
    </div>
  )};
  
  // ❌ **Error Handling**
  if (error && tenPostsError) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="w-full mt-14 mx-auto p-6">
      {/* 🔎 Search Bar */}
      <div className="w-full mb-4 flex flex-col items-center gap-6 h-86 relative">
          <div className='flex flex-col  items-center'> 
              <img src={logo} alt='logo hawariyawi'className='w-30'/>
              <h2 className='text-2xl text-yellow-600'>ሐዋሪያዊ መልሶች</h2>                  
          </div>
        <input
          type="text"
          placeholder="Search posts..."
          className="w-1/2 p-2 border border-gray-400 rounded-md outline-none pr-10"
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

      {/* 📌 Blog Content */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available.</p>
      ) : (
        <div className="w-full flex flex-col-reverse  lg:flex-row justify-between gap-6">
          {/* 🔹 Left Side: Recent Posts */}
          <div className="flex flex-col sticky top-20 gap-3 w-full min-h-screen lg:w-1/5">
            <h1 className="font-bold text-2xl text-yellow-600">አዳዲስ መጣጥፎች</h1>
            {tenPostsError ? (
              <p className="text-red-500">{tenPostsError}</p>
            ) : (
              tenPosts.map((post) => (
                <div key={post._id} className="flex gap-4 pb-3">
                  <img
                    src={post.image && `${host}/uploads/${post.image}`}
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
              ))
            )}
            <div className="w-full sticky top-20 min-h-screen">
              <PopularPosts />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full lg:w-3/5">
              {filteredPosts.length === 0 ? (
                <p className="text-center text-gray-600 w-full">No matching posts found.</p>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post._id} className="w-full md:w-[48%] lg:w-[48%] flex">
                    <Post
                      className="flex flex-col flex-1 h-[200px]"
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
        </div>
      )}
    </div>
  );
};

export default Blog;
