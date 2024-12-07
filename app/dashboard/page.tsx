'use client';
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppContext } from '@/utils/context';
import { Types } from '@requestnetwork/request-client.js';
import { useConnectWallet } from '@web3-onboard/react';

const Title: React.FC<{ text: string }> = ({ text }) => (
  <h1 className='text-center text-4xl font-bold mb-10 text-gray-800'>{text}</h1>
);

const Dashboard: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { requests } = useAppContext();
  const [{ wallet }] = useConnectWallet();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const walletAddress = wallet?.accounts[0].address.toLowerCase();

  const data = requests
    .filter(
      (request) =>
        new Date(request.date).toDateString() ===
        new Date('12-06-2024').toDateString()
    )
    .map((request) => ({
      name: new Date(request.timeStamp * 1000).toLocaleTimeString('default', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      inflow:
        request.status === Types.RequestLogic.STATE.ACCEPTED &&
        request.payee?.toLowerCase() === walletAddress
          ? request.balance
          : 0,
      outflow:
        request.status === Types.RequestLogic.STATE.ACCEPTED &&
        request.payer?.toLowerCase() === walletAddress
          ? request.balance
          : 0,
    }));
  console.log(data);

  const totalInflow = data.reduce((acc, item) => acc + (item.inflow || 0), 0);
  const totalOutflow = data.reduce((acc, item) => acc + (item.outflow || 0), 0);

  console.log(totalInflow, totalOutflow);

  const pendingInvoices = requests.filter(
    (request) => request.status === Types.RequestLogic.STATE.PENDING
  ).length;
  const totalOutstanding = totalInflow - totalOutflow;

  const pieData = [
    { name: 'Inflow', value: totalInflow },
    { name: 'Outflow', value: totalOutflow },
  ];

  const transactionData = [
    { name: 'Accepted', value: requests.length - pendingInvoices },
    { name: 'Pending', value: pendingInvoices },
  ];

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

  const recentTransactions = requests
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((request) => ({
      id: request.id,
      description: request.description,
      amount: request.balance,
      date: new Date(request.date).toLocaleDateString(),
      paymentNetwork: request.paymentNetwork,
      status: request.status,
    }));

  const monthlyData = requests.reduce(
    (acc: { [key: string]: { name: string; net: number } }, request) => {
      const month = new Date(request.date).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      const net =
        request.status === Types.RequestLogic.STATE.ACCEPTED &&
        (request.balance || 0) *
          (request.payee?.toLowerCase() === walletAddress ? 1 : -1);

      if (!acc[month]) {
        acc[month] = { name: month, net: 0 };
      }
      acc[month].net += typeof net === 'number' ? net : 0;
      return acc;
    },
    {}
  );

  const barGraphData = Object.values(monthlyData);
  console.log('karan', barGraphData);

  return (
    <div className='p-5 font-sans bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen'>
      <Title text='Dashboard' />
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mb-10'>
        <div
          className='bg-white p-5 rounded-lg text-center shadow-lg'
          title={`${totalInflow} ETH`}
        >
          <h2 className='text-xl mb-2 text-gray-700'>Total Inflow</h2>
          <p className='text-3xl font-bold text-green-500'>
            {totalInflow.toFixed(4)} ETH
          </p>
        </div>
        <div
          className='bg-white p-5 rounded-lg text-center shadow-lg'
          title={`${totalOutflow} ETH`}
        >
          <h2 className='text-xl mb-2 text-gray-700'>Total Outflow</h2>
          <p className='text-3xl font-bold text-red-500'>
            {totalOutflow.toFixed(4)} ETH
          </p>
        </div>
        <div
          className='bg-white p-5 rounded-lg text-center shadow-lg'
          title={`${totalOutstanding} ETH`}
        >
          <h2 className='text-xl mb-2 text-gray-700'>Total Outstanding</h2>
          <p className='text-3xl font-bold text-blue-500'>
            {totalOutstanding.toFixed(4)} ETH
          </p>
        </div>
        <div className='bg-white p-5 rounded-lg text-center shadow-lg'>
          <h2 className='text-xl mb-2 text-gray-700'>Pending Invoices</h2>
          <p className='text-3xl font-bold text-yellow-500'>
            {pendingInvoices}
          </p>
        </div>
      </div>
      {isClient && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10'>
          <div className='bg-white p-5 rounded-lg shadow-lg'>
            <h2 className='text-xl mb-2 text-gray-700'>
              Today's Inflow vs Outflow
            </h2>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='inflow'
                  stroke='#8884d8'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='outflow'
                  stroke='#82ca9d'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='bg-white p-5 rounded-lg shadow-lg'>
            <h2 className='text-xl mb-2 text-gray-700'>
              Monthly Outstanding Bar Graph
            </h2>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={barGraphData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='net' fill='#FFBB28' barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='bg-white p-5 rounded-lg shadow-lg'>
            <h2 className='text-xl mb-2 text-gray-700'>
              Inflow vs Outflow Distribution
            </h2>
            <ResponsiveContainer width='100%' height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={150}
                  innerRadius={90}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke='#fff'
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='bg-white p-5 rounded-lg shadow-lg'>
            <h2 className='text-xl mb-2 text-gray-700'>
              Accepted vs Pending Transactions
            </h2>
            <ResponsiveContainer width='100%' height={400}>
              <PieChart>
                <Pie
                  data={transactionData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={150}
                  innerRadius={90}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {transactionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke='#fff'
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='bg-white p-5 rounded-lg shadow-lg lg:col-span-2'>
            <h2 className='text-xl mb-2 text-gray-700'>Recent Transactions</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Request ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Payment Network
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {transaction.date}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {transaction.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {transaction.paymentNetwork}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {transaction.amount} ETH
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status ===
                            Types.RequestLogic.STATE.ACCEPTED
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
