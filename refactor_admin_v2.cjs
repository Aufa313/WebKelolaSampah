const fs = require('fs');
const path = 'c:/layanan-setor-sampah/src/components/dashboard/DashboardAdmin.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update imports
content = content.replace(
  'import { fetchPricing, updatePricing, fetchPickups, updatePickup } from "../../services/api";',
  'import { fetchPricing, updatePricing, fetchPickups, updatePickup, fetchStats, fetchWithdrawals, updateWithdrawal } from "../../services/api";'
);

// 2. Add state for withdrawals and stats right after component definition
const componentStartStr = 'export default function DashboardAdmin({ onBack, adminEmail }: DashboardAdminProps) {';
const newStates = `
  // --- Stats & Withdrawals States ---
  const [adminStats, setAdminStats] = useState({ total_warga: 0, total_pengepul: 6, total_berat: 0, saldo_beredar: 0 });
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const loadStatsAndWithdrawals = () => {
    fetchStats().then(res => {
      if (res.ok && res.data) setAdminStats(res.data);
    });
    fetchWithdrawals().then(res => {
      if (res.ok && res.data) setWithdrawals(res.data);
    });
  };

  useEffect(() => {
    loadStatsAndWithdrawals();
    const interval = setInterval(loadStatsAndWithdrawals, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWithdrawalAction = (id: number, status: "Disetujui" | "Ditolak") => {
    if (window.confirm(\`Apakah Anda yakin ingin \${status} penarikan ini?\`)) {
      updateWithdrawal(id, status).then(res => {
        if (res.ok) {
          alert(\`Penarikan \${status}!\`);
          loadStatsAndWithdrawals();
        } else {
          alert("Gagal memproses penarikan: " + res.error);
        }
      });
    }
  };
`;

content = content.replace(componentStartStr, componentStartStr + newStates);

// 3. Update the Top Cards
content = content.replace(
  /1,420/g,
  '{adminStats.total_warga}'
);
content = content.replace(
  /1\.420/g,
  '{adminStats.total_warga}'
);

content = content.replace(
  /Rp 13\.4M/g,
  'Rp {adminStats.saldo_beredar.toLocaleString()}'
);
content = content.replace(
  /285\.4 Ton/g,
  '{adminStats.total_berat} Kg'
);

// 4. Add Withdrawals Table to Render
const gpsSectionAnchor = '{/* SECTION: REAL-TIME GPS TRACKING & TELEMETRY */}';
const withdrawalsRender = `{/* TABEL WITHDRAWAL BARU */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10 order-7">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800">Persetujuan Penarikan Saldo (Withdrawals)</h3>
            <p className="text-sm text-slate-500 font-sans mt-1">Daftar pengajuan pencairan saldo warga.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100/50 text-[11px] text-slate-500 font-sans">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">ID</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Warga</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Nominal</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Jenis</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-sans">
              {withdrawals.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-slate-400">Tidak ada pengajuan penarikan saat ini.</td></tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm text-slate-600">WTH-{w.id}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{w.warga_name}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-emerald-700">Rp {parseFloat(w.amount).toLocaleString()}</td>
                    <td className="px-5 py-4 text-slate-600">{w.withdrawal_type}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={\`text-xs font-bold px-2 py-1 rounded \${
                        w.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' : 
                        w.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }\`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {w.status === 'Pending' && (
                        <div className="flex justify-center space-x-2">
                          <button onClick={() => handleWithdrawalAction(w.id, "Disetujui")} className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleWithdrawalAction(w.id, "Ditolak")} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      `;

content = content.replace(gpsSectionAnchor, withdrawalsRender + gpsSectionAnchor);

fs.writeFileSync(path, content, 'utf8');
console.log("DashboardAdmin refactored safely!");
