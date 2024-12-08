'use client';
import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import '@/styles/globals.css';

export default function Home() {
  const [{ wallet }, connect] = useConnectWallet();
  const [ethersProvider, setEthersProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if (wallet) {
      setEthersProvider(
        new ethers.providers.Web3Provider(wallet.provider, 'any')
      );
    } else {
      setEthersProvider(null);
    }
  }, [wallet]);

  return (
    <div className='no-scrollbar min-h-screen bg-gradient-to-r from-blue-50 to-blue-100'>
      <Navbar />
      <header className='bg-gradient-to-r from-green-500 to-green-700 text-white py-20 no-scrollbar'>
        <div className='container mx-auto text-center'>
          <h1 className='text-6xl font-extrabold mb-4'>Welcome to RequestHub</h1>
          <p className='text-2xl mb-8'>
            Your gateway to insightful data from the Request Network.
          </p>
          <button
            className='px-8 py-3 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:bg-gray-200 transition duration-300'
            onClick={() => connect()}
          >
            Get Started
          </button>
        </div>
      </header>
      <main className='container mx-auto px-4 py-16'>
        <section className='text-center mb-16'>
          <h2 className='text-3xl font-bold mb-4'>Features</h2>
          <p className='text-gray-700 mb-8'>
            Explore the powerful features of RequestHub.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-bold mb-2'>Dashboard</h3>
              <p className='text-gray-700'>
                Get an overview of your transactions, inflow, outflow, and outstanding balances.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-bold mb-2'>Invoices</h3>
              <p className='text-gray-700'>
                Manage and filter your invoices with ease.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-bold mb-2'>Analytics</h3>
              <p className='text-gray-700'>
                Analyze your transaction history and calculate your credit score.
              </p>
            </div>
          </div>
        </section>
        
      </main>
      <footer className='bg-gray-800 text-white py-8'>
        <div className='container mx-auto text-center'>
          <p>&copy; 2024 RequestHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
