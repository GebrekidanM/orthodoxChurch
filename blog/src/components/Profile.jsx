import React from 'react'
import akie from '../assets/akililu.png'

const Profile = () => {
  return (
    <div className='flex flex-col items-center justify-between'>
      <img 
            src={akie} 
            alt='akie profile' 
            className='rounded-[100%] w-30'
        />
        <h3>መ/ር አክሊሉ</h3>
    </div>
  )
}

export default Profile
