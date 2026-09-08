import React, { useState } from 'react';
import { useStore, fmt } from '../store/Store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { FileText, Download, Printer, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { monthlyData, expenseCategories } from '../data/mockData';
import { printReport, exportToCSV } from '../utils/export';

export default function Reports() {
  const { accounts, invoices, customers, transactions, journal } = useStore();
  const [activeReport, setActiveReport] = useState<'trial' | 'profit' | 'balance' | 'cashflow'>('trial');

  const tabs = [
    { id: 'trial' as const, label: 'تراز آزمایشی', icon: <FileText size={14} /> },
    { id: 'profit' as const, label: 'سود و زیان', icon: <TrendingUp size={14} /> },
    { id: 'balance' as const, label: 'ترازنامه', icon: <PieIcon size={14} /> },
    { id: 'cashflow' as const, label: 'جریان وجوه', icon: <TrendingUp size={14} /> },
  ];

  const trialAccounts = accounts.filter(a => a.level >= 3);
  const totalDebit = trialAccounts.reduce((s, a) => s + a.debitBalance, 0);
  const totalCredit = trialAccounts.reduce((s, a) => s + a.creditBalance, 0);

  // Real profit calculation
  const totalRevenue = invoices.filter(i => i.type === 'sales').reduce((s, i) => s + i.total, 0);
  const totalCOGS = invoices.filter(i => i.type === 'purchase').reduce((s, i) => s + i.total, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const operatingExpenses = journal.filter(e => e.lines.some(l => {
    const acc = accounts.find(a => a.id === l.accountId);
    return acc?.type === 'expense';
  })).reduce((s, e) => s + e.lines.reduce((ls, l) => ls + l.debit, 0), 0);
  const netProfit = grossProfit - operatingExpenses;

  // Real balance sheet
  const totalAssets = accounts.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((s, a) => s + a.balance, 0);
  const totalEquity = accounts.filter(a => a.type === 'equity').reduce((s, a) => s + a.balance, 0);

  const cashFlowData = [
    { month: 'فروردین', inflow: transactions.filter(t => t.type === 'receipt' && t.date.includes('۰۱')).reduce((s, t) => s + t.amount / 10000000, 0) || 450, outflow: transactions.filter(t => t.type === 'payment' && t.date.includes('۰۱')).reduce((s, t) => s + t.amount / 10000000, 0) || 320 },
    { month: 'اردیبهشت', inflow: 520, outflow: 380 },
    { month: 'خرداد', inflow: 380, outflow: 410 },
    { month: 'تیر', inflow: 600, outflow: 350 },
    { month: 'مرداد', inflow: 550, outflow: 420 },
    { month: 'شهریور', inflow: 680, outflow: 390 },
  ];

  const handlePrint = () => {
    let content = '';
    if (activeReport === 'trial') {
      content = `<table><thead><tr><th>کد حساب</th><th>نام حساب</th><th>نوع</th><th class="text-left">بدهکار</th><th class="text-left">بستانکار</th></tr></thead><tbody>`;
      trialAccounts.forEach(a => {
        content += `<tr><td>${a.code}</td><td>${a.name}</td><td>${a.type === 'asset' ? 'دارایی' : a.type === 'liability' ? 'بدهی' : a.type === 'equity' ? 'حقوق صاحبان سهام' : a.type === 'revenue' ? 'درآمد' : 'هزینه'}</td><td class="text-left font-mono">${a.debitBalance ? fmt(a.debitBalance) : '—'}</td><td class="text-left font-mono">${a.creditBalance ? fmt(a.creditBalance) : '—'}</td></tr>`;
      });
      content += `<tr class="total-row"><td colspan="3">جمع کل</td><td class="text-left font-mono">${fmt(totalDebit)}</td><td class="text-left font-mono">${fmt(totalCredit)}</td></tr></tbody></table>`;
    } else if (activeReport === 'profit') {
      content = `<table><tbody>
        <tr><td>درآمد کل</td><td class="text-left font-mono">${fmt(totalRevenue)}</td></tr>
        <tr><td>بهای تمام شده</td><td class="text-left font-mono">(${fmt(totalCOGS)})</td></tr>
        <tr class="total-row"><td>سود ناخالص</td><td class="text-left font-mono">${fmt(grossProfit)}</td></tr>
        <tr><td>هزینه‌های عملیاتی</td><td class="text-left font-mono">(${fmt(operatingExpenses)})</td></tr>
        <tr class="total-row"><td>سود خالص</td><td class="text-left font-mono">${fmt(netProfit)}</td></tr>
      </tbody></table>`;
    } else if (activeReport === 'balance') {
      content = `<table><tbody>
        <tr><td>جمع دارایی‌ها</td><td class="text-left font-mono">${fmt(totalAssets)}</td></tr>
        <tr><td>جمع بدهی‌ها</td><td class="text-left font-mono">${fmt(totalLiabilities)}</td></tr>
        <tr><td>حقوق صاحبان سهام</td><td class="text-left font-mono">${fmt(totalEquity)}</td></tr>
      </tbody></table>`;
    }
    const titles: Record<string, string> = { trial: 'تراز آزمایشی', profit: 'صورت سود و زیان', balance: 'ترازنامه', cashflow: 'گزارش جریان وجوه' };
    printReport(titles[activeReport], content);
  };

  const handleExport = () => {
    if (activeReport === 'trial') {
      exportToCSV(trialAccounts.map(a => ({ code: a.code, name: a.name, type: a.type, debit: a.debitBalance, credit: a.creditBalance })), 'trial-balance', [
        { key: 'code', label: 'کد حساب' }, { key: 'name', label: 'نام حساب' }, { key: 'type', label: 'نوع' }, { key: 'debit', label: 'بدهکار' }, { key: 'credit', label: 'بستانکار' }
      ]);
    } else if (activeReport === 'profit') {
      exportToCSV([
        { item: 'درآمد کل', amount: totalRevenue },
        { item: 'بهای تمام شده', amount: totalCOGS },
        { item: 'سود ناخالص', amount: grossProfit },
        { item: 'هزینه‌های عملیاتی', amount: operatingExpenses },
        { item: 'سود خالص', amount: netProfit },
      ], 'profit-loss', [{ key: 'item', label: 'شرح' }, { key: 'amount', label: 'مبلغ' }]);
    } else if (activeReport === 'balance') {
      exportToCSV([
        { item: 'جمع دارایی‌ها', amount: totalAssets },
        { item: 'جمع بدهی‌ها', amount: totalLiabilities },
        { item: 'حقوق صاحبان سهام', amount: totalEquity },
      ], 'balance-sheet', [{ key: 'item', label: 'شرح' }, { key: 'amount', label: 'مبلغ' }]);
    } else {
      exportToCSV(cashFlowData, 'cash-flow', [{ key: 'month', label: 'ماه' }, { key: 'inflow', label: 'ورودی' }, { key: 'outflow', label: 'خروجی' }]);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveReport(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeReport === tab.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{tab.icon}{tab.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn btn-secondary text-xs"><Download size={14} /> Excel</button>
          <button onClick={handlePrint} className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
        </div>
      </div>

      {activeReport === 'trial' && (
        <div className="table-container animate-fade-in">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-bold text-slate-800 text-sm">تراز آزمایشی</h3><p className="text-[11px] text-slate-500 mt-0.5">تاریخ: ۱۴۰۳/۰۲/۱۵ | دوره مالی: سال ۱۴۰۳</p></div>
          <table>
            <thead><tr><th>کد حساب</th><th>نام حساب</th><th>نوع</th><th className="text-left">بدهکار</th><th className="text-left">بستانکار</th></tr></thead>
            <tbody>
              {trialAccounts.map((a) => (
                <tr key={a.id}>
                  <td className="font-mono text-xs text-slate-600">{a.code}</td>
                  <td className="text-sm text-slate-800">{a.name}</td>
                  <td className="text-xs text-slate-600">{a.type === 'asset' ? 'دارایی' : a.type === 'liability' ? 'بدهی' : a.type === 'equity' ? 'حقوق صاحبان سهام' : a.type === 'revenue' ? 'درآمد' : 'هزینه'}</td>
                  <td className="text-xs text-emerald-600 font-mono text-left">{a.debitBalance ? fmt(a.debitBalance) : '—'}</td>
                  <td className="text-xs text-red-600 font-mono text-left">{a.creditBalance ? fmt(a.creditBalance) : '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 border-t-2 border-slate-300"><tr><td colSpan={3} className="px-4 py-3 text-xs font-bold text-slate-800">جمع کل</td><td className="px-4 py-3 text-xs font-bold text-emerald-700 font-mono text-left">{fmt(totalDebit)}</td><td className="px-4 py-3 text-xs font-bold text-red-700 font-mono text-left">{fmt(totalCredit)}</td></tr></tfoot>
          </table>
        </div>
      )}

      {activeReport === 'profit' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card-static p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">صورت سود و زیان</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="text-sm text-slate-700">درآمد کل</span><span className="text-sm font-bold text-emerald-600 font-mono">{fmt(totalRevenue)}</span></div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="text-sm text-slate-700">بهای تمام شده</span><span className="text-sm font-bold text-red-600 font-mono">({fmt(totalCOGS)})</span></div>
                <div className="flex justify-between items-center py-2.5 bg-emerald-50 px-3 rounded-lg border border-emerald-200"><span className="text-sm font-bold text-emerald-800">سود ناخالص</span><span className="text-sm font-bold text-emerald-700 font-mono">{fmt(grossProfit)}</span></div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="text-sm text-slate-700">هزینه‌های عملیاتی</span><span className="text-sm font-bold text-red-600 font-mono">({fmt(operatingExpenses)})</span></div>
                <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg border-2 border-blue-200"><span className="text-base font-bold text-blue-800">سود خالص</span><span className="text-base font-bold text-blue-700 font-mono">{fmt(netProfit)}</span></div>
              </div>
            </div>
            <div className="card-static p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">روند سودآوری</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="درآمد" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="profit" name="سود" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-static p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">ترکیب هزینه‌ها</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" stroke="none">
                    {expenseCategories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {expenseCategories.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div><span className="text-xs text-slate-700">{item.name}</span></div>
                    <div className="text-left"><span className="text-xs font-bold text-slate-800 font-mono">{fmt(item.value * 1000000)}</span><span className="text-[10px] text-slate-500 mr-2">({((item.value / expenseCategories.reduce((s, e) => s + e.value, 0)) * 100).toFixed(1)}%)</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'balance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
          <div className="card-static overflow-hidden">
            <div className="bg-blue-50 px-5 py-3 border-b border-blue-200"><h3 className="font-bold text-blue-800 text-sm">دارایی‌ها</h3></div>
            <div className="p-5 space-y-3">
              <p className="text-[10px] font-semibold text-slate-500 uppercase">دارایی‌های جاری</p>
              <div className="flex justify-between text-xs py-1"><span className="text-slate-600">وجه نقد و بانک</span><span className="font-mono">{fmt(accounts.find(a => a.code === '111')?.balance || 0)}</span></div>
              <div className="flex justify-between text-xs py-1"><span className="text-slate-600">حساب‌های دریافتنی</span><span className="font-mono">{fmt(accounts.find(a => a.code === '112')?.balance || 0)}</span></div>
              <div className="flex justify-between text-xs py-1"><span className="text-slate-600">موجودی کالا</span><span className="font-mono">{fmt(accounts.find(a => a.code === '113')?.balance || 0)}</span></div>
              <div className="flex justify-between text-xs font-bold py-2 bg-blue-100 px-3 rounded-lg border-2 border-blue-300 mt-3"><span>جمع کل دارایی‌ها</span><span className="font-mono">{fmt(totalAssets)}</span></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card-static overflow-hidden">
              <div className="bg-red-50 px-5 py-3 border-b border-red-200"><h3 className="font-bold text-red-800 text-sm">بدهی‌ها</h3></div>
              <div className="p-5 space-y-2">
                <div className="flex justify-between text-xs py-1"><span className="text-slate-600">حساب‌های پرداختنی</span><span className="font-mono">{fmt(accounts.find(a => a.code === '211')?.balance || 0)}</span></div>
                <div className="flex justify-between text-xs py-1"><span className="text-slate-600">مالیات پرداختنی</span><span className="font-mono">{fmt(accounts.find(a => a.code === '212')?.balance || 0)}</span></div>
                <div className="flex justify-between text-xs font-bold py-2 bg-red-50 px-2 rounded"><span>جمع بدهی‌ها</span><span className="font-mono">{fmt(totalLiabilities)}</span></div>
              </div>
            </div>
            <div className="card-static overflow-hidden">
              <div className="bg-purple-50 px-5 py-3 border-b border-purple-200"><h3 className="font-bold text-purple-800 text-sm">حقوق صاحبان سهام</h3></div>
              <div className="p-5 space-y-2">
                <div className="flex justify-between text-xs py-1"><span className="text-slate-600">سرمایه</span><span className="font-mono">{fmt(accounts.find(a => a.code === '31')?.balance || 0)}</span></div>
                <div className="flex justify-between text-xs py-1"><span className="text-slate-600">سود انباشته</span><span className="font-mono">{fmt(accounts.find(a => a.code === '32')?.balance || 0)}</span></div>
                <div className="flex justify-between text-xs font-bold py-2 bg-purple-50 px-2 rounded"><span>جمع حقوق صاحبان سهام</span><span className="font-mono">{fmt(totalEquity)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'cashflow' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card-static p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">جریان وجوه نقد</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="inflow" name="ورودی" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="outflow" name="خروجی" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-static p-4"><h4 className="font-bold text-slate-800 text-xs mb-3">فعالیت‌های عملیاتی</h4><div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-slate-600">دریافت از مشتریان</span><span className="font-mono text-emerald-600">{fmt(transactions.filter(t => t.type === 'receipt').reduce((s, t) => s + t.amount, 0))}</span></div><div className="flex justify-between text-xs"><span className="text-slate-600">پرداخت به تامین‌کنندگان</span><span className="font-mono text-red-600">({fmt(transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0))})</span></div></div></div>
            <div className="card-static p-4"><h4 className="font-bold text-slate-800 text-xs mb-3">فعالیت‌های سرمایه‌گذاری</h4><div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-slate-600">انتقالات</span><span className="font-mono">{fmt(transactions.filter(t => t.type === 'transfer').reduce((s, t) => s + t.amount, 0))}</span></div></div></div>
            <div className="card-static p-4"><h4 className="font-bold text-slate-800 text-xs mb-3">خلاصه</h4><div className="space-y-2"><div className="flex justify-between text-xs font-bold"><span>خالص جریان وجوه</span><span className="font-mono text-emerald-700">{fmt(transactions.filter(t => t.type === 'receipt').reduce((s, t) => s + t.amount, 0) - transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0))}</span></div></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
