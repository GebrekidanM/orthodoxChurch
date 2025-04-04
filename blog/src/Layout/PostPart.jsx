import React, { useEffect, useState } from 'react';
import api from '../utilities/axiosConfig';
import Post from '../components/Post';
import logo from '/logo.png'

const PostPart = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/post/threeposts');
        setPosts(data);
      } catch (err) {
        setError(err); // The interceptor will handle the error message
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='w-[90%] ml-[5%] mt-10'>
      <div className='flex gap-2 items-center mb-2'> 
        <img src={logo} alt='logo hawariyawi'className='w-10'/>              
        <h2 className='text-2xl text-yellow-600'>አዳዲስ መጣጥፎች</h2>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <Post 
            key={post._id} 
            title={post.title} 
            author={post.author?.username} 
            date={new Date(post.createdAt).toLocaleDateString()} 
            summary={post.summary} 
            image={post.image}
            id={post._id}
          />
        ))}
      </div>
    </div>
  );
}

export default PostPart;
