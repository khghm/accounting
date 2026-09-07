import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Journal from './components/Journal';
import Invoices from './components/Invoices';
import Customers from './components/Customers';
import Products from './components/Products';
import Treasury from './components/Treasury';
import Checks from './components/Checks';
import Payroll from './components/Payroll';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { PageType } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'accounts': return <Accounts />;
      case 'journal': return <Journal />;
      case 'invoices': return <Invoices />;
      case 'customers': return <Customers />;
      case 'products': return <Products />;
      case 'treasury': return <Treasury />;
      case 'checks': return <Checks />;
      case 'payroll': return <Payroll />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
