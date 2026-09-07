import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, Plus, Search, Edit, Trash2, FolderOpen, FileText, Filter, Download, Printer, ChevronRight } from 'lucide-react';
import { accounts } from '../data/mockData';

export default function Accounts() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['1', '2', '3', '4', '5', '9', '12', '13', '17', '18', '21', '24']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('');

  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);
  const toggleGroup = (id: string) => setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  const getChildren = (parentId: string) => accounts.filter(a => a.parentId === parentId);
  const getRootAccounts = () => accounts.filter(a => a.level === 1);

  const typeLabels: Record<string, string> = { asset: 'دارایی', liability: 'بدهی', equity: 'حقوق صاحبان سهام', revenue: 'درآمد', expense: 'هزینه' };
  const typeColors: Record<string, string> = { asset: 'badge-info', liability: 'badge-danger', equity: 'badge-purple', revenue: 'badge-success', expense: 'badge-warning' };

  const filteredAccounts = accounts.filter(a => {
    const matchSearch = !searchTerm || a.name.includes(searchTerm) || a.code.includes(searchTerm);
    const matchType = !filterType || a.type === filterType;
    return matchSearch && matchType;
  });

  const renderAccountRow = (account: typeof accounts[0], depth: number = 0) => {
    const children = getChildren(account.id);
    const isExpanded = expandedGroups.includes(account.id);
    const hasChildren = children.length > 0;
    return (
      <React.Fragment key={account.id}>
        <tr className={`hover:bg-slate-50/80 transition-colors ${depth === 0 ? 'bg-slate-50/40' : ''}`}>
          <td className="px-4 py-2.5 text-xs text-slate-600" style={{ paddingRight: `${depth * 20 + 16}px` }}>
            <div className="flex items-center gap-1.5">
              {hasChildren && (
                <button onClick={() => toggleGroup(account.id)} className="text-slate-400 hover:text-slate-600 p-0.5">
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronLeft size={13} />}
                </button>
              )}
              {hasChildren ? <FolderOpen size={13} className="text-amber-500" /> : <FileText size={13} className="text-slate-400" />}
              <span className="font-mono text-[11px] text-slate-500">{account.code}</span>
            </div>
          </td>
          <td className="px-4 py-2.5 text-sm font-medium text-slate-800">{account.name}</td>
          <td className="px-4 py-2.5"><span className={`badge ${typeColors[account.type]}`}>{typeLabels[account.type]}</span></td>
          <td className="px-4 py-2.5 text-xs text-emerald-600 font-mono text-left">{account.debitBalance ? fmt(account.debitBalance) : '—'}</td>
          <td className="px-4 py-2.5 text-xs text-red-600 font-mono text-left">{account.creditBalance ? fmt(account.creditBalance) : '—'}</td>
          <td className="px-4 py-2.5 text-xs font-bold text-slate-800 font-mono text-left">{fmt(account.balance)}</td>
          <td className="px-4 py-2.5">
            <div className="flex items-center gap-0.5 justify-center">
              <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={13} /></button>
              <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
            </div>
          </td>
        </tr>
        {isExpanded && children.map(child => renderAccountRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  const totalAssets = accounts.filter(a => a.type === 'asset' && a.level === 1).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'liability' && a.level === 1).reduce((s, a) => s + a.balance, 0);
  const totalEquity = accounts.filter(a => a.type === 'equity' && a.level === 1).reduce((s, a) => s + a.balance, 0);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 stagger-children">
        {[
          { label: 'جمع دارایی‌ها', value: totalAssets, color: 'text-blue-700 bg-blue-50 border-blue-100' },
          { label: 'جمع بدهی‌ها', value: totalLiabilities, color: 'text-red-700 bg-red-50 border-red-100' },
          { label: 'حقوق صاحبان سهام', value: totalEquity, color: 'text-purple-700 bg-purple-50 border-purple-100' },
          { label: 'جمع درآمدها', value: accounts.filter(a => a.type === 'revenue' && a.level === 1).reduce((s, a) => s + a.balance, 0), color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
          { label: 'جمع هزینه‌ها', value: accounts.filter(a => a.type === 'expense' && a.level === 1).reduce((s, a) => s + a.balance, 0), color: 'text-amber-700 bg-amber-50 border-amber-100' },
        ].map((item, i) => (
          <div key={i} className={`rounded-xl p-3 border ${item.color}`}>
            <p className="text-[11px] font-medium opacity-80">{item.label}</p>
            <p className="text-sm font-bold mt-1 font-mono">{fmt(item.value)}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="جستجوی حساب..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pr-8 py-2 text-xs w-48" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input py-2 text-xs w-36">
            <option value="">همه انواع</option>
            <option value="asset">دارایی</option>
            <option value="liability">بدهی</option>
            <option value="equity">حقوق صاحبان سهام</option>
            <option value="revenue">درآمد</option>
            <option value="expense">هزینه</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
          <button className="btn btn-secondary text-xs"><Download size={14} /> اکسل</button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> حساب جدید</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="text-right">کد حساب</th>
              <th className="text-right">نام حساب</th>
              <th className="text-right">نوع</th>
              <th className="text-left">بدهکار</th>
              <th className="text-left">بستانکار</th>
              <th className="text-left">مانده</th>
              <th className="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {getRootAccounts().map(account => renderAccountRow(account))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">ایجاد حساب جدید</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد حساب</label><input type="text" className="input text-sm" placeholder="مثال: ۱۱۱۴" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام حساب</label><input type="text" className="input text-sm" placeholder="نام حساب" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع حساب</label>
                  <select className="input text-sm"><option>دارایی</option><option>بدهی</option><option>حقوق صاحبان سهام</option><option>درآمد</option><option>هزینه</option></select>
                </div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">سطح</label>
                  <select className="input text-sm"><option>کل (سطح ۱)</option><option>گروه (سطح ۲)</option><option>کل (سطح ۳)</option><option>معین (سطح ۴)</option></select>
                </div>
              </div>
              <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حساب والد</label>
                <select className="input text-sm"><option>بدون والد (حساب کل)</option>{accounts.filter(a => a.level < 4).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">انصراف</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary">ذخیره حساب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
