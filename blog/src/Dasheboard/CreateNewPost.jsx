import React, { useState, useEffect } from "react";
import api from "../utilities/axiosConfig";
import Input from '../components/Input'
import Textarea from "../components/Textarea";
import {useAuth} from '../context/AuthContext'
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {user} = useAuth()


  useEffect(() => {
    if (user) {
      setAuthor(user.userId);
    }
  }, [user]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if(!title.trim()||!content.trim()||!summary.trim()|| !image || !author) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }
    if(summary.length > 100){
      setMessage("the length of summary must be less than 100 characters!")
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("summary", summary);
    formData.append("author", author);
    if (image) formData.append("image", image);

    try {
      await api.post("post/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate('/mainadmin?page=manage-post', { replace: true })
      setMessage("Post created successfully!");
      setTitle("");
      setContent("");
      setSummary("");
      setImage(null);
    } catch (error) {
      setMessage(error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-300 rounded-lg shadow-md text-neutral-900">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" type="text" value={title} change={(e) => setTitle(e.target.value)}/>
        <div className='flex flex-col gap-2'>
            <label>Summary: <small className="text-red-400">less than 200 characters.</small></label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} className='px-2 p-1 rounded-sm outline-none bg-neutral-100 text-neutral-900'></textarea>
        </div>
        <Textarea content={content} setContent={setContent}/>
        <div>
          <label className="block mb-2">Upload Image</label>
          <input type="file" accept="image/*" className="w-full p-2 rounded-sm outline-none bg-neutral-100 text-neutral-900" onChange={handleImageChange} />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
