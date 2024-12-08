'use client';
import CreditReport from '@/components/creditReport';
import React from 'react';
import { useAppContext, ContextType } from '@/utils/context';
import { Types } from '@requestnetwork/request-client.js';

export default function page() {
  const { requests, wallet } = useAppContext();
  const [creditScore, setCreditScore] = React.useState<number>(0);

  const walletAddress = wallet?.accounts[0].address?.toLowerCase();

  const sentRequests = requests.filter(
    (req) => req.payer?.toLowerCase() === walletAddress
  );
  const receivedRequests = requests.filter(
    (req) => req.payee?.toLowerCase() === walletAddress
  );

  const calculateCreditScore = (
    sentRequests: ContextType['requests'],
    receivedRequests: ContextType['requests']
  ): number => {
    if (sentRequests.length === 0 && receivedRequests.length === 0) {
      return -1; // No requests fetched
    }

    let TH = 0;
    let RB = 0;
    let AB = 0;
    let CUR = 0;
    let SGR = 0;

    // Calculate TH (Transaction History)
    const totalTransactions = sentRequests.length + receivedRequests.length;
    TH = Math.min((totalTransactions / 10) * 100, 100);
    console.log('TH:', TH);

    // Calculate RB (Repayment Behavior)
    const totalSentRequests = sentRequests.length;
    const acceptedSentRequests = sentRequests.filter(
      (req) => req.status === Types.RequestLogic.STATE.ACCEPTED
    ).length;
    const latePayments = totalSentRequests - acceptedSentRequests;
    RB = Math.max(100 - latePayments * 10, 0);
    console.log('RB:', RB);

    // Calculate AB (Average Balance)
    const totalReceivedAmount = receivedRequests.reduce(
      (sum, req) => sum + req.expectedAmount,
      0
    );
    const averageBalance = totalReceivedAmount / (receivedRequests.length || 1);
    AB = Math.min((averageBalance / 1000) * 100, 100);
    console.log('AB:', AB);

    // Calculate CUR (Credit Utilization Ratio)
    const totalCreditUsed = sentRequests.reduce(
      (sum, req) => sum + req.expectedAmount,
      0
    );
    const totalCreditAvailable = 10000;
    const utilizationRatio = (totalCreditUsed / totalCreditAvailable) * 100;
    if (utilizationRatio <= 30) {
      CUR = 100;
    } else if (utilizationRatio <= 50) {
      CUR = 70;
    } else {
      CUR = 30;
    }
    console.log('CUR:', CUR);

    // Calculate SGR (Savings Growth Rate)
    SGR = 50;
    console.log('SGR:', SGR);

    // Calculate final credit score
    const creditScore =
      TH * 0.2 + RB * 0.4 + AB * 0.2 + CUR * 0.15 + SGR * 0.05;
    const scaledScore = 300 + (creditScore / 100) * (850 - 300);
    console.log('Credit Score:', scaledScore);

    return Math.round(scaledScore);
  };

  React.useEffect(() => {
    const calculatedScore = calculateCreditScore(
      sentRequests,
      receivedRequests
    );
    setCreditScore(calculatedScore);
  }, [sentRequests, receivedRequests]);

  return (
    <>
      <h1>Credit Report</h1>
      <CreditReport score={creditScore} />
    </>
  );
}
