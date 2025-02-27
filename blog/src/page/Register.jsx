import React, { useState } from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import axiosConfig from '../utilities/axiosConfig'
import {handleAxiosError} from '../utilities/errorHandler'
import Input from '../components/Input'
import Card from '../components/Card'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !email.trim() || !password.trim() || !confPassword.trim()) {
      return setError("All fields are required!")
    }

    if (!emailRegex.test(email)) {
      return setError("Invalid email format!")
    }

    if (!passwordRegex.test(password)) {
      return setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.")
    }

    if (password !== confPassword) {
      return setError("Passwords do not match.")
    }

    try {
      setLoading(true)
      await axiosConfig.post('/user/register', { username, password, email })
      
      navigate('/login', { replace: true })
      
      // Clear input fields on successful registration
      setUsername("")
      setEmail("")
      setPassword("")
      setConfPassword("")
    } catch (err) {
      setError(handleAxiosError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full flex justify-center mt-16'>
      <Card title="ይመዝገቡ">
        <form onSubmit={handleSubmit} className='w-full p-4 flex flex-col gap-3'>
          <Input type={"text"} change={e => setUsername(e.target.value)} value={username} disable={loading} label={"የተጠቃሚ ስም"}/>
          <Input type={"email"} change={e => setEmail(e.target.value)} value={email} disable={loading} label={"ኢሜል"}/>
          <Input type={"password"} change={e => setPassword(e.target.value)} value={password} disable={loading} label={"የይለፍቃል"}/>
          <Input type={"password"} change={e => setConfPassword(e.target.value)} value={confPassword} disable={loading} label={"ድጋሚ የይለፍቃል"}/>
          <p className='text-center'>
            አካውንት አለኝ <NavLink to={'/login'} className={'text-yellow-600 font-bold'}>ይግቡ</NavLink>
          </p>
          {error && <p className='text-red-600 font-light'>{error}</p>}
          <div className='flex flex-col gap-2'>
            <input 
              type='submit' 
              value={loading ? 'Loading...' : 'ይመዝገቡ'} 
              className='w-1/2 ml-[25%] cursor-pointer p-2 rounded-sm bg-yellow-700' 
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Register
