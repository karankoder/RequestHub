import React from 'react';

interface CreditReportProps {
  score: number;
}

const CreditReport: React.FC<CreditReportProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className='flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-2xl font-bold mb-4'>Credit Score</h2>
      <div className={`text-6xl font-extrabold ${getScoreColor(score)}`}>
        {score}
      </div>
      <p className='mt-4 text-gray-600'>
        {score >= 750 ? 'Excellent' : score >= 650 ? 'Good' : 'Poor'}
      </p>
    </div>
  );
};

export default CreditReport;
