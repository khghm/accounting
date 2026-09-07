import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { FileText, Download, Printer, TrendingUp } from 'lucide-react';
import { accounts, monthlyData, expenseCategories } from '../data/mockData';

export default function Reports() {
  const [activeReport, setActiveReport] = useState<'trial' | 'profit' | 'balance' | 'cashflow'>('trial');

  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  const reportTypes = [
    { id: 'trial' as const, label: 'تراز آزمایشی', icon: <FileText size={16} /> },
    { id: 'profit' as const, label: 'سود و زیان', icon: <TrendingUp size={16} /> },
    { id: 'balance' as const, label: 'ترازنامه', icon: <FileText size={16} /> },
    { id: 'cashflow' as const, label: 'جریان وجوه', icon: <TrendingUp size={16} /> },
  ];

  const trialBalanceAccounts = accounts.filter(a => a.level >= 3);
  const totalDebit = trialBalanceAccounts.reduce((s, a) => s + a.debitBalance, 0);
  const totalCredit = trialBalanceAccounts.reduce((s, a) => s + a.creditBalance, 0);

  const profitData = {
    revenue: 3850000000,
    cogs: 1450000000,
    grossProfit: 2400000000,
    operatingExpenses: 760000000,
    netProfit: 1640000000,
  };

  const balanceSheet = {
    assets: { current: 3200000000, nonCurrent: 2220000000, total: 5420000000 },
    liabilities: { current: 980000000, nonCurrent: 700000000, total: 1680000000 },
    equity: { capital: 1500000000, retained: 600000000, total: 2100000000 },
  };

  const cashFlowData = [
    { month: 'فروردین', inflow: 450, outflow: 320 },
    { month: 'اردیبهشت', inflow: 520, outflow: 380 },
    { month: 'خرداد', inflow: 380, outflow: 410 },
    { month: 'تیر', inflow: 600, outflow: 350 },
    { month: 'مرداد', inflow: 550, outflow: 420 },
    { month: 'شهریور', inflow: 680, outflow: 390 },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Report Type Tabs */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-slate-100 shadow-sm">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeReport === report.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {report.icon}
            {report.label}
          </button>
        ))}
        <div className="flex-1"></div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Download size={16} />
          خروجی Excel
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Printer size={16} />
          چاپ
        </button>
      </div>

      {/* Trial Balance Report */}
      {activeReport === 'trial' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">تراز آزمایشی</h3>
            <p className="text-sm text-slate-500 mt-1">تاریخ: ۱۴۰۳/۰۲/۱۵ | دوره مالی: سال ۱۴۰۳</p>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کد حساب</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نام حساب</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نوع</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">بدهکار</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">بستانکار</th>
              </tr>
            </thead>
            <tbody>
              {trialBalanceAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50 border-b border-slate-100">
                  <td className="px-4 py-2.5 text-sm font-mono text-slate-600">{account.code}</td>
                  <td className="px-4 py-2.5 text-sm text-slate-800">{account.name}</td>
                  <td className="px-4 py-2.5 text-sm text-slate-600">
                    {account.type === 'asset' ? 'دارایی' : account.type === 'liability' ? 'بدهی' : account.type === 'equity' ? 'حقوق صاحبان سهام' : account.type === 'revenue' ? 'درآمد' : 'هزینه'}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-emerald-600 font-mono text-left">{account.debitBalance ? formatNumber(account.debitBalance) : '-'}</td>
                  <td className="px-4 py-2.5 text-sm text-red-600 font-mono text-left">{account.creditBalance ? formatNumber(account.creditBalance) : '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 border-t-2 border-slate-300">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-bold text-slate-800">جمع کل</td>
                <td className="px-4 py-3 text-sm font-bold text-emerald-700 font-mono text-left">{formatNumber(totalDebit)}</td>
                <td className="px-4 py-3 text-sm font-bold text-red-700 font-mono text-left">{formatNumber(totalCredit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Profit & Loss Report */}
      {activeReport === 'profit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">سود و زیان</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-700">درآمد کل</span>
                  <span className="text-sm font-bold text-emerald-600">{formatNumber(profitData.revenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-700">بهای تمام شده</span>
                  <span className="text-sm font-bold text-red-600">({formatNumber(profitData.cogs)})</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b-2 border-emerald-200 bg-emerald-50 px-3 rounded">
                  <span className="text-sm font-bold text-emerald-800">سود ناخالص</span>
                  <span className="text-sm font-bold text-emerald-700">{formatNumber(profitData.grossProfit)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-700">هزینه‌های عملیاتی</span>
                  <span className="text-sm font-bold text-red-600">({formatNumber(profitData.operatingExpenses)})</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg border-2 border-blue-200">
                  <span className="text-base font-bold text-blue-800">سود خالص</span>
                  <span className="text-base font-bold text-blue-700">{formatNumber(profitData.netProfit)}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">روند سودآوری</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="درآمد" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="profit" name="سود" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">ترکیب هزینه‌ها</h3>
            <div className="grid grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}M`}>
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {expenseCategories.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-slate-800">{formatNumber(item.value * 1000000)}</span>
                      <span className="text-xs text-slate-500 mr-2">({((item.value / expenseCategories.reduce((s, e) => s + e.value, 0)) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {activeReport === 'balance' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-blue-50 px-5 py-3 border-b border-blue-200">
              <h3 className="font-bold text-blue-800">دارایی‌ها</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase">دارایی‌های جاری</p>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">وجه نقد و بانک</span><span className="font-mono">{formatNumber(1850000000)}</span></div>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">حساب‌های دریافتنی</span><span className="font-mono">{formatNumber(890000000)}</span></div>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">موجودی کالا</span><span className="font-mono">{formatNumber(460000000)}</span></div>
                <div className="flex justify-between text-sm font-bold py-2 border-t border-slate-200 bg-blue-50 px-2 rounded"><span>جمع دارایی‌های جاری</span><span className="font-mono">{formatNumber(balanceSheet.assets.current)}</span></div>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase">دارایی‌های غیرجاری</p>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">اموال و تجهیزات</span><span className="font-mono">{formatNumber(1800000000)}</span></div>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">استهلاک انباشته</span><span className="font-mono text-red-600">({formatNumber(420000000)})</span></div>
                <div className="flex justify-between text-sm font-bold py-2 border-t border-slate-200 bg-blue-50 px-2 rounded"><span>جمع دارایی‌های غیرجاری</span><span className="font-mono">{formatNumber(balanceSheet.assets.nonCurrent)}</span></div>
              </div>
              <div className="flex justify-between text-base font-bold py-3 bg-blue-100 px-3 rounded-lg border-2 border-blue-300 mt-4">
                <span>جمع کل دارایی‌ها</span>
                <span className="font-mono">{formatNumber(balanceSheet.assets.total)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-red-50 px-5 py-3 border-b border-red-200">
                <h3 className="font-bold text-red-800">بدهی‌ها</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">حساب‌های پرداختنی</span><span className="font-mono">{formatNumber(650000000)}</span></div>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">مالیات پرداختنی</span><span className="font-mono">{formatNumber(180000000)}</span></div>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">حقوق پرداختنی</span><span className="font-mono">{formatNumber(150000000)}</span></div>
                <div className="flex justify-between text-sm font-bold py-2 border-t border-slate-200 bg-red-50 px-2 rounded"><span>جمع بدهی‌های جاری</span><span className="font-mono">{formatNumber(balanceSheet.liabilities.current)}</span></div>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">وام بلندمدت</span><span className="font-mono">{formatNumber(700000000)}</span></div>
                <div className="flex justify-between text-sm font-bold py-2 border-t border-slate-200 bg-red-50 px-2 rounded"><span>جمع کل بدهی‌ها</span><span className="font-mono">{formatNumber(balanceSheet.liabilities.total)}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-purple-50 px-5 py-3 border-b border-purple-200">
                <h3 className="font-bold text-purple-800">حقوق صاحبان سهام</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">سرمایه</span><span className="font-mono">{formatNumber(balanceSheet.equity.capital)}</span></div>
                <div className="flex justify-between text-sm py-1"><span className="text-slate-600">سود انباشته</span><span className="font-mono">{formatNumber(balanceSheet.equity.retained)}</span></div>
                <div className="flex justify-between text-sm font-bold py-2 border-t border-slate-200 bg-purple-50 px-2 rounded"><span>جمع حقوق صاحبان سهام</span><span className="font-mono">{formatNumber(balanceSheet.equity.total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Report */}
      {activeReport === 'cashflow' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">جریان وجوه نقد</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="inflow" name="ورودی" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" name="خروجی" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-3">فعالیت‌های عملیاتی</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">دریافت از مشتریان</span><span className="font-mono text-emerald-600">{formatNumber(2800000000)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">پرداخت به تامین‌کنندگان</span><span className="font-mono text-red-600">({formatNumber(1200000000)})</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">پرداخت حقوق</span><span className="font-mono text-red-600">({formatNumber(380000000)})</span></div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2"><span>خالص عملیاتی</span><span className="font-mono text-emerald-700">{formatNumber(1220000000)}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-3">فعالیت‌های سرمایه‌گذاری</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">خرید تجهیزات</span><span className="font-mono text-red-600">({formatNumber(250000000)})</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">فروش دارایی</span><span className="font-mono text-emerald-600">{formatNumber(50000000)}</span></div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2"><span>خالص سرمایه‌گذاری</span><span className="font-mono text-red-700">({formatNumber(200000000)})</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-3">فعالیت‌های تأمین مالی</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">دریافت وام</span><span className="font-mono text-emerald-600">{formatNumber(500000000)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">بازپرداخت اقساط</span><span className="font-mono text-red-600">({formatNumber(150000000)})</span></div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2"><span>خالص تأمین مالی</span><span className="font-mono text-emerald-700">{formatNumber(350000000)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
