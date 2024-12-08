'use client';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { init, Web3OnboardProvider } from '@web3-onboard/react';
import { onboardConfig, wagmiConfig } from '@/utils/connectWallet';
import { WagmiProvider } from 'wagmi';
import { Provider } from '@/utils/context';

const web3Onboard = init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  ...onboardConfig,
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en-GB'
      style={{ filter: 'invert(0)' }}
      className={poppins.className}
    >
      <head>
        <link rel='icon' href='/graph2.svg' />
        <title>RequestHub</title>
      </head>
      <body className='no-scrollbar'>
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          <WagmiProvider config={wagmiConfig}>
            <Provider>{children}</Provider>
          </WagmiProvider>
        </Web3OnboardProvider>
      </body>
    </html>
  );
}
