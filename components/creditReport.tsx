import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa'; // Add this line to import the icon

interface CreditReportProps {
  score: number;
}

const Loader: React.FC = () => (
  <div className='loader'>
    <style jsx>{`
      .loader {
        border: 4px solid rgba(0, 0, 0, 0.1);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border-left-color: #09f;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

const CreditReport: React.FC<CreditReportProps> = ({ score }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className='flex flex-wrap md:flex-nowrap justify-center gap-2 p-1 bg-gray-50'>
      <div className='flex flex-col items-center justify-center p-2 bg-white shadow-lg rounded-xl w-full md:w-1/2 hover:shadow-xl transition-shadow duration-300'>
        <h2 className='text-3xl font-extrabold mb-1'>Your Credit Score</h2>
        <div className='flex items-center'>
          <div className={`text-5xl font-extrabold ${getScoreColor(score)}`}>
            {score >= 0 ? score : <Loader />}
          </div>
          <div
            className='relative ml-2'
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <FaInfoCircle className='text-green-500 cursor-pointer text-lg' />
            {isTooltipVisible && (
              <div className='absolute top-1/2 left-full transform -translate-y-1/2 ml-2 w-48 p-2 bg-white text-gray-700 text-xs rounded-lg shadow-lg'>
                <div className='p-2'>
                  <p className='font-bold'>Calculation Parameters:</p>
                  <ul className='list-disc list-inside'>
                    <li>TH (Transaction History)</li>
                    <li>RB (Repayment Behavior)</li>
                    <li>AB (Average Balance)</li>
                    <li>CUR (Credit Utilization Ratio)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className='mt-1 text-lg text-gray-700'>
          {score >= 750
            ? 'Excellent'
            : score >= 650
            ? 'Good'
            : score >= 0
            ? 'Poor'
            : 'Loading...'}
        </p>
      </div>

      <div className='flex flex-col p-2 bg-white shadow-lg rounded-xl w-full md:w-1/2 hover:shadow-xl transition-shadow duration-300'>
        <h2 className='text-3xl font-extrabold mb-1'>About Credit Scores</h2>
        <p className='text-gray-700 text-md mb-2'>
          Your credit score represents your creditworthiness. It helps lenders
          assess the risk of lending you money.
        </p>
        <h3 className='text-xl font-semibold mb-1'>Importance</h3>
        <ul className='list-disc list-inside text-gray-700 text-md mb-2'>
          <li>Lower interest rates on loans.</li>
          <li>Faster loan approval and higher credit limits.</li>
          <li>Affects renting properties and job opportunities.</li>
        </ul>
        <h3 className='text-xl font-semibold mb-1'>Improvement Tips</h3>
        <ul className='list-disc list-inside text-gray-700 text-md mb-2'>
          <li>Pay bills on time.</li>
          <li>Keep credit card balances low.</li>
          <li>Don't close unused credit cards.</li>
          <li>Limit new credit requests.</li>
        </ul>
      </div>
    </div>
  );
};

export default CreditReport;
