import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, FileText, Users, Package, Wallet, CreditCard,
  Calculator, BarChart3, Settings, ChevronDown, ChevronLeft, Menu, X,
  Bell, Search, User, LogOut, Moon, Sun, Calendar, HelpCircle,
  Building2, ChevronRight, Keyboard
} from 'lucide-react';
import { PageType } from '../types';
import { useStore } from '../store/Store';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const menuItems: { id: PageType; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard size={18} /> },
  { id: 'accounts', label: 'کدینگ حساب‌ها', icon: <BookOpen size={18} /> },
  { id: 'journal', label: 'دفتر روزنامه', icon: <FileText size={18} /> },
  { id: 'invoices', label: 'فاکتورها', icon: <CreditCard size={18} />, badge: 2 },
  { id: 'customers', label: 'طرف حساب‌ها', icon: <Users size={18} /> },
  { id: 'products', label: 'انبارداری', icon: <Package size={18} />, badge: 3 },
  { id: 'treasury', label: 'خزانه‌داری', icon: <Wallet size={18} /> },
  { id: 'checks', label: 'چک و سفته', icon: <Calculator size={18} />, badge: 1 },
  { id: 'payroll', label: 'حقوق و دستمزد', icon: <Calculator size={18} /> },
  { id: 'reports', label: 'گزارشات مالی', icon: <BarChart3 size={18} /> },
  { id: 'settings', label: 'تنظیمات', icon: <Settings size={18} /> },
];

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { notifications } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pageTitle: Record<PageType, string> = {
    dashboard: 'داشبورد مدیریتی',
    accounts: 'کدینگ حساب‌ها',
    journal: 'دفتر روزنامه و اسناد حسابداری',
    invoices: 'مدیریت فاکتورها',
    customers: 'طرف حساب‌ها',
    products: 'انبارداری و کالا',
    treasury: 'خزانه‌داری',
    checks: 'مدیریت چک و سفته',
    payroll: 'حقوق و دستمزد',
    reports: 'گزارشات مالی',
    settings: 'تنظیمات سیستم',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        sidebar fixed lg:relative z-50 h-full flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-20'}
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        transition-all duration-300 ease-in-out
      `}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
            <Building2 size={20} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className="text-white font-bold text-sm">پارسیان</h1>
              <p className="text-slate-400 text-[10px]">سیستم جامع حسابداری</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-auto text-slate-400 hover:text-white hide-mobile">
            {sidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarOpen && <p className="px-6 text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">منوی اصلی</p>}
          <div className="stagger-children">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onPageChange(item.id); setMobileMenuOpen(false); }}
                className={`sidebar-item w-[calc(100%-16px)] ${currentPage === item.id ? 'active' : ''} ${!sidebarOpen ? 'justify-center mx-2 px-3' : ''}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="flex-1 text-right">{item.label}</span>}
                {sidebarOpen && item.badge && (
                  <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-400 font-medium">نسخه حرفه‌ای</span>
              </div>
              <p className="text-[10px] text-slate-400">شرکت پارسیان - سال مالی ۱۴۰۳</p>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill bg-emerald-500" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">۷۵٪ از فضای ذخیره‌سازی</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="glass border-b border-slate-200/60 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h2 className="text-base font-bold text-slate-800">{pageTitle[currentPage]}</h2>
            <p className="text-[11px] text-slate-400">آخرین به‌روزرسانی: ۵ دقیقه پیش</p>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="جستجوی سریع... (Ctrl+K)"
                className="input pr-9 pl-4 py-2 text-sm bg-slate-50/80 border-slate-200/60"
                onFocus={() => setSearchOpen(true)}
              />
              <kbd className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 mr-auto">
            <button onClick={() => setSearchOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Search size={18} />
            </button>
            
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block" data-tooltip="راهنما">
              <HelpCircle size={18} />
            </button>

            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell size={18} />
                {unreadNotifs > 0 && <span className="notification-dot absolute top-1.5 right-1.5"></span>}
              </button>
              {notifOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in z-50">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">اعلان‌ها</h4>
                    <span className="badge badge-danger">{unreadNotifs} جدید</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-emerald-50/30' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                            notif.type === 'error' ? 'bg-red-100 text-red-600' :
                            notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <Bell size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{notif.date}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 flex-shrink-0"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-100">
                    <button className="w-full text-center text-xs text-emerald-600 hover:text-emerald-700 font-medium">مشاهده همه اعلان‌ها</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
                  <User size={14} className="text-white" />
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-slate-700">مدیر سیستم</p>
                  <p className="text-[10px] text-slate-400">admin@parsian.ir</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in z-50">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-bold text-slate-800 text-sm">مدیر سیستم</p>
                    <p className="text-xs text-slate-500">admin@parsian.ir</p>
                    <span className="badge badge-purple mt-2">مدیر ارشد</span>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <User size={15} /> پروفایل من
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <Settings size={15} /> تنظیمات
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <Keyboard size={15} /> کلیدهای میانبر
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut size={15} /> خروج از سیستم
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="modal-content w-full max-w-xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجو در حساب‌ها، فاکتورها، مشتریان..."
                  className="input pr-10 py-3 text-sm"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-400 mb-3">دسترسی سریع</p>
              <div className="grid grid-cols-2 gap-2">
                {menuItems.slice(0, 6).map(item => (
                  <button
                    key={item.id}
                    onClick={() => { onPageChange(item.id); setSearchOpen(false); }}
                    className="flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <span className="text-emerald-600">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
