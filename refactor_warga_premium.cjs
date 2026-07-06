const fs = require('fs');
const path = 'c:/layanan-setor-sampah/src/components/dashboard/DashboardWarga.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update imports
content = content.replace(
  'import { fetchPickups, createPickup } from "../../services/api";',
  'import { fetchPickups, createPickup, fetchNotifications, markNotificationRead } from "../../services/api";'
);

content = content.replace(
  'Info, CheckCircle, AlertTriangle, ChevronRight, Scale, Leaf, Trash2, LogOut, Plus,',
  'Info, CheckCircle, AlertTriangle, ChevronRight, Scale, Leaf, Trash2, LogOut, Plus, Bell, BookOpen,'
);

// 2. Insert new states inside the DashboardWarga component
const stateInsertPos = content.indexOf('const [balance, setBalance] = useState(0);');
const premiumStates = `
  // --- Premium Warga States ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);

  const loadNotifications = () => {
    fetchNotifications(citizenUserId).then(res => {
      if (res.ok && res.data) {
        setNotifications(res.data);
      }
    });
  };

  const handleMarkNotificationsRead = () => {
    markNotificationRead(undefined, citizenUserId).then(res => {
      if (res.ok) {
        loadNotifications();
      }
    });
  };

  useEffect(() => {
    loadNotifications();
    const notifInterval = setInterval(loadNotifications, 5000);
    return () => clearInterval(notifInterval);
  }, []);

  // Gamifikasi Level & Badge logic
  const getWargaLevel = (weight: number) => {
    if (weight < 20) return { name: "Penyetor Pemula", level: 1, max: 20, badge: "🌱" };
    if (weight < 50) return { name: "Ksatria Hijau", level: 2, max: 50, badge: "🌿" };
    if (weight < 150) return { name: "Pejuang Daur Ulang", level: 3, max: 150, badge: "✨" };
    return { name: "Pahlawan Bumi", level: 4, max: 1000, badge: "👑" };
  };

  const userLevelInfo = getWargaLevel(totalWeight);
`;

content = content.slice(0, stateInsertPos) + premiumStates + content.slice(stateInsertPos);

// 3. Inject Notification Bell in Header (near "Keluar / Log Out")
const logoutBtnStr = `          <button
            onClick={onBack}
            className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/50 py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-xs font-sans"
            title="Keluar dari Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Log Out</span>
          </button>`;

const bellButtonStr = `
          {/* Lonceng Notifikasi */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) handleMarkNotificationsRead();
              }}
              className="relative p-2 text-slate-600 hover:text-[#008444] hover:bg-emerald-50 rounded-full transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-[9px] text-white font-bold rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden font-sans">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800">Notifikasi Anda</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 text-xs">Tutup</button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">Tidak ada notifikasi baru</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={\`p-4 text-left hover:bg-slate-50 transition-colors \${!n.is_read ? 'bg-emerald-50/30' : ''}\`}>
                        <h4 className="font-bold text-xs text-slate-800">{n.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal">{n.message}</p>
                        <span className="text-[9px] text-slate-400 block mt-2">{n.created_at}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tombol Hub Edukasi */}
          <button
            onClick={() => setShowEduModal(true)}
            className="text-xs font-bold text-[#008444] bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-xs font-sans"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pusat Edukasi</span>
          </button>
`;

content = content.replace(logoutBtnStr, bellButtonStr + '\n' + logoutBtnStr);

// 4. Inject Gamifikasi (Progress bar & Level Badge) in Profile Section
const profileCardAnchor = '<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nama Lengkap</span>';
const levelBadgeStr = `
            {/* Gamifikasi Badges & Levels */}
            <div className="col-span-1 sm:col-span-3 bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between mt-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{userLevelInfo.badge}</span>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#008444]">Level {userLevelInfo.level}</span>
                    <span className="text-sm font-bold text-slate-850 font-serif">{userLevelInfo.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Semakin banyak sampah disetor, level akan terus meningkat!</p>
                </div>
              </div>
              <div className="w-full sm:w-64 text-left">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Progress Level</span>
                  <span>{totalWeight} / {userLevelInfo.max} Kg</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#008444] h-2 rounded-full" style={{ width: \`\${Math.min(100, (totalWeight / userLevelInfo.max) * 100)}%\` }}></div>
                </div>
              </div>
            </div>
`;

// Insert level badge inside profil display mode (under default address column)
const addressColEndStr = '<p className="text-sm font-medium text-slate-600 leading-relaxed">{profileAddress}</p>\n            </div>';
content = content.replace(addressColEndStr, addressColEndStr + levelBadgeStr);


// 5. Add Pusat Edukasi Modal
const endDivDashboard = '</div>\n  );\n}';
const eduModalStr = `
      {/* PUSAT EDUKASI MODAL */}
      {showEduModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-[#008444] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                <h3 className="text-lg font-serif font-bold">Pusat Edukasi Pemilahan Sampah Lengkang</h3>
              </div>
              <button onClick={() => setShowEduModal(false)} className="text-emerald-100 hover:text-white text-xl font-bold font-mono">×</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 text-left">
              <p className="text-xs text-slate-500 leading-relaxed">
                Pemilahan sampah dari rumah membantu menaikkan nilai ekonomis tabungan Anda dan mempermudah tugas kurir koperasi kita. Berikut adalah panduan kategori dan harga pasarannya:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-blue-100 bg-blue-50/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🥤</span>
                    <h4 className="font-bold text-xs text-blue-900">1. Kategori Plastik</h4>
                  </div>
                  <p className="text-[11px] text-slate-650 leading-relaxed">
                    Botol PET bening, gelas plastik kemasan air mineral, wadah plastik HDPE tebal (botol detergen/shampoo). Pastikan sudah dibilas bersih.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-blue-800 bg-blue-100/50 py-0.5 px-2 rounded-md mt-2">Rp 2.500 / Kg</span>
                </div>

                <div className="border border-orange-100 bg-orange-50/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📦</span>
                    <h4 className="font-bold text-xs text-orange-900">2. Kategori Kertas</h4>
                  </div>
                  <p className="text-[11px] text-slate-655 leading-relaxed">
                    Koran bekas, buku cetak, kertas HVS sisa dokumen, kardus lipat tebal. Harap diikat rapi dan tidak basah/lembab.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-orange-800 bg-orange-100/50 py-0.5 px-2 rounded-md mt-2">Rp 1.800 / Kg</span>
                </div>

                <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🥫</span>
                    <h4 className="font-bold text-xs text-slate-800">3. Kategori Logam</h4>
                  </div>
                  <p className="text-[11px] text-slate-655 leading-relaxed">
                    Kaleng aluminium minuman soda, besi tua sisa bongkaran, tembaga, peralatan kuningan bekas. Nilai tukar sangat tinggi.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-slate-800 bg-slate-200/50 py-0.5 px-2 rounded-md mt-2">Rp 4.500 / Kg</span>
                </div>

                <div className="border border-amber-100 bg-amber-50/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🧴</span>
                    <h4 className="font-bold text-xs text-amber-900">4. Minyak Jelantah</h4>
                  </div>
                  <p className="text-[11px] text-slate-655 leading-relaxed">
                    Minyak goreng bekas pakai rumah tangga yang telah disaring dari kotoran makanan. Tampung dalam botol plastik rapat.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100/50 py-0.5 px-2 rounded-md mt-2">Rp 7.500 / Kg</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowEduModal(false)} className="bg-[#008444] text-white text-xs font-bold py-2 px-5 rounded-xl hover:bg-[#006633] transition cursor-pointer">Mengerti</button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(endDivDashboard, eduModalStr + '\n' + endDivDashboard);

fs.writeFileSync(path, content, 'utf8');
console.log("DashboardWarga premium features injected successfully!");
