import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, ArrowDown, ArrowUp, BarChart3 } from 'lucide-react';
import { products } from '../data/mockData';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);
  const filtered = products.filter(p => p.name.includes(searchTerm) || p.code.includes(searchTerm) || p.category.includes(searchTerm));
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + (p.stock * p.buyPrice), 0);
  const lowStock = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><div className="flex items-center gap-2"><Package size={16} className="text-blue-600" /><p className="text-[11px] text-slate-500">تعداد اقلام</p></div><p className="text-xl font-bold text-slate-800 mt-1">{products.length}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><ArrowDown size={16} className="text-emerald-600" /><p className="text-[11px] text-slate-500">موجودی کل</p></div><p className="text-xl font-bold text-slate-800 mt-1">{fmt(totalStock)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><BarChart3 size={16} className="text-purple-600" /><p className="text-[11px] text-slate-500">ارزش انبار</p></div><p className="text-lg font-bold text-slate-800 mt-1 font-mono">{fmt(totalValue)}</p><p className="text-[10px] text-slate-400">ریال</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" /><p className="text-[11px] text-slate-500">کمبود موجودی</p></div><p className="text-xl font-bold text-amber-600 mt-1">{lowStock.length}</p><p className="text-[10px] text-slate-400">قلم کالا</p></div>
      </div>

      {/* Alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-slide-down">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle size={14} className="text-amber-600" /><h4 className="font-bold text-amber-800 text-xs">هشدار: کالاهای با موجودی بحرانی</h4></div>
          <div className="flex flex-wrap gap-2">{lowStock.map(p => <span key={p.id} className="bg-amber-100 text-amber-700 text-[11px] px-2.5 py-1 rounded-full font-medium">{p.name} ({p.stock} عدد)</span>)}</div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی کالا..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pr-8 py-2 text-xs w-56" /></div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> کالای جدید</button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead><tr><th>کد</th><th>نام کالا</th><th>دسته</th><th className="text-left">قیمت خرید</th><th className="text-left">قیمت فروش</th><th className="text-left">سود</th><th className="text-left">موجودی</th><th className="text-center">وضعیت</th><th className="text-center">عملیات</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs text-slate-600">{p.code}</td>
                <td className="text-sm font-medium text-slate-800">{p.name}</td>
                <td className="text-xs text-slate-600">{p.category}</td>
                <td className="text-xs text-slate-700 font-mono text-left">{fmt(p.buyPrice)}</td>
                <td className="text-xs text-emerald-600 font-mono text-left font-bold">{fmt(p.sellPrice)}</td>
                <td className="text-xs text-blue-600 font-mono text-left">{fmt(p.sellPrice - p.buyPrice)}</td>
                <td className="text-sm font-bold text-slate-800 text-left">{p.stock} <span className="text-[10px] text-slate-400">{p.unit}</span></td>
                <td className="text-center">{p.stock <= p.minStock ? <span className="badge badge-danger">بحرانی</span> : p.stock <= p.minStock * 2 ? <span className="badge badge-warning">کم</span> : <span className="badge badge-success">مناسب</span>}</td>
                <td className="text-center"><div className="flex items-center justify-center gap-0.5"><button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button><button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">کالای جدید</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد کالا</label><input type="text" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام کالا</label><input type="text" className="input text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">دسته‌بندی</label><select className="input text-sm"><option>لپ‌تاپ</option><option>مانیتور</option><option>لوازم جانبی</option><option>پرینتر</option></select></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">واحد</label><select className="input text-sm"><option>عدد</option><option>کیلوگرم</option><option>متر</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">قیمت خرید</label><input type="number" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">قیمت فروش</label><input type="number" className="input text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">موجودی اولیه</label><input type="number" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حداقل موجودی</label><input type="number" className="input text-sm" /></div>
              </div>
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
