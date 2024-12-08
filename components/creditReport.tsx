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
    if (score >= 800) return 'text-green-500';
    if (score >= 740) return 'text-blue-500';
    if (score >= 670) return 'text-yellow-500';
    if (score >= 580) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className='flex flex-wrap md:flex-nowrap justify-center gap-4 p-4 bg-gray-100'>
      <div className='flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-2xl w-full md:w-1/2 hover:shadow-2xl transition-shadow duration-300 h-64'>
        <h2 className='text-3xl font-extrabold mb-2'>Your Credit Score</h2>
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
        <p className='mt-2 text-lg text-gray-700'>
          {score >= 800
            ? 'Excellent'
            : score >= 740
            ? 'Very Good'
            : score >= 670
            ? 'Good'
            : score >= 580
            ? 'Fair'
            : score >= 300
            ? 'Poor'
            : 'Loading...'}
        </p>
      </div>

      <div className='flex flex-col p-4 bg-white shadow-lg rounded-2xl w-full md:w-1/2 hover:shadow-2xl transition-shadow duration-300 h-64'>
        <h2 className='text-3xl font-extrabold mb-2'>About Credit Scores</h2>
        <p className='text-gray-700 text-md mb-2'>
          Your credit score represents your creditworthiness. It helps lenders
          assess the risk of lending you money.
        </p>
        <h3 className='text-xl font-semibold mb-2'>Importance</h3>
        <ul className='list-disc list-inside text-gray-700 text-md mb-2'>
          <li>Lower interest rates on loans.</li>
          <li>Faster loan approval and higher credit limits.</li>
          <li>Affects renting properties and job opportunities.</li>
          <li>Improves financial stability.</li>
        </ul>
      </div>
    </div>
  );
};

export default CreditReport;
