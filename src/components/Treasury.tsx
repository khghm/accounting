import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Plus, Search, Printer, Wallet, Building2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { transactions } from '../data/mockData';

export default function Treasury() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'receipt' | 'payment' | 'transfer'>('all');
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);
  const filtered = transactions.filter(t => filter === 'all' || t.type === filter);
  const totalReceipts = transactions.filter(t => t.type === 'receipt').reduce((s, t) => s + t.amount, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0);
  const chartData = [{ name: 'صندوق', balance: 350 }, { name: 'بانک ملت', balance: 980 }, { name: 'بانک ملی', balance: 520 }];
  const typeIcon = (t: string) => t === 'receipt' ? <ArrowDownLeft size={14} className="text-emerald-600" /> : t === 'payment' ? <ArrowUpRight size={14} className="text-red-600" /> : <ArrowLeftRight size={14} className="text-blue-600" />;
  const typeLabel = (t: string) => ({ receipt: 'دریافت', payment: 'پرداخت', transfer: 'انتقال' }[t] || t);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="gradient-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-2 mb-2"><ArrowDownLeft size={16} /><span className="text-white/80 text-xs">جمع دریافت‌ها</span></div>
          <p className="text-xl font-bold font-mono">{fmt(totalReceipts)}</p><p className="text-white/60 text-[11px] mt-1">ریال</p>
        </div>
        <div className="gradient-card bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20">
          <div className="flex items-center gap-2 mb-2"><ArrowUpRight size={16} /><span className="text-white/80 text-xs">جمع پرداخت‌ها</span></div>
          <p className="text-xl font-bold font-mono">{fmt(totalPayments)}</p><p className="text-white/60 text-[11px] mt-1">ریال</p>
        </div>
        <div className="gradient-card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center gap-2 mb-2"><ArrowLeftRight size={16} /><span className="text-white/80 text-xs">انتقالات</span></div>
          <p className="text-xl font-bold font-mono">{fmt(transactions.filter(t => t.type === 'transfer').reduce((s, t) => s + t.amount, 0))}</p><p className="text-white/60 text-[11px] mt-1">ریال</p>
        </div>
        <div className="gradient-card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20">
          <div className="flex items-center gap-2 mb-2"><Wallet size={16} /><span className="text-white/80 text-xs">موجودی کل</span></div>
          <p className="text-xl font-bold font-mono">{fmt(1850000000)}</p><p className="text-white/60 text-[11px] mt-1">ریال</p>
        </div>
      </div>

      {/* Chart + Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-static p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-4">موجودی حساب‌های بانکی</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="balance" name="موجودی (میلیون ریال)" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-static p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-4">حساب‌ها</h3>
          <div className="space-y-3">
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100"><p className="text-[11px] text-emerald-600 font-medium">صندوق ریالی</p><p className="text-lg font-bold text-emerald-700 font-mono mt-0.5">{fmt(350000000)}</p></div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100"><p className="text-[11px] text-blue-600 font-medium">بانک ملت - ۰۱۲۳</p><p className="text-lg font-bold text-blue-700 font-mono mt-0.5">{fmt(980000000)}</p></div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100"><p className="text-[11px] text-purple-600 font-medium">بانک ملی - ۰۵۶۷</p><p className="text-lg font-bold text-purple-700 font-mono mt-0.5">{fmt(520000000)}</p></div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجو..." className="input pr-8 py-2 text-xs w-44" /></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['all', 'receipt', 'payment', 'transfer'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-2 text-[11px] font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'همه' : f === 'receipt' ? 'دریافت' : f === 'payment' ? 'پرداخت' : 'انتقال'}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-xs"><Printer size={14} /> گزارش</button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> عملیات جدید</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead><tr><th>نوع</th><th>تاریخ</th><th>شرح</th><th>از حساب</th><th>به حساب</th><th className="text-left">مبلغ</th><th>شماره پیگیری</th></tr></thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td><div className="flex items-center gap-2">{typeIcon(t.type)}<span className="text-xs text-slate-700">{typeLabel(t.type)}</span></div></td>
                <td className="text-xs text-slate-600">{t.date}</td>
                <td className="text-sm text-slate-800">{t.description}</td>
                <td className="text-xs text-slate-600">{t.fromAccount}</td>
                <td className="text-xs text-slate-600">{t.toAccount}</td>
                <td className="text-xs font-bold text-slate-800 font-mono text-left">{fmt(t.amount)}</td>
                <td className="text-xs font-mono text-slate-500">{t.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">عملیات خزانه‌داری جدید</h3>
            <div className="space-y-4">
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع عملیات</label><select className="input text-sm"><option>دریافت</option><option>پرداخت</option><option>انتقال بین حساب‌ها</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ</label><input type="text" defaultValue="۱۴۰۳/۰۲/۱۵" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">مبلغ (ریال)</label><input type="number" className="input text-sm" placeholder="۰" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">از حساب</label><select className="input text-sm"><option>صندوق</option><option>بانک ملت</option><option>بانک ملی</option></select></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">به حساب</label><select className="input text-sm"><option>صندوق</option><option>بانک ملت</option><option>بانک ملی</option></select></div>
              </div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شرح</label><input type="text" className="input text-sm" placeholder="توضیحات" /></div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">انصراف</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary">ثبت</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
