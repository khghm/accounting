import React, { useState } from 'react';
import { Plus, Search, Eye, Printer, Trash2, Edit, Filter, Download, Send, CheckCircle } from 'lucide-react';
import { invoices } from '../data/mockData';

export default function Invoices() {
  const [filter, setFilter] = useState<'all' | 'sales' | 'purchase'>('all');
  const [showModal, setShowModal] = useState(false);
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);
  const filtered = invoices.filter(inv => filter === 'all' || inv.type === filter);

  const statusBadge = (s: string) => {
    const m: Record<string, [string, string]> = { paid: ['badge-success', '✓ پرداخت شده'], sent: ['badge-info', '↗ ارسال شده'], overdue: ['badge-danger', '⚠ معوق'], draft: ['badge-slate', 'پیش‌نویس'], cancelled: ['badge-slate', 'لغو شده'] };
    const [cls, label] = m[s] || ['badge-slate', s];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="gradient-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
          <p className="text-white/80 text-xs">جمع فروش</p>
          <p className="text-xl font-bold mt-1 font-mono">{fmt(invoices.filter(i => i.type === 'sales').reduce((s, i) => s + i.total, 0))}</p>
          <p className="text-white/60 text-[11px] mt-1">ریال</p>
        </div>
        <div className="gradient-card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
          <p className="text-white/80 text-xs">جمع خرید</p>
          <p className="text-xl font-bold mt-1 font-mono">{fmt(invoices.filter(i => i.type === 'purchase').reduce((s, i) => s + i.total, 0))}</p>
          <p className="text-white/60 text-[11px] mt-1">ریال</p>
        </div>
        <div className="gradient-card bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20">
          <p className="text-white/80 text-xs">مطالبات معوق</p>
          <p className="text-xl font-bold mt-1 font-mono">{fmt(invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0))}</p>
          <p className="text-white/60 text-[11px] mt-1">ریال</p>
        </div>
        <div className="gradient-card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20">
          <p className="text-white/80 text-xs">تعداد فاکتورها</p>
          <p className="text-xl font-bold mt-1">{invoices.length}</p>
          <p className="text-white/60 text-[11px] mt-1">فاکتور</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی فاکتور..." className="input pr-8 py-2 text-xs w-48" /></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['all', 'sales', 'purchase'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'همه' : f === 'sales' ? 'فروش' : 'خرید'}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-xs"><Download size={14} /> خروجی</button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> فاکتور جدید</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr><th>شماره</th><th>نوع</th><th>تاریخ</th><th>سررسید</th><th>طرف حساب</th><th className="text-left">مبلغ کل</th><th className="text-center">وضعیت</th><th className="text-center">عملیات</th></tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id}>
                <td className="font-mono text-xs text-slate-700">{inv.number}</td>
                <td><span className={`badge ${inv.type === 'sales' ? 'badge-success' : 'badge-info'}`}>{inv.type === 'sales' ? 'فروش' : 'خرید'}</span></td>
                <td className="text-xs text-slate-600">{inv.date}</td>
                <td className="text-xs text-slate-600">{inv.dueDate}</td>
                <td className="text-sm font-medium text-slate-800">{inv.customerName}</td>
                <td className="text-xs font-bold text-slate-800 font-mono text-left">{fmt(inv.total)}</td>
                <td className="text-center">{statusBadge(inv.status)}</td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={13} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Printer size={13} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit size={13} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-5xl mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">ایجاد فاکتور جدید</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع</label><select className="input text-sm"><option>فاکتور فروش</option><option>فاکتور خرید</option></select></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ</label><input type="text" defaultValue="۱۴۰۳/۰۲/۱۵" className="input text-sm" /></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">سررسید</label><input type="text" defaultValue="۱۴۰۳/۰۳/۱۵" className="input text-sm" /></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">طرف حساب</label><select className="input text-sm"><option>شرکت آلفا</option><option>شرکت بتا</option><option>شرکت دلتا</option></select></div>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-600">ردیف</th><th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-600">شرح کالا/خدمات</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">تعداد</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">فی (ریال)</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">جمع</th><th className="px-3 py-2.5 text-center text-[11px] font-semibold text-slate-600">حذف</th></tr></thead>
                <tbody>
                  <tr className="border-t border-slate-100"><td className="px-3 py-2 text-xs text-slate-600">۱</td><td className="px-3 py-2"><input type="text" className="input text-xs py-1.5" placeholder="نام کالا" /></td><td className="px-3 py-2"><input type="number" className="input text-xs py-1.5 w-16" defaultValue="1" /></td><td className="px-3 py-2"><input type="number" className="input text-xs py-1.5 w-24" defaultValue="0" /></td><td className="px-3 py-2 text-xs font-mono">۰</td><td className="px-3 py-2 text-center"><button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button></td></tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="grid grid-cols-3 gap-3 w-full md:w-1/2">
                <div><label className="text-xs text-slate-600 block mb-1">جمع کل</label><input type="text" defaultValue="۰" className="input text-sm bg-slate-50" readOnly /></div>
                <div><label className="text-xs text-slate-600 block mb-1">مالیات (۹٪)</label><input type="text" defaultValue="۰" className="input text-sm bg-slate-50" readOnly /></div>
                <div><label className="text-xs text-slate-600 block mb-1">تخفیف</label><input type="number" defaultValue="0" className="input text-sm" /></div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 text-center min-w-[180px]">
                <p className="text-xs text-emerald-600 font-medium">مبلغ قابل پرداخت</p>
                <p className="text-xl font-bold text-emerald-700 mt-1 font-mono">۰ <span className="text-xs">ریال</span></p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">انصراف</button>
              <button className="btn btn-secondary">ذخیره پیش‌نویس</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary">ثبت و صدور</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
