import React from 'react'
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className='flex gap-6'>
        <div onClick={()=>navigate(`/mainadmin?page=layout&about=ok`)} className='flex gap-2 items-center cursor-pointer p-3 rounded-md shadow-sm shadow-white'><FaGear /> Change About</div>
        <div onClick={()=>navigate(`/mainadmin?page=layout&name=ok`)} className='flex gap-2 items-center cursor-pointer p-3 rounded-md shadow-sm shadow-white'><FaGear /> Change Name</div>
        <div onClick={()=>navigate(`/mainadmin?page=layout&logo=ok`)} className='flex gap-2 items-center cursor-pointer p-3 rounded-md shadow-sm shadow-white'><FaGear /> Change Logo</div>
      </div>
    </div>
  )
}

export default Layout
