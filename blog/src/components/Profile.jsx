import React from 'react'

const Profile = ({name,image,role,email}) => {
  return (
    <div className='flex flex-col items-center justify-between rounded-md shadow-sm shadow-white border-amber-50 p-2 '>
      <img 
            src={`http://localhost:5000/uploads/${image}`}
            alt={`${name} profile`} 
            className='rounded-[100%] w-30 h-30'
        />
        <h3 className='pt-2 font-bold'>{name}</h3>
        <div className='flex flex-col justify-center items-center'>
          <p>{email}</p>
          <p>{role}</p>
        </div>
    </div>
  )
}

export default Profile
