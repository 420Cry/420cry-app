import React from 'react';
import { CryAlert } from '@420cry/420cry-lib';

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-blue-600">420CRY-APP</h1>
      <p className="text-lg text-center text-gray-700">Below are the components from @420cry/420cry-lib.</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <div>
          <CryAlert type="success" size='sm' title="Success"/>
          <CryAlert type="warning" size='md' title="warning"/>
          <CryAlert type="info" size='lg' title="warning"/>
          <CryAlert type="danger" size='lg' title="warning"/>
        </div>
      </div>
    </>
  );
}
