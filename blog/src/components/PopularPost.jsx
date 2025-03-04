import React, { useEffect, useState } from "react";
import api from "../utilities/axiosConfig";
import { NavLink } from "react-router-dom";
import host from "../utilities/api";

const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  
  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await api.get("/post/popular");
        setPopularPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch popular posts.");
      }
    };
    fetchPopularPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-yellow-600">ተወዳጅ መጣጥፎች</h2>
      {popularPosts.map((post) => (
        <NavLink to={`/postdetail/${post._id}`} key={post._id} className="block mt-2">
          <div className="flex gap-2">
            <img src={`${host}/uploads/${post.image}`} alt="Popular" className="w-16 h-16 object-cover rounded" />
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <small className="text-gray-500">
                    {post.author?.username} • {new Date(post.createdAt).toLocaleDateString()}
                </small>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default PopularPosts;
