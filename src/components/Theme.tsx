import React from 'react'
import { NavLink } from 'react-router-dom';

const Theme = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <NavLink to="/">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-gradient bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            API Data Table
          </h1>
        </NavLink>

        {children}
      </div>
    </div>
  )
}

export default Theme