import React from 'react';
import { useStore, fmt } from '../store/Store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight, Eye, Clock, FileText } from 'lucide-react';
import { monthlyData, expenseCategories } from '../data/mockData';
import { PageType } from '../types';

interface DashboardProps {
  onNavigate?: (page: PageType) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { invoices, customers, products, journal, transactions, checks } = useStore();

  const totalRevenue = invoices.filter(i => i.type === 'sales').reduce((s, i) => s + i.total, 0);
  const totalExpenses = invoices.filter(i => i.type === 'purchase').reduce((s, i) => s + i.total, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalReceivables = customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0);

  const stats = [
    { title: 'کل درآمد', value: fmt(totalRevenue), unit: 'ریال', change: '+12.5%', up: true, icon: <DollarSign size={20} />, color: 'emerald' },
    { title: 'کل هزینه‌ها', value: fmt(totalExpenses), unit: 'ریال', change: '+8.2%', up: true, icon: <TrendingDown size={20} />, color: 'red' },
    { title: 'سود خالص', value: fmt(netProfit), unit: 'ریال', change: '+18.3%', up: true, icon: <TrendingUp size={20} />, color: 'blue' },
    { title: 'مطالبات', value: fmt(totalReceivables), unit: 'ریال', change: '-5.1%', up: false, icon: <Users size={20} />, color: 'amber' },
  ];

  const recentInvoices = invoices.slice(0, 5);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).slice(0, 5);
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');
  const bouncedChecks = checks.filter(c => c.status === 'bounced');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <p className="text-xl font-bold text-slate-800 mt-1 font-mono">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.unit}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : stat.color === 'red' ? 'bg-red-100 text-red-600' : stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span className={`text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>{stat.change}</span>
              <span className="text-xs text-slate-400">نسبت به ماه قبل</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-static p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">نمودار درآمد و هزینه</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option>۶ ماه اخیر</option>
              <option>سال جاری</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="درآمد" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expense" name="هزینه" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-static p-5">
          <h3 className="font-bold text-slate-800 mb-4">ترکیب هزینه‌ها</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {expenseCategories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {expenseCategories.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-slate-600">{item.name}</span></div>
                <span className="font-medium text-slate-800">{item.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-static p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">آخرین فاکتورها</h3>
            <button onClick={() => onNavigate?.('invoices')} className="text-sm text-emerald-600 hover:text-emerald-700">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${inv.type === 'sales' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    <ShoppingCart size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{inv.customerName}</p>
                    <p className="text-xs text-slate-500">{inv.number} - {inv.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 font-mono">{fmt(inv.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : inv.status === 'overdue' ? 'bg-red-100 text-red-700' : inv.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                    {inv.status === 'paid' ? 'پرداخت شده' : inv.status === 'overdue' ? 'معوق' : inv.status === 'sent' ? 'ارسال شده' : 'پیش‌نویس'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-static p-5">
            <h3 className="font-bold text-slate-800 mb-4">برترین مشتریان</h3>
            <div className="space-y-3">
              {customers.filter(c => c.type === 'customer').slice(0, 5).map((customer, i) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm text-slate-700">{customer.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800 font-mono">{fmt(Math.abs(customer.balance))}</span>
                </div>
              ))}
            </div>
          </div>

          {(overdueInvoices.length > 0 || lowStockProducts.length > 0 || bouncedChecks.length > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <h4 className="font-bold text-amber-800 text-sm">هشدارها</h4>
              </div>
              <ul className="space-y-2 text-sm text-amber-700">
                {overdueInvoices.length > 0 && <li className="flex items-center gap-2">• {overdueInvoices.length} فاکتور معوق شده است</li>}
                {lowStockProducts.length > 0 && <li className="flex items-center gap-2">• {lowStockProducts.length} قلم کالا به حداقل موجودی رسیده</li>}
                {bouncedChecks.length > 0 && <li className="flex items-center gap-2">• {bouncedChecks.length} چک برگشتی وجود دارد</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
