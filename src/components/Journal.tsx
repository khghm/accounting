import React, { useState } from 'react';
import { Plus, Search, Eye, Printer, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';
import { journalEntries, accounts } from '../data/mockData';

export default function Journal() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [lines, setLines] = useState<{ accountId: string; accountName: string; debit: number; credit: number; description: string }[]>([
    { accountId: '', accountName: '', debit: 0, credit: 0, description: '' },
    { accountId: '', accountName: '', debit: 0, credit: 0, description: '' },
  ]);

  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  const addLine = () => {
    setLines([...lines, { accountId: '', accountName: '', debit: 0, credit: 0, description: '' }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 2) setLines(lines.filter((_, i) => i !== index));
  };

  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="جستجوی سند..." className="bg-white border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64" />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
            <option>همه وضعیت‌ها</option>
            <option>ثبت شده</option>
            <option>پیش‌نویس</option>
            <option>لغو شده</option>
          </select>
          <input type="text" placeholder="از تاریخ" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-32" />
          <input type="text" placeholder="تا تاریخ" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
            <Printer size={16} />
            چاپ
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} />
            سند جدید
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500">تعداد اسناد</p>
          <p className="text-lg font-bold text-slate-800">{journalEntries.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500">جمع بدهکار</p>
          <p className="text-lg font-bold text-emerald-600">{formatNumber(journalEntries.reduce((s, e) => s + e.lines.reduce((ls, l) => ls + l.debit, 0), 0))}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500">جمع بستانکار</p>
          <p className="text-lg font-bold text-red-600">{formatNumber(journalEntries.reduce((s, e) => s + e.lines.reduce((ls, l) => ls + l.credit, 0), 0))}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500">تراز</p>
          <p className="text-lg font-bold text-blue-600">✓ متوازن</p>
        </div>
      </div>

      {/* Journal Entries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">شماره</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">تاریخ</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">شرح</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">جمع بدهکار</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">جمع بستانکار</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">وضعیت</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.map((entry) => {
              const entryDebit = entry.lines.reduce((s, l) => s + l.debit, 0);
              const entryCredit = entry.lines.reduce((s, l) => s + l.credit, 0);
              return (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">{entry.number}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{entry.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium">{entry.description}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600 font-mono text-left">{formatNumber(entryDebit)}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-mono text-left">{formatNumber(entryCredit)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.status === 'posted' ? 'bg-emerald-100 text-emerald-700' :
                      entry.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.status === 'posted' ? 'ثبت شده' : entry.status === 'draft' ? 'پیش‌نویس' : 'لغو شده'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                        <Printer size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Entry Detail */}
      {selectedEntry && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm">جزئیات سند شماره {journalEntries.find(e => e.id === selectedEntry)?.number}</h4>
            <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-slate-600">
              <XCircle size={18} />
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">کد حساب</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">نام حساب</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">شرح</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">بدهکار</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">بستانکار</th>
              </tr>
            </thead>
            <tbody>
              {journalEntries.find(e => e.id === selectedEntry)?.lines.map((line) => (
                <tr key={line.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-sm font-mono text-slate-600">{line.accountId}</td>
                  <td className="px-4 py-2 text-sm text-slate-800">{line.accountName}</td>
                  <td className="px-4 py-2 text-sm text-slate-500">{line.description}</td>
                  <td className="px-4 py-2 text-sm text-emerald-600 font-mono text-left">{line.debit ? formatNumber(line.debit) : '-'}</td>
                  <td className="px-4 py-2 text-sm text-red-600 font-mono text-left">{line.credit ? formatNumber(line.credit) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">ثبت سند حسابداری جدید</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">تاریخ</label>
                <input type="text" defaultValue="1403/02/15" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">شماره سند</label>
                <input type="text" defaultValue="1007" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">نوع سند</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>سند دستی</option>
                  <option>سند فروش</option>
                  <option>سند خرید</option>
                  <option>سند دریافت</option>
                  <option>سند پرداخت</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-slate-600 block mb-1">شرح سند</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="شرح سند را وارد کنید" />
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">ردیف</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">حساب</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">شرح</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">بدهکار</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">بستانکار</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-sm text-slate-600">{i + 1}</td>
                      <td className="px-3 py-2">
                        <select
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          value={line.accountId}
                          onChange={(e) => {
                            const acc = accounts.find(a => a.id === e.target.value);
                            const newLines = [...lines];
                            newLines[i] = { ...newLines[i], accountId: e.target.value, accountName: acc?.name || '' };
                            setLines(newLines);
                          }}
                        >
                          <option value="">انتخاب حساب...</option>
                          {accounts.filter(a => a.level >= 3).map(a => (
                            <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input type="text" className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="توضیح" />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-left"
                          placeholder="0"
                          value={line.debit || ''}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[i] = { ...newLines[i], debit: Number(e.target.value) };
                            setLines(newLines);
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-left"
                          placeholder="0"
                          value={line.credit || ''}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[i] = { ...newLines[i], credit: Number(e.target.value) };
                            setLines(newLines);
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={() => removeLine(i)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-sm font-bold text-slate-700">جمع کل</td>
                    <td className="px-3 py-2 text-sm font-bold text-emerald-600 text-left">{formatNumber(totalDebit)}</td>
                    <td className="px-3 py-2 text-sm font-bold text-red-600 text-left">{formatNumber(totalCredit)}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-sm font-bold text-slate-700">
                      {totalDebit === totalCredit && totalDebit > 0 ? (
                        <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={14} /> تراز</span>
                      ) : totalDebit > 0 || totalCredit > 0 ? (
                        <span className="text-red-600 flex items-center gap-1"><XCircle size={14} /> عدم تراز (اختلاف: {formatNumber(Math.abs(totalDebit - totalCredit))})</span>
                      ) : null}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button onClick={addLine} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <Plus size={14} />
                افزودن سطر
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">انصراف</button>
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">ثبت سند</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
