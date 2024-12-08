'use client';
import { useState } from 'react';
import { useAppContext } from '@/utils/context';
import { FaSearch, FaFilter } from 'react-icons/fa';
import RequestCard from '@/components/RequestCard';

const Page = () => {
  const { requests, wallet } = useAppContext();
  const [filters, setFilters] = useState({
    searchTerm: '',
    statusFilter: '',
    typeFilter: '',
    payerAddress: '',
    payeeAddress: '',
    requestId: '',
    currencyNetwork: '',
    currencyType: '',
    fromDate: '',
    toDate: '',
  });

  const filteredRequests = requests.filter((request) => {
    const {
      searchTerm,
      statusFilter,
      typeFilter,
      payerAddress,
      payeeAddress,
      requestId,
      currencyNetwork,
      currencyType,
      fromDate,
      toDate,
    } = filters;
    const requestDate = new Date(request.date).toLocaleDateString();

    const from = fromDate ? new Date(fromDate).toLocaleDateString() : null;
    const to = toDate ? new Date(toDate).toLocaleDateString() : null;
    console.log(fromDate);
    console.log('kk', requestDate, 'from', from);
    return (
      (searchTerm === '' ||
        request.description
          .toLowerCase()
          .trim()
          .includes(searchTerm.toLowerCase().trim())) &&
      (statusFilter === '' || request.status === statusFilter.toLowerCase()) &&
      (typeFilter === '' ||
        (typeFilter === 'Paid'
          ? request.payer?.toLowerCase() ===
            wallet?.accounts[0].address.toLowerCase()
          : request.payee?.toLowerCase() ===
            wallet?.accounts[0].address.toLowerCase())) &&
      (payerAddress === '' ||
        request.payer?.toLowerCase()?.includes(payerAddress)) &&
      (payeeAddress === '' ||
        request.payee?.toLowerCase()?.includes(payeeAddress)) &&
      (requestId === '' || request.id.toLowerCase().includes(requestId)) &&
      (currencyNetwork === '' ||
        request.currencyNetwork?.includes(currencyNetwork)) &&
      (currencyType === '' || request.currencyType?.includes(currencyType)) &&
      (!from || requestDate >= from) &&
      (!to || requestDate <= to)
    );
  });

  return (
    <div className='container mx-auto p-4'>
      <header className='mb-6'>
        <h1 className='text-4xl font-extrabold text-center text-white bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-lg shadow-md'>
          Invoices
        </h1>
      </header>
      <div className='flex'>
        <aside className='w-1/5 p-4 bg-white rounded-lg shadow-md'>
          <h2 className='text-2xl text-gray-900 mb-4'>Filters</h2>
          <div className='mb-4 relative'>
            <input
              type='text'
              className='border border-gray-300 rounded-full p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md bg-white'
              placeholder='Search...'
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
            />
            <FaSearch className='absolute left-3 top-3 text-gray-400' />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Status</label>
            <select
              className='border border-gray-300 rounded-full p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md bg-white'
              value={filters.statusFilter}
              onChange={(e) =>
                setFilters({ ...filters, statusFilter: e.target.value })
              }
            >
              <option value=''>All Statuses</option>
              <option value='Pending'>Pending</option>
              <option value='Accepted'>Accepted</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Type</label>
            <select
              className='border border-gray-300 rounded-full p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md bg-white'
              value={filters.typeFilter}
              onChange={(e) =>
                setFilters({ ...filters, typeFilter: e.target.value })
              }
            >
              <option value=''>All Types</option>
              <option value='Paid'>Paid</option>
              <option value='Received'>Received</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Time Frame</label>
            <div className='flex space-x-2'>
              <input
                type='date'
                className='w-1/2 p-2 rounded bg-white text-gray-900 border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500'
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
              />
              <input
                type='date'
                className='w-1/2 p-2 rounded bg-white text-gray-900 border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500'
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Payer Address</label>
            <input
              type='text'
              className='w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={filters.payerAddress}
              onChange={(e) =>
                setFilters({ ...filters, payerAddress: e.target.value })
              }
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Payee Address</label>
            <input
              type='text'
              className='w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={filters.payeeAddress}
              onChange={(e) =>
                setFilters({ ...filters, payeeAddress: e.target.value })
              }
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Request ID</label>
            <input
              type='text'
              className='w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={filters.requestId}
              onChange={(e) =>
                setFilters({ ...filters, requestId: e.target.value })
              }
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Currency Network</label>
            <input
              type='text'
              className='w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={filters.currencyNetwork}
              onChange={(e) =>
                setFilters({ ...filters, currencyNetwork: e.target.value })
              }
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Currency Type</label>
            <input
              type='text'
              className='w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={filters.currencyType}
              onChange={(e) =>
                setFilters({ ...filters, currencyType: e.target.value })
              }
            />
          </div>
          <button
            className='w-full p-2 mt-4 bg-red-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md'
            onClick={() =>
              setFilters({
                searchTerm: '',
                statusFilter: '',
                typeFilter: '',
                payerAddress: '',
                payeeAddress: '',
                requestId: '',
                currencyNetwork: '',
                currencyType: '',
                fromDate: '',
                toDate: '',
              })
            }
          >
            Clear Filters
          </button>
        </aside>
        <main className='w-4/5 p-4'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
