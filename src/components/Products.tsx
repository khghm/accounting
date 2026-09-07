import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';
import { products } from '../data/mockData';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  const filteredProducts = products.filter(p =>
    p.name.includes(searchTerm) || p.code.includes(searchTerm) || p.category.includes(searchTerm)
  );

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + (p.stock * p.buyPrice), 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-blue-600" />
            <p className="text-sm text-slate-500">تعداد اقلام</p>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowDown size={18} className="text-emerald-600" />
            <p className="text-sm text-slate-500">موجودی کل</p>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatNumber(totalStock)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <p className="text-sm text-slate-500">ارزش انبار</p>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatNumber(totalValue)}</p>
          <p className="text-xs text-slate-400">ریال</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            <p className="text-sm text-slate-500">کمبود موجودی</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockItems.length}</p>
          <p className="text-xs text-slate-400">قلم کالا</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h4 className="font-bold text-amber-800 text-sm">هشدار: کالاهای با موجودی پایین</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(p => (
              <span key={p.id} className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                {p.name} ({p.stock} عدد)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="جستجوی کالا..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64" />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
            <option>همه دسته‌ها</option>
            <option>لپ‌تاپ</option>
            <option>مانیتور</option>
            <option>لوازم جانبی</option>
            <option>پرینتر</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('table')} className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>جدول</button>
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>کارت</button>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} />
            کالای جدید
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کد</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نام کالا</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">دسته‌بندی</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">واحد</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">قیمت خرید</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">قیمت فروش</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">موجودی</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">حداقل</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">وضعیت</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{product.code}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.unit}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-mono text-left">{formatNumber(product.buyPrice)}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-mono text-left">{formatNumber(product.sellPrice)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800 text-left">{product.stock}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 text-left">{product.minStock}</td>
                  <td className="px-4 py-3 text-center">
                    {product.stock <= product.minStock ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">بحرانی</span>
                    ) : product.stock <= product.minStock * 2 ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">کم</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">مناسب</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{product.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{product.code}</p>
                </div>
                {product.stock <= product.minStock ? (
                  <AlertTriangle size={16} className="text-red-500" />
                ) : null}
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">قیمت خرید:</span>
                  <span className="font-mono text-slate-700">{formatNumber(product.buyPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">قیمت فروش:</span>
                  <span className="font-mono text-emerald-600 font-bold">{formatNumber(product.sellPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">سود:</span>
                  <span className="font-mono text-blue-600">{formatNumber(product.sellPrice - product.buyPrice)}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">موجودی</p>
                  <p className="text-lg font-bold text-slate-800">{product.stock} <span className="text-xs text-slate-500">{product.unit}</span></p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  product.stock <= product.minStock ? 'bg-red-100 text-red-700' :
                  product.stock <= product.minStock * 2 ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {product.stock <= product.minStock ? 'بحرانی' : product.stock <= product.minStock * 2 ? 'کم' : 'مناسب'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">کالای جدید</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">کد کالا</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">نام کالا</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">دسته‌بندی</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>لپ‌تاپ</option>
                    <option>مانیتور</option>
                    <option>لوازم جانبی</option>
                    <option>پرینتر</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">واحد</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>عدد</option>
                    <option>کیلوگرم</option>
                    <option>متر</option>
                    <option>بسته</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">قیمت خرید</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">قیمت فروش</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">موجودی اولیه</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">حداقل موجودی</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
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
