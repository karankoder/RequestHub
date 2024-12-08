import CreditReport from '@/components/creditReport';
import React from 'react';

export default function page() {
  return (
    <>
      <h1>Credit Report</h1>
      <CreditReport score={750} />
    </>
  );
}
