import React, { useState } from 'react';
import { useStore, fmt, genId } from '../store/Store';
import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Plus, Search, X } from 'lucide-react';

export default function Treasury() {
  const { transactions, setTransactions, showToast } = useStore();
  const [filter, setFilter] = useState<'all' | 'receipt' | 'payment' | 'transfer'>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const filtered = transactions.filter(t => {
    const mf = filter === 'all' || t.type === filter;
    const ms = !search || t.description.includes(search) || t.reference.includes(search);
    return mf && ms;
  });
  const totalReceipts = transactions.filter(t => t.type === 'receipt').reduce((s, t) => s + t.amount, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0);
  const totalTransfers = transactions.filter(t => t.type === 'transfer').reduce((s, t) => s + t.amount, 0);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این تراکنش اطمینان دارید؟')) {
      setTransactions(transactions.filter(t => t.id !== id));
      showToast('تراکنش با موفقیت حذف شد');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="gradient-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"><div className="flex items-center gap-2 mb-2"><ArrowDownLeft size={16} /><span className="text-white/80 text-xs">جمع دریافت‌ها</span></div><p className="text-xl font-bold font-mono">{fmt(totalReceipts)}</p></div>
        <div className="gradient-card bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20"><div className="flex items-center gap-2 mb-2"><ArrowUpRight size={16} /><span className="text-white/80 text-xs">جمع پرداخت‌ها</span></div><p className="text-xl font-bold font-mono">{fmt(totalPayments)}</p></div>
        <div className="gradient-card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"><div className="flex items-center gap-2 mb-2"><ArrowLeftRight size={16} /><span className="text-white/80 text-xs">انتقالات</span></div><p className="text-xl font-bold font-mono">{fmt(totalTransfers)}</p></div>
        <div className="gradient-card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"><div className="flex items-center gap-2 mb-2"><span>💰</span><span className="text-white/80 text-xs">موجودی کل</span></div><p className="text-xl font-bold font-mono">{fmt(totalReceipts - totalPayments)}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pr-8 py-2 text-xs w-44" /></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['all', 'receipt', 'payment', 'transfer'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-2 text-[11px] font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'همه' : f === 'receipt' ? 'دریافت' : f === 'payment' ? 'پرداخت' : 'انتقال'}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> عملیات جدید</button>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>نوع</th><th>تاریخ</th><th>شرح</th><th>از حساب</th><th>به حساب</th><th className="text-left">مبلغ</th><th className="text-center">عملیات</th></tr></thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td><div className="flex items-center gap-2">{t.type === 'receipt' ? <ArrowDownLeft size={14} className="text-emerald-600" /> : t.type === 'payment' ? <ArrowUpRight size={14} className="text-red-600" /> : <ArrowLeftRight size={14} className="text-blue-600" />}<span className="text-xs text-slate-700">{t.type === 'receipt' ? 'دریافت' : t.type === 'payment' ? 'پرداخت' : 'انتقال'}</span></div></td>
                <td className="text-xs text-slate-600">{t.date}</td>
                <td className="text-sm text-slate-800">{t.description}</td>
                <td className="text-xs text-slate-600">{t.fromAccount}</td>
                <td className="text-xs text-slate-600">{t.toAccount}</td>
                <td className="text-xs font-bold text-slate-800 font-mono text-left">{fmt(t.amount)}</td>
                <td className="text-center"><button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <TransactionForm onClose={() => setShowModal(false)} />}
    </div>
  );
}

function TransactionForm({ onClose }: { onClose: () => void }) {
  const { transactions, setTransactions, showToast } = useStore();
  const [type, setType] = useState<'receipt' | 'payment' | 'transfer'>('receipt');
  const [date, setDate] = useState('۱۴۰۳/۰۲/۱۵');
  const [amount, setAmount] = useState(0);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!amount || !fromAccount || !toAccount || !description) {
      showToast('لطفاً تمام فیلدها را پر کنید', 'error'); return;
    }
    const newTransaction: Transaction = {
      id: genId(), date, type, amount, fromAccount, toAccount, description,
      reference: `${type === 'receipt' ? 'RC' : type === 'payment' ? 'PC' : 'TR'}-${Date.now().toString().slice(-6)}`,
    };
    setTransactions([newTransaction, ...transactions]);
    showToast('تراکنش با موفقیت ثبت شد');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">عملیات خزانه‌داری جدید</h3>
        <div className="space-y-4">
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع عملیات</label><select value={type} onChange={(e) => setType(e.target.value as any)} className="input text-sm"><option value="receipt">دریافت</option><option value="payment">پرداخت</option><option value="transfer">انتقال بین حساب‌ها</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ</label><input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">مبلغ (ریال) *</label><input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">از حساب *</label><input type="text" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="input text-sm" placeholder="مثال: بانک ملت" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">به حساب *</label><input type="text" value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="input text-sm" placeholder="مثال: صندوق" /></div>
          </div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شرح *</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input text-sm" placeholder="توضیحات" /></div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary">ثبت</button>
        </div>
      </div>
    </div>
  );
}
