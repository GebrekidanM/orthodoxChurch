import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utilities/axiosConfig";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/post/${id}`);
        setPost(response.data);
      } catch (err) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-28 mb-14 p-6 bg-neutral-900 rounded-lg shadow-md text-gray-300">
      {post && (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-2">
            By <strong>{post.author.username}</strong> on {new Date(post.createdAt).toDateString()}
          </p>
          <img
            src={post.image && `http://localhost:5000/uploads/${post.image}`}
            alt="Post"
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <div className="text-lg" dangerouslySetInnerHTML={{ __html: post.content }} />

        </>
      )}
    </div>
  );
};

export default PostDetail;
