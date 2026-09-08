import { Account, JournalEntry, Invoice, Customer, Transaction, Product, Check, PayrollRecord, Notification } from '../types';

export const accounts: Account[] = [
  { id: '1', code: '1', name: 'دارایی‌ها', type: 'asset', level: 1, balance: 5420000000, debitBalance: 5420000000, creditBalance: 0 },
  { id: '2', code: '11', name: 'دارایی‌های جاری', type: 'asset', parentId: '1', level: 2, balance: 3200000000, debitBalance: 3200000000, creditBalance: 0 },
  { id: '3', code: '111', name: 'وجه نقد و بانک', type: 'asset', parentId: '2', level: 3, balance: 1850000000, debitBalance: 1850000000, creditBalance: 0 },
  { id: '4', code: '1111', name: 'صندوق', type: 'asset', parentId: '3', level: 4, balance: 350000000, debitBalance: 350000000, creditBalance: 0 },
  { id: '5', code: '1112', name: 'بانک ملت - ۰۱۲۳', type: 'asset', parentId: '3', level: 4, balance: 980000000, debitBalance: 980000000, creditBalance: 0 },
  { id: '6', code: '1113', name: 'بانک ملی - ۰۵۶۷', type: 'asset', parentId: '3', level: 4, balance: 520000000, debitBalance: 520000000, creditBalance: 0 },
  { id: '7', code: '112', name: 'حساب‌های دریافتنی تجاری', type: 'asset', parentId: '2', level: 3, balance: 890000000, debitBalance: 890000000, creditBalance: 0 },
  { id: '8', code: '113', name: 'موجودی کالا و مواد', type: 'asset', parentId: '2', level: 3, balance: 460000000, debitBalance: 460000000, creditBalance: 0 },
  { id: '9', code: '12', name: 'دارایی‌های غیرجاری', type: 'asset', parentId: '1', level: 2, balance: 2220000000, debitBalance: 2220000000, creditBalance: 0 },
  { id: '10', code: '121', name: 'اموال، ماشین‌آلات و تجهیزات', type: 'asset', parentId: '9', level: 3, balance: 1800000000, debitBalance: 1800000000, creditBalance: 0 },
  { id: '11', code: '122', name: 'استهلاک انباشته', type: 'asset', parentId: '9', level: 3, balance: 420000000, debitBalance: 0, creditBalance: 420000000 },
  { id: '12', code: '2', name: 'بدهی‌ها', type: 'liability', level: 1, balance: 1680000000, debitBalance: 0, creditBalance: 1680000000 },
  { id: '13', code: '21', name: 'بدهی‌های جاری', type: 'liability', parentId: '12', level: 2, balance: 980000000, debitBalance: 0, creditBalance: 980000000 },
  { id: '14', code: '211', name: 'حساب‌های پرداختنی تجاری', type: 'liability', parentId: '13', level: 3, balance: 650000000, debitBalance: 0, creditBalance: 650000000 },
  { id: '15', code: '212', name: 'مالیات بر ارزش افزوده پرداختنی', type: 'liability', parentId: '13', level: 3, balance: 180000000, debitBalance: 0, creditBalance: 180000000 },
  { id: '16', code: '213', name: 'حقوق و دستمزد پرداختنی', type: 'liability', parentId: '13', level: 3, balance: 150000000, debitBalance: 0, creditBalance: 150000000 },
  { id: '17', code: '22', name: 'بدهی‌های غیرجاری', type: 'liability', parentId: '12', level: 2, balance: 700000000, debitBalance: 0, creditBalance: 700000000 },
  { id: '18', code: '3', name: 'حقوق صاحبان سهام', type: 'equity', level: 1, balance: 2100000000, debitBalance: 0, creditBalance: 2100000000 },
  { id: '19', code: '31', name: 'سرمایه ثبت‌شده', type: 'equity', parentId: '18', level: 2, balance: 1500000000, debitBalance: 0, creditBalance: 1500000000 },
  { id: '20', code: '32', name: 'سود (زیان) انباشته', type: 'equity', parentId: '18', level: 2, balance: 600000000, debitBalance: 0, creditBalance: 600000000 },
  { id: '21', code: '4', name: 'درآمدها', type: 'revenue', level: 1, balance: 3850000000, debitBalance: 0, creditBalance: 3850000000 },
  { id: '22', code: '41', name: 'درآمد فروش کالا', type: 'revenue', parentId: '21', level: 2, balance: 3200000000, debitBalance: 0, creditBalance: 3200000000 },
  { id: '23', code: '42', name: 'درآمد ارائه خدمات', type: 'revenue', parentId: '21', level: 2, balance: 650000000, debitBalance: 0, creditBalance: 650000000 },
  { id: '24', code: '5', name: 'هزینه‌ها', type: 'expense', level: 1, balance: 2210000000, debitBalance: 2210000000, creditBalance: 0 },
  { id: '25', code: '51', name: 'بهای تمام شده کالای فروش‌رفته', type: 'expense', parentId: '24', level: 2, balance: 1450000000, debitBalance: 1450000000, creditBalance: 0 },
  { id: '26', code: '52', name: 'هزینه حقوق و دستمزد', type: 'expense', parentId: '24', level: 2, balance: 380000000, debitBalance: 380000000, creditBalance: 0 },
  { id: '27', code: '53', name: 'هزینه اجاره', type: 'expense', parentId: '24', level: 2, balance: 120000000, debitBalance: 120000000, creditBalance: 0 },
  { id: '28', code: '54', name: 'هزینه آب، برق و گاز', type: 'expense', parentId: '24', level: 2, balance: 85000000, debitBalance: 85000000, creditBalance: 0 },
  { id: '29', code: '55', name: 'هزینه تبلیغات و بازاریابی', type: 'expense', parentId: '24', level: 2, balance: 175000000, debitBalance: 175000000, creditBalance: 0 },
];

export const journalEntries: JournalEntry[] = [
  { id: '1', date: '۱۴۰۳/۰۱/۱۵', number: 1001, description: 'ثبت فروش نقدی کالا به مشتری', status: 'posted', createdBy: 'مدیر سیستم', lines: [
    { id: '1', accountId: '4', accountName: 'صندوق', debit: 150000000, credit: 0, description: 'دریافت وجه نقد' },
    { id: '2', accountId: '22', accountName: 'درآمد فروش کالا', debit: 0, credit: 150000000, description: 'فروش نقدی' },
  ]},
  { id: '2', date: '۱۴۰۳/۰۱/۱۸', number: 1002, description: 'خرید مواد اولیه از تامین‌کننده', status: 'posted', createdBy: 'حسابدار', lines: [
    { id: '3', accountId: '8', accountName: 'موجودی کالا و مواد', debit: 85000000, credit: 0, description: 'ورود کالا به انبار' },
    { id: '4', accountId: '5', accountName: 'بانک ملت - ۰۱۲۳', debit: 0, credit: 85000000, description: 'پرداخت از بانک' },
  ]},
  { id: '3', date: '۱۴۰۳/۰۱/۲۲', number: 1003, description: 'پرداخت حقوق و دستمزد پرسنل - فروردین', status: 'posted', createdBy: 'مدیر سیستم', lines: [
    { id: '5', accountId: '26', accountName: 'هزینه حقوق و دستمزد', debit: 380000000, credit: 0, description: 'حقوق فروردین' },
    { id: '6', accountId: '5', accountName: 'بانک ملت - ۰۱۲۳', debit: 0, credit: 380000000, description: 'واریز حقوق' },
  ]},
  { id: '4', date: '۱۴۰۳/۰۲/۰۱', number: 1004, description: 'فروش نسیه به شرکت آلفا', status: 'posted', createdBy: 'حسابدار', lines: [
    { id: '7', accountId: '7', accountName: 'حساب‌های دریافتنی تجاری', debit: 220000000, credit: 0, description: 'فاکتور فروش' },
    { id: '8', accountId: '22', accountName: 'درآمد فروش کالا', debit: 0, credit: 220000000, description: 'فروش نسیه' },
  ]},
  { id: '5', date: '۱۴۰۳/۰۲/۰۵', number: 1005, description: 'پرداخت اجاره دفتر مرکزی', status: 'posted', createdBy: 'مدیر سیستم', lines: [
    { id: '9', accountId: '27', accountName: 'هزینه اجاره', debit: 30000000, credit: 0, description: 'اجاره اردیبهشت' },
    { id: '10', accountId: '5', accountName: 'بانک ملت - ۰۱۲۳', debit: 0, credit: 30000000, description: 'پرداخت اجاره' },
  ]},
  { id: '6', date: '۱۴۰۳/۰۲/۱۰', number: 1006, description: 'دریافت وجه از شرکت آلفا', status: 'posted', createdBy: 'حسابدار', lines: [
    { id: '11', accountId: '5', accountName: 'بانک ملت - ۰۱۲۳', debit: 180000000, credit: 0, description: 'واریز مشتری' },
    { id: '12', accountId: '7', accountName: 'حساب‌های دریافتنی تجاری', debit: 0, credit: 180000000, description: 'تسویه حساب' },
  ]},
  { id: '7', date: '۱۴۰۳/۰۲/۱۲', number: 1007, description: 'ثبت هزینه تبلیغات', status: 'draft', createdBy: 'حسابدار', lines: [
    { id: '13', accountId: '29', accountName: 'هزینه تبلیغات و بازاریابی', debit: 45000000, credit: 0, description: 'تبلیغات آنلاین' },
    { id: '14', accountId: '6', accountName: 'بانک ملی - ۰۵۶۷', debit: 0, credit: 45000000, description: 'پرداخت' },
  ]},
];

export const invoices: Invoice[] = [
  { id: '1', number: 'INV-1403-001', date: '۱۴۰۳/۰۱/۱۵', dueDate: '۱۴۰۳/۰۲/۱۵', type: 'sales', customerId: '1', customerName: 'شرکت فناوری آلفا', status: 'paid', items: [
    { id: '1', productName: 'لپ‌تاپ ایسوس VivoBook 15', quantity: 5, unitPrice: 45000000, total: 225000000 },
    { id: '2', productName: 'ماوس بی‌سیم لاجیتک', quantity: 10, unitPrice: 850000, total: 8500000 },
  ], subtotal: 233500000, tax: 21015000, discount: 0, total: 254515000 },
  { id: '2', number: 'INV-1403-002', date: '۱۴۰۳/۰۱/۲۰', dueDate: '۱۴۰۳/۰۲/۲۰', type: 'sales', customerId: '2', customerName: 'شرکت نوآوری بتا', status: 'sent', items: [
    { id: '3', productName: 'مانیتور سامسونگ ۲۷ اینچ', quantity: 3, unitPrice: 18000000, total: 54000000 },
  ], subtotal: 54000000, tax: 4860000, discount: 2700000, total: 56160000 },
  { id: '3', number: 'INV-1403-003', date: '۱۴۰۳/۰۲/۰۱', dueDate: '۱۴۰۳/۰۳/۰۱', type: 'purchase', customerId: '3', customerName: 'فروشگاه گاما', status: 'paid', items: [
    { id: '4', productName: 'کیبورد مکانیکی ریزر', quantity: 20, unitPrice: 2500000, total: 50000000 },
    { id: '5', productName: 'هدست گیمینگ SteelSeries', quantity: 15, unitPrice: 3200000, total: 48000000 },
  ], subtotal: 98000000, tax: 8820000, discount: 5000000, total: 101820000 },
  { id: '4', number: 'INV-1403-004', date: '۱۴۰۳/۰۲/۱۰', dueDate: '۱۴۰۳/۰۳/۱۰', type: 'sales', customerId: '4', customerName: 'شرکت دلتا', status: 'overdue', items: [
    { id: '6', productName: 'پرینتر HP LaserJet Pro', quantity: 2, unitPrice: 12000000, total: 24000000 },
  ], subtotal: 24000000, tax: 2160000, discount: 0, total: 26160000 },
  { id: '5', number: 'INV-1403-005', date: '۱۴۰۳/۰۲/۱۴', dueDate: '۱۴۰۳/۰۳/۱۴', type: 'sales', customerId: '5', customerName: 'شرکت اپسیلون', status: 'sent', items: [
    { id: '7', productName: 'وب‌کم لاجیتک C920', quantity: 8, unitPrice: 4200000, total: 33600000 },
    { id: '8', productName: 'هاب USB-C', quantity: 12, unitPrice: 1600000, total: 19200000 },
  ], subtotal: 52800000, tax: 4752000, discount: 3000000, total: 54552000 },
];

export const customers: Customer[] = [
  { id: '1', name: 'شرکت فناوری آلفا', code: 'C-001', type: 'customer', phone: '۰۲۱-۸۸۱۲۳۴۵۶', email: 'info@alpha-co.ir', address: 'تهران، خیابان ولیعصر، برج آلفا، طبقه ۱۲', nationalId: '۱۴۰۰۱۲۳۴۵۶۷', balance: 0, creditLimit: 500000000 },
  { id: '2', name: 'شرکت نوآوری بتا', code: 'C-002', type: 'customer', phone: '۰۲۱-۷۷۶۵۴۳۲۱', email: 'contact@beta.ir', address: 'تهران، خیابان آزادی، پلاک ۴۵', nationalId: '۱۴۰۰۹۸۷۶۵۴۳', balance: 56160000, creditLimit: 300000000 },
  { id: '3', name: 'فروشگاه زنجیره‌ای گاما', code: 'C-003', type: 'supplier', phone: '۰۲۱-۵۵۴۴۳۳۲۲', email: 'sales@gamma-shop.ir', address: 'تهران، بازار بزرگ، پاساژ گاما', nationalId: '۱۴۰۰۵۵۴۴۳۳۲', balance: -101820000, creditLimit: 0 },
  { id: '4', name: 'شرکت مهندسی دلتا', code: 'C-004', type: 'customer', phone: '۰۳۱-۳۳۲۲۱۱۰۰', email: 'info@delta-eng.ir', address: 'اصفهان، خیابان چهارباغ بالا، ساختمان دلتا', nationalId: '۱۴۰۰۳۳۲۲۱۱۰', balance: 26160000, creditLimit: 200000000 },
  { id: '5', name: 'گروه صنعتی اپسیلون', code: 'C-005', type: 'both', phone: '۰۴۱-۳۳۴۴۵۵۶۶', email: 'procurement@epsilon.ir', address: 'تبریز، شهرک صنعتی، فاز ۳، پلاک ۱۲', nationalId: '۱۴۰۰۳۳۴۴۵۵۶', balance: 145000000, creditLimit: 400000000 },
  { id: '6', name: 'شرکت بازرگانی زتا', code: 'C-006', type: 'customer', phone: '۰۵۱-۳۸۴۴۷۷۸۸', email: 'trade@zeta-co.ir', address: 'مشهد، بلوار وکیل‌آباد، برج زتا', nationalId: '۱۴۰۰۳۸۴۴۷۷۸', balance: 78000000, creditLimit: 250000000 },
];

export const transactions: Transaction[] = [
  { id: '1', date: '۱۴۰۳/۰۱/۱۵', type: 'receipt', amount: 150000000, fromAccount: 'مشتری - شرکت آلفا', toAccount: 'صندوق', description: 'دریافت نقدی بابت فروش', reference: 'RC-1403-001' },
  { id: '2', date: '۱۴۰۳/۰۱/۱۸', type: 'payment', amount: 85000000, fromAccount: 'بانک ملت', toAccount: 'تامین‌کننده - گاما', description: 'پرداخت بابت خرید کالا', reference: 'PC-1403-001' },
  { id: '3', date: '۱۴۰۳/۰۱/۲۲', type: 'payment', amount: 380000000, fromAccount: 'بانک ملت', toAccount: 'پرسنل', description: 'پرداخت حقوق فروردین ماه', reference: 'PC-1403-002' },
  { id: '4', date: '۱۴۰۳/۰۲/۰۵', type: 'payment', amount: 30000000, fromAccount: 'بانک ملت', toAccount: 'موجر', description: 'پرداخت اجاره اردیبهشت', reference: 'PC-1403-003' },
  { id: '5', date: '۱۴۰۳/۰۲/۱۰', type: 'receipt', amount: 180000000, fromAccount: 'مشتری - شرکت آلفا', toAccount: 'بانک ملت', description: 'واریز بابت فاکتور INV-001', reference: 'RC-1403-002' },
  { id: '6', date: '۱۴۰۳/۰۲/۱۲', type: 'transfer', amount: 100000000, fromAccount: 'بانک ملت', toAccount: 'بانک ملی', description: 'انتقال بین حساب‌ها', reference: 'TR-1403-001' },
  { id: '7', date: '۱۴۰۳/۰۲/۱۴', type: 'receipt', amount: 78000000, fromAccount: 'مشتری - شرکت زتا', toAccount: 'بانک ملی', description: 'واریز بابت فاکتور فروش', reference: 'RC-1403-003' },
];

export const products: Product[] = [
  { id: '1', code: 'P-001', name: 'لپ‌تاپ ایسوس VivoBook 15', category: 'لپ‌تاپ', unit: 'عدد', buyPrice: 38000000, sellPrice: 45000000, stock: 25, minStock: 5 },
  { id: '2', code: 'P-002', name: 'مانیتور سامسونگ ۲۷ اینچ 4K', category: 'مانیتور', unit: 'عدد', buyPrice: 14000000, sellPrice: 18000000, stock: 12, minStock: 3 },
  { id: '3', code: 'P-003', name: 'ماوس بی‌سیم لاجیتک MX Master', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 650000, sellPrice: 850000, stock: 85, minStock: 20 },
  { id: '4', code: 'P-004', name: 'کیبورد مکانیکی ریزر BlackWidow', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 2000000, sellPrice: 2500000, stock: 3, minStock: 10 },
  { id: '5', code: 'P-005', name: 'هدست گیمینگ SteelSeries Arctis', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 2600000, sellPrice: 3200000, stock: 30, minStock: 8 },
  { id: '6', code: 'P-006', name: 'پرینتر HP LaserJet Pro M404', category: 'پرینتر', unit: 'عدد', buyPrice: 9500000, sellPrice: 12000000, stock: 2, minStock: 3 },
  { id: '7', code: 'P-007', name: 'وب‌کم لاجیتک C920 HD Pro', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 3500000, sellPrice: 4200000, stock: 15, minStock: 5 },
  { id: '8', code: 'P-008', name: 'هاب USB-C هفت‌پورت Anker', category: 'لوازم جانبی', unit: 'عدد', buyPrice: 1200000, sellPrice: 1600000, stock: 50, minStock: 15 },
];

export const checks: Check[] = [
  { id: '1', number: 'CH-001234', date: '۱۴۰۳/۰۱/۲۰', dueDate: '۱۴۰۳/۰۲/۲۰', amount: 150000000, bank: 'بانک ملت', account: '۰۱۲۳-۴۵۶۷', status: 'cleared', type: 'receivable', party: 'شرکت آلفا', description: 'بابت فاکتور INV-001' },
  { id: '2', number: 'CH-005678', date: '۱۴۰۳/۰۲/۰۱', dueDate: '۱۴۰۳/۰۳/۰۱', amount: 85000000, bank: 'بانک ملی', account: '۰۵۶۷-۸۹۰۱', status: 'pending', type: 'payable', party: 'فروشگاه گاما', description: 'بابت خرید کالا' },
  { id: '3', number: 'CH-009012', date: '۱۴۰۳/۰۲/۱۰', dueDate: '۱۴۰۳/۰۳/۱۰', amount: 220000000, bank: 'بانک ملت', account: '۰۱۲۳-۴۵۶۷', status: 'deposited', type: 'receivable', party: 'شرکت بتا', description: 'بابت فاکتور INV-002' },
  { id: '4', number: 'CH-003456', date: '۱۴۰۳/۰۱/۱۵', dueDate: '۱۴۰۳/۰۲/۱۵', amount: 45000000, bank: 'بانک صادرات', account: '۱۲۳۴-۵۶۷۸', status: 'bounced', type: 'payable', party: 'شرکت زتا', description: 'برگشتی - عدم موجودی' },
];

export const payrollRecords: PayrollRecord[] = [
  { id: '1', employeeName: 'علی محمدی', personnelCode: 'EMP-001', baseSalary: 85000000, overtime: 12000000, bonus: 5000000, tax: 7500000, insurance: 6200000, loan: 3000000, netPay: 85300000, month: 'فروردین ۱۴۰۳', status: 'paid' },
  { id: '2', employeeName: 'مریم احمدی', personnelCode: 'EMP-002', baseSalary: 72000000, overtime: 8000000, bonus: 3000000, tax: 5800000, insurance: 5400000, loan: 2000000, netPay: 69800000, month: 'فروردین ۱۴۰۳', status: 'paid' },
  { id: '3', employeeName: 'رضا کریمی', personnelCode: 'EMP-003', baseSalary: 95000000, overtime: 15000000, bonus: 8000000, tax: 9200000, insurance: 7100000, loan: 5000000, netPay: 96700000, month: 'فروردین ۱۴۰۳', status: 'paid' },
  { id: '4', employeeName: 'زهرا حسینی', personnelCode: 'EMP-004', baseSalary: 68000000, overtime: 6000000, bonus: 2000000, tax: 4900000, insurance: 5100000, loan: 0, netPay: 66000000, month: 'فروردین ۱۴۰۳', status: 'pending' },
  { id: '5', employeeName: 'محمد رضایی', personnelCode: 'EMP-005', baseSalary: 78000000, overtime: 10000000, bonus: 4000000, tax: 6700000, insurance: 5800000, loan: 4000000, netPay: 75500000, month: 'فروردین ۱۴۰۳', status: 'pending' },
];

export const notifications: Notification[] = [
  { id: '1', title: 'فاکتور معوق', message: 'فاکتور INV-1403-004 به مبلغ ۲۶,۱۶۰,۰۰۰ ریال معوق شده است', type: 'warning', date: '۱۴۰۳/۰۲/۱۵', read: false },
  { id: '2', title: 'کمبود موجودی', message: '۲ قلم کالا به حداقل موجودی رسیده‌اند', type: 'error', date: '۱۴۰۳/۰۲/۱۴', read: false },
  { id: '3', title: 'چک برگشتی', message: 'چک شماره CH-003456 به مبلغ ۴۵,۰۰۰,۰۰۰ ریال برگشت خورده', type: 'error', date: '۱۴۰۳/۰۲/۱۳', read: false },
  { id: '4', title: 'سررسید مالیات', message: 'مهلت ارسال اظهارنامه مالیاتی تا ۱۵ روز دیگر', type: 'info', date: '۱۴۰۳/۰۲/۱۲', read: true },
  { id: '5', title: 'پرداخت موفق', message: 'حقوق فروردین ماه با موفقیت پرداخت شد', type: 'success', date: '۱۴۰۳/۰۱/۲۲', read: true },
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
  { name: 'سایر هزینه‌ها', value: 85, color: '#8b5cf6' },
];

export const dailySalesData = [
  { day: 'شنبه', sales: 120 }, { day: 'یکشنبه', sales: 180 }, { day: 'دوشنبه', sales: 150 },
  { day: 'سه‌شنبه', sales: 210 }, { day: 'چهارشنبه', sales: 190 }, { day: 'پنجشنبه', sales: 250 },
];
