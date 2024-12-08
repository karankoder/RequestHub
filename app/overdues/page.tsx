'use client';
import React from 'react';
import {
  useAppContext,
  getOverdueRequests,
  ContextType,
} from '../../utils/context';

const OverduePage = () => {
  const { requests }: { requests: ContextType['requests'] } = useAppContext();
  const overdueRequests = getOverdueRequests(requests);

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

  return (
    <div className='p-5'>
      <h1 className='text-2xl text-gray-800 mb-5'>Overdue Payments</h1>
      {overdueRequests.length === 0 ? (
        <p>No overdue payments found.</p>
      ) : (
        <table className='w-full border-collapse mt-5'>
          <thead>
            <tr className='bg-gray-200 text-left'>
              <th className='p-3 border-b'>Request Id</th>
              <th className='p-3 border-b'>Due Date</th>
              <th className='p-3 border-b'>Expected Amount (ETH)</th>
              <th className='p-3 border-b'>Creation Date</th>
              <th className='p-3 border-b'>Payer</th>
              <th className='p-3 border-b'>Payee</th>
            </tr>
          </thead>
          <tbody>
            {overdueRequests.map((request) => (
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
                <td className='p-3'>{formatDate(request.dueDate || '')}</td>
                <td className='p-3'>{request.expectedAmount} ETH</td>
                <td className='p-3'>{formatDate(request.date)}</td>
                <td className='p-3'>{parseAddress(request.payer || '')}</td>
                <td className='p-3'>{parseAddress(request.payee || '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OverduePage;
