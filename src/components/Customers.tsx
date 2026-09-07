import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, User, Building, MoreVertical } from 'lucide-react';
import { customers } from '../data/mockData';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'customer' | 'supplier' | 'both'>('all');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(Math.abs(n));
  const filtered = customers.filter(c => {
    const ms = !searchTerm || c.name.includes(searchTerm) || c.code.includes(searchTerm);
    const mf = filter === 'all' || c.type === filter;
    return ms && mf;
  });
  const typeBadge = (t: string) => { const m: Record<string, [string, string]> = { customer: ['badge-info', 'مشتری'], supplier: ['badge-warning', 'تامین‌کننده'], both: ['badge-purple', 'هر دو'] }; const [c, l] = m[t] || ['badge-slate', t]; return <span className={`badge ${c}`}>{l}</span>; };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">کل طرف حساب‌ها</p><p className="text-xl font-bold text-slate-800 mt-1">{customers.length}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">جمع مطالبات</p><p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{fmt(customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0))}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">جمع بدهی‌ها</p><p className="text-lg font-bold text-red-600 mt-1 font-mono">{fmt(customers.filter(c => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0))}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">مانده خالص</p><p className="text-lg font-bold text-blue-600 mt-1 font-mono">{fmt(customers.reduce((s, c) => s + c.balance, 0))}</p></div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجو..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pr-8 py-2 text-xs w-48" /></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['all', 'customer', 'supplier'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'همه' : f === 'customer' ? 'مشتریان' : 'تامین‌کنندگان'}</button>
            ))}
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-2.5 py-2 text-xs ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}>کارت</button>
            <button onClick={() => setViewMode('table')} className={`px-2.5 py-2 text-xs ${viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}>جدول</button>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> طرف حساب جدید</button>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                    {c.type === 'supplier' ? <Building size={18} className="text-emerald-700" /> : <User size={18} className="text-emerald-700" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{c.code}</p>
                  </div>
                </div>
                {typeBadge(c.type)}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600"><Phone size={12} className="text-slate-400" /><span dir="ltr">{c.phone}</span></div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><Mail size={12} className="text-slate-400" /><span>{c.email}</span></div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><MapPin size={12} className="text-slate-400" /><span className="truncate">{c.address}</span></div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500">مانده حساب</p>
                  <p className={`text-sm font-bold font-mono ${c.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{c.balance >= 0 ? 'بدهکار' : 'بستانکار'}: {fmt(c.balance)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>کد</th><th>نام</th><th>نوع</th><th>تلفن</th><th>ایمیل</th><th className="text-left">مانده</th><th className="text-center">عملیات</th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono text-xs text-slate-600">{c.code}</td>
                  <td className="text-sm font-medium text-slate-800">{c.name}</td>
                  <td>{typeBadge(c.type)}</td>
                  <td className="text-xs text-slate-600" dir="ltr">{c.phone}</td>
                  <td className="text-xs text-slate-600">{c.email}</td>
                  <td className={`text-xs font-bold font-mono text-left ${c.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(c.balance)}</td>
                  <td className="text-center"><div className="flex items-center justify-center gap-0.5"><button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button><button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">طرف حساب جدید</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام</label><input type="text" className="input text-sm" placeholder="نام طرف حساب" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد</label><input type="text" className="input text-sm" placeholder="کد" /></div>
              </div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع</label><select className="input text-sm"><option>مشتری</option><option>تامین‌کننده</option><option>هر دو</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تلفن</label><input type="text" className="input text-sm" placeholder="شماره تلفن" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">ایمیل</label><input type="email" className="input text-sm" placeholder="ایمیل" /></div>
              </div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">آدرس</label><input type="text" className="input text-sm" placeholder="آدرس" /></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حد اعتبار (ریال)</label><input type="number" className="input text-sm" placeholder="۰" /></div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">انصراف</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary">ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
