import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  fetchTransactions, 
  fetchLeaderboard, 
  requestWithdrawal, 
  fetchNotifications, 
  markNotificationRead 
} from "../../services/api";
import { 
  ArrowLeft, Award, HelpCircle, ArrowUpRight, ArrowDownLeft, 
  TrendingUp, Download, RefreshCw, Smartphone, Wallet, ShoppingBag,
  Info, CheckCircle, AlertTriangle, ChevronRight, Scale, Leaf, Trash2, LogOut, Plus, Bell, BookOpen,
  MapPin, Calendar, Clock, User, Map, Copy, ExternalLink, Building2
} from "lucide-react";

interface Mutation {
  id: string;
  date: string;
  category: string;
  weight: number;
  type: "Masuk" | "Keluar";
  amount: number;
  status: "Sukses" | "Pending Admin";
}

interface DashboardWargaProps {
  onBack: () => void;
}

export default function DashboardWarga({ onBack }: DashboardWargaProps) {
  const citizenUserId = parseInt(localStorage.getItem("lengkang_authenticated_user_id") || "3");
  
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

  // Real live RW Sectors state loaded from localStorage with initial fallback
  const [rwSectors, setRwSectors] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("lengkang_rw_sectors");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading sectors in citizen view", e);
    }
    return [
      {
        id: "RW-01",
        name: "RW 01 - Sektor Plastik Mandiri",
        shortName: "Sektor RW 01",
        pickupSchedule: "Senin & Kamis",
        pickupTime: "08:00 - 11:30 WIB",
        dropOffPoint: "Bank Sampah Unit 01",
        address: "Jl. Plastik Mandiri Raya No. 4, RT 02/RW 01",
        coordinator: "Bpk. Ahmad Fauzi",
        coordinatorPhone: "+62 812-7744-1029",
        mainWaste: "Botol Plastik PET, Gelas Kemasan, HDPE",
        capacityStatus: "Bagus",
        capacityPct: 35,
        svgCoords: { cx: 70, cy: 50, r: 28, path: "M 10,15 L 110,10 L 130,80 L 30,85 Z" },
        desc: "Sektor pelopor daur ulang botol plastik dengan sistem pemilahan presisi tinggi."
      },
      {
        id: "RW-02",
        name: "RW 02 - Sektor Hutan Lengkang",
        shortName: "Sektor RW 02",
        pickupSchedule: "Selasa & Jumat",
        pickupTime: "09:00 - 12:00 WIB",
        dropOffPoint: "Posko Hijau RW 02 (Samping Masjid Jami')",
        address: "Gang Sentosa No. 12, RT 04/RW 02",
        coordinator: "Pak Sodik Permana",
        coordinatorPhone: "+62 856-9938-1290",
        mainWaste: "Minyak Jelantah, Kompos Organik, Kertas",
        capacityStatus: "Bagus",
        capacityPct: 42,
        svgCoords: { cx: 180, cy: 45, r: 32, path: "M 110,10 L 230,20 L 250,75 L 130,80 Z" },
        desc: "Sektor rindang yang memusatkan pengumpulan minyak jelantah sisa dapur warga untuk biodiesel."
      },
      {
        id: "RW-03",
        name: "RW 03 - Sektor Kertas Berkah",
        shortName: "Sektor RW 03",
        pickupSchedule: "Rabu & Sabtu",
        pickupTime: "08:30 - 11:00 WIB",
        dropOffPoint: "Depo Kertas Mandiri RW 03",
        address: "Jl. Flamboyan Timur No. 45, RT 01/RW 03",
        coordinator: "Ibu Rosy Handayani",
        coordinatorPhone: "+62 813-8822-0941",
        mainWaste: "Kardus, Kertas Koran, Dokumen Bekas, Dupleks",
        capacityStatus: "Menengah",
        capacityPct: 68,
        svgCoords: { cx: 290, cy: 45, r: 28, path: "M 230,20 L 370,15 L 350,75 L 250,75 Z" },
        desc: "Fokus pada penyelamatan serat kertas bekas dengan kemitraan langsung bersama pabrik bubur kertas."
      },
      {
        id: "RW-04",
        name: "RW 04 - Sektor Logam Mulia",
        shortName: "Sektor RW 04",
        pickupSchedule: "Senin & Jumat",
        pickupTime: "13:00 - 15:30 WIB",
        dropOffPoint: "Gudang Penampungan Logam RW 04",
        address: "Kawasan Komunitas Logam Bersih, Sektor 4, RT 03/RW 04",
        coordinator: "Bpk. Heri Susanto",
        coordinatorPhone: "+62 823-4567-8912",
        mainWaste: "Kuningan, Tembaga, Aluminium Kaleng, Besi Tua",
        capacityStatus: "Bagus",
        capacityPct: 28,
        svgCoords: { cx: 70, cy: 125, r: 28, path: "M 30,85 L 130,80 L 110,155 L 20,150 Z" },
        desc: "Sektor pengumpulan barang elektronik usang dan sisa bongkaran logam berkualitas industri."
      },
      {
        id: "RW-05",
        name: "RW 05 - Sektor Sinergi Mandiri",
        shortName: "Sektor RW 05",
        pickupSchedule: "Selasa & Sabtu",
        pickupTime: "10:00 - 12:30 WIB",
        dropOffPoint: "Pos RW 05 (Samping PAUD Belimbing)",
        address: "Jl. Hutan Lengkang No. 88, RT 01/RW 05",
        coordinator: "Ibu Sumarni Hartati",
        coordinatorPhone: "+62 812-3456-7801",
        mainWaste: "Kemasan TetraPak, Plastik Saset, Botol Kaca",
        capacityStatus: "Hampir Penuh",
        capacityPct: 82,
        svgCoords: { cx: 185, cy: 120, r: 32, path: "M 130,80 L 250,75 L 235,150 L 110,155 Z" },
        desc: "Mengelola persentase sampah kemasan multi-layer khusus (saset sereal, kopi, detergen) menjadi ecobrick."
      },
      {
        id: "RW-06",
        name: "RW 06 - Sektor Tekno Hijau",
        shortName: "Sektor RW 06",
        pickupSchedule: "Rabu & Kamis",
        pickupTime: "08:00 - 11:30 WIB",
        dropOffPoint: "Loker Drop-off E-Waste RW 06",
        address: "Kompleks Perkantoran Lengkang No. 1, RT 02/RW 06",
        coordinator: "Bpk. Rian Hidayat",
        coordinatorPhone: "+62 878-1152-3300",
        mainWaste: "Baterai Bekas, Charger Rusak, Kabel, Lampu LED",
        capacityStatus: "Bagus",
        capacityPct: 15,
        svgCoords: { cx: 300, cy: 115, r: 28, path: "M 250,75 L 350,75 L 330,145 L 235,150 Z" },
        desc: "Sektor percontohan e-waste (sampah elektronik kecil) terlengkap dengan kontainer penahan khusus."
      }
    ];
  });

  // Sync state whenever localStorage changes (e.g. if tabs are switched or storage writes complete)
  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const stored = localStorage.getItem("lengkang_rw_sectors");
        if (stored) {
          setRwSectors(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("storage", handleStorageSync);
    handleStorageSync(); // initial call
    const interval = setInterval(handleStorageSync, 3000);
    return () => {
      window.removeEventListener("storage", handleStorageSync);
      clearInterval(interval);
    };
  }, []);

  // Real state for interactive dashboard simulation
  const [balance, setBalance] = useState(0);
  const [totalWeight, setTotalWeight] = useState(142.5);
  const [incentivePreference, setIncentivePreference] = useState("Paket Sembako Bulanan");
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawType, setWithdrawType] = useState<"Uang" | "Sembako">("Uang");
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  // Chart Interactive Hover & View states
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; value: number; x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"grafik-saldo" | "komposisi-sampah">("grafik-saldo");

  // --- Drop-off Map & Sektor RW Schedule state ---
  const [selectedrwId, setSelectedrwId] = useState("RW-02");
  const [mapOrListTab, setMapOrListTab] = useState<"map" | "list">("map");
  const [searchRWQuery, setSearchRWQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Leaderboard active tab state ("weekly" | "monthly")
  const [leaderboardTab, setLeaderboardTab] = useState<"weekly" | "monthly">("weekly");

  // PDF Export simulated states
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Riwayat Table filter & search state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"Semua" | "Masuk" | "Keluar">("Semua");
  
  // --- Resident Pickups State ---
  const [residentPickups, setResidentPickups] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("lengkang_resident_pickups");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "REQ-201",
        wargaName: "Ibu Sumarni",
        wargaPhone: "081234567801",
        wargaAddress: "RW 02 - Sektor Hutan Lengkang, Gang Sentosa No. 12",
        wasteCategory: "Plastik PET Gelas & Botol",
        estimatedWeight: 14.5,
        requestDate: "2026-06-18",
        status: "Menunggu Penugasan"
      },
      {
        id: "REQ-202",
        wargaName: "Bpk. Heri Susanto",
        wargaPhone: "082345678912",
        wargaAddress: "RW 05 - Jl. Hutan Lengkang No. 88, RT 01",
        wasteCategory: "Minyak Jelantah Rumahan",
        estimatedWeight: 22.0,
        requestDate: "2026-06-18",
        status: "Kurir Ditugaskan",
        assignedCourier: "Budi Santoso",
        pickupDate: "2026-06-19",
        pickupTimeSlot: "Pagi (08:00 - 11:00)"
      },
      {
        id: "REQ-203",
        wargaName: "Siti Rahmaawati",
        wargaPhone: "083456789023",
        wargaAddress: "RW 01 - Sektor Plastik Mandiri, RT 03/RW 01",
        wasteCategory: "Kardus Kering Bersih",
        estimatedWeight: 35.0,
        requestDate: "2026-06-19",
        status: "Menunggu Penugasan"
      }
    ];
  });

  // --- Profile State & Persistence ---
  const [profileName, setProfileName] = useState(() => {
    try {
      const stored = localStorage.getItem("lengkang_profile_name");
      return stored || "Ibu Sumarni";
    } catch {
      return "Ibu Sumarni";
    }
  });

  const [profilePhone, setProfilePhone] = useState(() => {
    try {
      const stored = localStorage.getItem("lengkang_profile_phone");
      return stored || "081234567801";
    } catch {
      return "081234567801";
    }
  });

  const [profileAddress, setProfileAddress] = useState(() => {
    try {
      const stored = localStorage.getItem("lengkang_profile_address");
      return stored || "RW 02 - Sektor Hutan Lengkang, Gang Sentosa No. 12";
    } catch {
      return "RW 02 - Sektor Hutan Lengkang, Gang Sentosa No. 12";
    }
  });

  const [pickupFormOpen, setPickupFormOpen] = useState(false);
  const [pWargaName, setPWargaName] = useState(profileName);
  const [pWargaPhone, setPWargaPhone] = useState(profilePhone);
  const [pWargaAddress, setPWargaAddress] = useState(profileAddress);

  const [pCategory, setPCategory] = useState("Plastik PET Gelas & Botol");
  const [pWeight, setPWeight] = useState("12");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profileName);
  const [editPhone, setEditPhone] = useState(profilePhone);
  const [editAddress, setEditAddress] = useState(profileAddress);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Sync edit profile variables when profileName changes
  React.useEffect(() => {
    setPWargaName(profileName);
    setPWargaPhone(profilePhone);
    setPWargaAddress(profileAddress);
    setEditName(profileName);
    setEditPhone(profilePhone);
    setEditAddress(profileAddress);
  }, [profileName, profilePhone, profileAddress]);

  const handleRequestPickup = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = parseFloat(pWeight);
    if (!pWargaName.trim() || !pWargaPhone.trim() || !pWargaAddress.trim() || isNaN(wt) || wt <= 0) {
      alert("Harap isi semua kolom formulir dengan data yang valid!");
      return;
    }

    const newRequest = {
      id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
      wargaName: pWargaName,
      wargaPhone: pWargaPhone,
      wargaAddress: pWargaAddress,
      wasteCategory: pCategory,
      estimatedWeight: wt,
      requestDate: new Date().toISOString().split("T")[0],
      status: "Menunggu Penugasan"
    };

    const updated = [newRequest, ...residentPickups];
    setResidentPickups(updated);
    try {
      localStorage.setItem("lengkang_resident_pickups", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setPWeight("");
    setPickupFormOpen(false);
    alert(`Sukses mengirimkan permintaan penjemputan! ID Anda: ${newRequest.id}. Admin akan segera menugaskan kurir terdekat.`);
  };

  // Sync state changes every 3 seconds
  React.useEffect(() => {
    const syncWithLocal = () => {
      try {
        const stored = localStorage.getItem("lengkang_resident_pickups");
        if (stored) {
          setResidentPickups(JSON.parse(stored));
        }
      } catch (err) {
        console.error(err);
      }
    };
    const interval = setInterval(syncWithLocal, 3000);
    return () => clearInterval(interval);
  }, []);
  
  
  // Mutations data
  const [mutations, setMutations] = useState<Mutation[]>([]);
  const userLevelInfo = getWargaLevel(totalWeight);


  // Form states for adding simulated mutation to show off instant system feedback
  const [simCategory, setSimCategory] = useState("Plastik Sektor Premium");
  const [simWeight, setSimWeight] = useState("10");

  const handleSimulateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(simWeight);
    if (isNaN(w) || w <= 0) {
      alert("Masukkan berat sampah yang valid.");
      return;
    }

    // Assign price multipliers matching App.tsx configs
    let conversionRate = 2500;
    if (simCategory.includes("Kertas")) conversionRate = 1800;
    else if (simCategory.includes("Logam")) conversionRate = 4500;
    else if (simCategory.includes("Organik")) conversionRate = 1000;
    else if (simCategory.includes("E-Waste")) conversionRate = 8000;

    const cashValue = w * conversionRate;
    const newMutation: Mutation = {
      id: "C-" + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().split("T")[0],
      category: simCategory,
      weight: w,
      type: "Masuk",
      amount: cashValue,
      status: "Pending Admin" // First pending for validation simulation
    };

    setMutations([newMutation, ...mutations]);
    setTotalWeight(prev => parseFloat((prev + w).toFixed(1)));
    setBalance(prev => prev + cashValue);
    
    // Reset weight input
    setSimWeight("");
    
    // Auto-resolve pending admin deposit after 4 seconds to make UI alive
    const targetId = newMutation.id;
    setTimeout(() => {
      setMutations(current => 
        current.map(m => m.id === targetId ? { ...m, status: "Sukses" } : m)
      );
    }, 4000);
  };

  const handleWithdrawHandler = (e: React.FormEvent) => {
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="dashboard-warga-view">
      
      {/* 0. HEADER DENGAN TOMBOL KEMBALI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-150 mb-8" id="dashboard-back-header">
        <div className="flex items-center space-x-3.5">
          <button 
            id="back-to-landing-btn"
            onClick={onBack}
            className="group flex items-center justify-center p-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#008444] rounded-xl transition-all cursor-pointer shadow-xs border border-slate-200/50"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-serif font-bold text-neutral-dark tracking-tight">Portal Saldo & Mutasi Warga</h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Pantau tabungan, klaim insentif sembako, dan riwayat daur ulang Lengkang Anda.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:self-center">
          <span className="text-[11px] font-bold font-mono uppercase bg-emerald-50 text-[#008444] border border-emerald-100 py-1.5 px-3 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008444] animate-ping"></span>
            PORTAL WARGA AKTIF
          </span>
          <button
            onClick={onBack}
            className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/50 py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-xs font-sans"
            title="Keluar dari Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Log Out</span>
          </button>
        </div>
      </div>

      {/* SEKSI PROFIL WARGA LENGKANG (PERSISTENT STATE) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-left animate-fade-in" id="profil-warga-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-2">
              <span className="p-1.5 bg-emerald-50 rounded-lg text-primary">👤</span>
              <span>Profil Anggota Koperasi</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola informasi keanggotaan Anda untuk penjemputan daur ulang otomatis dan integrasi data koperasi kelurahan.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => {
              setIsEditingProfile(!isEditingProfile);
              setProfileSuccessMsg("");
            }}
            className="text-xs bg-slate-50 hover:bg-slate-100 text-[#008444] font-bold py-2 px-4 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1 transition-all shrink-0 self-start sm:self-center"
          >
            <span>⚙️</span>
            <span>{isEditingProfile ? "Batal Edit" : "Ubah Info Profil"}</span>
          </button>
        </div>

        {profileSuccessMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200/65 text-emerald-800 text-xs py-2.5 px-4 rounded-xl font-medium animate-fade-in">
            ✅ {profileSuccessMsg}
          </div>
        )}

        {!isEditingProfile ? (
          /* READ-ONLY DISPLAY MODE */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nama Lengkap</span>
              <p className="text-sm font-bold text-slate-800 font-sans">{profileName}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">No. Kontak Handphone / WA</span>
              <p className="text-sm font-bold font-mono text-slate-750">{profilePhone}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Alamat default Penjemputan</span>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">{profileAddress}</p>
            </div>
          </div>
        ) : (
          /* INPUT EDIT FORM MODE */
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!editName.trim() || !editPhone.trim() || !editAddress.trim()) {
              alert("Hubungi Kami / isi dengan rincian data profile yang benar!");
              return;
            }
            
            // Save to localStorage
            try {
              localStorage.setItem("lengkang_profile_name", editName);
              localStorage.setItem("lengkang_profile_phone", editPhone);
              localStorage.setItem("lengkang_profile_address", editAddress);
              
              // Also sync with shared mock database
              const storedDb = localStorage.getItem("lengkang_citizens_database");
              if (storedDb) {
                const list = JSON.parse(storedDb);
                const updated = list.map((c: any) => {
                  if (c.id === "WRG-101") {
                    return { ...c, name: editName, phone: editPhone, address: editAddress };
                  }
                  return c;
                });
                localStorage.setItem("lengkang_citizens_database", JSON.stringify(updated));
              }
            } catch (err) {
              console.error(err);
            }

            setProfileName(editName);
            setProfilePhone(editPhone);
            setProfileAddress(editAddress);
            setIsEditingProfile(false);
            setProfileSuccessMsg("Info profil keanggotaan berhasil diperbarui & disimpan secara lokal!");
          }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-805 outline-none focus:border-[#008444] transition"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-805 outline-none focus:border-[#008444] transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alamat default Penjemputan</label>
              <textarea
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-805 outline-none focus:border-[#008444] transition resize-none"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setEditName(profileName);
                  setEditPhone(profilePhone);
                  setEditAddress(profileAddress);
                }}
                className="bg-white border border-slate-200 text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-[#008444] text-[#ffffff] font-bold py-2 px-5 rounded-xl hover:bg-[#006633] transition cursor-pointer text-xs shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 1. KARTU SALDO UTAMA & TOP STATS (Grid 1 md:3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 scroll-mt-24" id="top-stats-cards">
        
        {/* Kartu Utama (Total Saldo) */}
        <motion.div 
          whileHover={{ scale: 1.025, boxShadow: "0 20px 25px -5px rgba(0, 132, 68, 0.18), 0 8px 10px -6px rgba(0, 132, 68, 0.18)" }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          className="bg-[#008444] text-white rounded-2xl p-6 shadow-md shadow-emerald-950/10 flex flex-col justify-between h-44 relative overflow-hidden group cursor-pointer"
        >
          {/* Decorative Vector Wave behind */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300"></div>
          
          <div>
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block">
              Total Saldo Tabungan
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-3xl font-bold tracking-tight font-sans">
                Rp {balance.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-100 font-mono">Bumi-ID</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
            <button
               id="tarik-saldo-btn"
              onClick={() => { setWithdrawModal(true); setWithdrawType("Uang"); }}
              className="bg-emerald-50 text-emerald-800 hover:bg-white text-xs font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Tarik Saldo</span>
            </button>
            <button
              id="klaim-sembako-btn"
              onClick={() => { setWithdrawModal(true); setWithdrawType("Sembako"); }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Tukar Sembako</span>
            </button>
          </div>
        </motion.div>

        {/* Kartu Sekunder 1 (Total Sampah) */}
        <motion.div 
          whileHover={{ scale: 1.025, boxShadow: "0 15px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)" }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-44 cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Total Berat Sampah
              </span>
              <div className="bg-emerald-100/50 text-primary p-2 rounded-xl">
                <Scale className="w-4 h-4 text-[#008444]" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1 text-slate-800 mt-2">
              <span className="text-3xl font-bold block text-neutral-dark font-sans">
                {totalWeight} <span className="text-lg font-sans font-medium text-slate-400">Kg</span>
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-sans border-t border-slate-100 pt-4 mt-auto">
            <span className="font-semibold text-primary block hover:underline cursor-pointer flex items-center gap-1">
              Hasil akumulasi dari <strong className="font-mono">{mutations.filter(e => e.type === "Masuk").length} kali</strong> setoran daur ulang berkah.
            </span>
          </div>
        </motion.div>

        {/* Kartu Sekunder 2 (Status Insentif) */}
        <motion.div 
          whileHover={{ scale: 1.025, boxShadow: "0 15px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)" }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-44 cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Preferensi Klaim Saat Ini
              </span>
              <div className="bg-emerald-100/50 text-primary p-1.5 rounded-lg">
                <Award className="w-4 h-4 text-[#008444]" />
              </div>
            </div>
            
            <div className="mt-3">
              <span className="text-lg font-serif font-bold text-neutral-dark block text-left">
                {incentivePreference}
              </span>
              <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full mt-1">
                <span className="w-1 h-1 rounded-full bg-[#008444] inline-block animate-pulse"></span>
                <span>AKTIF & SIAP PAKAI</span>
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3.5 mt-auto flex justify-between items-center text-xs">
            <span className="text-slate-405 font-sans">Ubah preferensi:</span>
            <select
              value={incentivePreference}
              onChange={(e) => setIncentivePreference(e.target.value)}
              className="text-xs font-semibold text-primary focus:outline-none cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-md py-1 px-1.5"
            >
              <option value="Paket Sembako Bulanan">Sembako Bulanan</option>
              <option value="Saldo Tunai E-Wallet">Saldo E-Wallet</option>
              <option value="Potongan Iuran Kelurahan">Iuran Kelurahan</option>
              <option value="Voucher Listrik Prabayar">Voucher Listrik</option>
            </select>
          </div>
        </motion.div>

      </div>

      {/* SEKSI NOTIFIKASI & PENJADWALAN KURIR (REAL-TIME SYNCED) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-left animate-fade-in scroll-mt-24" id="warga-courier-notification-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#008444]" />
              <span>Notifikasi &amp; Penjadwalan Kurir Warga</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pantau jadwal penjemputan sampah daur ulang Anda atau ajukan permintaan penjemputan kurir ke rumah Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPickupFormOpen(!pickupFormOpen)}
            className="self-start md:self-center bg-[#008444] hover:bg-[#006633] text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{pickupFormOpen ? "Tutup Formulir" : "Ajukan Penjemputan Kurir"}</span>
          </button>
        </div>

        {/* Form Ajukan Penjemputan Baru */}
        {pickupFormOpen && (
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 mb-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#008444]" />
              <span>Formulir Pengajuan Penjemputan</span>
            </h3>
            <form onSubmit={handleRequestPickup} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Warga</label>
                <input
                  type="text"
                  value={pWargaName}
                  onChange={(e) => setPWargaName(e.target.value)}
                  placeholder="Contoh: Ibu Sumarni"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition"
                  required
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Kontak Ponsel / WA</label>
                <input
                  type="text"
                  value={pWargaPhone}
                  onChange={(e) => setPWargaPhone(e.target.value)}
                  placeholder="Contoh: 081234567801"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition"
                  required
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Estimasi Berat Sampah (Kg)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={pWeight}
                  onChange={(e) => setPWeight(e.target.value)}
                  placeholder="Contoh: 15"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 font-mono outline-none focus:border-[#008444] transition"
                  required
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Kategori Sampah Utama</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition cursor-pointer"
                >
                  <option value="Plastik PET Gelas & Botol">Plastik PET Gelas & Botol</option>
                  <option value="Kardus Kering Bersih">Kardus Kering Bersih</option>
                  <option value="Minyak Jelantah Rumahan">Minyak Jelantah Rumahan</option>
                  <option value="Logam & Besi Tua">Logam & Besi Tua</option>
                  <option value="Layanan E-Waste Khusus">Layanan E-Waste Khusus</option>
                </select>
              </div>

              <div className="md:col-span-8 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Alamat Lengkap Rumah (RT/RW)</label>
                <input
                  type="text"
                  value={pWargaAddress}
                  onChange={(e) => setPWargaAddress(e.target.value)}
                  placeholder="Contoh: RW 02 - Sektor Hutan Lengkang, Gang Sentosa No. 12"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-805 outline-none focus:border-[#008444] transition"
                  required
                />
              </div>

              <div className="md:col-span-12 pt-1 text-right">
                <button
                  type="submit"
                  className="bg-[#008444] hover:bg-[#006633] text-white font-bold py-2 px-5 rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Kirim Permintaan Ke Admin
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Live Notification Streams Cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {residentPickups.slice(0, 4).map((pickup) => {
            const isAssigned = pickup.status === "Kurir Ditugaskan";
            return (
              <div 
                key={pickup.id} 
                className={`p-4 rounded-xl border transition-all ${
                  isAssigned 
                    ? "bg-emerald-50/55 border-emerald-200 shadow-xs" 
                    : "bg-slate-50/50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {pickup.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium font-sans">
                      {pickup.requestDate}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans ${
                    isAssigned 
                      ? "bg-[#008444] text-white" 
                      : "bg-amber-100 text-amber-950 border border-amber-200"
                  }`}>
                    {pickup.status === "Kurir Ditugaskan" ? "Kurir Ditugaskan" : "Menunggu Penugasan"}
                  </span>
                </div>

                <div className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-450">Jenis Sampah:</span>
                    <strong className="text-slate-800">{pickup.wasteCategory} ({pickup.estimatedWeight} Kg)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450">Warga:</span>
                    <span className="text-slate-600 font-medium">{pickup.wargaName}</span>
                  </div>
                  
                  {isAssigned ? (
                    <div className="mt-3 bg-white p-3 rounded-lg border border-emerald-100 space-y-1 text-[11px] leading-relaxed shadow-xs">
                      <div className="flex items-center gap-1.5 text-[#008444] font-bold uppercase tracking-wider text-[10px] mb-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                        <span>Informasi Kurir Lapangan:</span>
                      </div>
                      <p className="text-slate-700">
                        Nama Juru Kurir: <strong className="text-[#008444]">{pickup.assignedCourier}</strong>
                      </p>
                      <p className="text-slate-600">
                        Hari/Sesi Rute: <span className="font-semibold text-slate-800">{pickup.pickupDate} ({pickup.pickupTimeSlot})</span>
                      </p>
                      <p className="text-[10px] text-slate-405 mt-1 italic">
                        *Harap persiapkan timbulan pilahan Anda di depan gerbang/pintu rumah agar memudahkan mempercepat timbangan kurir.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 bg-white/50 p-2.5 rounded-lg border border-dashed border-slate-200 text-[11px] text-slate-500">
                      Permintaan Anda dalam antrean. Petugas admin sedang mendistribusikan armada pick-up kurir berplat operasional ke sektor Anda.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEKSI PETA INTERAKTIF RUTE & JADWAL PENJEMPUTAN RW LENGKANG */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-left animate-fade-in scroll-mt-24" id="peta-rute-jadwal-rw-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-2">
              <Map className="w-5 h-5 text-[#008444]" />
              <span>Peta Rute &amp; Jadwal Penjemputan Sektor RW</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Klik sektor RW pada peta interaktif untuk melihat jadwal pick-up berkah mingguan dan lokasi posko pengumpulan sampah kering terdekat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMapOrListTab("map")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapOrListTab === "map"
                    ? "bg-[#008444] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Peta Interaktif</span>
              </button>
              <button
                type="button"
                onClick={() => setMapOrListTab("list")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapOrListTab === "list"
                    ? "bg-[#008444] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Jadwal Mingguan</span>
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => {
                // Find matching profile address RW or select defaults
                const matchedSector = rwSectors.find(rw => profileAddress.toUpperCase().includes(rw.id.replace("-", " "))) || rwSectors[1]; // default RW-02
                setSelectedrwId(matchedSector.id);
                setMapOrListTab("map");
                alert(`Sektor tempat tinggal Anda terdeteksi di: ${matchedSector.name}! Menyorot sektor pada peta...`);
              }}
              className="text-[11px] font-bold text-[#008444] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-sans"
            >
              <MapPin className="w-3.5 h-3.5 animate-bounce" />
              <span>Sektor Saya</span>
            </button>
          </div>
        </div>

        {mapOrListTab === "map" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* COLUMN 1: INTERACTIVE MAP SVG CANVAS (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50/70 border border-slate-150 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur border border-slate-200/60 py-1 px-2.5 rounded-lg text-[10px] font-bold text-slate-500 flex items-center gap-1 shadow-xs z-10 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                MAP LAYOUT: KELURAHAN LENGKANG
              </div>

              {/* Responsive SVG Container for map */}
              <div className="relative w-full overflow-hidden flex items-center justify-center p-2 mt-4 sm:mt-0" style={{ minHeight: "220px" }}>
                <svg
                  viewBox="0 0 380 170"
                  className="w-full h-auto max-w-[450px] overflow-visible drop-shadow-md"
                >
                  {/* SVG filter for subtle shadow/glow */}
                  <defs>
                    <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* RW Zones rendering */}
                  {rwSectors.map((rw) => {
                    const isSelected = selectedrwId === rw.id;
                    return (
                      <g
                        key={rw.id}
                        className="cursor-pointer transition-all duration-300"
                        onClick={() => setSelectedrwId(rw.id)}
                      >
                        {/* Interactive polygon path */}
                        <path
                          d={rw.svgCoords.path}
                          fill={isSelected ? "#10b981" : "#cbd5e1"}
                          fillOpacity={isSelected ? 0.35 : 0.15}
                          stroke={isSelected ? "#008444" : "#94a3b8"}
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          strokeLinejoin="round"
                          className="hover:fill-emerald-100 hover:fill-opacity-50 hover:stroke-emerald-500 transition-all duration-200"
                          style={{
                            filter: isSelected ? "url(#glow-filter)" : "none"
                          }}
                        />

                        {/* Text inside sector - fallback at centroid coords */}
                        <text
                          x={rw.svgCoords.cx}
                          y={rw.svgCoords.cy - 1}
                          fontSize="9"
                          fontWeight={isSelected ? "bold" : "medium"}
                          textAnchor="middle"
                          fill={isSelected ? "#065f46" : "#475569"}
                          className="select-none pointer-events-none font-mono"
                        >
                          {rw.id}
                        </text>

                        {/* Tiny Pin above selected sector */}
                        {isSelected && (
                          <g transform={`translate(${rw.svgCoords.cx}, ${rw.svgCoords.cy - 12})`}>
                            <circle cx="0" cy="0" r="4.5" fill="#ef4444" className="animate-ping absolute" />
                            <circle cx="0" cy="0" r="3" fill="#ef4444" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Micro Helper Legends inside the box */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[9px] font-mono tracking-tight text-slate-400 uppercase">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-1.5 bg-emerald-200 border border-emerald-500 rounded-sm"></span>
                    <span>Dipilih</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-1.5 bg-slate-100 border border-slate-300 rounded-sm"></span>
                    <span>Sektor Lain</span>
                  </div>
                </div>
              </div>

              {/* Status bar bottom overlay */}
              <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-sans">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Suhu operasional: Posko buka setiap shift terjadwal.</span>
                </span>
                <span className="font-mono text-slate-400">Peta Digital v1.4</span>
              </div>
            </div>

            {/* COLUMN 2: SELECTED RW SEKTOR INFO CARD (5 cols) */}
            {(() => {
              const rw = rwSectors.find(item => item.id === selectedrwId) || rwSectors[0];
              const isDefaultUserRW = profileAddress.toUpperCase().includes(rw.id.replace("-", " "));
              return (
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between" id="rw-detail-card-panel">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="text-left">
                        <span className="inline-flex items-center space-x-1 bg-emerald-50 text-[#008444] text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5">
                          {isDefaultUserRW ? "Sektor Tempat Tinggal Anda ⭐" : "Sektor Kelurahan"}
                        </span>
                        <h3 className="font-serif font-bold text-base text-neutral-dark tracking-tight leading-tight">
                          {rw.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 italic leading-relaxed font-sans">
                          "{rw.desc}"
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-[#008444] text-white p-2 rounded-xl h-9 w-10 flex items-center justify-center shrink-0">
                        {rw.id}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3.5 space-y-2.5 text-xs font-sans text-slate-650">
                      {/* Pick up Schedule */}
                      <div className="flex items-start gap-2.5 text-left">
                        <Calendar className="w-4 h-4 text-emerald-605 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider leading-none mb-1">Jadwal Pick-up Rutin</span>
                          <strong className="text-slate-800 font-sans">{rw.pickupSchedule}</strong>
                          <span className="text-slate-500 font-mono text-[11px] ml-1.5">({rw.pickupTime})</span>
                        </div>
                      </div>

                      {/* Drop off location */}
                      <div className="flex items-start gap-2.5 text-left">
                        <MapPin className="w-4 h-4 text-emerald-605 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider leading-none mb-1">Posko Drop-off</span>
                          <strong className="text-slate-800 font-sans">{rw.dropOffPoint}</strong>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{rw.address}</p>
                        </div>
                      </div>

                      {/* Main waste types */}
                      <div className="flex items-start gap-2.5 text-left">
                        <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider leading-none mb-1">Kategori Unggulan Sektor</span>
                          <span className="text-slate-700 font-semibold text-[11.5px] leading-relaxed">{rw.mainWaste}</span>
                        </div>
                      </div>

                      {/* Capacity status progress bar */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                          <span className="text-slate-500 font-sans">Tingkat Isian Wadah Sektor:</span>
                          <span className={`font-mono font-bold ${
                            rw.capacityStatus === "Hampir Penuh" 
                              ? "text-rose-600" 
                              : rw.capacityStatus === "Menengah"
                                ? "text-amber-600"
                                : "text-emerald-700"
                          }`}>
                            {rw.capacityPct}% ({rw.capacityStatus})
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              rw.capacityPct > 80 
                                ? "bg-rose-500" 
                                : rw.capacityPct > 50 
                                  ? "bg-amber-500" 
                                  : "bg-emerald-500"
                            }`} 
                            style={{ width: `${rw.capacityPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-2 bg-slate-50 p-3 rounded-xl text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-550 flex items-center gap-1 font-sans">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Koordinator:</span> <strong className="text-slate-750">{rw.coordinator}</strong>
                        </span>
                        <a
                          href={`tel:${rw.coordinatorPhone}`}
                          className="font-mono text-[#008444] font-bold hover:underline"
                        >
                          {rw.coordinatorPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(`${rw.dropOffPoint}, Alamat: ${rw.address}`);
                          setCopiedIndex(rw.id);
                          setTimeout(() => setCopiedIndex(null), 2500);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedIndex === rw.id ? "Berhasil Disalin!" : "Salin Alamat Posko"}</span>
                    </button>
                    
                    <a
                      href={`https://wa.me/${rw.coordinatorPhone.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#008444] text-[11px] font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 text-center leading-none font-sans"
                    >
                      <span>💬 Hubungi Pengawas RW</span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* TAB 2: INTERACTIVE SCHEDULES LIST & SEARCH VIEW */
          <div className="space-y-4 animate-fade-in text-left" id="rw-schedules-list-view">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari kelurahan, Sektor RW, hari atau material daur ulang utama..."
                  value={searchRWQuery}
                  onChange={(e) => setSearchRWQuery(e.target.value)}
                  className="bg-white border border-slate-200 p-2.5 pl-3.5 rounded-xl text-xs w-full focus:border-[#008444] focus:outline-none placeholder:text-slate-400 font-sans"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-end shrink-0">
                Pencarian mencocokkan &nbsp;<strong className="text-[#008444] font-bold font-sans">
                  {rwSectors.filter(rw => 
                    rw.name.toLowerCase().includes(searchRWQuery.toLowerCase()) || 
                    rw.id.toLowerCase().includes(searchRWQuery.toLowerCase()) ||
                    rw.pickupSchedule.toLowerCase().includes(searchRWQuery.toLowerCase()) ||
                    rw.mainWaste.toLowerCase().includes(searchRWQuery.toLowerCase())
                  ).length} Sektor RW
                </strong>
              </div>
            </div>

            {/* Weekly Timelines List cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rwSectors
                .filter(rw => 
                  rw.name.toLowerCase().includes(searchRWQuery.toLowerCase()) || 
                  rw.id.toLowerCase().includes(searchRWQuery.toLowerCase()) ||
                  rw.pickupSchedule.toLowerCase().includes(searchRWQuery.toLowerCase()) ||
                  rw.mainWaste.toLowerCase().includes(searchRWQuery.toLowerCase())
                )
                .map((rw) => {
                  const isCurrentRW = profileAddress.toUpperCase().includes(rw.id.replace("-", " "));
                  return (
                    <motion.div
                      whileHover={{ scale: 1.015, boxShadow: "0 6px 10px -1px rgba(0,0,0,0.06)" }}
                      key={rw.id}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between ${
                        isCurrentRW 
                          ? "bg-emerald-50/40 border-emerald-300" 
                          : "bg-white border-slate-200/70"
                      }`}
                    >
                      <div>
                        {/* Sector header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isCurrentRW ? "bg-emerald-200 text-emerald-800" : "bg-slate-100 text-slate-500"
                          }`}>
                            {rw.id} {isCurrentRW && "• RW SAYA ⭐"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            TPS Sektor: {rw.capacityPct}%
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-neutral-dark leading-snug tracking-tight truncate">
                          {rw.name}
                        </h4>

                        <div className="mt-3.5 space-y-2 text-xs font-sans">
                          {/* Schedule time */}
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <p className="text-slate-700 leading-none">
                              <span className="font-semibold text-slate-805">{rw.pickupSchedule}</span>
                              <span className="text-[10.5px] text-slate-450 ml-1 font-mono">({rw.pickupTime})</span>
                            </p>
                          </div>

                          {/* Posko Dropoff */}
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="leading-tight text-left">
                              <span className="text-slate-400 text-[10px] block font-semibold uppercase leading-none mb-0.5">Posko Drop-off</span>
                              <span className="text-slate-700 font-medium">{rw.dropOffPoint}</span>
                            </div>
                          </div>

                          {/* Material */}
                          <div className="flex items-start gap-1.5 pt-1">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-slate-500 leading-snug text-[11px] text-left">
                              Komoditas utama: <span className="text-slate-800 font-semibold">{rw.mainWaste}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Clickable Quick Action selector */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedrwId(rw.id);
                          setMapOrListTab("map");
                        }}
                        className="w-full mt-4 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-[#008444] transition border border-slate-200/40 rounded-lg py-1.5 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer font-sans"
                      >
                        <span>Lihat Lokasi di Peta</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* 2. BODY SECTION : ANALYTICS SUMMARY PANEL & SIMULATION AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8" id="dashboard-middle-row">
        
        {/* Panel Ringkasan Pergerakan Tabungan (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between scroll-mt-24" id="interactive-balance-chart-container">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
              <div className="text-left">
                <h3 className="font-serif font-bold text-lg text-neutral-dark">Ringkasan & Tren Tabungan</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Analisis interaktif perkembangan dana & setoran.</p>
              </div>
              
              {/* Tab Switcher & Export PDF Button */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-lg flex text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("grafik-saldo")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      activeTab === "grafik-saldo" 
                        ? "bg-[#008444] text-white shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Grafik Saldo
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("komposisi-sampah")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      activeTab === "komposisi-sampah" 
                        ? "bg-[#008444] text-white shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Komposisi
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPdfModalOpen(true)}
                  className="bg-slate-50 hover:bg-slate-100 text-[#008444] border border-[#008444]/20 p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Unduh Laporan Mutasi PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>

            {activeTab === "grafik-saldo" ? (
              /* INTERACTIVE GRADIENT SVG LINE CHART WITH HOVER TOOLTIP */
              <div className="relative mt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                  <span>Rp 450.000 max</span>
                  <span className="text-primary font-bold animate-pulse">● Gerakkan kursor ke titik grafik</span>
                </div>
                
                <div className="relative bg-slate-50/50 border border-slate-150 rounded-2xl p-4 overflow-visible">
                  <svg 
                    viewBox="0 0 420 160" 
                    className="w-full h-auto overflow-visible"
                    style={{ maxHeight: "190px" }}
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#008444" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#008444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid horizontal guidelines */}
                    <line x1="30" y1="20" x2="390" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3"/>
                    <line x1="30" y1="60" x2="390" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3"/>
                    <line x1="30" y1="100" x2="390" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3"/>
                    <line x1="30" y1="140" x2="390" y2="140" stroke="#e2e8f0" strokeWidth="1"/>

                    {/* dynamic calculations */}
                    {(() => {
                      const points = [
                        { m: "Jan", val: 120000, x: 40 },
                        { m: "Feb", val: 210000, x: 110 },
                        { m: "Mar", val: 180000, x: 180 },
                        { m: "Apr", val: 290000, x: 250 },
                        { m: "Mei", val: 340000, x: 320 },
                        { m: "Jun", val: balance, x: 380 },
                      ].map(p => {
                        const minVal = 100000;
                        const maxVal = 440000;
                        const range = maxVal - minVal;
                        const height = 110;
                        const y = 140 - ((p.val - minVal) / range) * height;
                        return { ...p, y };
                      });

                      // generate path
                      const pathD = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                      const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                      return (
                        <>
                          {/* Gradient area */}
                          <path d={areaD} fill="url(#chartGradient)" />

                          {/* Smooth curved/joined trace line */}
                          <path d={pathD} fill="none" stroke="#008444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Circles & Hovers overlay */}
                          {points.map((p) => {
                            const isHovered = hoveredPoint?.month === p.m;
                            return (
                              <g 
                                key={p.m}
                                className="cursor-pointer"
                                onMouseEnter={(e) => {
                                  setHoveredPoint({
                                    month: p.m,
                                    value: p.val,
                                    x: p.x,
                                    y: p.y
                                  });
                                }}
                                onMouseLeave={() => setHoveredPoint(null)}
                              >
                                {/* Invisible larger hover target circle for easier mobile/desktop touching */}
                                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                                {/* Outer pulse ring on hover */}
                                {isHovered && (
                                  <circle cx={p.x} cy={p.y} r="8" fill="#10b981" opacity="0.4" />
                                )}

                                {/* Main node circle */}
                                <circle 
                                  cx={p.x} 
                                  cy={p.y} 
                                  r={isHovered ? "5" : "3.5"} 
                                  fill={isHovered ? "#008444" : "#ffffff"} 
                                  stroke="#008444" 
                                  strokeWidth="2.5" 
                                  className="transition-all duration-150"
                                />

                                {/* Label at bottom */}
                                <text x={p.x} y="153" fontSize="8.5" textAnchor="middle" fill="#94a3b8" className="font-mono">{p.m}</text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Absolute-positioned Interactive Hover Tooltip */}
                  {hoveredPoint && (
                    <div 
                      className="absolute z-10 bg-slate-900 text-white rounded-lg p-2.5 shadow-md pointer-events-none text-[10px] space-y-0.5 animate-fade-in-fast font-sans"
                      style={{ 
                        left: `${(hoveredPoint.x / 420) * 100}%`, 
                        top: `${(hoveredPoint.y / 160) * 80}%`, 
                        transform: "translate(-50%, -115%)" 
                      }}
                    >
                      <p className="font-bold text-slate-300 uppercase tracking-wider text-[8px] leading-none">{hoveredPoint.month} (Pemberkatan)</p>
                      <p className="font-mono text-xs font-black text-emerald-400">Rp {hoveredPoint.value.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
                  <span className="flex items-center gap-1 text-slate-500 font-sans">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Akumulasi Riwayat Saldo Bulanan Anda
                  </span>
                  <span className="font-mono text-[10px]">Tingkat Akumulasi: +38.4%</span>
                </div>
              </div>
            ) : (
              /* Tab 2: ORIGINAL COMPOSITION BAR CHARTS */
              <div className="space-y-4 py-2" id="composition-charts-container">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-650 mb-1.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#008444] inline-block"></span>
                      Sampah Terpilah Premium (Plastik/Logam)
                    </span>
                    <span className="font-mono text-slate-700">72% porsi</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#008444] rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-650 mb-1.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
                      Sampah Organik Bersih (Kompos)
                    </span>
                    <span className="font-mono text-slate-700">18% porsi</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "18%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-650 mb-1.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block"></span>
                      Kertas & Kardus Daur Ulang
                    </span>
                    <span className="font-mono text-slate-700">10% porsi</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Interactive Information Banner */}
            <div className="mt-5 p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-700">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Lengkang Eco-Sircle Benefits</span>
              </div>
              <p className="text-slate-500 leading-relaxed font-sans">
                Setiap 10 Kg penambahan berat sampah disetor meningkatkan poin pengali klaim Sebesar <strong className="text-primary font-mono">+1.2x multiplier</strong> untuk penukaran sembako di pekan terakhir bulan berjalan.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-5 flex justify-between gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-[#008444] font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Sistem Terverifikasi DLH 2026
            </span>
            <span className="font-mono">ID Warga: ID-88481-JKT</span>
          </div>
        </div>

        {/* Panel Simulasi Tambah Deposito Baru (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleSimulateDeposit} className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-neutral-dark">Simulasi Setor Sampah Instan</h3>
              <p className="text-xs text-slate-400 mt-0.5">Uji coba langsung pertambahan saldo secara instan saat menyetor sampah simulasi.</p>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Kategori Sampah Simulasi
              </label>
              <select
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-neutral-dark font-sans cursor-pointer focus:border-[#008444] outline-none"
              >
                <option value="Plastik Sektor Premium">Plastik Sektor Premium (Rp2.500/kg)</option>
                <option value="Kertas, Kardus & Karton">Kertas, Kardus & Karton (Rp1.800/kg)</option>
                <option value="Logam & Aluminium Premium">Logam & Aluminium (Rp4.500/kg)</option>
                <option value="Sampah Organik Bersih">Sampah Organik Bersih (Rp1.000/kg)</option>
                <option value="Layanan E-Waste Khusus">Layanan E-Waste Khusus (Rp8.000/kg)</option>
              </select>
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Berat Sampah (Kilogram)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={simWeight}
                onChange={(e) => setSimWeight(e.target.value)}
                placeholder="Contoh: 15.2"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:border-[#008444] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#008444] hover:bg-primary-hover text-white py-2.5 px-4 rounded-xl font-bold text-xs transition duration-200 cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
            >
              <Leaf className="w-4 h-4" />
              <span>Simulasikan Setoran Sampah</span>
            </button>
          </form>

          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100/50 rounded-lg text-[10px] text-emerald-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008444] inline-block animate-pulse" />
            <span>Setoran simulasi akan otomatis berstatus <span className="font-bold">Pending Admin</span> dan berubah menjadi <span className="font-bold">Sukses</span> dalam 4 detik.</span>
          </div>
        </div>

      </div>

      {/* 3. TABEL RIWAYAT MUTASI SALDO (Anti-Crash Layar HP) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 scroll-mt-24" id="riwayat-mutasi-section">
        {/* FILTER & CARI PANEL FOR TRANSACTIONS */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-150 mb-6 mt-4">
          <div className="text-left">
            <h3 className="font-serif font-bold text-xl text-neutral-dark">Riwayat Mutasi Tabungan</h3>
            <p className="text-xs text-slate-450 mt-0.5 font-sans">Pantau sebaran mutasi masuk dan penarikan tunai yang terdaftar.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search input field */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari ID / Kategori..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-250 p-2 pl-3 rounded-lg text-xs w-full sm:w-48 focus:border-[#008444] focus:outline-none placeholder:text-slate-400 font-sans"
              />
            </div>

            {/* Filter buttons */}
            <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTypeFilter("Semua")}
                className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                  typeFilter === "Semua" 
                    ? "bg-white text-slate-900 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("Masuk")}
                className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                  typeFilter === "Masuk" 
                    ? "bg-white text-emerald-800 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Setor (+)
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("Keluar")}
                className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                  typeFilter === "Keluar" 
                    ? "bg-white text-amber-900 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Tarik/Klaim (-)
              </button>
            </div>

            {/* Refresh Sync Button */}
            <button
              onClick={() => {
                alert("Semua data transaksi terbaru berhasil di-sinkronisasi dengan server Lengkang Cloud!");
              }}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition cursor-pointer flex items-center justify-center shrink-0"
              title="Sinkronisasi Server"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pembungkus Aman (Scroll Guard) mencegah Layout HP Rusak */}
        <div className="w-full overflow-x-auto rounded-xl border border-slate-100" id="mutasi-table-scroll-guard">
          {(() => {
            const filteredMutations = mutations.filter((m) => {
              const matchesSearch = m.category.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
              if (typeFilter === "Masuk") return matchesSearch && m.type === "Masuk";
              if (typeFilter === "Keluar") return matchesSearch && m.type === "Keluar";
              return matchesSearch;
            });

            if (filteredMutations.length === 0) {
              return (
                <div className="py-12 text-center text-slate-450 space-y-2 bg-slate-50/20">
                  <div className="font-bold text-slate-500">Hasil Tidak Ditemukan</div>
                  <div className="text-slate-400 font-sans">Kata kunci "{searchQuery}" atau filter tidak mencocokkan riwayat mutasi mana pun.</div>
                </div>
              );
            }

            return (
              <table className="w-full border-collapse text-left text-xs text-slate-600 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-700 font-bold">
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">ID Mutasi</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Tanggal</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Kategori / Transaksi</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-center">Berat (Kg)</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-center">Jenis Mutasi</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Rupiah (Rp)</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-center">Status Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-sans">
                  {filteredMutations.map((mutation, i) => {
                    const isDeposit = mutation.type === "Masuk";
                    return (
                      <motion.tr 
                        key={mutation.id} 
                        whileHover={{ scale: 1.006, backgroundColor: "rgba(16, 185, 129, 0.04)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}
                        transition={{ duration: 0.15 }}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                      >
                        {/* ID Column */}
                        <td className="px-5 py-4 shrink-0">
                          <span className="font-mono font-bold text-slate-800">{mutation.id}</span>
                        </td>

                        {/* Date Column */}
                        <td className="px-5 py-4 text-slate-500 font-mono">
                          {mutation.date}
                        </td>

                        {/* Category Column */}
                        <td className="px-5 py-4 font-medium text-slate-800">
                          {mutation.category}
                        </td>

                        {/* Weight Column */}
                        <td className="px-5 py-4 text-center text-slate-600 font-mono font-bold">
                          {mutation.weight > 0 ? `${mutation.weight} Kg` : "-"}
                        </td>

                        {/* Mutation Type Column */}
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                            isDeposit 
                              ? "bg-emerald-50 text-emerald-800" 
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {isDeposit ? (
                              <>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#008444] mr-0.5" />
                                <span>Setor (+)</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownLeft className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
                                <span>Tarik (-)</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Nominal Column */}
                        <td className={`px-5 py-4 text-right font-mono font-bold text-sm ${isDeposit ? "text-emerald-700" : "text-neutral-dark"}`}>
                          {isDeposit ? "+" : "-"}Rp {mutation.amount.toLocaleString()}
                        </td>

                        {/* Validation Status Column */}
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-sm ${
                            mutation.status === "Sukses"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            <span className={`w-1 h-1 rounded-full inline-block ${mutation.status === "Sukses" ? "bg-emerald-700" : "bg-amber-600 animate-pulse"}`} />
                            <span>{mutation.status}</span>
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>

      {/* 4. FOOTER MINI DASHBOARD (Bantuan Cepat) */}
      <div 
        id="dashboard-mini-footer"
        className="w-full bg-[#f8fafc] border border-slate-250 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 mt-8"
      >
        <div className="flex items-center space-x-2.5 text-left">
          <div className="bg-slate-200 text-slate-650 p-2 rounded-xl">
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <span className="font-bold text-neutral-dark block leading-none">Mengalami Selisih Saldo / Timbangan?</span>
            <span className="text-slate-400">Tim pengawas Lengkang siap menginvestigasi ulang dalam 1 jam secara transparan.</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            referrerPolicy="no-referrer"
            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl transition"
          >
            Hubungi WhatsApp Pengawas
          </a>
        </div>
      </div>

      {/* WITHDRAW / KLAIM MODAL */}
      {withdrawModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 transition-all" id="withdrawal-modal-overlay">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-100 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-neutral-dark">
                  {withdrawType === "Uang" ? "Tarik Saldo Ke Rekening/E-Wallet" : "Tukar Saldo Dengan Sembako"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Saldo saat ini: <strong>Rp {balance.toLocaleString()}</strong></p>
              </div>
              <button 
                onClick={() => setWithdrawModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              >
                ✕
              </button>
            </div>

            {withdrawalSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-serif font-bold text-base text-neutral-dark">Permintaan Berhasil Dikirim</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
                  Permintaan saldo Anda sedang diproses oleh admin Lengkang. Status mutasi akan terupdate dalam 5 detik.
                </p>
                <div className="bg-slate-50 rounded-lg p-2 font-mono text-xs text-slate-400 inline-block mt-3">
                  ID VALIDASI: CLM-{Math.floor(Math.random() * 8000) + 2000}
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdrawHandler} className="space-y-4 font-sans text-xs">
                {/* Type specific instructions */}
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-slate-600">
                  {withdrawType === "Uang" ? (
                    <span>Tarik saldo langsung menjadi uang elektronik (OVO, Gopey, Dana, LinkAja) atau Bank Transfer instan bebas biaya admin.</span>
                  ) : (
                    <span>Pilih nominal penukaran untuk Paket Sembako (Beras, Minyak goreng, Gula pasir) untuk dijemput atau diantar kurir.</span>
                  )}
                </div>

                {/* Amount input */}
                <div>
                  <label className="block font-bold text-slate-600 mb-1.5">Nominal Penarikan (Rp)</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Contoh: 50000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-sm focus:border-[#008444] outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Minimal penarikan sebesar Rp 10.000.</span>
                </div>

                {/* Transfer destination field */}
                {withdrawType === "Uang" ? (
                  <div>
                    <label className="block font-bold text-slate-600 mb-1.5">Pilih E-Wallet / Bank Tujuan</label>
                    <select className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 focus:border-[#008444] cursor-pointer">
                      <option>GoPay Mandiri</option>
                      <option>OVO Cash</option>
                      <option>DANA ID</option>
                      <option>Bank Mandiri (013)</option>
                      <option>Bank BCA (432)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-600 mb-1.5">Kategori Paket Sembako</label>
                    <select className="w-full bg-slate-55 border border-slate-200 rounded-lg p-2.5 focus:border-[#008444] cursor-pointer">
                      <option>Paket Sembako Sehat A (Minyak + Beras 5Kg)</option>
                      <option>Paket Sembako Sehat B (Gula + Susu + Terigu)</option>
                      <option>Beras Premium Cianjur Mandiri (10Kg)</option>
                    </select>
                  </div>
                )}

                {/* Destination account number name */}
                <div>
                  <label className="block font-bold text-slate-600 mb-1.5">
                    {withdrawType === "Uang" ? "Nomor Rekening / No Handphone E-Wallet" : "Alamat Penjemputan Paket"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={withdrawType === "Uang" ? "Contoh: 08123456789" : "Contoh: Diambil di Pos RW 02 / kirim ke alamat rumah"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-[#008444] outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWithdrawModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#008444] hover:bg-[#006633] text-white font-bold py-2 px-5 rounded-xl cursor-pointer shadow-xs"
                  >
                    Konfirmasi Penarikan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. PDF REPORT SIMULATOR MODAL OVERLAY */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto" id="pdf-export-modal-backdrop">
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 shadow-2xl border border-slate-100 my-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-secondary/15 mb-4">
              <div className="text-left">
                <h3 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#008444]" />
                  <span>Ekspor Laporan Resmi Tabungan (PDF)</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Dapatkan salinan digital resmi untuk kebutuhan administrasi kelurahan atau klaim asuransi.</p>
              </div>
              <button 
                onClick={() => {
                  setPdfModalOpen(false);
                  setPdfDownloaded(false);
                  setPdfGenerating(false);
                }}
                className="p-1 px-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Action & Status Panel */}
            <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-4 mb-5 text-xs text-slate-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left font-sans space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>
                    <span>Tanda Tangan Digital Terverifikasi</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">Enkripsi ledger menggunakan SHA-256 Pemda DKI Jakarta.</p>
                </div>

                <div className="w-full sm:w-auto flex justify-end">
                  {pdfGenerating ? (
                    <div className="flex flex-col items-center sm:items-end w-full sm:w-48 gap-1.5">
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#008444] h-full rounded-full animate-[pulse_1s_infinite]" style={{ width: "70%" }}></div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800">Menyusun halaman PDF...</span>
                    </div>
                  ) : pdfDownloaded ? (
                    <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-emerald-200">
                      <CheckCircle className="w-4 h-4" />
                      <span>Berhasil Diunduh!</span>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => {
                        setPdfGenerating(true);
                        setTimeout(() => {
                          setPdfGenerating(false);
                          setPdfDownloaded(true);
                          // Trigger standard print mockup to feel native
                          setTimeout(() => {
                            window.print();
                          }, 100);
                        }, 1800);
                      }}
                      className="bg-[#008444] hover:bg-[#006633] text-white font-bold py-2.5 px-6 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                      <Download className="w-4 h-4 animate-bounce" />
                      <span>Unduh & Cetak PDF</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Real aesthetic PDF Ledger Mockup Preview */}
            <div className="border border-dashed border-slate-300 p-6 bg-slate-50/50 rounded-xl max-h-[350px] overflow-y-auto text-left" id="pdf-receipt-monochrome-mock">
              
              {/* Receipt Header */}
              <div className="text-center pb-5 border-b border-slate-300 mb-5 relative">
                <div className="font-serif text-base font-black tracking-tight text-neutral-dark uppercase">KOPERASI BANK SAMPAH LENGKANG</div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-1">Lembaga Pemberdayaan Lingkungan RW 02 - DKI Jakarta</div>
                <div className="absolute right-0 top-0 bg-neutral-dark text-white px-2 py-0.5 rounded font-mono text-[8px] font-bold">MUTASI RESMI</div>
              </div>

              {/* Receipt metadata pairs */}
              <div className="grid grid-cols-2 gap-4 text-[11px] mb-5 font-sans leading-relaxed text-slate-500">
                <div className="space-y-1">
                  <div>Nama Anggota: <span className="font-bold text-neutral-dark">lengkangw@gmail.com</span></div>
                  <div>ID Warga Resmi: <span className="font-mono text-neutral-dark">ID-88481-JKT</span></div>
                  <div>Periode Laporan: <span className="text-neutral-dark">Juni 2026 (Aktif)</span></div>
                </div>
                <div className="space-y-1 text-right">
                  <div>Dicetak Pada: <span className="font-mono text-neutral-dark">{new Date().toISOString().split("T")[0]}</span></div>
                  <div>Total Berat Disetor: <span className="font-bold text-neutral-dark">{totalWeight} Kg</span></div>
                  <div>Saldo Akhir Bersih: <span className="text-emerald-700 font-bold font-mono text-xs">Rp {balance.toLocaleString()}</span></div>
                </div>
              </div>

              {/* PDF Transactions List Table */}
              <table className="w-full border-collapse text-left text-[10px] text-slate-600">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="py-2">ID</th>
                    <th className="py-2">Tanggal</th>
                    <th className="py-2">Uraian Setoran / Penarikan</th>
                    <th className="py-2 text-right">Berat (Kg)</th>
                    <th className="py-2 text-right">Status</th>
                    <th className="py-2 text-right">Jumlah Saldo (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-250 font-mono">
                  {mutations.map((m) => {
                    const isPlus = m.type === "Masuk";
                    return (
                      <tr key={m.id} className="text-slate-600">
                        <td className="py-2 pr-2 font-bold">{m.id}</td>
                        <td className="py-2 pr-2 text-slate-450">{m.date}</td>
                        <td className="py-2 pr-2 text-slate-800 font-sans font-medium">{m.category}</td>
                        <td className="py-2 text-right">{m.weight > 0 ? `${m.weight} Kg` : "-"}</td>
                        <td className="py-2 text-right text-[9px] text-[#008444] font-sans font-semibold">{m.status}</td>
                        <td className={`py-2 text-right font-bold ${isPlus ? "text-emerald-700" : "text-neutral-dark"}`}>
                          {isPlus ? "+" : "-"}Rp {m.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Receipt Footer Signature */}
              <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-400">
                <span>Dokumen ini disinkronisasi langsung dengan Lengkang Green Blockchain.</span>
                <span className="font-mono text-[8px]">QR-HASH: BSCSL-2026-99388B</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 mt-5">
              <button
                type="button"
                onClick={() => {
                  setPdfModalOpen(false);
                  setPdfDownloaded(false);
                  setPdfGenerating(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-xl cursor-pointer text-xs"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
