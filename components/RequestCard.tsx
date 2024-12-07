import React from 'react';
import { FaEthereum } from 'react-icons/fa';
import { Types } from '@requestnetwork/request-client.js';

interface Request {
  id: string;
  title: string;
  payer: string;
  payee: string;
  paymentNetwork: string;
  expectedAmount: Types.RequestLogic.Amount;
  date: string;
  status: Types.RequestLogic.STATE;
  description: string;
}

const RequestCard = ({ request }: { request: Request }) => {
  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      <div className='p-4'>
        <div className='bg-green-600 p-2 rounded-t-lg flex items-center'>
          <h2 className='text-lg font-semibold text-white flex-1'>
            Request Id - {request.title.slice(0, 4)}...
            {request.title.slice(-4)}
          </h2>
          <FaEthereum className='text-white' />
        </div>
        <div className='bg-gray-50 p-3 rounded-b-lg'>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Payer:</strong> {request.payer}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Payee:</strong> {request.payee}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Payment Network:</strong> {request.paymentNetwork}
          </p>
          <p className='text-gray-600 mb-1 text-sm'>
            <strong>Expected Amount:</strong> {request.expectedAmount}
          </p>
        </div>
        <div className='flex items-center justify-between p-3'>
          <span className='text-xs text-gray-500'>{request.date}</span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              request.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {request.status}
          </span>
        </div>
        <div className='flex space-x-2 p-3'>
          <button className='flex-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm shadow-md'>
            View
          </button>
          <button className='flex-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm shadow-md'>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;