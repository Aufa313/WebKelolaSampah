const fs = require('fs');
const path = 'c:/layanan-setor-sampah/src/components/dashboard/DashboardAdmin.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Insert export function inside DashboardAdmin component
const stateInsertPos = content.indexOf('const [ledgerEntries, setLedgerEntries] = useState(');
const exportFunc = `
  const exportLedgerToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Tanggal,Tipe,Kategori,Deskripsi,Jumlah (Rp)\\n";
    ledgerEntries.forEach(entry => {
      const row = \`\${entry.id},\${entry.date},\${entry.type},\${entry.category},"\${entry.description.replace(/"/g, '""')}",\${entry.amount}\`;
      csvContent += row + "\\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", \`Buku_Besar_Koperasi_Lengkang_Clean_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

content = content.slice(0, stateInsertPos) + exportFunc + content.slice(stateInsertPos);

// 2. Add Export CSV button in general ledger section
const ledgerHeaderStr = `<span className="font-serif font-bold text-sm text-slate-700 block">Buku Kas Harian (General Ledger)</span>`;
const newLedgerHeaderStr = `
            <div className="flex justify-between items-center w-full mb-2">
              <span className="font-serif font-bold text-sm text-slate-700 block">Buku Kas Harian (General Ledger)</span>
              <button
                onClick={exportLedgerToCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008444] text-white rounded-xl text-xs font-bold font-sans hover:bg-[#006633] transition shadow-xs cursor-pointer"
                title="Ekspor Data ke Excel/CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>
            </div>
`;

content = content.replace(ledgerHeaderStr, newLedgerHeaderStr);

fs.writeFileSync(path, content, 'utf8');
console.log("DashboardAdmin CSV export feature injected successfully!");
