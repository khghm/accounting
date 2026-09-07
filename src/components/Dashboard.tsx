import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight, Eye, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { monthlyData, expenseCategories, invoices, customers, dailySalesData, accounts } from '../data/mockData';

export default function Dashboard() {
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);

  const stats = [
    { title: 'کل درآمد', value: '۳,۸۵۰,۰۰۰,۰۰۰', unit: 'ریال', change: '+۱۲.۵٪', up: true, icon: <DollarSign size={20} />, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
    { title: 'کل هزینه‌ها', value: '۲,۲۱۰,۰۰۰,۰۰۰', unit: 'ریال', change: '+۸.۲٪', up: true, icon: <TrendingDown size={20} />, gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/25' },
    { title: 'سود خالص', value: '۱,۶۴۰,۰۰۰,۰۰۰', unit: 'ریال', change: '+۱۸.۳٪', up: true, icon: <TrendingUp size={20} />, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/25' },
    { title: 'مطالبات معوق', value: '۸۹۰,۰۰۰,۰۰۰', unit: 'ریال', change: '-۵.۱٪', up: false, icon: <Users size={20} />, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
  ];

  const quickActions = [
    { label: 'ثبت سند جدید', icon: <FileText size={18} />, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
    { label: 'فاکتور فروش', icon: <ShoppingCart size={18} />, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { label: 'دریافت وجه', icon: <ArrowDownRight size={18} />, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
    { label: 'پرداخت وجه', icon: <ArrowUpRight size={18} />, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat, i) => (
          <div key={i} className={`gradient-card bg-gradient-to-br ${stat.gradient} text-white ${stat.shadow} shadow-lg`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-white/60 text-[11px] mt-1">{stat.unit}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-emerald-200' : 'text-red-200'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
              <span className="text-white/50 text-[11px]">نسبت به ماه قبل</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card-static p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm">دسترسی سریع</h3>
          <span className="text-[11px] text-slate-400">عملیات پرکاربرد</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button key={i} className={`${action.color} p-4 rounded-xl transition-all flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-95`}>
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card-static p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">عملکرد مالی</h3>
              <p className="text-xs text-slate-400 mt-0.5">درآمد و هزینه ۶ ماه اخیر</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">ماهانه</button>
              <button className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg">سالانه</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="revenue" name="درآمد" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expense" name="هزینه" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="card-static p-5">
          <h3 className="font-bold text-slate-800 mb-1">ترکیب هزینه‌ها</h3>
          <p className="text-xs text-slate-400 mb-4">تفکیک هزینه‌ها بر اساس نوع</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {expenseCategories.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{item.value}M</span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(item.value / 1450) * 100}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 card-static p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">آخرین فاکتورها</h3>
              <p className="text-xs text-slate-400 mt-0.5">فاکتورهای اخیر سیستم</p>
            </div>
            <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              <Eye size={12} /> مشاهده همه
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-right text-[11px] font-semibold text-slate-500 pb-3 pr-2">شماره</th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 pb-3">طرف حساب</th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 pb-3">تاریخ</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 pb-3">مبلغ</th>
                  <th className="text-center text-[11px] font-semibold text-slate-500 pb-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-2 text-xs font-mono text-slate-600">{inv.number}</td>
                    <td className="py-3 text-xs font-medium text-slate-800">{inv.customerName}</td>
                    <td className="py-3 text-xs text-slate-500">{inv.date}</td>
                    <td className="py-3 text-xs font-bold text-slate-800 text-left font-mono">{fmt(inv.total)}</td>
                    <td className="py-3 text-center">
                      <span className={`badge ${
                        inv.status === 'paid' ? 'badge-success' :
                        inv.status === 'overdue' ? 'badge-danger' :
                        inv.status === 'sent' ? 'badge-info' : 'badge-slate'
                      }`}>
                        {inv.status === 'paid' ? '✓ پرداخت شده' : inv.status === 'overdue' ? '⚠ معوق' : inv.status === 'sent' ? '↗ ارسال شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Daily Sales */}
          <div className="card-static p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">فروش هفتگی</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={dailySalesData}>
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="card-static p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-500" />
              <h3 className="font-bold text-slate-800 text-sm">هشدارها و اعلان‌ها</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-2.5 bg-red-50 rounded-lg">
                <XCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-red-800">چک برگشتی</p>
                  <p className="text-[10px] text-red-600">CH-003456 - مبلغ ۴۵M ریال</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-amber-50 rounded-lg">
                <Clock size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-amber-800">فاکتور معوق</p>
                  <p className="text-[10px] text-amber-600">INV-1403-004 - شرکت دلتا</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-emerald-50 rounded-lg">
                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-emerald-800">پرداخت موفق</p>
                  <p className="text-[10px] text-emerald-600">حقوق فروردین - ۵ نفر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
