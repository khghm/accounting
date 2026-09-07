import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, User } from 'lucide-react';
import { customers } from '../data/mockData';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'customer' | 'supplier' | 'both'>('all');
  const [showModal, setShowModal] = useState(false);

  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(Math.abs(num));

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.includes(searchTerm) || c.code.includes(searchTerm);
    const matchFilter = filter === 'all' || c.type === filter;
    return matchSearch && matchFilter;
  });

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      customer: 'bg-blue-100 text-blue-700',
      supplier: 'bg-amber-100 text-amber-700',
      both: 'bg-purple-100 text-purple-700',
    };
    const labels: Record<string, string> = { customer: 'مشتری', supplier: 'تامین‌کننده', both: 'هر دو' };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[type]}`}>{labels[type]}</span>;
  };

  return (
    <div className="p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">کل طرف حساب‌ها</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">جمع مطالبات</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatNumber(customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0))}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">جمع بدهی‌ها</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatNumber(customers.filter(c => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0))}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">مانده خالص</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{formatNumber(customers.reduce((s, c) => s + c.balance, 0))}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="جستجو..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64" />
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setFilter('all')} className={`px-3 py-2 text-sm ${filter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>همه</button>
            <button onClick={() => setFilter('customer')} className={`px-3 py-2 text-sm ${filter === 'customer' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>مشتریان</button>
            <button onClick={() => setFilter('supplier')} className={`px-3 py-2 text-sm ${filter === 'supplier' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>تامین‌کنندگان</button>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          طرف حساب جدید
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{customer.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{customer.code}</p>
                </div>
              </div>
              {getTypeBadge(customer.type)}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={13} className="text-slate-400" />
                <span className="text-xs" dir="ltr">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={13} className="text-slate-400" />
                <span className="text-xs">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={13} className="text-slate-400" />
                <span className="text-xs">{customer.address}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">مانده حساب</p>
                <p className={`text-sm font-bold ${customer.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {customer.balance >= 0 ? 'بدهکار' : 'بستانکار'}: {formatNumber(customer.balance)} ریال
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit size={14} /></button>
                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">طرف حساب جدید</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">نام</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="نام طرف حساب" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">کد</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="کد" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">نوع</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>مشتری</option>
                  <option>تامین‌کننده</option>
                  <option>هر دو</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">تلفن</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="شماره تلفن" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">ایمیل</label>
                  <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="ایمیل" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">آدرس</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="آدرس" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">حد اعتبار</label>
                <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="0" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">انصراف</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
