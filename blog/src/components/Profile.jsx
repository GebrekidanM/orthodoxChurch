import React from 'react';

const Profile = ({ name, image, role, email }) => {
  return (
    <div className="flex flex-col items-center justify-between rounded-md shadow-sm shadow-white border border-amber-50 p-4 md:px-6 
                      sm:w-1/5  w-full text-center md:text-left transition-all duration-300 ">
      
      {/* Profile Image */}
      <img 
        src={`http://localhost:5000/uploads/${image}`}
        alt={`${name} profile`} 
        className="rounded-full w-32 h-32 object-cover sm:w-40 sm:h-40 border border-gray-300"
      />

      {/* Text Content */}
      <div className="flex flex-col justify-center items-center md:items-start gap-2 px-4">
        <h3 className="text-lg font-bold text-center">{name}</h3>
        <p className="text-gray-300 lg:text-xl md:text-sm">{email}</p>
        <p className="text-yellow-400 font-semibold">{role}</p>
      </div>
    </div>
  );
};

export default Profile;
