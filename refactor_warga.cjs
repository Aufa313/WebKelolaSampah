const fs = require('fs');
const path = 'c:/layanan-setor-sampah/src/components/dashboard/DashboardWarga.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace state of balance
content = content.replace(
  'const [balance, setBalance] = useState(384500);',
  'const [balance, setBalance] = useState(0);'
);

// 2. Replace static mutations array
const mutationsRegex = /const \[mutations, setMutations\] = useState<Mutation\[\]>\(\[[\s\S]*?\]\);/;
content = content.replace(
  mutationsRegex,
  'const [mutations, setMutations] = useState<Mutation[]>([]);'
);

// 3. Replace handleWithdrawHandler to use requestWithdrawal
const withdrawHandlerRegex = /const handleWithdrawHandler = \(e: React\.FormEvent\) => \{[\s\S]*?\};\s*return \(/;
const newWithdrawHandler = `const handleWithdrawHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Masukkan nominal penarikan yang valid.");
      return;
    }
    if (amt > balance) {
      alert("Maaf, saldo tabungan Anda tidak mencukupi untuk penarikan ini.");
      return;
    }

    requestWithdrawal(citizenUserId, amt, withdrawType).then(res => {
      if (res.ok) {
        setWithdrawalSuccess(true);
        setBalance(prev => prev - amt);
        setWithdrawAmount("");
        
        setTimeout(() => {
          setWithdrawalSuccess(false);
          setWithdrawModal(false);
          loadTransactionsFromDB();
        }, 2000);
      } else {
        alert("Gagal melakukan penarikan: " + res.error);
      }
    });
  };

  const loadTransactionsFromDB = () => {
    fetchTransactions(citizenUserId).then((res) => {
      if (res.ok && res.data) {
        setBalance(res.data.balance);
        const mapped = res.data.history.map((tx: any) => ({
          id: "TX-" + tx.id,
          date: tx.created_at.split(" ")[0],
          category: tx.description || (tx.transaction_type === "Masuk" ? "Setor Sampah" : "Pencairan"),
          weight: 0,
          type: tx.transaction_type,
          amount: parseFloat(tx.amount),
          status: "Sukses"
        }));
        setMutations(mapped);
      }
    });
  };

  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const loadLeaderboardFromDB = () => {
    fetchLeaderboard().then((res) => {
      if (res.ok && res.data) {
        setLeaderboardData(res.data);
      }
    });
  };

  useEffect(() => {
    loadTransactionsFromDB();
    loadLeaderboardFromDB();
    const interval = setInterval(() => {
      loadTransactionsFromDB();
      loadLeaderboardFromDB();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (`;

content = content.replace(withdrawHandlerRegex, newWithdrawHandler);

// 4. Update the leaderboard rendering
const leaderboardRenderRegex = /<tbody className="divide-y divide-slate-150">[\s\S]*?<\/tbody>/;
const newLeaderboardRender = `<tbody className="divide-y divide-slate-150">
                  {leaderboardData.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white \${user.rank === 1 ? 'bg-amber-400' : user.rank === 2 ? 'bg-slate-300' : user.rank === 3 ? 'bg-amber-600' : 'bg-emerald-600'}\`}>
                            {user.rank <= 3 ? (user.rank === 1 ? '🏆' : user.rank === 2 ? '🥈' : '🥉') : user.rank}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{user.nama}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-700">{user.totalBerat} Kg</td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{user.address || '-'}</td>
                    </tr>
                  ))}
                </tbody>`;
content = content.replace(leaderboardRenderRegex, newLeaderboardRender);

fs.writeFileSync(path, content, 'utf8');
console.log("DashboardWarga refactored successfully!");
