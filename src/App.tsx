import React, { useState } from 'react';
import { StoreProvider, useStore } from './store/Store';
import { PageType } from './types';
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

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const { toast } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
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
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200' : toast.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border`}>
          <span className={toast.type === 'success' ? 'text-emerald-700' : toast.type === 'error' ? 'text-red-700' : 'text-blue-700'}>
            {toast.message}
          </span>
        </div>
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
