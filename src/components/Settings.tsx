import React, { useState } from 'react';
import { Building, User, Shield, Bell, Database, Palette } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'اطلاعات شرکت', icon: <Building size={16} /> },
    { id: 'user', label: 'کاربران', icon: <User size={16} /> },
    { id: 'security', label: 'امنیت', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'اعلان‌ها', icon: <Bell size={16} /> },
    { id: 'backup', label: 'پشتیبان‌گیری', icon: <Database size={16} /> },
    { id: 'appearance', label: 'ظاهر', icon: <Palette size={16} /> },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-56 bg-white rounded-xl border border-slate-100 shadow-sm p-3 h-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'company' && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">اطلاعات شرکت</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">نام شرکت</label>
                  <input type="text" defaultValue="شرکت پارسیان" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">شناسه ملی</label>
                  <input type="text" defaultValue="14001234567" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">کد اقتصادی</label>
                  <input type="text" defaultValue="41-12345678" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">شماره ثبت</label>
                  <input type="text" defaultValue="123456" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" dir="ltr" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-slate-600 block mb-1">آدرس</label>
                  <input type="text" defaultValue="تهران، خیابان ولیعصر، پلاک 123" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">تلفن</label>
                  <input type="text" defaultValue="021-88123456" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">کد پستی</label>
                  <input type="text" defaultValue="1234567890" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">سال مالی</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>1403</option>
                    <option>1402</option>
                    <option>1401</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">نرخ مالیات بر ارزش افزوده</label>
                  <input type="text" defaultValue="9" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" dir="ltr" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">ذخیره تغییرات</button>
              </div>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">مدیریت کاربران</h3>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نام</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نام کاربری</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">نقش</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">وضعیت</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-800">مدیر سیستم</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">admin</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">مدیر ارشد</span></td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">فعال</span></td>
                    <td className="px-4 py-3 text-center"><button className="text-sm text-blue-600 hover:underline">ویرایش</button></td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-800">حسابدار</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">accountant</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">حسابدار</span></td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">فعال</span></td>
                    <td className="px-4 py-3 text-center"><button className="text-sm text-blue-600 hover:underline">ویرایش</button></td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-800">فروشنده</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">sales</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">فروش</span></td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">فعال</span></td>
                    <td className="px-4 py-3 text-center"><button className="text-sm text-blue-600 hover:underline">ویرایش</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات امنیتی</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-800">احراز هویت دو مرحله‌ای</p>
                    <p className="text-xs text-slate-500">افزایش امنیت حساب کاربری</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-800">قفل خودکار</p>
                    <p className="text-xs text-slate-500">قفل شدن بعد از ۱۵ دقیقه عدم فعالیت</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-800">لاگ فعالیت‌ها</p>
                    <p className="text-xs text-slate-500">ثبت تمام فعالیت‌های کاربران</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">پشتیبان‌گیری</h3>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">آخرین پشتیبان‌گیری</p>
                      <p className="text-xs text-emerald-600 mt-1">۱۴۰۳/۰۲/۱۴ - ساعت ۲۳:۰۰</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-200 text-emerald-800">موفق</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">پشتیبان‌گیری فوری</button>
                  <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">بازیابی</button>
                  <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">دانلود آخرین نسخه</button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">زمان‌بندی خودکار</p>
                  <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>هر روز ساعت ۲۳:۰۰</option>
                    <option>هر هفته (جمعه‌ها)</option>
                    <option>هر ماه</option>
                    <option>غیرفعال</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات اعلان‌ها</h3>
              <div className="space-y-3">
                {['اعلان سررسید فاکتورها', 'هشدار کمبود موجودی', 'اعلان دریافت/پرداخت', 'گزارش روزانه', 'هشدار بدهی معوق'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات ظاهری</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-2">تم رنگی</label>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-emerald-600 ring-2 ring-emerald-300 ring-offset-2"></button>
                    <button className="w-10 h-10 rounded-full bg-blue-600 hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 transition-all"></button>
                    <button className="w-10 h-10 rounded-full bg-purple-600 hover:ring-2 hover:ring-purple-300 hover:ring-offset-2 transition-all"></button>
                    <button className="w-10 h-10 rounded-full bg-red-600 hover:ring-2 hover:ring-red-300 hover:ring-offset-2 transition-all"></button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-2">حالت نمایش</label>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">تاریک</button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm ring-2 ring-emerald-300 ring-offset-2">روشن</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-2">اندازه فونت</label>
                  <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>کوچک</option>
                    <option>متوسط (پیش‌فرض)</option>
                    <option>بزرگ</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
