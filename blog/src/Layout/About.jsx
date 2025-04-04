import React, { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import logo from '/logo.png'
import Input from '../components/Input'
import api from '../utilities/axiosConfig'

const About = () => {
  const [admins, setAdmins] = useState([]);
  const [about, setAbout] = useState('');
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await api.get('/user/main-admins'); // API to fetch admins
        setAdmins(data);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      }
    };

    const fetchAbout = async () =>{
      try {
        const {data} = await api.get('/layout/about')
        setAbout(data)
      } catch (error) {
        setError(error)
      }
    }

    fetchAbout();
    fetchAdmins();
  }, []);



  return (
    <div className='w-[90%] ml-[5%] mt-40 flex flex-col  mb-4'>
      <div className='mt-10'>
            <div className='flex gap-2 items-center mb-2'> 
                <img src={logo} alt='logo hawariyawi'className='w-10'/>
                <h2 className='text-2xl text-yellow-600'>መምህራን</h2>
            </div>
        <div className='flex flex-wrap w-full justify-start gap-4'>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <Profile key={admin._id} name={admin.username} email={admin.email} role={admin.role} image={admin.image} />
            ))
          ) : (
            <p>No admins found.</p>
          )}
        </div>
      </div>
      <div className=' w-[100%] mt-40 flex lg:gap-2 gap-10 lg:flex-row flex-col justify-between '>
          <div className='lg:w-1/2 w-full flex flex-col gap-2'>
            <div className='flex gap-2 items-center'> 
              <img src={logo} alt='logo hawariyawi'className='w-10'/>
              <h2 className='text-2xl text-yellow-600'>ሐዋሪያዊ መልሶች</h2>
            </div>
            <div
              className="text-lg mb-4"
              dangerouslySetInnerHTML={{ __html: about.content }}
            />
          </div>
          
          <div className='flex flex-col lg:w-1/3 mx-auto sm:w-2/3 w-full p-3 bg-gray-750 rounded-md shadow-sm shadow-white'>
            <h2 className='text-4xl font-bold text-center p-3'>ያግኙን</h2>
            <form className='flex flex-col gap-3'>
              <Input label={"የተጠቃሚ ስም"} type='text'/>
              <Input label={"ኢሜል"} type='email'/>
              <div className='flex flex-col gap-2'>
                <label>መልዕክት:</label>
                <textarea className='px-1 p-1 border-1 border-gray-600 rounded-sm outline-none bg-neutral-100 text-neutral-900'></textarea>
              </div>
              <div className='flex flex-col gap-2'>
                <input type='button' value={'ይላኩ'} className='w-1/2 ml-[25%] cursor-pointer p-2 rounded-sm bg-yellow-700'/>
              </div>
            </form>
          </div>
          
          
      </div>
      
    </div>
  )
}

export default About
