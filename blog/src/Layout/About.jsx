import React from 'react'
import Profile from '../components/Profile'
import logo from '/logo.png'
import Input from '../components/Input'
const About = () => {
  return (
    <div className='w-[90%] ml-[5%] mt-40 flex flex-col  mb-4'>
      <div className='flex justify-between'>
        <Profile/>
        <Profile/>
        <Profile/>
        <Profile/>
        <Profile/>
        <Profile/>
      </div>
      <div className=' w-[100%] mt-40 flex justify-between '>
          <div className='w-1/2 flex flex-col gap-2'>
            <div className='flex gap-2 items-center'> 
              <img src={logo} alt='logo hawariyawi'className='w-10'/>
              <h2 className='text-2xl text-yellow-600'>ሐዋሪያዊ መልሶች</h2>
            </div>
            <p>Although Kepler 452b is located in the habitable zone of its star, it is currently too far for humans to reach with our existing space technology. At approximately 1,400 light-years away, it would take tens of thousands of years, even at the speed of the fastest spacecraft we have today (such as the Parker Solar Probe, which travels at around 700,000 km/h). To make human travel to such distant exoplanets a reality, we would need to develop technologies that can achieve much faster speeds, such as propulsion systems based on nuclear fusion, antimatter, or even theoretical concepts like warp drives.</p>
          </div>
          
          <div className='flex flex-col w-1/3 p-3 bg-gray-750 rounded-md shadow-sm shadow-white'>
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
