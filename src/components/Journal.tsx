import React, { useState } from 'react';
import { Plus, Search, Eye, Printer, Trash2, CheckCircle, XCircle, FileText, Filter } from 'lucide-react';
import { journalEntries, accounts } from '../data/mockData';

export default function Journal() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [lines, setLines] = useState<{ accountId: string; accountName: string; debit: number; credit: number }[]>([
    { accountId: '', accountName: '', debit: 0, credit: 0 },
    { accountId: '', accountName: '', debit: 0, credit: 0 },
  ]);
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);
  const addLine = () => setLines([...lines, { accountId: '', accountName: '', debit: 0, credit: 0 }]);
  const removeLine = (i: number) => { if (lines.length > 2) setLines(lines.filter((_, idx) => idx !== i)); };
  const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">تعداد اسناد</p><p className="text-xl font-bold text-slate-800 mt-1">{journalEntries.length}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">جمع بدهکار</p><p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{fmt(journalEntries.reduce((s, e) => s + e.lines.reduce((ls, l) => ls + l.debit, 0), 0))}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">جمع بستانکار</p><p className="text-lg font-bold text-red-600 mt-1 font-mono">{fmt(journalEntries.reduce((s, e) => s + e.lines.reduce((ls, l) => ls + l.credit, 0), 0))}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">وضعیت تراز</p><p className="text-lg font-bold text-blue-600 mt-1 flex items-center gap-1.5"><CheckCircle size={18} /> متوازن ✓</p></div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی سند..." className="input pr-8 py-2 text-xs w-48" /></div>
          <select className="input py-2 text-xs w-32"><option>همه وضعیت‌ها</option><option>ثبت شده</option><option>پیش‌نویس</option></select>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> سند جدید</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>شماره</th><th>تاریخ</th><th>شرح</th><th className="text-left">بدهکار</th><th className="text-left">بستانکار</th><th className="text-center">وضعیت</th><th className="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.map((entry) => {
              const d = entry.lines.reduce((s, l) => s + l.debit, 0);
              const c = entry.lines.reduce((s, l) => s + l.credit, 0);
              return (
                <tr key={entry.id} className={selectedEntry === entry.id ? 'bg-emerald-50/50' : ''}>
                  <td className="font-mono text-xs text-slate-700">{entry.number}</td>
                  <td className="text-xs text-slate-600">{entry.date}</td>
                  <td className="text-sm font-medium text-slate-800">{entry.description}</td>
                  <td className="text-xs text-emerald-600 font-mono text-left">{fmt(d)}</td>
                  <td className="text-xs text-red-600 font-mono text-left">{fmt(c)}</td>
                  <td className="text-center"><span className={`badge ${entry.status === 'posted' ? 'badge-success' : entry.status === 'draft' ? 'badge-warning' : 'badge-danger'}`}>{entry.status === 'posted' ? '✓ ثبت شده' : entry.status === 'draft' ? '◌ پیش‌نویس' : '✕ لغو'}</span></td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <button onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={13} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Printer size={13} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail */}
      {selectedEntry && (
        <div className="card-static overflow-hidden animate-slide-down">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm">جزئیات سند #{journalEntries.find(e => e.id === selectedEntry)?.number}</h4>
            <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={18} /></button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/50"><tr><th className="px-4 py-2 text-right text-[11px] font-semibold text-slate-500">کد</th><th className="px-4 py-2 text-right text-[11px] font-semibold text-slate-500">نام حساب</th><th className="px-4 py-2 text-right text-[11px] font-semibold text-slate-500">شرح</th><th className="px-4 py-2 text-left text-[11px] font-semibold text-slate-500">بدهکار</th><th className="px-4 py-2 text-left text-[11px] font-semibold text-slate-500">بستانکار</th></tr></thead>
            <tbody>
              {journalEntries.find(e => e.id === selectedEntry)?.lines.map((line) => (
                <tr key={line.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-xs font-mono text-slate-600">{line.accountId}</td>
                  <td className="px-4 py-2 text-xs text-slate-800">{line.accountName}</td>
                  <td className="px-4 py-2 text-xs text-slate-500">{line.description}</td>
                  <td className="px-4 py-2 text-xs text-emerald-600 font-mono text-left">{line.debit ? fmt(line.debit) : '—'}</td>
                  <td className="px-4 py-2 text-xs text-red-600 font-mono text-left">{line.credit ? fmt(line.credit) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Entry Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-5xl mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">ثبت سند حسابداری جدید</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تاریخ</label><input type="text" defaultValue="۱۴۰۳/۰۲/۱۵" className="input text-sm" /></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شماره سند</label><input type="text" defaultValue="۱۰۰۸" className="input text-sm" /></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع سند</label><select className="input text-sm"><option>سند دستی</option><option>سند فروش</option><option>سند خرید</option><option>سند دریافت</option><option>سند پرداخت</option></select></div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">پیوست</label><input type="file" className="input text-sm" /></div>
            </div>
            <div className="mb-4"><label className="text-xs text-slate-600 block mb-1.5 font-medium">شرح سند</label><input type="text" className="input text-sm" placeholder="شرح سند را وارد کنید" /></div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-600">ردیف</th><th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-600">حساب</th><th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-600">شرح</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">بدهکار</th><th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-600">بستانکار</th><th className="px-3 py-2.5 text-center text-[11px] font-semibold text-slate-600">حذف</th></tr></thead>
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-xs text-slate-600">{i + 1}</td>
                      <td className="px-3 py-2"><select className="input text-xs py-1.5" value={line.accountId} onChange={(e) => { const acc = accounts.find(a => a.id === e.target.value); const nl = [...lines]; nl[i] = { ...nl[i], accountId: e.target.value, accountName: acc?.name || '' }; setLines(nl); }}><option value="">انتخاب حساب...</option>{accounts.filter(a => a.level >= 3).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select></td>
                      <td className="px-3 py-2"><input type="text" className="input text-xs py-1.5" placeholder="توضیح" /></td>
                      <td className="px-3 py-2"><input type="number" className="input text-xs py-1.5 text-left" placeholder="۰" value={line.debit || ''} onChange={(e) => { const nl = [...lines]; nl[i] = { ...nl[i], debit: Number(e.target.value) }; setLines(nl); }} /></td>
                      <td className="px-3 py-2"><input type="number" className="input text-xs py-1.5 text-left" placeholder="۰" value={line.credit || ''} onChange={(e) => { const nl = [...lines]; nl[i] = { ...nl[i], credit: Number(e.target.value) }; setLines(nl); }} /></td>
                      <td className="px-3 py-2 text-center"><button onClick={() => removeLine(i)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr><td colSpan={3} className="px-3 py-2.5 text-xs font-bold text-slate-700">جمع کل</td><td className="px-3 py-2.5 text-xs font-bold text-emerald-600 text-left font-mono">{fmt(totalDebit)}</td><td className="px-3 py-2.5 text-xs font-bold text-red-600 text-left font-mono">{fmt(totalCredit)}</td><td></td></tr>
                  <tr><td colSpan={6} className="px-3 py-2 text-xs">{totalDebit === totalCredit && totalDebit > 0 ? <span className="text-emerald-600 flex items-center gap-1 font-bold"><CheckCircle size={14} /> سند تراز است</span> : totalDebit > 0 || totalCredit > 0 ? <span className="text-red-600 flex items-center gap-1 font-bold"><XCircle size={14} /> عدم تراز (اختلاف: {fmt(Math.abs(totalDebit - totalCredit))})</span> : null}</td></tr>
                </tfoot>
              </table>
            </div>
            <div className="flex items-center justify-between mt-5">
              <button onClick={addLine} className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"><Plus size={14} /> افزودن سطر</button>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">انصراف</button>
                <button onClick={() => setShowModal(false)} className="btn btn-primary">ثبت سند</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
