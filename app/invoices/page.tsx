'use client';
import { useState } from 'react';
import { useAppContext } from '@/utils/context';
import { FaSearch } from 'react-icons/fa';
import RequestCard from '@/components/RequestCard';

const Page = () => {
  const { requests, wallet } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredRequests = requests.filter((request) => {
    return (
      (statusFilter === '' || request.status === statusFilter.toLowerCase()) &&
      (typeFilter === '' ||
        (typeFilter === 'Paid'
          ? request.payer?.toLowerCase() ===
            wallet?.accounts[0].address.toLowerCase()
          : request.payee?.toLowerCase() ===
            wallet?.accounts[0].address.toLowerCase()))
    );
  });

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
        <div className='flex items-center'>
          <select
            className='border border-gray-300 rounded-full p-2 ml-4 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value=''>All Statuses</option>
            <option value='Pending'>Pending</option>
            <option value='Accepted'>Accepted</option>
          </select>
          <select
            className='border border-gray-300 rounded-full p-2 ml-4 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md'
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value=''>All Types</option>
            <option value='Paid'>Paid</option>
            <option value='Received'>Received</option>
          </select>
        </div>
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredRequests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
};

export default Page;
