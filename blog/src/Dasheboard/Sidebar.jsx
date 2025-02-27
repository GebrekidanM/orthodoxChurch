import React from "react";
import { useSearchParams } from "react-router-dom";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = searchParams.get("page");

  const handleNavigation = (page) => {
    setSearchParams({ page });
  };

  const lists = [
    { link: "dashboard", name: "Dashboard" },
    { link: "create-post", name: "Create Blog" },
    { link: "manage-user", name: "Manage Users" },
    { link: "manage-post", name: "Manage Posts" },
    { link: "manage-comment", name: "Manage Comments" },
  ];

  return (
    <aside className="w-56 h-full fixed left-0 top-14 bg-black shadow-sm shadow-amber-100">
      <nav className="p-6">
        <ul className="flex flex-col gap-2">
          {lists.map((list) => (
            <li
              key={list.link}
              onClick={() => handleNavigation(list.link)}
              className={`p-1 font-bold cursor-pointer duration-200 transition-all rounded-sm ${
                activePage === list.link
                  ? "bg-gray-400 text-black"
                  : "hover:bg-gray-400 hover:text-black"
              }`}
            >
              {list.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
