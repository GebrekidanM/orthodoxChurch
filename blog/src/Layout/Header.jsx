import React from 'react'
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../page/LogoutButton';


const Header = () => {
  const {user} = useAuth()
  
const lists = [
  { label: "መጣጥፍ", path: "/posts" },
  { label: "ጥያቄዎች", path: "/questions" },
  { label: "ስለ እኛ", path: "/about" },
  { label: "ያግኙን", path: "/contact" },
]
    
  return (
    <div className='w-full px-10 flex justify-between h-14 items-center fixed left-0 top-0 bg-neutral-900 '>
        <Link to={'/'} className='font-jiret font-bold text-yellow-500 text-xl'>ሐዋሪያዊ መልሶች</Link>
        <ul className='flex gap-4 items-center'>
           {lists.map(list=>(
            <NavLink key={list.label} to={list.path} className={({ isActive }) => isActive ? "list-none font-abysinica font-bold cursor-pointer text-yellow-500" : "text-white list-none font-abysinica font-bold cursor-pointer hover:text-yellow-500 transition-colors" }>{list.label}</NavLink>
            ))} 
            {user ? 
            <>
              <LogoutButton/> 
              <Link to="/mainadmin" className="list-none font-abysinica font-bold cursor-pointer bg-green-700 py-1 px-3 rounded-md">Dashbord</Link>
            </>
                  : <NavLink to={'/login'} 
                             className={({ isActive }) => isActive ? "list-none font-abysinica font-bold cursor-pointer text-yellow-500 bg-green-700 py-1 px-3 rounded-md" : "bg-green-700 py-1 px-3 rounded-md text-white list-none font-abysinica font-bold cursor-pointer hover:text-yellow-500 transition-colors"}> ይግቡ </NavLink>}
        </ul>
    </div>
  )
}

export default Header
