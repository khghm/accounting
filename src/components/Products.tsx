import React, { useState } from 'react';
import { useStore, fmt, genId } from '../store/Store';
import { Product } from '../types';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, X, Printer, Download } from 'lucide-react';
import { printReport, exportToCSV } from '../utils/export';

export default function Products() {
  const { products, setProducts, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const filtered = products.filter(p => p.name.includes(search) || p.code.includes(search) || p.category.includes(search));
  const lowStock = products.filter(p => p.stock <= p.minStock);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این کالا اطمینان دارید؟')) {
      setProducts(products.filter(p => p.id !== id));
      showToast('کالا با موفقیت حذف شد');
    }
  };

  const handlePrint = () => {
    let content = '<table><thead><tr><th>کد</th><th>نام کالا</th><th>دسته</th><th class="text-left">قیمت خرید</th><th class="text-left">قیمت فروش</th><th class="text-left">موجودی</th></tr></thead><tbody>';
    filtered.forEach(p => {
      content += `<tr><td>${p.code}</td><td>${p.name}</td><td>${p.category}</td><td class="text-left font-mono">${fmt(p.buyPrice)}</td><td class="text-left font-mono">${fmt(p.sellPrice)}</td><td class="text-left">${p.stock} ${p.unit}</td></tr>`;
    });
    content += '</tbody></table>';
    printReport('لیست کالاها', content);
  };

  const handleExport = () => {
    const data = filtered.map(p => ({
      code: p.code, name: p.name, category: p.category, buyPrice: p.buyPrice, sellPrice: p.sellPrice, stock: p.stock, unit: p.unit,
    }));
    exportToCSV(data, 'products', [
      { key: 'code', label: 'کد' }, { key: 'name', label: 'نام کالا' }, { key: 'category', label: 'دسته' },
      { key: 'buyPrice', label: 'قیمت خرید' }, { key: 'sellPrice', label: 'قیمت فروش' }, { key: 'stock', label: 'موجودی' }, { key: 'unit', label: 'واحد' }
    ]);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><div className="flex items-center gap-2"><Package size={16} className="text-blue-600" /><p className="text-[11px] text-slate-500">تعداد اقلام</p></div><p className="text-xl font-bold text-slate-800 mt-1">{products.length}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">موجودی کل</p><p className="text-xl font-bold text-slate-800 mt-1">{fmt(products.reduce((s, p) => s + p.stock, 0))}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">ارزش انبار</p><p className="text-lg font-bold text-slate-800 mt-1 font-mono">{fmt(products.reduce((s, p) => s + (p.stock * p.buyPrice), 0))}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" /><p className="text-[11px] text-slate-500">کمبود موجودی</p></div><p className="text-xl font-bold text-amber-600 mt-1">{lowStock.length}</p></div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-slide-down">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle size={14} className="text-amber-600" /><h4 className="font-bold text-amber-800 text-xs">هشدار: کالاهای با موجودی بحرانی</h4></div>
          <div className="flex flex-wrap gap-2">{lowStock.map(p => <span key={p.id} className="bg-amber-100 text-amber-700 text-[11px] px-2.5 py-1 rounded-full font-medium">{p.name} ({p.stock} عدد)</span>)}</div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی کالا..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pr-8 py-2 text-xs w-56" /></div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn btn-secondary text-xs"><Download size={14} /> Excel</button>
          <button onClick={handlePrint} className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn btn-primary text-xs"><Plus size={14} /> کالای جدید</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>کد</th><th>نام کالا</th><th>دسته</th><th className="text-left">قیمت خرید</th><th className="text-left">قیمت فروش</th><th className="text-left">موجودی</th><th className="text-center">وضعیت</th><th className="text-center">عملیات</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs text-slate-600">{p.code}</td>
                <td className="text-sm font-medium text-slate-800">{p.name}</td>
                <td className="text-xs text-slate-600">{p.category}</td>
                <td className="text-xs text-slate-700 font-mono text-left">{fmt(p.buyPrice)}</td>
                <td className="text-xs text-emerald-600 font-mono text-left font-bold">{fmt(p.sellPrice)}</td>
                <td className="text-sm font-bold text-slate-800 text-left">{p.stock} <span className="text-[10px] text-slate-400">{p.unit}</span></td>
                <td className="text-center">{p.stock <= p.minStock ? <span className="badge badge-danger">بحرانی</span> : p.stock <= p.minStock * 2 ? <span className="badge badge-warning">کم</span> : <span className="badge badge-success">مناسب</span>}</td>
                <td className="text-center"><div className="flex items-center justify-center gap-0.5"><button onClick={() => { setEditing(p); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button><button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <ProductForm product={editing} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { products, setProducts, showToast } = useStore();
  const [code, setCode] = useState(product?.code || `P-${String(products.length + 1).padStart(3, '0')}`);
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'لوازم جانبی');
  const [unit, setUnit] = useState(product?.unit || 'عدد');
  const [buyPrice, setBuyPrice] = useState(product?.buyPrice || 0);
  const [sellPrice, setSellPrice] = useState(product?.sellPrice || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [minStock, setMinStock] = useState(product?.minStock || 5);

  const handleSubmit = () => {
    if (!name || !code) { showToast('لطفاً نام و کد کالا را وارد کنید', 'error'); return; }
    const newProduct: Product = { id: product?.id || genId(), code, name, category, unit, buyPrice, sellPrice, stock, minStock };
    if (product) {
      setProducts(products.map(p => p.id === product.id ? newProduct : p));
      showToast('کالا با موفقیت ویرایش شد');
    } else {
      setProducts([...products, newProduct]);
      showToast('کالا با موفقیت ایجاد شد');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">{product ? 'ویرایش کالا' : 'کالای جدید'}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد کالا *</label><input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام کالا *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">دسته‌بندی</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="input text-sm"><option>لپ‌تاپ</option><option>مانیتور</option><option>لوازم جانبی</option><option>پرینتر</option></select></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">واحد</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="input text-sm"><option>عدد</option><option>کیلوگرم</option><option>متر</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">قیمت خرید</label><input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">قیمت فروش</label><input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="input text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">موجودی</label><input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حداقل موجودی</label><input type="number" value={minStock} onChange={(e) => setMinStock(Number(e.target.value))} className="input text-sm" /></div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary">ذخیره</button>
        </div>
      </div>
    </div>
  );
}
