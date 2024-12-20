'use client';
import safeModule from '@web3-onboard/gnosis';
import trustModule from '@web3-onboard/trust';
import ledgerModule from '@web3-onboard/ledger';
import trezorModule from '@web3-onboard/trezor';
import coinbaseModule from '@web3-onboard/coinbase';
import walletConnectModule from '@web3-onboard/walletconnect';
import injectedModule from '@web3-onboard/injected-wallets';

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon } from 'wagmi/chains';

const injected = injectedModule();
export const onboardConfig = {
  wallets: [
    injected,
    walletConnectModule({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      dappUrl: process.env.NEXT_PUBLIC_APP_URL,
    }),
    coinbaseModule(),
    ledgerModule({
      walletConnectVersion: 2,
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    }),
    trezorModule({
      email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL!,
      appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    }),
    safeModule(),
    trustModule(),
  ],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      rpcUrl:
        process.env.NEXT_PUBLIC_RPC_URL_ETHEREUM || 'https://eth.llamarpc.com',
    },
    {
      id: '0xaa36a7',
      token: 'ETH',
      rpcUrl:
        process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || 'https://sepolia.drpc.org',
    },
    {
      id: '0x89',
      token: 'MATIC',
      rpcUrl:
        process.env.NEXT_PUBLIC_RPC_URL_POLYGON || 'https://1rpc.io/matic',
    },
  ],
  appMetadata: {
    name: 'RequestHub',
    icon: 'graph2.png',
    description: 'RequestHub is a decentralized request platform.',
  },
};

export const wagmiConfig = createConfig({
  chains: [polygon, mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
});
