import React from 'react'
import { NavLink } from 'react-router-dom'

const Post = ({ title, author, date, summary, image, id}) => {

  return (
    <div className="flex flex-col gap-4 w-full bg-gray-750 rounded-sm shadow-sm shadow-white">
      <img src={image && `http://localhost:5000/uploads/${image}`} 
           alt="Post Image" 
           className="w-100 h-40 object-cover object-[750%_25%] rounded-t-sm" />
      
      <div className="flex flex-col p-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mb-4 text-sm text-gray-400">
          <span>by: {author} </span>
          <span className="ml-2">{date}</span>
        </p>

        <p className="text-sm text-gray-300">{summary}</p>
        <NavLink to={`/postdetail/${id}`} className="text-yellow-600 p-1">
          See more . . .
        </NavLink>
      </div>
    </div>
  )
}

export default Post
