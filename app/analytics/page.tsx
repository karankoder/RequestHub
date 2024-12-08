'use client';
import React from 'react';
import { useAppContext, ContextType } from '../../utils/context';
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
    <div className='bg-gray-100 p-4 rounded-lg transition duration-300 hover:bg-gray-200'>
      <div className='flex flex-col'>
        <h3 className='text-sm text-gray-600 mb-2'>Engaged Address</h3>
        <h2 className='text-xl'>{displayAddress}</h2>
        <p className='text-xs text-gray-500 mb-4'>
          Transactions: {requests.length}
        </p>
        <p>Last Transaction: {requests[0]?.date || 'N/A'}</p>
        <p>Total Received Payments: {totalReceived}</p>
        <p>Total Paid Payments: {totalPaid}</p>
        <p>Total Pending Payments: {totalPending}</p>
        <p>Total Overdues: {totalOverdue}</p>
      </div>
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const { requests, wallet } = useAppContext();
  const walletAddress = wallet?.accounts[0].address.toLowerCase();

  const groupedRequests = requests.reduce((acc, request) => {
    const address = request.payee || request.payer;
    if (!address) return acc;
    if (!acc[address]) {
      acc[address] = [];
    }
    acc[address].push(request);
    return acc;
  }, {} as Record<string, ContextType['requests']>);
  console.log(groupedRequests);

  return (
    <div className='p-4'>
      <div className='flex flex-wrap gap-4'>
        {Object.keys(groupedRequests)
          .filter((address) => address.toLowerCase() !== walletAddress)
          .map((address, index) => (
            <div className='flex-1 min-w-[calc(33.333%-32px)]' key={index}>
              <AddressCard
                address={address}
                requests={groupedRequests[address]}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default function Page() {
  return <AnalyticsPage />;
}
