'use client';
import React from 'react';
import { useAppContext, ContextType } from '@/utils/context';
import { Types } from '@requestnetwork/request-client.js';

const OverduePage = () => {
  const { requests }: { requests: ContextType['requests'] } = useAppContext();

  const getPendingRequests = (requests: ContextType['requests']) => {
    return requests.filter(
      (request) => request.status === Types.RequestLogic.STATE.PENDING
    );
  };

  const getOverdueRequests = (requests: ContextType['requests']) => {
    const currentDate = new Date();
    return requests.filter(
      (request) => request.dueDate && new Date(request.dueDate) < currentDate
    );
  };

  const pendingRequests = getPendingRequests(requests);
  const overdueRequests = getOverdueRequests(pendingRequests);

  const parseAddress = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  const formatDate = (dateString: string) => {
    const options = {
      day: 'numeric' as const,
      month: 'short' as const,
      year: 'numeric' as const,
    };
    return new Date(dateString)
      .toLocaleDateString('en-GB', options)
      .replace(/ /g, ' ');
  };

  const getStatus = (dueDate: string) => {
    const currentDate = new Date();
    return new Date(dueDate) < currentDate ? 'Overdue' : 'Pending';
  };

  const getStatusClass = (status: string) => {
    return status === 'Overdue' ? 'text-red-600 font-bold' : 'text-yellow-600';
  };

  return (
    <div className='p-5'>
      <header className='mb-6'>
        <h1 className='text-4xl font-extrabold text-center text-white bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-lg shadow-md'>
          Pending Payments
        </h1>
      </header>
      {overdueRequests.length === 0 ? (
        <p>No overdue payments found.</p>
      ) : (
        <table className='w-full border-collapse mt-5'>
          <thead>
            <tr className='bg-gray-200 text-left'>
              <th className='p-3 border-b'>Request Id</th>
              <th className='p-3 border-b'>Payer</th>
              <th className='p-3 border-b'>Payee</th>
              <th className='p-3 border-b'>Creation Date</th>
              <th className='p-3 border-b'>Due Date</th>
              <th className='p-3 border-b'>Expected Amount (ETH)</th>
              <th className='p-3 border-b'>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request.id} className='border-b'>
                <td className='p-3'>
                  <a
                    href={`https://scan.request.network/request/${request.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-green-600'
                  >
                    {parseAddress(request.id)}
                  </a>
                </td>
                <td className='p-3'>{parseAddress(request.payer || '')}</td>
                <td className='p-3'>{parseAddress(request.payee || '')}</td>
                <td className='p-3'>{formatDate(request.date)}</td>
                <td className='p-3'>{formatDate(request.dueDate || '')}</td>
                <td className='p-3'>{request.expectedAmount} ETH</td>
                <td
                  className={`p-3 ${getStatusClass(
                    getStatus(request.dueDate || '')
                  )}`}
                >
                  {getStatus(request.dueDate || '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OverduePage;
