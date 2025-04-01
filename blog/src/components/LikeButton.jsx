import React, { useEffect, useState } from "react";
import api from "../utilities/axiosConfig";
import { FaThumbsUp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LikeButton = ({ questionId, answerId, likes }) => {
    const navigate = useNavigate()
    const {user} = useAuth()

    const [numLikes,setNumLikes] = useState()
    useEffect(()=>{
        setNumLikes(likes?.length)
    },[likes])

  const handleLike = async () => {
    if(!user) return navigate('/login');
    try {
      const endpoint = answerId
        ? `/question/${questionId}/answer/${answerId}/like`
        : `/question/${questionId}/like`;
      const response = await api.post(endpoint);
      setNumLikes(numLikes + 1)
    } catch (error) {
      console.error("Error toggling like:", error.response?.data || error.message);
    }
  };

  return (
    <button onClick={handleLike} className="flex items-center text-gray-500 hover:text-yellow-600 cursor-pointer mt-2">
      <FaThumbsUp className="mr-1" /> {numLikes}
    </button>
  );
};

export default LikeButton;
