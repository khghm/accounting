import { Account, JournalEntry, Invoice, Customer, Transaction, Product } from '../types';

export const accounts: Account[] = [
  { id: '1', code: '1', name: 'دارایی‌ها', type: 'asset', level: 1, balance: 5420000000, debitBalance: 5420000000, creditBalance: 0 },
  { id: '2', code: '11', name: 'دارایی‌های جاری', type: 'asset', parentId: '1', level: 2, balance: 3200000000, debitBalance: 3200000000, creditBalance: 0 },
  { id: '3', code: '111', name: 'وجه نقد و بانک', type: 'asset', parentId: '2', level: 3, balance: 1850000000, debitBalance: 1850000000, creditBalance: 0 },
  { id: '4', code: '1111', name: 'صندوق', type: 'asset', parentId: '3', level: 4, balance: 350000000, debitBalance: 350000000, creditBalance: 0 },
  { id: '5', code: '1112', name: 'بانک ملت', type: 'asset', parentId: '3', level: 4, balance: 980000000, debitBalance: 980000000, creditBalance: 0 },
  { id: '6', code: '1113', name: 'بانک ملی', type: 'asset', parentId: '3', level: 4, balance: 520000000, debitBalance: 520000000, creditBalance: 0 },
  { id: '7', code: '112', name: 'حساب‌های دریافتنی', type: 'asset', parentId: '2', level: 3, balance: 890000000, debitBalance: 890000000, creditBalance: 0 },
  { id: '8', code: '113', name: 'موجودی کالا', type: 'asset', parentId: '2', level: 3, balance: 460000000, debitBalance: 460000000, creditBalance: 0 },
  { id: '9', code: '12', name: 'دارایی‌های غیرجاری', type: 'asset', parentId: '1', level: 2, balance: 2220000000, debitBalance: 2220000000, creditBalance: 0 },
  { id: '10', code: '121', name: 'اموال و تجهیزات', type: 'asset', parentId: '9', level: 3, balance: 1800000000, debitBalance: 1800000000, creditBalance: 0 },
  { id: '11', code: '122', name: 'استهلاک انباشته', type: 'asset', parentId: '9', level: 3, balance: 420000000, debitBalance: 0, creditBalance: 420000000 },
  { id: '12', code: '2', name: 'بدهی‌ها', type: 'liability', level: 1, balance: 1680000000, debitBalance: 0, creditBalance: 1680000000 },
  { id: '13', code: '21', name: 'بدهی‌های جاری', type: 'liability', parentId: '12', level: 2, balance: 980000000, debitBalance: 0, creditBalance: 980000000 },
  { id: '14', code: '211', name: 'حساب‌های پرداختنی', type: 'liability', parentId: '13', level: 3, balance: 650000000, debitBalance: 0, creditBalance: 650000000 },
  { id: '15', code: '212', name: 'مالیات پرداختنی', type: 'liability', parentId: '13', level: 3, balance: 180000000, debitBalance: 0, creditBalance: 180000000 },
  { id: '16', code: '213', name: 'حقوق پرداختنی', type: 'liability', parentId: '13', level: 3, balance: 150000000, debitBalance: 0, creditBalance: 150000000 },
  { id: '17', code: '22', name: 'بدهی‌های غیرجاری', type: 'liability', parentId: '12', level: 2, balance: 700000000, debitBalance: 0, creditBalance: 700000000 },
  { id: '18', code: '3', name: 'حقوق صاحبان سهام', type: 'equity', level: 1, balance: 2100000000, debitBalance: 0, creditBalance: 2100000000 },
  { id: '19', code: '31', name: 'سرمایه', type: 'equity', parentId: '18', level: 2, balance: 1500000000, debitBalance: 0, creditBalance: 1500000000 },
  { id: '20', code: '32', name: 'سود انباشته', type: 'equity', parentId: '18', level: 2, balance: 600000000, debitBalance: 0, creditBalance: 600000000 },
  { id: '21', code: '4', name: 'درآمدها', type: 'revenue', level: 1, balance: 3850000000, debitBalance: 0, creditBalance: 3850000000 },
  { id: '22', code: '41', name: 'درآمد فروش', type: 'revenue', parentId: '21', level: 2, balance: 3200000000, debitBalance: 0, creditBalance: 3200000000 },
  { id: '23', code: '42', name: 'درآمد خدمات', type: 'revenue', parentId: '21', level: 2, balance: 650000000, debitBalance: 0, creditBalance: 650000000 },
  { id: '24', code: '5', name: 'هزینه‌ها', type: 'expense', level: 1, balance: 2210000000, debitBalance: 2210000000, creditBalance: 0 },
  { id: '25', code: '51', name: 'بهای تمام شده کالای فروش رفته', type: 'expense', parentId: '24', level: 2, balance: 1450000000, debitBalance: 1450000000, creditBalance: 0 },
  { id: '26', code: '52', name: 'هزینه حقوق و دستمزد', type: 'expense', parentId: '24', level: 2, balance: 380000000, debitBalance: 380000000, creditBalance: 0 },
  { id: '27', code: '53', name: 'هزینه اجاره', type: 'expense', parentId: '24', level: 2, balance: 120000000, debitBalance: 120000000, creditBalance: 0 },
  { id: '28', code: '54', name: 'هزینه utilities', type: 'expense', parentId: '24', level: 2, balance: 85000000, debitBalance: 85000000, creditBalance: 0 },
  { id: '29', code: '55', name: 'هزینه تبلیغات', type: 'expense', parentId: '24', level: 2, balance: 175000000, debitBalance: 175000000, creditBalance: 0 },
];

export const journalEntries: JournalEntry[] = [
  {
    id: '1', date: '1403/01/15', number: 1001, description: 'ثبت فروش نقدی', status: 'posted', createdBy: 'مدیر سیستم',
    lines: [
      { id: '1', accountId: '4', accountName: 'صندوق', debit: 150000000, credit: 0, description: '' },
      { id: '2', accountId: '22', accountName: 'درآمد فروش', debit: 0, credit: 150000000, description: '' },
    ]
  },
  {
    id: '2', date: '1403/01/18', number: 1002, description: 'خرید مواد اولیه', status: 'posted', createdBy: 'مدیر سیستم',
    lines: [
      { id: '3', accountId: '8', accountName: 'موجودی کالا', debit: 85000000, credit: 0, description: '' },
      { id: '4', accountId: '5', accountName: 'بانک ملت', debit: 0, credit: 85000000, description: '' },
    ]
  },
  {
    id: '3', date: '1403/01/22', number: 1003, description: 'پرداخت حقوق پرسنل', status: 'posted', createdBy: 'مدیر سیستم',
    lines: [
      { id: '5', accountId: '26', accountName: 'هزینه حقوق و دستمزد', debit: 380000000, credit: 0, description: '' },
      { id: '6', accountId: '5', accountName: 'بانک ملت', debit: 0, credit: 380000000, description: '' },
    ]
  },
  {
    id: '4', date: '1403/02/01', number: 1004, description: 'فروش نسیه به شرکت آلفا', status: 'posted', createdBy: 'مدیر سیستم',
    lines: [
      { id: '7', accountId: '7', accountName: 'حساب‌های دریافتنی', debit: 220000000, credit: 0, description: '' },
      { id: '8', accountId: '22', accountName: 'درآمد فروش', debit: 0, credit: 220000000, description: '' },
    ]
  },
  {
    id: '5', date: '1403/02/05', number: 1005, description: 'پرداخت اجاره دفتر', status: 'posted', createdBy: 'مدیر سیستم',
    lines: [
      { id: '9', accountId: '27', accountName: 'هزینه اجاره', debit: 30000000, credit: 0, description: '' },
      { id: '10', accountId: '5', accountName: 'بانک ملت', debit: 0, credit: 30000000, description: '' },
    ]
  },
  {
    id: '6', date: '1403/02/10', number: 1006, description: 'دریافت از مشتری', status: 'posted', createdBy: 'مدیر سیستم',
    lines: [
      { id: '11', accountId: '5', accountName: 'بانک ملت', debit: 180000000, credit: 0, description: '' },
      { id: '12', accountId: '7', accountName: 'حساب‌های دریافتنی', debit: 0, credit: 180000000, description: '' },
    ]
  },
];

export const invoices: Invoice[] = [
  {
    id: '1', number: 'INV-1001', date: '1403/01/15', dueDate: '1403/02/15', type: 'sales',
    customerId: '1', customerName: 'شرکت آلفا', status: 'paid',
    items: [
      { id: '1', productName: 'لپ‌تاپ ایسوس', quantity: 5, unitPrice: 45000000, total: 225000000 },
      { id: '2', productName: 'ماوس بی‌سیم', quantity: 10, unitPrice: 850000, total: 8500000 },
    ],
    subtotal: 233500000, tax: 21015000, discount: 0, total: 254515000
  },
  {
    id: '2', number: 'INV-1002', date: '1403/01/20', dueDate: '1403/02/20', type: 'sales',
    customerId: '2', customerName: 'شرکت بتا', status: 'sent',
    items: [
      { id: '3', productName: 'مانیتور سامسونگ', quantity: 3, unitPrice: 18000000, total: 54000000 },
    ],
    subtotal: 54000000, tax: 4860000, discount: 2700000, total: 56160000
  },
  {
    id: '3', number: 'INV-1003', date: '1403/02/01', dueDate: '1403/03/01', type: 'purchase',
    customerId: '3', customerName: 'فروشگاه گاما', status: 'paid',
    items: [
      { id: '4', productName: 'کیبورد مکانیکی', quantity: 20, unitPrice: 2500000, total: 50000000 },
      { id: '5', productName: 'هدست گیمینگ', quantity: 15, unitPrice: 3200000, total: 48000000 },
    ],
    subtotal: 98000000, tax: 8820000, discount: 5000000, total: 101820000
  },
  {
    id: '4', number: 'INV-1004', date: '1403/02/10', dueDate: '1403/03/10', type: 'sales',
    customerId: '4', customerName: 'شرکت دلتا', status: 'overdue',
    items: [
      { id: '6', productName: 'پرینتر HP', quantity: 2, unitPrice: 12000000, total: 24000000 },
    ],
    subtotal: 24000000, tax: 2160000, discount: 0, total: 26160000
  },
];

export const customers: Customer[] = [
  { id: '1', name: 'شرکت آلفا', code: 'C-001', type: 'customer', phone: '021-88123456', email: 'info@alpha.com', address: 'تهران، خیابان ولیعصر', balance: 0, creditLimit: 500000000 },
  { id: '2', name: 'شرکت بتا', code: 'C-002', type: 'customer', phone: '021-77654321', email: 'info@beta.com', address: 'تهران، خیابان آزادی', balance: 56160000, creditLimit: 300000000 },
  { id: '3', name: 'فروشگاه گاما', code: 'C-003', type: 'supplier', phone: '021-55443322', email: 'info@gamma.com', address: 'تهران، بازار بزرگ', balance: -101820000, creditLimit: 0 },
  { id: '4', name: 'شرکت دلتا', code: 'C-004', type: 'customer', phone: '031-33221100', email: 'info@delta.com', address: 'اصفهان، خیابان چهارباغ', balance: 26160000, creditLimit: 200000000 },
  { id: '5', name: 'شرکت اپسیلون', code: 'C-005', type: 'both', phone: '041-33445566', email: 'info@epsilon.com', address: 'تبریز، خیابان ارتش', balance: 145000000, creditLimit: 400000000 },
];

export const transactions: Transaction[] = [
  { id: '1', date: '1403/01/15', type: 'receipt', amount: 150000000, fromAccount: 'مشتری', toAccount: 'صندوق', description: 'دریافت نقدی فروش', reference: 'RC-001' },
  { id: '2', date: '1403/01/18', type: 'payment', amount: 85000000, fromAccount: 'بانک ملت', toAccount: 'تامین‌کننده', description: 'پرداخت بابت خرید', reference: 'PC-001' },
  { id: '3', date: '1403/01/22', type: 'payment', amount: 380000000, fromAccount: 'بانک ملت', toAccount: 'پرسنل', description: 'پرداخت حقوق', reference: 'PC-002' },
  { id: '4', date: '1403/02/05', type: 'payment', amount: 30000000, fromAccount: 'بانک ملت', toAccount: 'موجر', description: 'پرداخت اجاره', reference: 'PC-003' },
  { id: '5', date: '1403/02/10', type: 'receipt', amount: 180000000, fromAccount: 'مشتری', toAccount: 'بانک ملت', description: 'دریافت از شرکت آلفا', reference: 'RC-002' },
  { id: '6', date: '1403/02/12', type: 'transfer', amount: 100000000, fromAccount: 'بانک ملت', toAccount: 'بانک ملی', description: 'انتقال بین حساب‌ها', reference: 'TR-001' },
];

export const products: Product[] = [
  { id: '1', code: 'P-001', name: 'لپ‌تاپ ایسوس VivoBook', category: 'لپ‌تاپ', unit: 'عدد', buyPrice: 38000000, sellPrice: 45000000, stock: 25, minStock: 5 },
  { id: '2', code: 'P-002', name: 'مانیتور سامسونگ 27"', category: 'مانیتور', unit: 'عدد', buyPrice: 14000000, sellPrice: 18000000, stock: 12, minStock: 3 },
  { id: '3', code: 'P-003', name: 'ماوس بی‌سیم لاجیتک', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 650000, sellPrice: 850000, stock: 85, minStock: 20 },
  { id: '4', code: 'P-004', name: 'کیبورد مکانیکی ریزر', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 2000000, sellPrice: 2500000, stock: 40, minStock: 10 },
  { id: '5', code: 'P-005', name: 'هدست گیمینگ SteelSeries', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 2600000, sellPrice: 3200000, stock: 30, minStock: 8 },
  { id: '6', code: 'P-006', name: 'پرینتر HP LaserJet', category: 'پرینتر', unit: 'عدد', buyPrice: 9500000, sellPrice: 12000000, stock: 8, minStock: 3 },
  { id: '7', code: 'P-007', name: 'وب‌کم لاجیتک C920', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 3500000, sellPrice: 4200000, stock: 15, minStock: 5 },
  { id: '8', code: 'P-008', name: 'هاب USB-C', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 1200000, sellPrice: 1600000, stock: 50, minStock: 15 },
];

export const monthlyData = [
  { month: 'فروردین', revenue: 850, expense: 620, profit: 230 },
  { month: 'اردیبهشت', revenue: 920, expense: 580, profit: 340 },
  { month: 'خرداد', revenue: 780, expense: 650, profit: 130 },
  { month: 'تیر', revenue: 1050, expense: 720, profit: 330 },
  { month: 'مرداد', revenue: 980, expense: 690, profit: 290 },
  { month: 'شهریور', revenue: 1120, expense: 750, profit: 370 },
];

export const expenseCategories = [
  { name: 'بهای تمام شده', value: 1450, color: '#3b82f6' },
  { name: 'حقوق و دستمزد', value: 380, color: '#10b981' },
  { name: 'اجاره', value: 120, color: '#f59e0b' },
  { name: 'تبلیغات', value: 175, color: '#ef4444' },
  { name: 'سایر', value: 85, color: '#8b5cf6' },
];
