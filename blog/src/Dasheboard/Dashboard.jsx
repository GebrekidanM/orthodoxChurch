import React from 'react'

const Dashboard = () => {
  return (
      <>
          {/* Blog Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total Blogs</h2>
              <p className="text-2xl">150</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Published Blogs</h2>
              <p className="text-2xl">100</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Drafts</h2>
              <p className="text-2xl">50</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total Views</h2>
              <p className="text-2xl">10,000</p>
            </div>
          </div>

          {/* Recent Blogs Table */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Recent Blogs</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Blog Title 1</td>
                  <td className="border px-4 py-2">Author 1</td>
                  <td className="border px-4 py-2">Category 1</td>
                  <td className="border px-4 py-2">Published</td>
                  <td className="border px-4 py-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                    <button className="bg-green-500 text-white px-2 py-1 rounded ml-2">View</button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Create New Blog</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">View Analytics</button>
          </div>
        </>
  )
}

export default Dashboard
