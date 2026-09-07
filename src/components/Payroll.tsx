import React, { useState } from 'react';
import { Plus, Search, Users, DollarSign, Calculator, CheckCircle, Clock } from 'lucide-react';
import { payrollRecords } from '../data/mockData';

export default function Payroll() {
  const [showModal, setShowModal] = useState(false);
  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);
  const totalBase = payrollRecords.reduce((s, r) => s + r.baseSalary, 0);
  const totalNet = payrollRecords.reduce((s, r) => s + r.netPay, 0);
  const totalTax = payrollRecords.reduce((s, r) => s + r.tax, 0);
  const totalInsurance = payrollRecords.reduce((s, r) => s + r.insurance, 0);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><div className="flex items-center gap-2"><Users size={16} className="text-blue-600" /><p className="text-[11px] text-slate-500">تعداد پرسنل</p></div><p className="text-xl font-bold text-slate-800 mt-1">{payrollRecords.length}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><DollarSign size={16} className="text-emerald-600" /><p className="text-[11px] text-slate-500">جمع حقوق پایه</p></div><p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{fmt(totalBase)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><Calculator size={16} className="text-purple-600" /><p className="text-[11px] text-slate-500">جمع خالص پرداختی</p></div><p className="text-lg font-bold text-purple-600 mt-1 font-mono">{fmt(totalNet)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><Clock size={16} className="text-amber-600" /><p className="text-[11px] text-slate-500">معوق</p></div><p className="text-xl font-bold text-amber-600 mt-1">{payrollRecords.filter(r => r.status === 'pending').length}</p></div>
      </div>

      {/* Deductions Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-static p-4"><p className="text-[11px] text-slate-500 mb-1">جمع مالیات کسر شده</p><p className="text-lg font-bold text-red-600 font-mono">{fmt(totalTax)}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500 mb-1">جمع حق بیمه</p><p className="text-lg font-bold text-blue-600 font-mono">{fmt(totalInsurance)}</p></div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی پرسنل..." className="input pr-8 py-2 text-xs w-48" /></div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-xs">محاسبه حقوق</button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs"><Plus size={14} /> فیش حقوقی جدید</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead><tr><th>کد پرسنلی</th><th>نام</th><th className="text-left">حقوق پایه</th><th className="text-left">اضافه‌کار</th><th className="text-left">مالیات</th><th className="text-left">بیمه</th><th className="text-left">خالص</th><th className="text-center">وضعیت</th></tr></thead>
          <tbody>
            {payrollRecords.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs text-slate-600">{r.personnelCode}</td>
                <td className="text-sm font-medium text-slate-800">{r.employeeName}</td>
                <td className="text-xs font-mono text-left">{fmt(r.baseSalary)}</td>
                <td className="text-xs text-emerald-600 font-mono text-left">{fmt(r.overtime + r.bonus)}</td>
                <td className="text-xs text-red-600 font-mono text-left">({fmt(r.tax)})</td>
                <td className="text-xs text-blue-600 font-mono text-left">({fmt(r.insurance)})</td>
                <td className="text-xs font-bold text-slate-800 font-mono text-left">{fmt(r.netPay)}</td>
                <td className="text-center">{r.status === 'paid' ? <span className="badge badge-success">✓ پرداخت شده</span> : <span className="badge badge-warning">⏳ در انتظار</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content w-full max-w-2xl mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-5">فیش حقوقی جدید</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام پرسنل</label><input type="text" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد پرسنلی</label><input type="text" className="input text-sm" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حقوق پایه</label><input type="number" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">اضافه‌کار</label><input type="number" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">پاداش</label><input type="number" className="input text-sm" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">مالیات</label><input type="number" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">بیمه</label><input type="number" className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">اقساط</label><input type="number" className="input text-sm" /></div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">انصراف</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary">ثبت فیش</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
