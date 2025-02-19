import React from 'react'
import { NavLink } from 'react-router-dom'

const Post = ({ title, author, date, summary, image, id}) => {

  return (
    <div className="flex gap-4 max-w-sm bg-gray-750 rounded-e-sm shadow-sm shadow-white p-4">
      <img src={image && `http://localhost:5000/uploads/${image}`} 
           alt="Post Image" 
           className="w-36 object-cover rounded-e-sm" />
      
      <div className="flex flex-col">
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
