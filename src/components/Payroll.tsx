import React, { useState } from 'react';
import { useStore, fmt, genId } from '../store/Store';
import { PayrollRecord } from '../types';
import { Plus, Search, Edit, Trash2, Users, DollarSign, Calculator, Printer, Download } from 'lucide-react';
import { printReport, exportToCSV } from '../utils/export';

export default function Payroll() {
  const { payroll, setPayroll, showToast } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PayrollRecord | null>(null);
  const totalBase = payroll.reduce((s, r) => s + r.baseSalary, 0);
  const totalNet = payroll.reduce((s, r) => s + r.netPay, 0);
  const totalTax = payroll.reduce((s, r) => s + r.tax, 0);
  const totalInsurance = payroll.reduce((s, r) => s + r.insurance, 0);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این فیش حقوقی اطمینان دارید؟')) {
      setPayroll(payroll.filter(r => r.id !== id));
      showToast('فیش حقوقی با موفقیت حذف شد');
    }
  };

  const handlePrint = () => {
    let content = '<table><thead><tr><th>کد پرسنلی</th><th>نام</th><th class="text-left">حقوق پایه</th><th class="text-left">اضافه‌کار</th><th class="text-left">مالیات</th><th class="text-left">بیمه</th><th class="text-left">خالص</th><th>وضعیت</th></tr></thead><tbody>';
    payroll.forEach(r => {
      content += `<tr><td>${r.personnelCode}</td><td>${r.employeeName}</td><td class="text-left font-mono">${fmt(r.baseSalary)}</td><td class="text-left font-mono">${fmt(r.overtime + r.bonus)}</td><td class="text-left font-mono">(${fmt(r.tax)})</td><td class="text-left font-mono">(${fmt(r.insurance)})</td><td class="text-left font-mono">${fmt(r.netPay)}</td><td>${r.status === 'paid' ? 'پرداخت شده' : 'در انتظار'}</td></tr>`;
    });
    content += '</tbody></table>';
    printReport('لیست حقوق و دستمزد', content);
  };

  const handleExport = () => {
    const data = payroll.map(r => ({
      personnelCode: r.personnelCode, employeeName: r.employeeName, baseSalary: r.baseSalary,
      overtime: r.overtime, bonus: r.bonus, tax: r.tax, insurance: r.insurance, loan: r.loan, netPay: r.netPay, month: r.month,
    }));
    exportToCSV(data, 'payroll', [
      { key: 'personnelCode', label: 'کد پرسنلی' }, { key: 'employeeName', label: 'نام' }, { key: 'baseSalary', label: 'حقوق پایه' },
      { key: 'overtime', label: 'اضافه‌کار' }, { key: 'bonus', label: 'پاداش' }, { key: 'tax', label: 'مالیات' },
      { key: 'insurance', label: 'بیمه' }, { key: 'loan', label: 'اقساط' }, { key: 'netPay', label: 'خالص' }, { key: 'month', label: 'ماه' }
    ]);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <div className="card-static p-4"><div className="flex items-center gap-2"><Users size={16} className="text-blue-600" /><p className="text-[11px] text-slate-500">تعداد پرسنل</p></div><p className="text-xl font-bold text-slate-800 mt-1">{payroll.length}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><DollarSign size={16} className="text-emerald-600" /><p className="text-[11px] text-slate-500">جمع حقوق پایه</p></div><p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{fmt(totalBase)}</p></div>
        <div className="card-static p-4"><div className="flex items-center gap-2"><Calculator size={16} className="text-purple-600" /><p className="text-[11px] text-slate-500">جمع خالص پرداختی</p></div><p className="text-lg font-bold text-purple-600 mt-1 font-mono">{fmt(totalNet)}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500">معوق</p><p className="text-xl font-bold text-amber-600 mt-1">{payroll.filter(r => r.status === 'pending').length}</p></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card-static p-4"><p className="text-[11px] text-slate-500 mb-1">جمع مالیات کسر شده</p><p className="text-lg font-bold text-red-600 font-mono">{fmt(totalTax)}</p></div>
        <div className="card-static p-4"><p className="text-[11px] text-slate-500 mb-1">جمع حق بیمه</p><p className="text-lg font-bold text-blue-600 font-mono">{fmt(totalInsurance)}</p></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="جستجوی پرسنل..." className="input pr-8 py-2 text-xs w-48" /></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="btn btn-secondary text-xs"><Download size={14} /> Excel</button>
            <button onClick={handlePrint} className="btn btn-secondary text-xs"><Printer size={14} /> چاپ</button>
            <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn btn-primary text-xs"><Plus size={14} /> فیش حقوقی جدید</button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>کد پرسنلی</th><th>نام</th><th className="text-left">حقوق پایه</th><th className="text-left">اضافه‌کار</th><th className="text-left">مالیات</th><th className="text-left">بیمه</th><th className="text-left">خالص</th><th className="text-center">وضعیت</th><th className="text-center">عملیات</th></tr></thead>
          <tbody>
            {payroll.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs text-slate-600">{r.personnelCode}</td>
                <td className="text-sm font-medium text-slate-800">{r.employeeName}</td>
                <td className="text-xs font-mono text-left">{fmt(r.baseSalary)}</td>
                <td className="text-xs text-emerald-600 font-mono text-left">{fmt(r.overtime + r.bonus)}</td>
                <td className="text-xs text-red-600 font-mono text-left">({fmt(r.tax)})</td>
                <td className="text-xs text-blue-600 font-mono text-left">({fmt(r.insurance)})</td>
                <td className="text-xs font-bold text-slate-800 font-mono text-left">{fmt(r.netPay)}</td>
                <td className="text-center">{r.status === 'paid' ? <span className="badge badge-success">✓ پرداخت شده</span> : <span className="badge badge-warning">⏳ در انتظار</span>}</td>
                <td className="text-center"><div className="flex items-center justify-center gap-0.5"><button onClick={() => { setEditing(r); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button><button onClick={() => handleDelete(r.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <PayrollForm record={editing} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function PayrollForm({ record, onClose }: { record: PayrollRecord | null; onClose: () => void }) {
  const { payroll, setPayroll, showToast } = useStore();
  const [employeeName, setEmployeeName] = useState(record?.employeeName || '');
  const [personnelCode, setPersonnelCode] = useState(record?.personnelCode || `EMP-${String(payroll.length + 1).padStart(3, '0')}`);
  const [baseSalary, setBaseSalary] = useState(record?.baseSalary || 0);
  const [overtime, setOvertime] = useState(record?.overtime || 0);
  const [bonus, setBonus] = useState(record?.bonus || 0);
  const [tax, setTax] = useState(record?.tax || 0);
  const [insurance, setInsurance] = useState(record?.insurance || 0);
  const [loan, setLoan] = useState(record?.loan || 0);
  const [month, setMonth] = useState(record?.month || 'فروردین ۱۴۰۳');

  const netPay = baseSalary + overtime + bonus - tax - insurance - loan;

  const handleSubmit = () => {
    if (!employeeName || !personnelCode) { showToast('لطفاً نام و کد پرسنلی را وارد کنید', 'error'); return; }
    const newRecord: PayrollRecord = {
      id: record?.id || genId(), employeeName, personnelCode, baseSalary, overtime, bonus, tax, insurance, loan, netPay, month,
      status: 'pending',
    };
    if (record) {
      setPayroll(payroll.map(r => r.id === record.id ? newRecord : r));
      showToast('فیش حقوقی با موفقیت ویرایش شد');
    } else {
      setPayroll([...payroll, newRecord]);
      showToast('فیش حقوقی با موفقیت ایجاد شد');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">{record ? 'ویرایش فیش حقوقی' : 'فیش حقوقی جدید'}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام پرسنل *</label><input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد پرسنلی *</label><input type="text" value={personnelCode} onChange={(e) => setPersonnelCode(e.target.value)} className="input text-sm" /></div>
          </div>
          <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">ماه</label><input type="text" value={month} onChange={(e) => setMonth(e.target.value)} className="input text-sm" /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">حقوق پایه</label><input type="number" value={baseSalary} onChange={(e) => setBaseSalary(Number(e.target.value))} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">اضافه‌کار</label><input type="number" value={overtime} onChange={(e) => setOvertime(Number(e.target.value))} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">پاداش</label><input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="input text-sm" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">مالیات</label><input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">بیمه</label><input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="input text-sm" /></div>
            <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">اقساط</label><input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="input text-sm" /></div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-xs text-emerald-600 font-medium">خالص پرداختی</p>
            <p className="text-xl font-bold text-emerald-700 mt-1 font-mono">{fmt(netPay)} ریال</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary">ثبت فیش</button>
        </div>
      </div>
    </div>
  );
}
