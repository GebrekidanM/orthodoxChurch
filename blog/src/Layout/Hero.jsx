import React from 'react'
import logo from '/logo.png'

import { useAuth } from '../context/AuthContext'
import { NavLink } from 'react-router-dom'

const Hero = () => {
    const {user} = useAuth()

  return (
        <div className='flex mb-24 gap-6 lg:flex-row flex-col-reverse md:justify-center lg:mt-14 lg:gap-10 items-center w-[80%] ml-[10%] h-[90vh]'>
            <div className='flex flex-col items-start gap-8'>
                <p className='flex flex-col gap-2 font-abysinica text-center lg:text-left'>
                    <span className='lg:text-sm'>እንኳን ደህና መጡ</span>
                    <span className='text-2xl'>ለሚወጣ ሁሉ በክርስቶስም ትምህርት ለማይኖር ሰው አምላክ የለውም።</span>
                    <span className='text-yellow-500 font-bold'>2ኛ ዮሐንስ 9</span>
                </p>
                {user 
                    ? 
                        <NavLink to='/ask' className='bg-yellow-600 mx-auto lg:mx-0 hover:bg-yellow-700 transition-all duration-300 text-center p-2 rounded-sm w-30 font-bold text-black hover:text-amber-950 font-abysinica text-2xl cursor-pointer'>ይጠይቁ</NavLink>
                    :
                        <NavLink to='/register' className='bg-yellow-600 mx-auto lg:mx-0 hover:bg-yellow-700 transition-all duration-300 text-center p-2 rounded-sm w-30 font-bold text-black hover:text-amber-950 font-abysinica text-2xl cursor-pointer'>ይመዝገቡ</NavLink>
                }
            </div>
            <img
                src={logo}
                alt="logo apostolic"
                className="lg:w-100 lg:h-100 md:w-50 md:h-50 "
                />
         </div>
  )
}

export default Hero
