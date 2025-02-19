import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AdminUsers from './AdminUsers';
import Analysis from './Analysis';
import CreatePost from './CreateNewPost';

const Main = () => {
    const {user} = useAuth()
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "dashboard";
    const renderPage = () => {
        switch (page) {
          case "dashboard":
            return <Dashboard />;
          case "manage-user":
            return <AdminUsers />;
          case "create-post":
            return <CreatePost />;
          case "analysis":
            return <Analysis />;
          default:
            return <Dashboard />;
        }
      };
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black shadow-md py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Blog Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">{user?.username}</span>
            <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full" />
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>

        <main className="flex-1 p-6 ml-58">{renderPage()}</main>  
      </div>
     </div>
  );
};

export default Main;
