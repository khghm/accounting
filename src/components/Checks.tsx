import React, { useState } from 'react';
import { useStore, fmt, genId } from '../store/Store';
import { Check } from '../types';
import { Plus, Search, Edit, Trash2, CreditCard, AlertTriangle, CheckCircle, XCircle, Printer, Download } from 'lucide-react';
import { printReport, exportToCSV } from '../utils/export';

export default function Checks() {
  const { checks, setChecks, showToast } = useStore();
  const [filter, setFilter] = useState<'all' | 'receivable' | 'payable'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Check | null>(null);
  const filtered = checks.filter(c => filter === 'all' || c.type === filter);
  const totalReceivable = checks.filter(c => c.type === 'receivable').reduce((s, c) => s + c.amount, 0);
  const totalPayable = checks.filter(c => c.type === 'payable').reduce((s, c) => s + c.amount, 0);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این چک اطمینان دارید؟')) {
      setChecks(checks.filter(c => c.id !== id));
      showToast('چک با موفقیت حذف شد');
    }
  };

  const handlePrint = () => {
    const statusLabels: Record<string, string> = { pending: 'در انتظار', cleared: 'وصول شده', bounced: 'برگشتی', deposited: 'سپرده شده' };
    let content = '<table><thead><tr><th>شماره چک</th><th>نوع</th><th>بانک</th><th>طرف حساب</th><th>سررسید</th><th class="text-left">مبلغ</th><th>وضعیت</th></tr></thead><tbody>';
    filtered.forEach(c => {
      content += `<tr><td>${c.number}</td><td>${c.type === 'receivable' ? 'دریافتنی' : 'پرداختنی'}</td><td>${c.bank}</td><td>${c.party}</td><td>${c.dueDate}</td><td class="text-left font-mono">${fmt(c.amount)}</td><td>${statusLabels[c.status]}</td></tr>`;
    });
    content += '</tbody></table>';
    printReport('لیست چک‌ها', content);
  };

  const handleExport = () => {
    const statusLabels: Record<string, string> = { pending: 'در انتظار', cleared: 'وصول شده', bounced: 'برگشتی', deposited: 'سپرده شده' };
    const data = filtered.map(c => ({
      number: c.number, type: c.type === 'receivable' ? 'دریافتنی' : 'پرداختنی', bank: c.bank, party: c.party,
      date: c.date, dueDate: c.dueDate, amount: c.amount, status: statusLabels[c.status],
    }));
    exportToCSV(data, 'checks', [
      { key: 'number', label: 'شماره' }, { key: 'type', label: 'نوع' }, { key: 'bank', label: 'بانک' }, { key: 'party', label: 'طرف حساب' },
      { key: 'date', label: 'تاریخ' }, { key: 'dueDate', label: 'سررسید' }, { key: 'amount', label: 'مبلغ' }, { key: 'status', label: 'وضعیت' }
    ]);
  };

  const statusBadge = (s: string) => {
    const m: Record<string, [string, string]> = { pending: ['badge-warning', '⏳ در انتظار'], cleared: ['badge-success', '✓ وصول شده'], bounced: ['badge-danger', '✕ برگشتی'], deposited: ['badge-info', '↗ سپرده شده'] };
    const [c, l] = m[s] || ['badge-slate', s];
    return <span className={`badge ${c}`}>{l}</span>;
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><div className="flex items-center gap-2"><CreditCard size={16} className="text-blue-600" /><p className="text-[11px] text-slate-500">تعداد چک‌ها</p></div><p className="text-xl font-bold text-slate-800 mt-1">{checks.length}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /><p className="text-[11px] text-slate-500">چک‌های دریافتنی</p></div><p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{fmt(totalReceivable)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><XCircle size={16} className="text-red-600" /><p className="text-[11px] text-slate-500">چک‌های پرداختنی</p></div><p className="text-lg font-bold text-red-600 mt-1 font-mono">{fmt(totalPayable)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" /><p className="text-[11px] text-slate-500">چک‌های برگشتی</p></div><p className="text-xl font-bold text-amber-600 mt-1">{checks.filter(c => c.status === 'bounced').length}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجو..." className="input pr-8 py-2 text-xs w-44" /></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['all', 'receivable', 'payable'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'همه' : f === 'receivable' ? 'دریافتنی' : 'پرداختنی'}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn btn-secondary text-xs"><Download size={14} /> Excel</button>
          <button onClick={handlePrint} className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn btn-primary text-xs"><Plus size={14} /> ثبت چک جدید</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>شماره چک</th><th>نوع</th><th>بانک</th><th>طرف حساب</th><th>تاریخ سررسید</th><th className="text-left">مبلغ</th><th className="text-center">وضعیت</th><th className="text-center">عملیات</th></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="font-mono text-xs text-slate-700">{c.number}</td>
                <td><span className={`badge ${c.type === 'receivable' ? 'badge-info' : 'badge-warning'}`}>{c.type === 'receivable' ? 'دریافتنی' : 'پرداختنی'}</span></td>
                <td className="text-xs text-slate-600">{c.bank}</td>
                <td className="text-sm font-medium text-slate-800">{c.party}</td>
                <td className="text-xs text-slate-600">{c.dueDate}</td>
                <td className="text-xs font-bold text-slate-800 font-mono text-left">{fmt(c.amount)}</td>
                <td className="text-center">{statusBadge(c.status)}</td>
                <td className="text-center"><div className="flex items-center justify-center gap-0.5"><button onClick={() => { setEditing(c); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button><button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <CheckForm check={editing} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function CheckForm({ check, onClose }: { check: Check | null; onClose: () => void }) {
  const { checks, setChecks, showToast } = useStore();
  const [number, setNumber] = useState(check?.number || `CH-${String(checks.length + 1).padStart(6, '0')}`);
  const [type, setType] = useState<Check['type']>(check?.type || 'receivable');
  const [bank, setBank] = useState(check?.bank || '');
  const [date, setDate] = useState(check?.date || '۱۴۰۳/۰۲/۱۵');
  const [dueDate, setDueDate] = useState(check?.dueDate || '۱۴۰۳/۰۳/۱۵');
  const [amount, setAmount] = useState(check?.amount || 0);
  const [party, setParty] = useState(check?.party || '');
  const [description, setDescription] = useState(check?.description || '');
  const [status, setStatus] = useState<Check['status']>(check?.status || 'pending');

  const handleSubmit = () => {
    if (!number || !bank || !amount || !party) { showToast('لطفاً تمام فیلدهای ضروری را پر کنید', 'error'); return; }
    const newCheck: Check = { id: check?.id || genId(), number, type, bank, account: '', date, dueDate, amount, status, party, description };
    if (check) {
      setChecks(checks.map(c => c.id === check.id ? newCheck : c));
      showToast('چک با موفقیت ویرایش شد');
    } else {
      setChecks([...checks, newCheck]);
      showToast('چک با موفقیت ثبت شد');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">{check ? 'ویرایش چک' : 'ثبت چک جدید'}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع چک</label><select value={type} onChange={(e) => setType(e.target.value as any)} className="input text-sm"><option value="receivable">دریافتنی</option><option value="payable">پرداختنی</option></select></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شماره چک *</label><input type="text" value={number} onChange={(e) => setNumber(e.target.value)} className="input text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">بانک *</label><input type="text" value={bank} onChange={(e) => setBank(e.target.value)} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">وضعیت</label><select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input text-sm"><option value="pending">در انتظار</option><option value="cleared">وصول شده</option><option value="deposited">سپرده شده</option><option value="bounced">برگشتی</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ صدور</label><input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ سررسید</label><input type="text" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input text-sm" /></div>
          </div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">مبلغ (ریال) *</label><input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input text-sm" /></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">طرف حساب *</label><input type="text" value={party} onChange={(e) => setParty(e.target.value)} className="input text-sm" /></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شرح</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input text-sm" /></div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary">ثبت چک</button>
        </div>
      </div>
    </div>
  );
}
