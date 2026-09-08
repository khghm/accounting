import React, { useState } from 'react';
import { useStore, fmt, genId } from '../store/Store';
import { Customer } from '../types';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, User, Building, X, Printer, Download } from 'lucide-react';
import { printReport, exportToCSV } from '../utils/export';

export default function Customers() {
  const { customers, setCustomers, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'customer' | 'supplier' | 'both'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = customers.filter(c => {
    const ms = !search || c.name.includes(search) || c.code.includes(search);
    const mf = filter === 'all' || c.type === filter;
    return ms && mf;
  });

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این طرف حساب اطمینان دارید؟')) {
      setCustomers(customers.filter(c => c.id !== id));
      showToast('طرف حساب با موفقیت حذف شد');
    }
  };

  const handlePrint = () => {
    const typeLabels: Record<string, string> = { customer: 'مشتری', supplier: 'تامین‌کننده', both: 'هر دو' };
    let content = '<table><thead><tr><th>کد</th><th>نام</th><th>نوع</th><th>تلفن</th><th>ایمیل</th><th class="text-left">مانده</th></tr></thead><tbody>';
    filtered.forEach(c => {
      content += `<tr><td>${c.code}</td><td>${c.name}</td><td>${typeLabels[c.type]}</td><td dir="ltr">${c.phone}</td><td>${c.email}</td><td class="text-left font-mono">${fmt(c.balance)}</td></tr>`;
    });
    content += '</tbody></table>';
    printReport('لیست طرف حساب‌ها', content);
  };

  const handleExport = () => {
    const typeLabels: Record<string, string> = { customer: 'مشتری', supplier: 'تامین‌کننده', both: 'هر دو' };
    const data = filtered.map(c => ({
      code: c.code, name: c.name, type: typeLabels[c.type], phone: c.phone, email: c.email, address: c.address, balance: c.balance,
    }));
    exportToCSV(data, 'customers', [
      { key: 'code', label: 'کد' }, { key: 'name', label: 'نام' }, { key: 'type', label: 'نوع' },
      { key: 'phone', label: 'تلفن' }, { key: 'email', label: 'ایمیل' }, { key: 'address', label: 'آدرس' }, { key: 'balance', label: 'مانده' }
    ]);
  };

  const typeBadge = (t: string) => { const m: Record<string, [string, string]> = { customer: ['badge-info', 'مشتری'], supplier: ['badge-warning', 'تامین‌کننده'], both: ['badge-purple', 'هر دو'] }; const [c, l] = m[t] || ['badge-slate', t]; return <span className={`badge ${c}`}>{l}</span>; };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">کل طرف حساب‌ها</p><p className="text-xl font-bold text-slate-800 mt-1">{customers.length}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">جمع مطالبات</p><p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{fmt(customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0))}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">جمع بدهی‌ها</p><p className="text-lg font-bold text-red-600 mt-1 font-mono">{fmt(customers.filter(c => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0))}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">مانده خالص</p><p className="text-lg font-bold text-blue-600 mt-1 font-mono">{fmt(customers.reduce((s, c) => s + c.balance, 0))}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pr-8 py-2 text-xs w-48" /></div>
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
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn btn-secondary text-xs"><Download size={14} /> Excel</button>
          <button onClick={handlePrint} className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn btn-primary text-xs"><Plus size={14} /> طرف حساب جدید</button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                    {c.type === 'supplier' ? <Building size={18} className="text-emerald-700" /> : <User size={18} className="text-emerald-700" />}
                  </div>
                  <div><h4 className="font-bold text-slate-800 text-sm">{c.name}</h4><p className="text-[11px] text-slate-500 font-mono">{c.code}</p></div>
                </div>
                {typeBadge(c.type)}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600"><Phone size={12} className="text-slate-400" /><span dir="ltr">{c.phone}</span></div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><Mail size={12} className="text-slate-400" /><span>{c.email}</span></div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><MapPin size={12} className="text-slate-400" /><span className="truncate">{c.address}</span></div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div><p className="text-[11px] text-slate-500">مانده حساب</p><p className={`text-sm font-bold font-mono ${c.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{c.balance >= 0 ? 'بدهکار' : 'بستانکار'}: {fmt(c.balance)}</p></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(c); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
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
                  <td className="text-center"><div className="flex items-center justify-center gap-0.5"><button onClick={() => { setEditing(c); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button><button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <CustomerForm customer={editing} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function CustomerForm({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  const { customers, setCustomers, showToast } = useStore();
  const [name, setName] = useState(customer?.name || '');
  const [code, setCode] = useState(customer?.code || `C-${String(customers.length + 1).padStart(3, '0')}`);
  const [type, setType] = useState<Customer['type']>(customer?.type || 'customer');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [creditLimit, setCreditLimit] = useState(customer?.creditLimit || 0);

  const handleSubmit = () => {
    if (!name || !code) { showToast('لطفاً نام و کد را وارد کنید', 'error'); return; }
    const newCustomer: Customer = {
      id: customer?.id || genId(), name, code, type, phone, email, address,
      balance: customer?.balance || 0, creditLimit,
    };
    if (customer) {
      setCustomers(customers.map(c => c.id === customer.id ? newCustomer : c));
      showToast('طرف حساب با موفقیت ویرایش شد');
    } else {
      setCustomers([...customers, newCustomer]);
      showToast('طرف حساب با موفقیت ایجاد شد');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">{customer ? 'ویرایش طرف حساب' : 'طرف حساب جدید'}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input text-sm" placeholder="نام طرف حساب" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد *</label><input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="input text-sm" placeholder="کد" /></div>
          </div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع</label><select value={type} onChange={(e) => setType(e.target.value as any)} className="input text-sm"><option value="customer">مشتری</option><option value="supplier">تامین‌کننده</option><option value="both">هر دو</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تلفن</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input text-sm" placeholder="شماره تلفن" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">ایمیل</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input text-sm" placeholder="ایمیل" /></div>
          </div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">آدرس</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input text-sm" placeholder="آدرس" /></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حد اعتبار (ریال)</label><input type="number" value={creditLimit} onChange={(e) => setCreditLimit(Number(e.target.value))} className="input text-sm" placeholder="۰" /></div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary">ذخیره</button>
        </div>
      </div>
    </div>
  );
}
