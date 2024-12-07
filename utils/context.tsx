'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { WalletState } from '@web3-onboard/core';
import { useConnectWallet } from '@web3-onboard/react';
import { initializeRequestNetwork } from './initRequestNetwork';
import type { RequestNetwork } from '@requestnetwork/request-client.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Types } from '@requestnetwork/request-client.js';

interface ContextType {
  wallet: WalletState | null;
  requestNetwork: RequestNetwork | null;
  requests: Array<{
    id: string;
    title: string;
    description: string;
    status: Types.RequestLogic.STATE;
    payer?: string;
    payee?: string;
    date: string;
    expectedAmount: number;
    paymentNetwork?: string | undefined;
    balance?: number;
    timeStamp: number;
    currencyNetwork: string | undefined;
    currencyType: string | undefined;
  }>;
}

const Context = createContext<ContextType | undefined>(undefined);
const queryClient = new QueryClient();

export const Provider = ({ children }: { children: ReactNode }) => {
  const [{ wallet }] = useConnectWallet();
  const [requestNetwork, setRequestNetwork] = useState<RequestNetwork | null>(
    null
  );
  const [requests, setRequests] = useState<ContextType['requests']>([]);

  useEffect(() => {
    if (wallet) {
      const { provider } = wallet;
      initializeRequestNetwork(setRequestNetwork, provider);
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet) {
      requestNetwork
        ?.fromIdentity({
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: wallet?.accounts[0].address.toLowerCase() as string,
        })
        .then((requests) => {
          console.log(requests);
          const requestDatas = requests.map((request) => {
            const data = request.getData();
            console.log(data);
            return {
              id: data.requestId,
              title: data.requestId,
              description: data.contentData.reason || '',
              status:
                data.balance?.balance &&
                data.balance.balance >= data.expectedAmount
                  ? Types.RequestLogic.STATE.ACCEPTED
                  : Types.RequestLogic.STATE.PENDING,
              payer: (data.payer?.value || '').toLowerCase(),
              payee: (data.payee?.value || '').toLowerCase(),
              date: new Date(data.timestamp * 1000).toLocaleDateString(),
              expectedAmount: Number(data.expectedAmount || 0) / 1e18,
              balance: Number(data.balance?.balance || 0) / 1e18,
              paymentNetwork: data.currencyInfo.network,
              timeStamp: data.timestamp,
              currencyNetwork: data.currencyInfo.network,
              currencyType: data.currencyInfo.type,
            };
          });
          console.log(requestDatas);
          setRequests(requestDatas);
        });
    }
  }, [wallet, requestNetwork]);

  return (
    <Context.Provider
      value={{
        wallet,
        requestNetwork,
        requests,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useAppContext must be used within a Context Provider');
  }
  return context;
};
