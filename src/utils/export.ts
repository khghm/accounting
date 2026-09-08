// Print utility
export function printReport(title: string, content: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('لطفاً پاپ‌آپ را برای این سایت مجاز کنید');
    return;
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        * { font-family: 'Vazirmatn', sans-serif; box-sizing: border-box; }
        body { padding: 20px; direction: rtl; }
        h1 { text-align: center; margin-bottom: 10px; color: #1e293b; }
        .meta { text-align: center; color: #64748b; font-size: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #f1f5f9; padding: 10px; text-align: right; font-size: 12px; border: 1px solid #e2e8f0; }
        td { padding: 8px 10px; border: 1px solid #e2e8f0; font-size: 13px; }
        .text-left { text-align: left; }
        .font-mono { font-family: monospace; }
        .total-row { background: #f8fafc; font-weight: bold; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')} | ساعت: ${new Date().toLocaleTimeString('fa-IR')}</div>
      ${content}
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 500);
}

// Export to CSV
export function exportToCSV(data: any[], filename: string, headers: { key: string; label: string }[]) {
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel
  const csvContent = BOM + [
    headers.map(h => h.label).join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h.key];
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
      return val ?? '';
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toLocaleDateString('fa-IR')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// Export to JSON
export function exportToJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Format number for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount);
}
