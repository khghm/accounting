export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: string;
  level: number;
  balance: number;
  debitBalance: number;
  creditBalance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  number: number;
  description: string;
  lines: JournalLine[];
  status: 'draft' | 'posted' | 'cancelled';
  createdBy: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  type: 'sales' | 'purchase';
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

export interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  type: 'customer' | 'supplier' | 'both';
  phone: string;
  email: string;
  address: string;
  balance: number;
  creditLimit: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'receipt' | 'payment' | 'transfer';
  amount: number;
  fromAccount: string;
  toAccount: string;
  description: string;
  reference: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
}

export type PageType = 'dashboard' | 'accounts' | 'journal' | 'invoices' | 'customers' | 'treasury' | 'products' | 'reports' | 'settings';
