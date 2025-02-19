import React from 'react'
import Post from '../components/Post'

const Favorites = () => {
  
  return (
    <div className='w-[90%] ml-[5%]'>
        <div className='flex gap-8'>
            <Post/>
            <Post/>
            <Post/>
        </div>
      
    </div>
  )
}

export default Favorites
