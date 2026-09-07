import React from 'react';
import { PageType } from '../types';
import {
  LayoutDashboard, BookOpen, FileText, Users, Wallet, Package,
  BarChart3, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard size={20} /> },
  { id: 'accounts', label: 'کدینگ حساب‌ها', icon: <BookOpen size={20} /> },
  { id: 'journal', label: 'دفتر روزنامه', icon: <FileText size={20} /> },
  { id: 'invoices', label: 'فاکتورها', icon: <FileText size={20} /> },
  { id: 'customers', label: 'طرف حساب‌ها', icon: <Users size={20} /> },
  { id: 'products', label: 'انبار و کالا', icon: <Package size={20} /> },
  { id: 'treasury', label: 'خزانه‌داری', icon: <Wallet size={20} /> },
  { id: 'reports', label: 'گزارشات', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'تنظیمات', icon: <Settings size={20} /> },
];

export default function Sidebar({ currentPage, onPageChange, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen fixed right-0 top-0 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-60'} shadow-2xl`}>
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm">پ</div>
              <div>
                <h1 className="font-bold text-sm">پارسیان</h1>
                <p className="text-[10px] text-slate-400">سیستم حسابداری</p>
              </div>
            </div>
          )}
          <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors">
            {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>
      
      <nav className="p-2 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="absolute bottom-4 right-4 left-4">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-[10px] text-slate-400 text-center">نسخه ۲.۵.۰</p>
            <p className="text-[10px] text-slate-500 text-center mt-1">© ۱۴۰۳ پارسیان</p>
          </div>
        </div>
      )}
    </aside>
  );
}
