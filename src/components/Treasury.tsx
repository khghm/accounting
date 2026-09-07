import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Plus, Search, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { transactions } from '../data/mockData';

export default function Treasury() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'receipt' | 'payment' | 'transfer'>('all');

  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  const filteredTransactions = transactions.filter(t => filter === 'all' || t.type === filter);

  const totalReceipts = transactions.filter(t => t.type === 'receipt').reduce((s, t) => s + t.amount, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0);
  const totalTransfers = transactions.filter(t => t.type === 'transfer').reduce((s, t) => s + t.amount, 0);

  const chartData = [
    { name: 'صندوق', balance: 350000 },
    { name: 'بانک ملت', balance: 980000 },
    { name: 'بانک ملی', balance: 520000 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt': return <ArrowDownLeft size={16} className="text-emerald-600" />;
      case 'payment': return <ArrowUpRight size={16} className="text-red-600" />;
      case 'transfer': return <ArrowLeftRight size={16} className="text-blue-600" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { receipt: 'دریافت', payment: 'پرداخت', transfer: 'انتقال' };
    return labels[type];
  };

  return (
    <div className="p-6 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft size={18} />
            <span className="text-emerald-100 text-sm">جمع دریافت‌ها</span>
          </div>
          <p className="text-xl font-bold">{formatNumber(totalReceipts)}</p>
          <p className="text-emerald-200 text-xs mt-1">ریال</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg shadow-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={18} />
            <span className="text-red-100 text-sm">جمع پرداخت‌ها</span>
          </div>
          <p className="text-xl font-bold">{formatNumber(totalPayments)}</p>
          <p className="text-red-200 text-xs mt-1">ریال</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight size={18} />
            <span className="text-blue-100 text-sm">انتقالات</span>
          </div>
          <p className="text-xl font-bold">{formatNumber(totalTransfers)}</p>
          <p className="text-blue-200 text-xs mt-1">ریال</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg shadow-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💰</span>
            <span className="text-purple-100 text-sm">موجودی کل</span>
          </div>
          <p className="text-xl font-bold">{formatNumber(1850000000)}</p>
          <p className="text-purple-200 text-xs mt-1">ریال</p>
        </div>
      </div>

      {/* Bank Balance Chart */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">موجودی حساب‌های بانکی</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="balance" name="موجودی (میلیون ریال)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">صندوق‌ها</h3>
          <div className="space-y-3">
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <p className="text-xs text-emerald-600">صندوق ریالی</p>
              <p className="text-lg font-bold text-emerald-700">{formatNumber(350000000)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-xs text-blue-600">بانک ملت - ۱۲۳۴</p>
              <p className="text-lg font-bold text-blue-700">{formatNumber(980000000)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <p className="text-xs text-purple-600">بانک ملی - ۵۶۷۸</p>
              <p className="text-lg font-bold text-purple-700">{formatNumber(520000000)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="جستجو..." className="bg-white border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-56" />
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setFilter('all')} className={`px-3 py-2 text-sm ${filter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>همه</button>
            <button onClick={() => setFilter('receipt')} className={`px-3 py-2 text-sm ${filter === 'receipt' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>دریافت</button>
            <button onClick={() => setFilter('payment')} className={`px-3 py-2 text-sm ${filter === 'payment' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>پرداخت</button>
            <button onClick={() => setFilter('transfer')} className={`px-3 py-2 text-sm ${filter === 'transfer' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>انتقال</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
            <Printer size={16} />
            گزارش
          </button>
          <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} />
            عملیات جدید
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نوع</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">تاریخ</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">شرح</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">از حساب</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">به حساب</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">مبلغ</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">شماره پیگیری</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(t.type)}
                    <span className="text-sm text-slate-700">{getTypeLabel(t.type)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.date}</td>
                <td className="px-4 py-3 text-sm text-slate-800">{t.description}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.fromAccount}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.toAccount}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-800 font-mono text-left">{formatNumber(t.amount)}</td>
                <td className="px-4 py-3 text-sm font-mono text-slate-500">{t.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">عملیات خزانه‌داری جدید</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">نوع عملیات</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>دریافت</option>
                  <option>پرداخت</option>
                  <option>انتقال بین حساب‌ها</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">تاریخ</label>
                  <input type="text" defaultValue="1403/02/15" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">مبلغ (ریال)</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">از حساب</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>صندوق</option>
                    <option>بانک ملت</option>
                    <option>بانک ملی</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">به حساب</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>صندوق</option>
                    <option>بانک ملت</option>
                    <option>بانک ملی</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">شرح</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="توضیحات" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">شماره پیگیری / چک</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="شماره" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">انصراف</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">ثبت</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
