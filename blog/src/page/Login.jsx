import React, { useState } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Input from '../components/Input';
import Card from '../components/Card';
import api from '../utilities/axiosConfig';

const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser, setRole , role} = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation checks
    if (!email.trim() || !password.trim()) {
      return setError('All fields are required!');
    }

    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address!');
    }

    try {
      setLoading(true);
      const { data } = await api.post("/user/login", { email, password });

      if (data?.user) {
        setUser(data.user);
        setRole(data.user?.role || "");
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError(error);
      setRole("");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/mainadmin" replace state={{ role }} />;
  }
  

  return (
    <div className="w-full mb-40 flex justify-center mt-20">
      <Card title="ይግቡ">
        <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col gap-3">
          <Input label="ኢሜል" change={(e) => setEmail(e.target.value)} type="email" disable={loading} />
          <Input label="የይለፍቃል" change={(e) => setPassword(e.target.value)} type="password" disable={loading} />
          <p className="text-center">
            አካውንት የለኝም <NavLink to={'/register'} className={'text-yellow-600 font-bold'}>ይመዝገቡ</NavLink>
          </p>
          {error && <p className="text-red-600 font-light">{error}</p>}
          
          <div className="flex flex-col gap-2">
            <input
              type="submit"
              value={loading ? 'Loading...' : 'ይግቡ'}
              className="w-1/2 ml-[25%] cursor-pointer p-2 rounded-sm bg-yellow-700"
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
