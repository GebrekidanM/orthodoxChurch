import React, { useState } from 'react'
import { NavLink , useNavigate} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import {handleAxiosError} from '../utilities/errorHandler'
import Input from '../components/Input';
import Card from '../components/Card';


const Login = () => {
  const [password,setPassword] = useState('')
  const [email,setEmail]= useState('')
  const [error,setError]= useState('')
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const handleSubmit = async (e) => {
    e.preventDefault();

      setError("");
      if (!email.trim() || !password.trim()) {
        return setError("All fields are required!");
      }

      if (!emailRegex.test(email)) {
        return setError("Invalid email format!");
      }
      try {
        setLoading(true);  // Start loading
        await login(email, password);
        
        navigate('/', { replace: true })

        setEmail("");
        setPassword("");
      } catch (err) {
        setError(err|| "Login failed!")
      } finally {
        setLoading(false);  // End loading
      }
  };

  

  return (
    <div className='w-full mb-40 flex justify-center mt-20'>
      <Card title="ይግቡ">
        <form onSubmit={handleSubmit} className='w-full p-4 flex flex-col gap-3'>
            <Input label="ኢሜል" change={e=>setEmail(e.target.value)} type="email" disable={loading}/>
            <Input label="የይለፍቃል" change={e=>setPassword(e.target.value)} type="password" disable={loading}/>
            <p className='text-center'>አካውንት የለኝም <NavLink to={'/register'} className={'text-yellow-600 font-bold'}>ይመዝገቡ</NavLink> </p>
            {error && <p className='text-red-600 font-light'>{error}</p>}
            
            <div className='flex flex-col gap-2'>
            <input 
                  type='submit' 
                  value={loading ? 'Loading...' : 'ይግቡ'}
                  className='w-1/2 ml-[25%] cursor-pointer p-2 rounded-sm bg-yellow-700' 
                  disabled={loading}
                />
            </div>
        </form>
      </Card>
    </div>
  )
}

export default Login
