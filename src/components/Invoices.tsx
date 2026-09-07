import React, { useState } from 'react';
import { Plus, Search, Eye, Printer, Trash2, Edit, Filter } from 'lucide-react';
import { invoices } from '../data/mockData';

export default function Invoices() {
  const [filter, setFilter] = useState<'all' | 'sales' | 'purchase'>('all');
  const [showModal, setShowModal] = useState(false);

  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  const filteredInvoices = invoices.filter(inv => filter === 'all' || inv.type === filter);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-100 text-emerald-700',
      sent: 'bg-blue-100 text-blue-700',
      overdue: 'bg-red-100 text-red-700',
      draft: 'bg-slate-100 text-slate-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    const labels: Record<string, string> = {
      paid: 'پرداخت شده', sent: 'ارسال شده', overdue: 'معوق', draft: 'پیش‌نویس', cancelled: 'لغو شده'
    };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="p-6 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/20">
          <p className="text-emerald-100 text-sm">جمع فروش</p>
          <p className="text-2xl font-bold mt-1">{formatNumber(invoices.filter(i => i.type === 'sales').reduce((s, i) => s + i.total, 0))}</p>
          <p className="text-emerald-200 text-xs mt-1">ریال</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/20">
          <p className="text-blue-100 text-sm">جمع خرید</p>
          <p className="text-2xl font-bold mt-1">{formatNumber(invoices.filter(i => i.type === 'purchase').reduce((s, i) => s + i.total, 0))}</p>
          <p className="text-blue-200 text-xs mt-1">ریال</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white shadow-lg shadow-amber-500/20">
          <p className="text-amber-100 text-sm">مطالبات معوق</p>
          <p className="text-2xl font-bold mt-1">{formatNumber(invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0))}</p>
          <p className="text-amber-200 text-xs mt-1">ریال</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg shadow-purple-500/20">
          <p className="text-purple-100 text-sm">تعداد فاکتورها</p>
          <p className="text-2xl font-bold mt-1">{invoices.length}</p>
          <p className="text-purple-200 text-xs mt-1">فاکتور</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="جستجوی فاکتور..." className="bg-white border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64" />
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setFilter('all')} className={`px-3 py-2 text-sm ${filter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>همه</button>
            <button onClick={() => setFilter('sales')} className={`px-3 py-2 text-sm ${filter === 'sales' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>فروش</button>
            <button onClick={() => setFilter('purchase')} className={`px-3 py-2 text-sm ${filter === 'purchase' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>خرید</button>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          فاکتور جدید
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">شماره</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نوع</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">تاریخ</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">سررسید</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">طرف حساب</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">مبلغ کل</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">وضعیت</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                <td className="px-4 py-3 text-sm font-mono text-slate-700">{inv.number}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${inv.type === 'sales' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {inv.type === 'sales' ? 'فروش' : 'خرید'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{inv.date}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{inv.dueDate}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{inv.customerName}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-800 font-mono text-left">{formatNumber(inv.total)}</td>
                <td className="px-4 py-3 text-center">{getStatusBadge(inv.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Eye size={14} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Printer size={14} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"><Edit size={14} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">ایجاد فاکتور جدید</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">نوع فاکتور</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>فاکتور فروش</option>
                  <option>فاکتور خرید</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">تاریخ</label>
                <input type="text" defaultValue="1403/02/15" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">سررسید</label>
                <input type="text" defaultValue="1403/03/15" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">طرف حساب</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>شرکت آلفا</option>
                  <option>شرکت بتا</option>
                  <option>شرکت دلتا</option>
                </select>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">ردیف</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">شرح کالا/خدمات</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">تعداد</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">فی</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">جمع</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-sm text-slate-600">1</td>
                    <td className="px-3 py-2"><input type="text" className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm" placeholder="نام کالا" /></td>
                    <td className="px-3 py-2"><input type="number" className="w-20 border border-slate-200 rounded px-2 py-1.5 text-sm" defaultValue="1" /></td>
                    <td className="px-3 py-2"><input type="number" className="w-28 border border-slate-200 rounded px-2 py-1.5 text-sm" defaultValue="0" /></td>
                    <td className="px-3 py-2 text-sm text-slate-800">0</td>
                    <td className="px-3 py-2 text-center"><button className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <div className="grid grid-cols-3 gap-4 w-1/2">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">جمع کل</label>
                  <input type="text" defaultValue="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">مالیات (۹٪)</label>
                  <input type="text" defaultValue="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">تخفیف</label>
                  <input type="number" defaultValue="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                <p className="text-xs text-emerald-600">مبلغ قابل پرداخت</p>
                <p className="text-xl font-bold text-emerald-700">0 ریال</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">انصراف</button>
              <button className="px-4 py-2 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700">ذخیره پیش‌نویس</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">ثبت و صدور</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
