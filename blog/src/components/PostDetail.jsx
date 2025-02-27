import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utilities/axiosConfig";
import { FaThumbsUp, FaRegThumbsUp, FaReply, FaEye } from "react-icons/fa";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/post/${id}`);
        setPost(response.data);
        setLikeCount(response.data.likes?.length || 0);
        setViews(response.data.views || 0); // Include views from post data
        setIsLiked(response.data.likes?.includes(user?._id));
      } catch (err) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/${id}`);
        setComments(response.data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };

    const fetchViews = async () => {
      try {
        const res = await api.get(`/post/${id}/view`);
        setViews(res.data.views);
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    };

    fetchViews();

    fetchPostData();
    fetchComments();
  }, [id, user]);

  const handleLikePost = async () => {
    if (!user) {
      navigate(`/login?redirect=/post/${id}`);
      return;
    }

    // Optimistically update UI before API call
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await api.put(`/post/${id}/like`);
      setLikeCount(response.data.likes.length);
      setIsLiked(response.data.likes.includes(user?._id));
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      navigate(`/login?redirect=/post/${id}`);
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await api.post("/comments", {
        postId: id,
        content: newComment,
      });
      setComments((prev) => [response.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      navigate(`/login?redirect=/post/${id}`);
      return;
    }

    try {
      const response = await api.put(`/comments/${commentId}/like`);
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, likes: response.data.likes } : comment
        )
      );
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  const handleReply = async (commentId, replyText) => {
    if (!user) {
      navigate(`/login?redirect=/post/${id}`);
      return;
    }

    if (!replyText.trim()) return;

    try {
      const response = await api.post("/comments/reply", {
        postId: id,
        content: replyText,
        parentComment: commentId,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, response.data] }
            : comment
        )
      );
    } catch (err) {
      console.error("Failed to add reply", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-20 mb-14 p-6 bg-neutral-900 rounded-lg shadow-md text-gray-300">
      {post && (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-2">
            By <strong>{post.author?.username}</strong> on{" "}
            {new Date(post.createdAt).toDateString()}
          </p>
          
          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt="Post"
              className="w-full h-100 object-cover object-[75%_25%] rounded-md mb-4"
            />
          )}
          <div
            className="text-lg mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-1 text-gray-400 hover:text-yellow-500"
              onClick={handleLikePost}
            >
              {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
              <span>{likeCount}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-400">
                <FaEye />
                <span>{views}</span>
            </div>
          </div>
        </>
      )}

      <div className="mt-6">
        <h2 className="text-2xl mb-3">Comments</h2>
        {user && (
          <div className="flex flex-col gap-3">
            <textarea
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-white"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="bg-yellow-600 px-4 py-2 rounded text-white" onClick={handleAddComment}>
              Comment
            </button>
          </div>
        )}

        <div className="mt-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-neutral-800 p-3 rounded mb-3">
                <p className="text-sm text-gray-400">
                  <strong>{comment.user.username}</strong> •{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p className="text-white">{comment.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    className="flex items-center gap-1 text-gray-400 hover:text-yellow-500"
                    onClick={() => handleLikeComment(comment._id)}
                  >
                    {comment.likes?.includes(user?._id) ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                  
                  <button
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-400"
                    onClick={() => handleReply(comment._id, prompt("Reply:"))}
                  >
                    <FaReply />
                    Reply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
