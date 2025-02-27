import React from 'react'

const Input = ({type,change,value,disable,label}) => {
  return (
    <div>
        <div className='flex flex-col gap-2'>
            <label>{label}:</label>
            <input 
              type={type} 
              onChange={change} 
              value={value}
              disabled={disable}
              className='w-full px-2 p-1 rounded-sm outline-none bg-neutral-100 text-neutral-900' 
             />
          </div>
        
    </div>
  )
}

export default Input