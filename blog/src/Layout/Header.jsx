import React, {useEffect, useState} from 'react';
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../page/LogoutButton';

const Header = () => {
  const { user, loading} = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lists = [
    { label: "መጣጥፍ", path: "/posts" },
    { label: "ጥያቄዎች", path: "/question" },
    { label: "ስለ እኛ", path: "/about" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle NavLink styling
  const getNavLinkClass = (isActive, isLoginButton = false) => {
    const baseClass = "list-none font-abysinica font-bold cursor-pointer transition-colors";
    const activeClass = isLoginButton 
      ? "text-yellow-500 bg-green-700 py-1 px-3 rounded-md" 
      : "text-yellow-500";
    const inactiveClass = isLoginButton 
      ? "bg-green-700 py-1 px-3 rounded-md text-white hover:text-yellow-500" 
      : "text-white hover:text-yellow-500";
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  // Show loading state until auth check is complete
  if (loading) {
    return (
      <div className="w-full px-10 flex justify-between h-full items-center absolute left-0 top-0 bg-neutral-900 text-white">
        Checking authentication...
      </div>
    );
  }


  return (
    <div className='w-full px-10 flex justify-between h-14 items-center fixed left-0 top-0 bg-neutral-900 z-20'>
      {/* Logo */}
      <Link to={'/'} className='font-jiret font-bold text-yellow-500 text-xl'>
        ሐዋሪያዊ መልሶች
      </Link>

      {/* Hamburger Menu (Mobile) */}
      <button 
        className="md:hidden text-white focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Navigation Links (Desktop) */}
      <ul className={`md:flex gap-4 items-center ${isMenuOpen ? 'flex flex-col bg-neutral-900 w-full z-50 absolute top-14 left-0 pb-4' : 'hidden'}`}>
        {lists.map(list => (
          <NavLink 
            key={list.label} 
            to={list.path} 
            onClick={()=> isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(false)}
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            {list.label}
          </NavLink>
        ))}

        {/* Conditional Rendering for Login/Logout */}
        {user ? (
          <>
            <LogoutButton />
            {user.role === "admin" && (
              <Link 
                to="/mainadmin" 
                className="list-none font-abysinica font-bold cursor-pointer bg-green-700 py-1 px-3 rounded-md hover:text-yellow-500 transition-colors"
              >
                ዳሽቦርድ
              </Link>
            )}
          </>
        ) : (
          <NavLink 
            to={'/login'} 
            className={({ isActive }) => getNavLinkClass(isActive, true)}
          >
            ይግቡ
          </NavLink>
        )}
      </ul>
    </div>
  );
};

export default Header