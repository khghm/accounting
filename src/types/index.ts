export interface Account {
  id: string; code: string; name: string; type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  level: number; parentId?: string; balance: number; debitBalance: number; creditBalance: number;
}
export interface JournalLine { id: string; accountId: string; accountName: string; debit: number; credit: number; description: string; }
export interface JournalEntry { id: string; date: string; number: number; description: string; status: 'posted' | 'draft' | 'cancelled'; createdBy: string; lines: JournalLine[]; }
export interface InvoiceItem { id: string; productName: string; quantity: number; unitPrice: number; total: number; discount?: number; }
export interface Invoice { id: string; number: string; date: string; dueDate: string; type: 'sales' | 'purchase'; customerId: string; customerName: string; status: 'paid' | 'sent' | 'overdue' | 'draft' | 'cancelled'; items: InvoiceItem[]; subtotal: number; tax: number; discount: number; total: number; }
export interface Customer { id: string; name: string; code: string; type: 'customer' | 'supplier' | 'both'; phone: string; email: string; address: string; nationalId?: string; balance: number; creditLimit: number; }
export interface Transaction { id: string; date: string; type: 'receipt' | 'payment' | 'transfer'; amount: number; fromAccount: string; toAccount: string; description: string; reference: string; }
export interface Product { id: string; code: string; name: string; category: string; unit: string; buyPrice: number; sellPrice: number; stock: number; minStock: number; }
export interface Check { id: string; number: string; date: string; dueDate: string; amount: number; bank: string; account: string; status: 'pending' | 'cleared' | 'bounced' | 'deposited'; type: 'receivable' | 'payable'; party: string; description: string; }
export interface PayrollRecord { id: string; employeeName: string; personnelCode: string; baseSalary: number; overtime: number; bonus: number; tax: number; insurance: number; loan: number; netPay: number; month: string; status: 'paid' | 'pending'; }
export interface Notification { id: string; title: string; message: string; type: 'info' | 'warning' | 'success' | 'error'; date: string; read: boolean; }
export type PageType = 'dashboard' | 'accounts' | 'journal' | 'invoices' | 'customers' | 'products' | 'treasury' | 'checks' | 'payroll' | 'reports' | 'settings';
