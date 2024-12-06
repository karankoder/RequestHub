'use client';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/utils/context';
import { useConnectWallet } from '@web3-onboard/react';
import { Types } from '@requestnetwork/request-client.js';
import { FaSearch } from 'react-icons/fa';
import RequestCard from '@/components/RequestCard';

const Page = () => {
  const [{ wallet }] = useConnectWallet();
  const { requestNetwork } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      status: Types.RequestLogic.STATE;
      payer?: string;
      payee?: string;
      date: string;
      expectedAmount: Types.RequestLogic.Amount;
      paymentNetwork?: string;
    }>
  >([]);

  useEffect(() => {
    if (wallet) {
      requestNetwork
        ?.fromIdentity({
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: wallet?.accounts[0].address.toLowerCase() as string,
        })
        .then((requests) => {
          const requestDatas = requests.map((request) => {
            const data = request.getData();
            console.log(data);
            return {
              id: data.requestId,
              title: data.requestId,
              description: data.contentData.description || 'No Description',
              status: data.state,
              payer: data.payer?.value || '',
              payee: data.payee?.value || '',
              date: new Date(data.timestamp * 1000).toLocaleDateString(),
              expectedAmount: data.expectedAmount,
              paymentNetwork: data.currencyInfo.network,
            };
          });
          setRequests(requestDatas);
        });
    }
  }, [wallet, requestNetwork]);

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
