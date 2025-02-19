import React from 'react'

const Card = ({children,title}) => {
  return (
    <div className='w-120 flex flex-col items-center rounded-md shadow-sm shadow-white'>
        <h2 className='text-3xl mb-4 p-2 text-yellow-600'>{title}</h2>
        {children}
    </div>
  )
}

export default Card
