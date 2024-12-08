import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className='fixed top-0 left-1/2 transform -translate-x-1/2 w-2/3 bg-white shadow-md rounded-b-lg no-scrollbar'>
      <ul className='flex justify-around items-center p-4'>
        <li className='text-gray-700 hover:text-green-500'>
          <a href='#'>Home</a>
        </li>
        <li className='text-gray-700 hover:text-green-500'>
          <Link href='/invoices'>Invoices</Link>
        </li>
        <li className='text-gray-700 hover:text-green-500'>
          <Link href='/dashboard'>Dashboard</Link>
        </li>
        <li className='text-gray-700 hover:text-green-500'>
          <a href='/analytics'>Analytics</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
