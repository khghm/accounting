import React from 'react';
import { Bell, Search, User, Calendar } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو..."
            className="bg-slate-100 border-0 rounded-lg pr-9 pl-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
          <Calendar size={14} />
          <span>۱۴۰۳/۰۲/۱۵</span>
        </div>
        
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700">مدیر سیستم</span>
        </div>
      </div>
    </header>
  );
}
