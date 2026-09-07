import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, JournalEntry, Invoice, Customer, Transaction, Product, Check, PayrollRecord, Notification } from '../types';
import { accounts as defaultAccounts, journalEntries as defaultJournal, invoices as defaultInvoices, customers as defaultCustomers, transactions as defaultTransactions, products as defaultProducts, checks as defaultChecks, payrollRecords as defaultPayroll, notifications as defaultNotifications } from '../data/mockData';

interface Store {
  accounts: Account[]; setAccounts: (v: Account[]) => void;
  journal: JournalEntry[]; setJournal: (v: JournalEntry[]) => void;
  invoices: Invoice[]; setInvoices: (v: Invoice[]) => void;
  customers: Customer[]; setCustomers: (v: Customer[]) => void;
  transactions: Transaction[]; setTransactions: (v: Transaction[]) => void;
  products: Product[]; setProducts: (v: Product[]) => void;
  checks: Check[]; setChecks: (v: Check[]) => void;
  payroll: PayrollRecord[]; setPayroll: (v: PayrollRecord[]) => void;
  notifications: Notification[]; setNotifications: (v: Notification[]) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<Store | null>(null);

function load<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}
function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccountsState] = useState<Account[]>(() => load('acc_accounts', defaultAccounts));
  const [journal, setJournalState] = useState<JournalEntry[]>(() => load('acc_journal', defaultJournal));
  const [invoices, setInvoicesState] = useState<Invoice[]>(() => load('acc_invoices', defaultInvoices));
  const [customers, setCustomersState] = useState<Customer[]>(() => load('acc_customers', defaultCustomers));
  const [transactions, setTransactionsState] = useState<Transaction[]>(() => load('acc_transactions', defaultTransactions));
  const [products, setProductsState] = useState<Product[]>(() => load('acc_products', defaultProducts));
  const [checks, setChecksState] = useState<Check[]>(() => load('acc_checks', defaultChecks));
  const [payroll, setPayrollState] = useState<PayrollRecord[]>(() => load('acc_payroll', defaultPayroll));
  const [notifications, setNotificationsState] = useState<Notification[]>(() => load('acc_notifications', defaultNotifications));
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const setAccounts = (v: Account[]) => { setAccountsState(v); save('acc_accounts', v); };
  const setJournal = (v: JournalEntry[]) => { setJournalState(v); save('acc_journal', v); };
  const setInvoices = (v: Invoice[]) => { setInvoicesState(v); save('acc_invoices', v); };
  const setCustomers = (v: Customer[]) => { setCustomersState(v); save('acc_customers', v); };
  const setTransactions = (v: Transaction[]) => { setTransactionsState(v); save('acc_transactions', v); };
  const setProducts = (v: Product[]) => { setProductsState(v); save('acc_products', v); };
  const setChecks = (v: Check[]) => { setChecksState(v); save('acc_checks', v); };
  const setPayroll = (v: PayrollRecord[]) => { setPayrollState(v); save('acc_payroll', v); };
  const setNotifications = (v: Notification[]) => { setNotificationsState(v); save('acc_notifications', v); };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <StoreContext.Provider value={{
      accounts, setAccounts, journal, setJournal, invoices, setInvoices,
      customers, setCustomers, transactions, setTransactions, products, setProducts,
      checks, setChecks, payroll, setPayroll, notifications, setNotifications,
      toast, showToast,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// Utility functions
export const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(Math.round(n));
export const fmtCurrency = (n: number) => `${fmt(n)} ریال`;
export const todayStr = () => {
  const d = new Date();
  // Simple Jalali approximation for display
  return `۱۴۰۳/۰۲/${String(d.getDate()).padStart(2, '۰').replace(/\d/g, w => '۰۱۲۳۴۵۶۷۸۹'[+w])}`;
};
export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
