'use client';
import { useState } from 'react';
import { useAppContext } from '@/utils/context';
import { FaSearch } from 'react-icons/fa';
import RequestCard from '@/components/RequestCard';

const Page = () => {
  const { requests } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className='container mx-auto p-4'>
      <header className='mb-6'>
        <h1 className='text-4xl font-extrabold text-center text-white bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-lg shadow-md'>
          Invoices
        </h1>
      </header>
      <div className='flex justify-between items-center mb-6'>
        <div className='relative w-full max-w-xs'>
          <input
            type='text'
            className='border border-gray-300 rounded-full p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className='absolute left-3 top-3 text-gray-400' />
        </div>
        <select
          className='border border-gray-300 rounded-full p-2 ml-4 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md'
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value=''>All Statuses</option>
          <option value='Pending'>Pending</option>
          <option value='Accepted'>Accepted</option>
        </select>
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
};

export default Page;
