import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AdminUsers from './AdminUsers';
import CreatePost from './CreateNewPost';
import ManagePost from './ManagePost';
import UserEdit from './Edit/UserEdit';
import PostEdit from './Edit/PostEdit';
import ManageComment from './ManageComment';

const Main = () => {
    const {user} = useAuth()
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "dashboard";
    const idedit = searchParams.get("idedit");


    const renderPage = () => {
      switch (page) {
        case "dashboard":
          return <Dashboard />;
        case "manage-user":
          if(idedit) return <UserEdit id={idedit}/>; 
          return <AdminUsers />;
        case "manage-post":
          if(idedit) return <PostEdit id={idedit}/>; 
          return <ManagePost />;
        case "create-post":
          return <CreatePost />;
        case "manage-comment":
          return <ManageComment />;
        
        default:
          return <Dashboard />;
      }
  };
  
  return (
    <div className="min-h-screen mt-14 ml-48 bg-black " style={{"width":"calc(100vw - 236px)"}}>
      <header className="bg-black shadow-md py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Blog Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4 tx-white">{user?.username}</span>
            <img src={`http://localhost:5000/uploads/${user?.image}`} alt="Profile" className="rounded-full w-10 h-10 object-cover" />
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>
        <main className="flex-1 p-6">{renderPage()}</main>  
      </div>
     </div>
  );
};

export default Main;
