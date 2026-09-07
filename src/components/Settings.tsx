import React, { useState, useEffect } from 'react';
import { Building, User, Shield, Bell, Database, Palette, Check, RotateCcw } from 'lucide-react';

interface CompanyInfo {
  name: string; nationalId: string; economicCode: string; registrationNumber: string;
  address: string; phone: string; postalCode: string; fiscalYear: string; vatRate: number;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
    </label>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    try { const s = localStorage.getItem('acc_company'); return s ? JSON.parse(s) : { name: 'شرکت پارسیان', nationalId: '۱۴۰۰۱۲۳۴۵۶۷', economicCode: '۴۱-۱۲۳۴۵۶۷۸', registrationNumber: '۱۲۳۴۵۶', address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳', phone: '۰۲۱-۸۸۱۲۳۴۵۶', postalCode: '۱۲۳۴۵۶۷۸۹۰', fiscalYear: '۱۴۰۳', vatRate: 9 }; } catch { return { name: '', nationalId: '', economicCode: '', registrationNumber: '', address: '', phone: '', postalCode: '', fiscalYear: '۱۴۰۳', vatRate: 9 }; }
  });
  const [saved, setSaved] = useState(false);

  const saveCompany = () => {
    localStorage.setItem('acc_company', JSON.stringify(companyInfo));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetAll = () => {
    if (confirm('آیا از حذف تمام داده‌ها و بازگشت به حالت اولیه اطمینان دارید؟ این عمل قابل بازگشت نیست!')) {
      Object.keys(localStorage).filter(k => k.startsWith('acc_')).forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'company', label: 'اطلاعات شرکت', icon: <Building size={15} /> },
    { id: 'user', label: 'کاربران و دسترسی', icon: <User size={15} /> },
    { id: 'security', label: 'امنیت', icon: <Shield size={15} /> },
    { id: 'notifications', label: 'اعلان‌ها', icon: <Bell size={15} /> },
    { id: 'backup', label: 'پشتیبان‌گیری', icon: <Database size={15} /> },
    { id: 'appearance', label: 'ظاهر سیستم', icon: <Palette size={15} /> },
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-56 card-static p-3 h-fit lg:sticky lg:top-4">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium mb-1 transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{tab.icon}{tab.label}</button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'company' && (
            <div className="card-static p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6">اطلاعات شرکت</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نام شرکت</label><input type="text" value={companyInfo.name} onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})} className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شناسه ملی</label><input type="text" value={companyInfo.nationalId} onChange={(e) => setCompanyInfo({...companyInfo, nationalId: e.target.value})} className="input text-sm" dir="ltr" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد اقتصادی</label><input type="text" value={companyInfo.economicCode} onChange={(e) => setCompanyInfo({...companyInfo, economicCode: e.target.value})} className="input text-sm" dir="ltr" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">شماره ثبت</label><input type="text" value={companyInfo.registrationNumber} onChange={(e) => setCompanyInfo({...companyInfo, registrationNumber: e.target.value})} className="input text-sm" dir="ltr" /></div>
                <div className="md:col-span-2"><label className="text-xs text-slate-600 block mb-1.5 font-medium">آدرس</label><input type="text" value={companyInfo.address} onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})} className="input text-sm" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">تلفن</label><input type="text" value={companyInfo.phone} onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})} className="input text-sm" dir="ltr" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">کد پستی</label><input type="text" value={companyInfo.postalCode} onChange={(e) => setCompanyInfo({...companyInfo, postalCode: e.target.value})} className="input text-sm" dir="ltr" /></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">سال مالی</label><select value={companyInfo.fiscalYear} onChange={(e) => setCompanyInfo({...companyInfo, fiscalYear: e.target.value})} className="input text-sm"><option>۱۴۰۳</option><option>۱۴۰۲</option></select></div>
                <div><label className="text-xs text-slate-600 block mb-1.5 font-medium">نرخ مالیات بر ارزش افزوده (٪)</label><input type="number" value={companyInfo.vatRate} onChange={(e) => setCompanyInfo({...companyInfo, vatRate: Number(e.target.value)})} className="input text-sm" dir="ltr" /></div>
              </div>
              <div className="mt-6 flex justify-end items-center gap-3">
                {saved && <span className="text-xs text-emerald-600 flex items-center gap-1"><Check size={14} /> ذخیره شد</span>}
                <button onClick={saveCompany} className="btn btn-primary">ذخیره تغییرات</button>
              </div>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="card-static p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6">مدیریت کاربران</h3>
              <div className="table-container">
                <table>
                  <thead><tr><th>نام</th><th>نام کاربری</th><th>نقش</th><th>وضعیت</th></tr></thead>
                  <tbody>
                    <tr><td className="text-sm font-medium text-slate-800">مدیر سیستم</td><td className="text-xs font-mono text-slate-600">admin</td><td><span className="badge badge-purple">مدیر ارشد</span></td><td><span className="badge badge-success">فعال</span></td></tr>
                    <tr><td className="text-sm font-medium text-slate-800">حسابدار</td><td className="text-xs font-mono text-slate-600">accountant</td><td><span className="badge badge-info">حسابدار</span></td><td><span className="badge badge-success">فعال</span></td></tr>
                    <tr><td className="text-sm font-medium text-slate-800">فروشنده</td><td className="text-xs font-mono text-slate-600">sales</td><td><span className="badge badge-warning">فروش</span></td><td><span className="badge badge-success">فعال</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card-static p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات امنیتی</h3>
              <div className="space-y-3">
                {[{ t: 'احراز هویت دو مرحله‌ای', d: 'افزایش امنیت حساب کاربری' }, { t: 'قفل خودکار', d: 'قفل شدن بعد از ۱۵ دقیقه عدم فعالیت' }, { t: 'لاگ فعالیت‌ها', d: 'ثبت تمام فعالیت‌های کاربران' }].map((item, i) => (
                  <SecurityToggle key={i} title={item.t} desc={item.d} storageKey={`acc_sec_${i}`} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card-static p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات اعلان‌ها</h3>
              <div className="space-y-3">
                {['اعلان سررسید فاکتورها', 'هشدار کمبود موجودی', 'اعلان دریافت/پرداخت', 'گزارش روزانه', 'هشدار بدهی معوق', 'اعلان چک‌های سررسید'].map((item, i) => (
                  <SecurityToggle key={i} title={item} desc="" storageKey={`acc_notif_${i}`} defaultChecked={i < 4} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="card-static p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6">پشتیبان‌گیری و بازیابی</h3>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium text-emerald-800">آخرین پشتیبان‌گیری</p><p className="text-xs text-emerald-600 mt-1">ذخیره خودکار در مرورگر شما</p></div>
                  <span className="badge badge-success flex items-center gap-1"><Check size={12} /> فعال</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => {
                    const data = {};
                    Object.keys(localStorage).filter(k => k.startsWith('acc_')).forEach(k => { (data as any)[k] = localStorage.getItem(k); });
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `backup-${Date.now()}.json`; a.click();
                  }} className="btn btn-primary">دانلود پشتیبان</button>
                  <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file'; input.accept = '.json';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            const data = JSON.parse(ev.target?.result as string);
                            Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v as string));
                            alert('بازیابی با موفقیت انجام شد. صفحه بارگذاری مجدد می‌شود.');
                            window.location.reload();
                          } catch { alert('فایل نامعتبر است'); }
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }} className="btn btn-secondary">بازیابی از فایل</button>
                  <button onClick={resetAll} className="btn btn-danger flex items-center gap-2"><RotateCcw size={14} /> بازنشانی کامل</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card-static p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات ظاهری</h3>
              <div className="space-y-6">
                <div><label className="text-xs text-slate-600 block mb-3 font-medium">تم رنگی</label><div className="flex gap-3">{['bg-emerald-600', 'bg-blue-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-600'].map((c, i) => <button key={i} className={`w-10 h-10 rounded-xl ${c} ${i === 0 ? 'ring-2 ring-offset-2 ring-emerald-500' : ''} hover:scale-110 transition-transform`}></button>)}</div></div>
                <div><label className="text-xs text-slate-600 block mb-3 font-medium">حالت نمایش</label><div className="flex gap-3"><button className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs">تاریک</button><button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs ring-2 ring-offset-2 ring-emerald-300">روشن</button></div></div>
                <div><label className="text-xs text-slate-600 block mb-3 font-medium">اندازه فونت</label><select className="input text-sm w-48"><option>کوچک</option><option>متوسط (پیش‌فرض)</option><option>بزرگ</option></select></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SecurityToggle({ title, desc, storageKey, defaultChecked = true }: { title: string; desc: string; storageKey: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(() => {
    const v = localStorage.getItem(storageKey);
    return v !== null ? v === 'true' : defaultChecked;
  });
  useEffect(() => { localStorage.setItem(storageKey, String(checked)); }, [checked, storageKey]);
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      <div><p className="text-sm font-medium text-slate-800">{title}</p>{desc && <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>}</div>
      <Toggle checked={checked} onChange={setChecked} />
    </div>
  );
}
