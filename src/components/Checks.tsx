import React, { useState } from 'react';
import { Plus, Search, CreditCard, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { checks } from '../data/mockData';

export default function Checks() {
  const [filter, setFilter] = useState<'all' | 'receivable' | 'payable'>('all');
  const [showModal, setShowModal] = useState(false);
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);
  const filtered = checks.filter(c => filter === 'all' || c.type === filter);
  const totalReceivable = checks.filter(c => c.type === 'receivable').reduce((s, c) => s + c.amount, 0);
  const totalPayable = checks.filter(c => c.type === 'payable').reduce((s, c) => s + c.amount, 0);
  const statusBadge = (s: string) => {
    const m: Record<string, [string, string]> = { pending: ['badge-warning', '⏳ در انتظار'], cleared: ['badge-success', '✓ وصول شده'], bounced: ['badge-danger', '✕ برگشتی'], deposited: ['badge-info', '↗ سپرده شده'] };
    const [c, l] = m[s] || ['badge-slate', s];
    return <span className={`badge ${c}`}>{l}</span>;
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><div className="flex items-center gap-2"><CreditCard size={16} className="text-blue-600" /><p className="text-[11px] text-slate-500">تعداد چک‌ها</p></div><p className="text-xl font-bold text-slate-800 mt-1">{checks.length}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /><p className="text-[11px] text-slate-500">چک‌های دریافتنی</p></div><p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{fmt(totalReceivable)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><XCircle size={16} className="text-red-600" /><p className="text-[11px] text-slate-500">چک‌های پرداختنی</p></div><p className="text-lg font-bold text-red-600 mt-1 font-mono">{fmt(totalPayable)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" /><p className="text-[11px] text-slate-500">چک‌های معوق</p></div><p className="text-xl font-bold text-amber-600 mt-1">{checks.filter(c => c.status === 'bounced').length}</p></div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجو..." className="input pr-8 py-2 text-xs w-44" /></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['all', 'receivable', 'payable'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'همه' : f === 'receivable' ? 'دریافتنی' : 'پرداختنی'}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> ثبت چک جدید</button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead><tr><th>شماره چک</th><th>نوع</th><th>بانک</th><th>طرف حساب</th><th>تاریخ سررسید</th><th className="text-left">مبلغ</th><th className="text-center">وضعیت</th></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="font-mono text-xs text-slate-700">{c.number}</td>
                <td><span className={`badge ${c.type === 'receivable' ? 'badge-info' : 'badge-warning'}`}>{c.type === 'receivable' ? 'دریافتنی' : 'پرداختنی'}</span></td>
                <td className="text-xs text-slate-600">{c.bank}</td>
                <td className="text-sm font-medium text-slate-800">{c.party}</td>
                <td className="text-xs text-slate-600">{c.dueDate}</td>
                <td className="text-xs font-bold text-slate-800 font-mono text-left">{fmt(c.amount)}</td>
                <td className="text-center">{statusBadge(c.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">ثبت چک جدید</h3>
            <div className="space-y-4">
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع چک</label><select className="input text-sm"><option>دریافتنی</option><option>پرداختنی</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شماره چک</label><input type="text" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">بانک</label><input type="text" className="input text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ صدور</label><input type="text" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ سررسید</label><input type="text" className="input text-sm" /></div>
              </div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">مبلغ (ریال)</label><input type="number" className="input text-sm" /></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">طرف حساب</label><input type="text" className="input text-sm" /></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شرح</label><input type="text" className="input text-sm" /></div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">انصراف</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary">ثبت چک</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
