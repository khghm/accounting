import React, { useState } from 'react';
import { useStore, fmt, genId } from '../store/Store';
import { Invoice, InvoiceItem } from '../types';
import { Plus, Search, Eye, Printer, Trash2, Edit, Download, X } from 'lucide-react';
import { printReport, exportToCSV } from '../utils/export';

export default function Invoices() {
  const { invoices, setInvoices, customers, showToast } = useStore();
  const [filter, setFilter] = useState<'all' | 'sales' | 'purchase'>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter(inv => {
    const matchFilter = filter === 'all' || inv.type === filter;
    const matchSearch = !search || inv.number.includes(search) || inv.customerName.includes(search);
    return matchFilter && matchSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این فاکتور اطمینان دارید؟')) {
      setInvoices(invoices.filter(i => i.id !== id));
      showToast('فاکتور با موفقیت حذف شد');
    }
  };

  const handlePrint = () => {
    let content = '<table><thead><tr><th>شماره</th><th>نوع</th><th>تاریخ</th><th>سررسید</th><th>طرف حساب</th><th class="text-left">مبلغ کل</th><th>وضعیت</th></tr></thead><tbody>';
    filtered.forEach(inv => {
      content += `<tr><td>${inv.number}</td><td>${inv.type === 'sales' ? 'فروش' : 'خرید'}</td><td>${inv.date}</td><td>${inv.dueDate}</td><td>${inv.customerName}</td><td class="text-left font-mono">${fmt(inv.total)}</td><td>${inv.status === 'paid' ? 'پرداخت شده' : inv.status === 'overdue' ? 'معوق' : inv.status === 'sent' ? 'ارسال شده' : 'پیش‌نویس'}</td></tr>`;
    });
    content += '</tbody></table>';
    printReport('لیست فاکتورها', content);
  };

  const handleExport = () => {
    const data = filtered.map(inv => ({
      number: inv.number, type: inv.type === 'sales' ? 'فروش' : 'خرید', date: inv.date, dueDate: inv.dueDate,
      customer: inv.customerName, total: inv.total, status: inv.status === 'paid' ? 'پرداخت شده' : inv.status === 'overdue' ? 'معوق' : inv.status === 'sent' ? 'ارسال شده' : 'پیش‌نویس',
    }));
    exportToCSV(data, 'invoices', [
      { key: 'number', label: 'شماره' }, { key: 'type', label: 'نوع' }, { key: 'date', label: 'تاریخ' }, { key: 'dueDate', label: 'سررسید' },
      { key: 'customer', label: 'طرف حساب' }, { key: 'total', label: 'مبلغ کل' }, { key: 'status', label: 'وضعیت' }
    ]);
  };

  const handleEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setShowModal(true);
  };

  const statusBadge = (s: string) => {
    const m: Record<string, [string, string]> = { paid: ['badge-success', '✓ پرداخت شده'], sent: ['badge-info', '↗ ارسال شده'], overdue: ['badge-danger', '⚠ معوق'], draft: ['badge-slate', 'پیش‌نویس'] };
    const [c, l] = m[s] || ['badge-slate', s];
    return <span className={`badge ${c}`}>{l}</span>;
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
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی فاکتور..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pr-8 py-2 text-xs w-48" /></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['all', 'sales', 'purchase'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'همه' : f === 'sales' ? 'فروش' : 'خرید'}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn btn-secondary text-xs"><Download size={14} /> Excel</button>
          <button onClick={handlePrint} className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
          <button onClick={() => { setEditingInvoice(null); setShowModal(true); }} className="btn btn-primary text-xs"><Plus size={14} /> فاکتور جدید</button>
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
                    <button onClick={() => setViewingInvoice(inv)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={13} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Printer size={13} /></button>
                    <button onClick={() => handleEdit(inv)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit size={13} /></button>
                    <button onClick={() => handleDelete(inv.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingInvoice && (
        <div className="modal-overlay" onClick={() => setViewingInvoice(null)}>
          <div className="modal-content w-full max-w-3xl mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">فاکتور {viewingInvoice.number}</h3>
              <button onClick={() => setViewingInvoice(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
              <div><span className="text-slate-500">تاریخ:</span> <span className="font-medium">{viewingInvoice.date}</span></div>
              <div><span className="text-slate-500">سررسید:</span> <span className="font-medium">{viewingInvoice.dueDate}</span></div>
              <div><span className="text-slate-500">طرف حساب:</span> <span className="font-medium">{viewingInvoice.customerName}</span></div>
              <div><span className="text-slate-500">وضعیت:</span> {statusBadge(viewingInvoice.status)}</div>
            </div>
            <table className="w-full mb-5">
              <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">شرح</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">تعداد</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">فی</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">جمع</th></tr></thead>
              <tbody>
                {viewingInvoice.items.map(item => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-sm">{item.productName}</td>
                    <td className="px-3 py-2 text-xs text-left">{item.quantity}</td>
                    <td className="px-3 py-2 text-xs font-mono text-left">{fmt(item.unitPrice)}</td>
                    <td className="px-3 py-2 text-xs font-mono text-left font-bold">{fmt(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-600">جمع کل:</span><span className="font-mono">{fmt(viewingInvoice.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-600">مالیات (۹٪):</span><span className="font-mono">{fmt(viewingInvoice.tax)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-600">تخفیف:</span><span className="font-mono text-red-600">({fmt(viewingInvoice.discount)})</span></div>
              <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2"><span>مبلغ قابل پرداخت:</span><span className="font-mono text-emerald-600">{fmt(viewingInvoice.total)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && <InvoiceForm invoice={editingInvoice} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function InvoiceForm({ invoice, onClose }: { invoice: Invoice | null; onClose: () => void }) {
  const { invoices, setInvoices, customers, products, showToast } = useStore();
  const [type, setType] = useState<'sales' | 'purchase'>(invoice?.type || 'sales');
  const [date, setDate] = useState(invoice?.date || '۱۴۰۳/۰۲/۱۵');
  const [dueDate, setDueDate] = useState(invoice?.dueDate || '۱۴۰۳/۰۳/۱۵');
  const [customerId, setCustomerId] = useState(invoice?.customerId || '');
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || [{ id: genId(), productName: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const [discount, setDiscount] = useState(invoice?.discount || 0);

  const addItem = () => setItems([...items, { id: genId(), productName: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const removeItem = (id: string) => { if (items.length > 1) setItems(items.filter(i => i.id !== id)); };
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => {
      if (i.id === id) {
        const updated = { ...i, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return i;
    }));
  };

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + tax - discount;

  const handleSubmit = () => {
    if (!customerId) { showToast('لطفاً طرف حساب را انتخاب کنید', 'error'); return; }
    if (items.some(i => !i.productName || i.quantity <= 0 || i.unitPrice <= 0)) {
      showToast('لطفاً تمام فیلدهای اقلام را پر کنید', 'error'); return;
    }

    const customer = customers.find(c => c.id === customerId);
    const newInvoice: Invoice = {
      id: invoice?.id || genId(),
      number: invoice?.number || `INV-${Date.now().toString().slice(-6)}`,
      date, dueDate, type,
      customerId, customerName: customer?.name || '',
      status: 'sent',
      items, subtotal, tax, discount, total,
    };

    if (invoice) {
      setInvoices(invoices.map(i => i.id === invoice.id ? newInvoice : i));
      showToast('فاکتور با موفقیت ویرایش شد');
    } else {
      setInvoices([...invoices, newInvoice]);
      showToast('فاکتور با موفقیت ایجاد شد');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-5xl mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">{invoice ? 'ویرایش فاکتور' : 'فاکتور جدید'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع</label><select value={type} onChange={(e) => setType(e.target.value as any)} className="input text-sm"><option value="sales">فروش</option><option value="purchase">خرید</option></select></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ</label><input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="input text-sm" /></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">سررسید</label><input type="text" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input text-sm" /></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">طرف حساب</label><select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="input text-sm"><option value="">انتخاب...</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
          <table className="w-full">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-600">شرح کالا</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">تعداد</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">فی</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">جمع</th><th className="px-3 py-2.5 text-center text-[11px] font-semibold text-slate-600">حذف</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-3 py-2"><input type="text" value={item.productName} onChange={(e) => updateItem(item.id, 'productName', e.target.value)} className="input text-xs py-1.5" placeholder="نام کالا" list="products" /><datalist id="products">{products.map(p => <option key={p.id} value={p.name} />)}</datalist></td>
                  <td className="px-3 py-2"><input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} className="input text-xs py-1.5 w-16" /></td>
                  <td className="px-3 py-2"><input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))} className="input text-xs py-1.5 w-24" /></td>
                  <td className="px-3 py-2 text-xs font-mono">{fmt(item.total)}</td>
                  <td className="px-3 py-2 text-center"><button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addItem} className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium mb-4"><Plus size={14} /> افزودن قلم</button>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-3 w-full md:w-1/2">
            <div><label className="text-xs text-slate-600 block mb-1">جمع کل</label><input type="text" value={fmt(subtotal)} className="input text-sm bg-slate-50" readOnly /></div>
            <div><label className="text-xs text-slate-600 block mb-1">مالیات (۹٪)</label><input type="text" value={fmt(tax)} className="input text-sm bg-slate-50" readOnly /></div>
            <div><label className="text-xs text-slate-600 block mb-1">تخفیف</label><input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="input text-sm" /></div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 text-center min-w-[180px]">
            <p className="text-xs text-emerald-600 font-medium">مبلغ قابل پرداخت</p>
            <p className="text-xl font-bold text-emerald-700 mt-1 font-mono">{fmt(total)} <span className="text-xs">ریال</span></p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary">ثبت فاکتور</button>
        </div>
      </div>
    </div>
  );
}
