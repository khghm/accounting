import React, { useState } from 'react';
import { useStore, fmt, genId } from '../store/Store';
import { Account } from '../types';
import { ChevronDown, ChevronLeft, Plus, Search, Edit, Trash2, FolderOpen, FileText, X, Printer, Download } from 'lucide-react';
import { printReport, exportToCSV } from '../utils/export';

export default function Accounts() {
  const { accounts, setAccounts, showToast } = useStore();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);

  const toggleGroup = (id: string) => setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  const getChildren = (parentId: string) => accounts.filter(a => a.parentId === parentId);
  const getRootAccounts = () => accounts.filter(a => a.level === 1);

  const getTypeLabel = (type: string) => ({ asset: 'دارایی', liability: 'بدهی', equity: 'حقوق صاحبان سهام', revenue: 'درآمد', expense: 'هزینه' }[type] || type);
  const getTypeColor = (type: string) => ({ asset: 'bg-blue-100 text-blue-700', liability: 'bg-red-100 text-red-700', equity: 'bg-purple-100 text-purple-700', revenue: 'bg-emerald-100 text-emerald-700', expense: 'bg-amber-100 text-amber-700' }[type] || 'bg-slate-100 text-slate-700');

  const handleDelete = (id: string) => {
    const hasChildren = accounts.some(a => a.parentId === id);
    if (hasChildren) { showToast('این حساب دارای زیرمجموعه است و قابل حذف نیست', 'error'); return; }
    if (confirm('آیا از حذف این حساب اطمینان دارید؟')) {
      setAccounts(accounts.filter(a => a.id !== id));
      showToast('حساب با موفقیت حذف شد');
    }
  };

  const handlePrint = () => {
    const typeLabels: Record<string, string> = { asset: 'دارایی', liability: 'بدهی', equity: 'حقوق صاحبان سهام', revenue: 'درآمد', expense: 'هزینه' };
    let content = '<table><thead><tr><th>کد</th><th>نام حساب</th><th>نوع</th><th class="text-left">بدهکار</th><th class="text-left">بستانکار</th><th class="text-left">مانده</th></tr></thead><tbody>';
    accounts.filter(a => a.level >= 3).forEach(a => {
      content += `<tr><td>${a.code}</td><td>${a.name}</td><td>${typeLabels[a.type]}</td><td class="text-left font-mono">${a.debitBalance ? fmt(a.debitBalance) : '—'}</td><td class="text-left font-mono">${a.creditBalance ? fmt(a.creditBalance) : '—'}</td><td class="text-left font-mono">${fmt(a.balance)}</td></tr>`;
    });
    content += '</tbody></table>';
    printReport('کدینگ حساب‌ها', content);
  };

  const handleExport = () => {
    const typeLabels: Record<string, string> = { asset: 'دارایی', liability: 'بدهی', equity: 'حقوق صاحبان سهام', revenue: 'درآمد', expense: 'هزینه' };
    const data = accounts.filter(a => a.level >= 3).map(a => ({
      code: a.code, name: a.name, type: typeLabels[a.type], debit: a.debitBalance, credit: a.creditBalance, balance: a.balance,
    }));
    exportToCSV(data, 'accounts', [
      { key: 'code', label: 'کد' }, { key: 'name', label: 'نام حساب' }, { key: 'type', label: 'نوع' },
      { key: 'debit', label: 'بدهکار' }, { key: 'credit', label: 'بستانکار' }, { key: 'balance', label: 'مانده' }
    ]);
  };

  const renderAccountRow = (account: Account, depth: number = 0) => {
    const children = getChildren(account.id);
    const isExpanded = expandedGroups.includes(account.id);
    const hasChildren = children.length > 0;
    return (
      <React.Fragment key={account.id}>
        <tr className={`hover:bg-slate-50 transition-colors ${depth > 0 ? 'bg-slate-25' : ''}`}>
          <td className="px-4 py-3 text-sm text-slate-600 font-mono" style={{ paddingRight: `${depth * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren && <button onClick={() => toggleGroup(account.id)} className="text-slate-400 hover:text-slate-600">{isExpanded ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}</button>}
              {hasChildren ? <FolderOpen size={14} className="text-amber-500" /> : <FileText size={14} className="text-slate-400" />}
              <span className="font-mono text-xs">{account.code}</span>
            </div>
          </td>
          <td className="px-4 py-3 text-sm font-medium text-slate-800">{account.name}</td>
          <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(account.type)}`}>{getTypeLabel(account.type)}</span></td>
          <td className="px-4 py-3 text-sm text-emerald-600 font-mono text-left">{account.debitBalance ? fmt(account.debitBalance) : '—'}</td>
          <td className="px-4 py-3 text-sm text-red-600 font-mono text-left">{account.creditBalance ? fmt(account.creditBalance) : '—'}</td>
          <td className="px-4 py-3 text-sm font-bold text-slate-800 font-mono text-left">{fmt(account.balance)}</td>
          <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => { setEditing(account); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit size={14} /></button><button onClick={() => handleDelete(account.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button></div></td>
        </tr>
        {isExpanded && children.map(child => renderAccountRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی حساب..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pr-9 py-2 text-sm w-64" /></div>
          <select className="input py-2 text-sm w-40"><option>همه انواع</option><option>دارایی</option><option>بدهی</option><option>حقوق صاحبان سهام</option><option>درآمد</option><option>هزینه</option></select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn btn-secondary text-xs"><Download size={14} /> Excel</button>
          <button onClick={handlePrint} className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn btn-primary text-sm"><Plus size={16} /> حساب جدید</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {['asset', 'liability', 'equity', 'revenue', 'expense'].map(type => {
          const total = accounts.filter(a => a.type === type && a.level === 1).reduce((sum, a) => sum + a.balance, 0);
          return (<div key={type} className="card-static p-3"><p className="text-xs text-slate-500">{getTypeLabel(type)}</p><p className="text-sm font-bold text-slate-800 mt-1 font-mono">{fmt(total)}</p></div>);
        })}
      </div>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr><th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کد حساب</th><th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نام حساب</th><th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نوع</th><th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">بدهکار</th><th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">بستانکار</th><th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">مانده</th><th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th></tr>
            </thead>
            <tbody>{getRootAccounts().map(account => renderAccountRow(account))}</tbody>
          </table>
        </div>
      </div>

      {showModal && <AccountForm account={editing} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function AccountForm({ account, onClose }: { account: Account | null; onClose: () => void }) {
  const { accounts, setAccounts, showToast } = useStore();
  const [code, setCode] = useState(account?.code || '');
  const [name, setName] = useState(account?.name || '');
  const [type, setType] = useState<Account['type']>(account?.type || 'asset');
  const [parentId, setParentId] = useState(account?.parentId || '');
  const [level, setLevel] = useState(account?.level || (parentId ? accounts.find(a => a.id === parentId)?.level! + 1 || 2 : 1));

  const handleSubmit = () => {
    if (!code || !name) { showToast('لطفاً کد و نام حساب را وارد کنید', 'error'); return; }
    if (accounts.some(a => a.code === code && a.id !== account?.id)) { showToast('کد حساب تکراری است', 'error'); return; }
    const parent = parentId ? accounts.find(a => a.id === parentId) : null;
    const newAccount: Account = {
      id: account?.id || genId(), code, name, type, level: parent ? parent.level + 1 : 1,
      parentId: parentId || undefined, balance: account?.balance || 0,
      debitBalance: account?.debitBalance || 0, creditBalance: account?.creditBalance || 0,
    };
    if (account) {
      setAccounts(accounts.map(a => a.id === account.id ? newAccount : a));
      showToast('حساب با موفقیت ویرایش شد');
    } else {
      setAccounts([...accounts, newAccount]);
      showToast('حساب با موفقیت ایجاد شد');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">{account ? 'ویرایش حساب' : 'ایجاد حساب جدید'}</h3>
        <div className="space-y-4">
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد حساب *</label><input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="input text-sm" placeholder="مثال: 1114" /></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام حساب *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input text-sm" placeholder="نام حساب را وارد کنید" /></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نوع حساب</label><select value={type} onChange={(e) => setType(e.target.value as any)} className="input text-sm"><option value="asset">دارایی</option><option value="liability">بدهی</option><option value="equity">حقوق صاحبان سهام</option><option value="revenue">درآمد</option><option value="expense">هزینه</option></select></div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حساب والد</label><select value={parentId} onChange={(e) => setParentId(e.target.value)} className="input text-sm"><option value="">بدون والد (حساب کل)</option>{accounts.filter(a => a.level < 4).map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select></div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary">ذخیره</button>
        </div>
      </div>
    </div>
  );
}
