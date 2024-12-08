'use client';
import React from 'react';
import { useAppContext, ContextType } from '@/utils/context';
import { Types } from '@requestnetwork/request-client.js';

interface AddressCardProps {
  address: string;
  requests: ContextType['requests'];
}

const AddressCard: React.FC<AddressCardProps> = ({ address, requests }) => {
  const { wallet } = useAppContext();
  const walletAddress = wallet?.accounts[0].address.toLowerCase();
  const currentDate = new Date();

  const totalReceived = requests.filter(
    (request) =>
      request.status === Types.RequestLogic.STATE.ACCEPTED &&
      request.payee?.toLowerCase() === walletAddress
  ).length;
  const totalPaid = requests.filter(
    (request) =>
      request.status === Types.RequestLogic.STATE.ACCEPTED &&
      request.payer?.toLowerCase() === walletAddress
  ).length;
  const totalPending = requests.filter(
    (request) => request.status === Types.RequestLogic.STATE.PENDING
  ).length;
  const totalOverdue = requests.filter(
    (request) => request.dueDate && new Date(request.dueDate) < currentDate
  ).length;

  const displayAddress = `${address.slice(0, 10)}...${address.slice(-10)}`;

  return (
    <div className='flex flex-wrap md:flex-nowrap justify-center gap-4 p-4 bg-gray-100'>
      <div className='flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-2xl w-full hover:shadow-2xl transition-shadow duration-300'>
        <div className='bg-green-600 p-2 rounded-t-lg flex items-center w-full'>
          <h2 className='text-lg font-semibold text-white flex-1'>
            Engaged Address
          </h2>
        </div>
        <div className='bg-gray-50 p-3 rounded-b-lg w-full'>
          <h2 className='text-xl mb-2'>{displayAddress}</h2>
          <p className='text-xs text-gray-500 mb-4'>
            Transactions: {requests.length}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Last Transaction:</strong> {requests[0]?.date || 'N/A'}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Total Received Payments:</strong> {totalReceived}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Total Paid Payments:</strong> {totalPaid}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Total Pending Payments:</strong> {totalPending}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Total Overdues:</strong> {totalOverdue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
