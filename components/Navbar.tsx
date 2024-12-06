import React from 'react';

const Navbar = () => {
  return (
    <nav className='fixed top-0 left-1/2 transform -translate-x-1/2 w-2/3 bg-white shadow-md rounded-b-lg no-scrollbar'>
      <ul className='flex justify-around items-center p-4'>
        <li className='text-gray-700 hover:text-green-500'>
          <a href='#'>Home</a>
        </li>
        <li className='text-gray-700 hover:text-green-500'>
          <a href='#'>About</a>
        </li>
        <li className='text-gray-700 hover:text-green-500'>
          <a href='#'>Services</a>
        </li>
        <li className='text-gray-700 hover:text-green-500'>
          <a href='#'>Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
