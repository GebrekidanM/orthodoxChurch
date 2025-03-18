import React, { useState, useEffect } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../page/LogoutButton';

const Header = () => {
  const { user, loading } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(user); // Update user state when authentication changes
  }, [user]);

  const lists = [
    { label: "መጣጥፍ", path: "/posts" },
    { label: "ጥያቄዎች", path: "/question" },
    { label: "ስለ እኛ", path: "/about" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

  if (loading) {
    return (
      <div className="w-screen px-10 flex justify-between h-screen items-center fixed left-0 top-0 bg-neutral-900 text-white">
        Loading . . .
      </div>
    );
  }

  return (
    <div className='w-full px-10 flex justify-between h-14 items-center fixed left-0 top-0 bg-neutral-900 z-20'>
      {/* Logo */}
      <Link to='/' className='font-jiret font-bold text-yellow-500 text-xl'>
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

      {/* Navigation Links (Desktop & Mobile) */}
      <ul className={`md:flex gap-4 items-center ${isMenuOpen ? 'flex flex-col bg-neutral-900 w-full z-50 absolute top-14 left-0 pb-4' : 'hidden'}`}>
        {lists.map(list => (
          <NavLink 
            key={list.label} 
            to={list.path} 
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            {list.label}
          </NavLink>
        ))}

        {/* Conditional Rendering for Login/Logout */}
        {currentUser ? (
          <>
            <LogoutButton onClick={() => setIsMenuOpen(false)} />
            {(currentUser.role === "admin" || currentUser.role === "main") && (
              <Link 
                onClick={() => setIsMenuOpen(false)} 
                to="/mainadmin" 
                className="list-none font-abysinica font-bold cursor-pointer bg-green-700 py-1 px-3 rounded-md hover:text-yellow-500 transition-colors"
              >
                ዳሽቦርድ
              </Link>
            )}
          </>
        ) : (
          <NavLink 
            to='/login' 
            className={({ isActive }) => getNavLinkClass(isActive, true)}
            onClick={() => setIsMenuOpen(false)}
          >
            ይግቡ
          </NavLink>
        )}
      </ul>
    </div>
  );
};

export default Header;
