'use client';
import Navbar from '@/components/Navbar';
import React, { FC, useEffect, useState } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import '@/styles/globals.css';

export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [ethersProvider, setEthersProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    console.log(wallet);
    if (wallet) {
      setEthersProvider(
        new ethers.providers.Web3Provider(wallet.provider, 'any')
      );
    } else {
      setEthersProvider(null);
    }
  }, [wallet]);
  console.log(ethersProvider);
  return (
    <div className='no-scrollbar  overflow-auto min-h-screen bg-blue-50'>
      <Navbar />
      <header className='bg-green-600 text-white py-20 no-scrollbar'>
        <div className='container mx-auto text-center'>
          <h1 className='text-5xl font-bold mb-4'>Welcome to RequestHub</h1>
          <p className='text-xl mb-8'>
            Your gateway to insightful data from the Request Network.
          </p>
          <button
            className='px-8 py-3 bg-white text-green-400 font-semibold rounded hover:bg-gray-200'
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
              <h3 className='text-xl font-bold mb-2'>Feature One</h3>
              <p className='text-gray-700'>Description of feature one.</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-bold mb-2'>Feature Two</h3>
              <p className='text-gray-700'>Description of feature two.</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-bold mb-2'>Feature Three</h3>
              <p className='text-gray-700'>Description of feature three.</p>
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
