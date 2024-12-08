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
import { ContextType } from '@/utils/context';
import Link from 'next/link';

const Title: React.FC<{ text: string }> = ({ text }) => (
  <h1 className='text-4xl font-extrabold text-center text-white bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-lg shadow-md'>
    {text}
  </h1>
);

const Dashboard: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [filter, setFilter] = useState('today');
  const { requests }: { requests: ContextType['requests'] } = useAppContext();
  const [{ wallet }] = useConnectWallet();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const walletAddress = wallet?.accounts[0].address.toLowerCase();

  const getWeekData = (
    requests: ContextType['requests'],
    walletAddress: string
  ) => {
    const now = new Date('12-06-2024');
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekData = requests.reduce((acc, request) => {
      const requestDate = new Date(request.date);
      if (requestDate >= startOfWeek && requestDate <= endOfWeek) {
        const day = requestDate.toLocaleDateString('default', {
          weekday: 'short',
        });
        if (!acc[day]) {
          acc[day] = { name: day, inflow: 0, outflow: 0, net: 0 };
        }
        if (request.status === Types.RequestLogic.STATE.ACCEPTED) {
          if (request.payee?.toLowerCase() === walletAddress) {
            acc[day].inflow += request.balance || 0;
            acc[day].net += request.balance || 0;
          }
          if (request.payer?.toLowerCase() === walletAddress) {
            acc[day].outflow += request.balance || 0;
            acc[day].net -= request.balance || 0;
          }
        }
      }
      return acc;
    }, {} as { [key: string]: { name: string; inflow: number; outflow: number; net: number } });

    const orderedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return orderedDays.map((day) => weekData[day]).filter(Boolean);
  };

  const getMonthlyData = (
    requests: ContextType['requests'],
    walletAddress: string
  ) => {
    const monthlyData = requests.reduce(
      (
        acc: {
          [key: string]: {
            name: string;
            inflow: number;
            outflow: number;
            net: number;
          };
        },
        request
      ) => {
        const date = new Date(request.date).toLocaleString('default', {
          day: '2-digit',
          month: 'short',
        });
        const inflow =
          request.status === Types.RequestLogic.STATE.ACCEPTED &&
          request.payee?.toLowerCase() === walletAddress
            ? request.balance || 0
            : 0;
        const outflow =
          request.status === Types.RequestLogic.STATE.ACCEPTED &&
          request.payer?.toLowerCase() === walletAddress
            ? request.balance || 0
            : 0;
        const net = inflow - outflow;

        if (!acc[date]) {
          acc[date] = { name: date, inflow: 0, outflow: 0, net: 0 };
        }
        acc[date].inflow += inflow;
        acc[date].outflow += outflow;
        acc[date].net += net;
        return acc;
      },
      {}
    );

    return Object.values(monthlyData).reverse();
  };

  const getDailyOutstandingData = (
    requests: ContextType['requests'],
    walletAddress: string
  ) => {
    const now = new Date('12-06-2024');
    const dailyData = requests.reduce((acc, request) => {
      const requestDate = new Date(request.date);
      if (requestDate.toDateString() === now.toDateString()) {
        const time = new Date(request.timeStamp * 1000).toLocaleTimeString(
          'default',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        );
        const net =
          request.status === Types.RequestLogic.STATE.ACCEPTED &&
          (request.balance || 0) *
            (request.payee?.toLowerCase() === walletAddress ? 1 : -1);

        if (!acc[time]) {
          acc[time] = [];
        }
        acc[time].push({ name: time, net: typeof net === 'number' ? net : 0 });
      }
      return acc;
    }, {} as { [key: string]: { name: string; net: number }[] });

    return Object.values(dailyData).flat();
  };
  console.log('hello', getDailyOutstandingData(requests, walletAddress || '0'));
  const getOutstandingData = (
    requests: ContextType['requests'],
    filter: string,
    walletAddress: string
  ) => {
    if (filter === 'thisWeek') {
      return getWeekData(requests, walletAddress);
    } else if (filter === 'thisMonth') {
      return getMonthlyData(requests, walletAddress);
    } else if (filter === 'today') {
      return getDailyOutstandingData(requests, walletAddress);
    }
    return [];
  };

  const filterData = (requests: ContextType['requests']) => {
    const now = new Date('12-06-2024');
    if (filter === 'thisWeek') {
      return getWeekData(requests, walletAddress || '0');
    } else if (filter === 'thisMonth') {
      return getMonthlyData(requests, walletAddress || '0');
    }

    return requests
      .filter((request) => {
        const requestDate = new Date(request.date);
        if (filter === 'today') {
          return requestDate.toDateString() === now.toDateString();
        }
        return false;
      })
      .map((request) => ({
        name:
          filter === 'today'
            ? new Date(request.timeStamp * 1000).toLocaleTimeString('default', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date(request.timeStamp * 1000).toLocaleDateString('default', {
                day: '2-digit',
                month: 'short',
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
  };

  const totalInflow = requests.reduce(
    (acc, request) =>
      request.status === Types.RequestLogic.STATE.ACCEPTED &&
      request.payee?.toLowerCase() === walletAddress
        ? acc + (request.balance || 0)
        : acc,
    0
  );

  const totalOutflow = requests.reduce(
    (acc, request) =>
      request.status === Types.RequestLogic.STATE.ACCEPTED &&
      request.payer?.toLowerCase() === walletAddress
        ? acc + (request.balance || 0)
        : acc,
    0
  );

  const getFilteredTotals = (data: any[]) => {
    return data.reduce(
      (acc, item) => {
        acc.inflow += item.inflow || 0;
        acc.outflow += item.outflow || 0;
        return acc;
      },
      { inflow: 0, outflow: 0 }
    );
  };

  const filteredData = filterData(requests);
  const { inflow: filteredInflow, outflow: filteredOutflow } =
    getFilteredTotals(filteredData);
  const netOutstanding = filteredInflow - filteredOutflow;

  const data = filterData(requests);
  console.log(data);

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

  const barGraphData = getOutstandingData(
    requests,
    filter,
    walletAddress || '0'
  );
  console.log('karan', barGraphData);

  const handlePendingInvoicesClick = () => {
    window.location.href = '/pending_invoices';
  };

  const chartStyles = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const tooltipStyles = {
    backgroundColor: '#f5f5f5',
    borderRadius: '0.5rem',
    border: '1px solid #ddd',
    padding: '0.5rem',
  };

  const axisStyles = {
    stroke: '#8884d8',
    fontSize: '0.875rem',
    fontWeight: '500',
  };

  const chartContainerStyles = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const chartContainerHoverStyles = {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  };

  return (
    <div className='p-5 font-sans bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen'>
      <Title text='Dashboard' />

      <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mb-2 mt-5'>
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
        <div
          className='bg-white p-5 rounded-lg text-center shadow-lg'
          onClick={handlePendingInvoicesClick}
          style={{ cursor: 'pointer' }}
        >
          <h2 className='text-xl mb-2 text-gray-700'>Pending Invoices</h2>
          <p className='text-3xl font-bold text-yellow-500'>
            {pendingInvoices}
          </p>
        </div>
      </div>
      <div className='mb-5'>
        <label htmlFor='filter' className='mr-2'>
          Filter:
        </label>
        <select
          id='filter'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='p-2 mt-2 border rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500'
        >
          <option value='today'>Today</option>
          <option value='thisWeek'>This Week</option>
          <option value='thisMonth'>This Month</option>
        </select>
      </div>
      {isClient && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10'>
          <div
            className='relative'
            style={chartContainerStyles}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, chartContainerHoverStyles)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, chartContainerStyles)
            }
          >
            <h2 className='text-xl mb-2 text-gray-700'>
              {filter === 'today'
                ? "Today's"
                : filter === 'thisWeek'
                ? "This Week's"
                : "This Month's"}{' '}
              Inflow vs Outflow
            </h2>
            <div className='absolute top-0 right-0 mt-2 mr-2 text-right'>
              <p className='text-lg text-green-500'>
                Total Inflow: {filteredInflow.toFixed(4)} ETH
              </p>
              <p className='text-lg text-red-500'>
                Total Outflow: {filteredOutflow.toFixed(4)} ETH
              </p>
            </div>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                <XAxis dataKey='name' {...axisStyles} />
                <YAxis {...axisStyles} />
                <Tooltip contentStyle={tooltipStyles} />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='inflow'
                  stroke='#00C49F'
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type='monotone'
                  dataKey='outflow'
                  stroke='#FF8042'
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className='relative'
            style={chartContainerStyles}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, chartContainerHoverStyles)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, chartContainerStyles)
            }
          >
            <h2 className='text-xl mb-2 text-gray-700'>
              {filter === 'today'
                ? "Today's"
                : filter === 'thisWeek'
                ? "This Week's"
                : "This Month's"}{' '}
              Outstanding Bar Graph
            </h2>
            <div className='absolute top-0 right-0 mt-2 mr-2 text-right'>
              <p className='text-lg text-blue-500'>
                Net Outstanding: {netOutstanding.toFixed(4)} ETH
              </p>
            </div>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={barGraphData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                <XAxis dataKey='name' {...axisStyles} />
                <YAxis {...axisStyles} />
                <Tooltip contentStyle={tooltipStyles} />
                <Legend />
                <Bar
                  dataKey='net'
                  fill='#FFBB28'
                  barSize={30}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div
            style={chartContainerStyles}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, chartContainerHoverStyles)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, chartContainerStyles)
            }
          >
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
                <Tooltip contentStyle={tooltipStyles} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div
            style={chartContainerStyles}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, chartContainerHoverStyles)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, chartContainerStyles)
            }
          >
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
                <Tooltip contentStyle={tooltipStyles} />
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
