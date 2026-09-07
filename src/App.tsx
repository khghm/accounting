import React, { useState } from 'react';
import { PageType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Journal from './components/Journal';
import Invoices from './components/Invoices';
import Customers from './components/Customers';
import Treasury from './components/Treasury';
import Products from './components/Products';
import Reports from './components/Reports';
import Settings from './components/Settings';

const pageTitles: Record<PageType, string> = {
  dashboard: 'داشبورد',
  accounts: 'کدینگ حساب‌ها',
  journal: 'دفتر روزنامه و اسناد حسابداری',
  invoices: 'فاکتورهای فروش و خرید',
  customers: 'طرف حساب‌ها',
  products: 'انبار و مدیریت کالا',
  treasury: 'خزانه‌داری',
  reports: 'گزارشات مالی',
  settings: 'تنظیمات سیستم',
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'accounts': return <Accounts />;
      case 'journal': return <Journal />;
      case 'invoices': return <Invoices />;
      case 'customers': return <Customers />;
      case 'treasury': return <Treasury />;
      case 'products': return <Products />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans" dir="rtl">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'mr-16' : 'mr-60'}`}>
        <Header title={pageTitles[currentPage]} />
        <main className="min-h-[calc(100vh-60px)]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
