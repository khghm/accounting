import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, Plus, Search, Edit, Trash2, FolderOpen, FileText } from 'lucide-react';
import { accounts } from '../data/mockData';

export default function Accounts() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const getChildren = (parentId: string) => accounts.filter(a => a.parentId === parentId);
  const getRootAccounts = () => accounts.filter(a => a.level === 1);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      asset: 'دارایی', liability: 'بدهی', equity: 'حقوق صاحبان سهام', revenue: 'درآمد', expense: 'هزینه'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      asset: 'bg-blue-100 text-blue-700',
      liability: 'bg-red-100 text-red-700',
      equity: 'bg-purple-100 text-purple-700',
      revenue: 'bg-emerald-100 text-emerald-700',
      expense: 'bg-amber-100 text-amber-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };

  const filteredAccounts = accounts.filter(a =>
    a.name.includes(searchTerm) || a.code.includes(searchTerm)
  );

  const renderAccountRow = (account: typeof accounts[0], depth: number = 0) => {
    const children = getChildren(account.id);
    const isExpanded = expandedGroups.includes(account.id);
    const hasChildren = children.length > 0;

    return (
      <React.Fragment key={account.id}>
        <tr className={`hover:bg-slate-50 transition-colors ${depth > 0 ? 'bg-slate-25' : ''}`}>
          <td className="px-4 py-3 text-sm text-slate-600 font-mono" style={{ paddingRight: `${depth * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button onClick={() => toggleGroup(account.id)} className="text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}
                </button>
              )}
              {hasChildren ? <FolderOpen size={14} className="text-amber-500" /> : <FileText size={14} className="text-slate-400" />}
              <span className="font-mono text-xs">{account.code}</span>
            </div>
          </td>
          <td className="px-4 py-3 text-sm font-medium text-slate-800">{account.name}</td>
          <td className="px-4 py-3">
            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(account.type)}`}>
              {getTypeLabel(account.type)}
            </span>
          </td>
          <td className="px-4 py-3 text-sm text-emerald-600 font-mono text-left">{account.debitBalance ? formatNumber(account.debitBalance) : '-'}</td>
          <td className="px-4 py-3 text-sm text-red-600 font-mono text-left">{account.creditBalance ? formatNumber(account.creditBalance) : '-'}</td>
          <td className="px-4 py-3 text-sm font-bold text-slate-800 font-mono text-left">{formatNumber(account.balance)}</td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                <Edit size={14} />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && children.map(child => renderAccountRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی حساب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
            />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
            <option>همه انواع</option>
            <option>دارایی</option>
            <option>بدهی</option>
            <option>حقوق صاحبان سهام</option>
            <option>درآمد</option>
            <option>هزینه</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} />
          حساب جدید
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        {['asset', 'liability', 'equity', 'revenue', 'expense'].map(type => {
          const typeAccounts = accounts.filter(a => a.type === type && a.level === 1);
          const total = typeAccounts.reduce((sum, a) => sum + a.balance, 0);
          return (
            <div key={type} className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-500">{getTypeLabel(type)}</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{formatNumber(total)}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کد حساب</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نام حساب</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نوع</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">بدهکار</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">بستانکار</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">مانده</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {getRootAccounts().map(account => renderAccountRow(account))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">ایجاد حساب جدید</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">کد حساب</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="مثال: 1114" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">نام حساب</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="نام حساب را وارد کنید" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">نوع حساب</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>دارایی</option>
                  <option>بدهی</option>
                  <option>حقوق صاحبان سهام</option>
                  <option>درآمد</option>
                  <option>هزینه</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">حساب والد</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>بدون والد (حساب کل)</option>
                  {accounts.filter(a => a.level < 4).map(a => (
                    <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">انصراف</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
