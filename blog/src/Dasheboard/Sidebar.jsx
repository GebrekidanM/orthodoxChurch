import React from "react";

import { useSearchParams } from "react-router-dom";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigation = (page) => {
    setSearchParams({ page });
  };
const lists = [
  {link:"dashboard",name:"Dashbord"},
  {link:"create-post",name:"Create New Blog"},
  {link:"manage-user",name:"Manage Users"},
  {link:"analysis",name:"Analysis"},

] 
  return (
    <aside className="w-58 h-full fixed left-0 top-14 bg-black shadow-sm shadow-amber-100">
    <nav className="p-6">
      <ul className="">
        {lists.map(list=>(
            <li key={list.link} onClick={() => handleNavigation(list.link)} className="p-1 font-bold cursor-pointer hover:bg-gray-400 hover:text-black duration-200 transition-all rounded-sm">{list.name}</li>
        ))}
      </ul>
    </nav>
    </aside>
  );
};

export default Sidebar;
