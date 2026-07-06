import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Phone, ShieldAlert, BadgeInfo, CheckCircle, XCircle, Info, Edit3, 
  Trash2, RefreshCw, Star, Download, Printer, TrendingUp, Check, 
  AlertCircle, ChevronRight, Scale, Leaf, Truck, UserCheck, QrCode,
  MessageSquare, Send, Calendar, MapPin, Clock, Plus, Navigation, Compass, Radio, Map, Activity, Play, Milestone, Search, Navigation2, CheckSquare, Sparkles,
  Camera, Eye, Moon, AlertTriangle, PlayCircle, ClipboardList, RefreshCw as SpinIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import KurirStatsWidget from "./KurirStatsWidget";
import { fetchPickups, updatePickup } from "../../services/api";

interface DashboardKurirProps {
  onBack: () => void;
  courierEmail: string;
}

interface ResidentPickup {
  id: string;
  wargaName: string;
  wargaPhone: string;
  wargaAddress: string;
  wasteCategory: string;
  estimatedWeight: number;
  requestDate: string;
  status: string;
  assignedCourier?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  obstacleReason?: string;
  obstacleNote?: string;
  actualWeight?: number;
  completedAt?: string;
}

export default function DashboardKurir({ onBack, courierEmail }: DashboardKurirProps) {
  // Navigation active tab: 'tugas' | 'peta' | 'scan' | 'riwayat'
  const [activeTab, setActiveTab] = useState<"tugas" | "peta" | "scan" | "riwayat">("tugas");
  
  // Custom interactive map active item
  const [selectedMapPickup, setSelectedMapPickup] = useState<ResidentPickup | null>(null);
  
  // Real-time custom sync feedback animation screen overlay state
  const [syncFeedback, setSyncFeedback] = useState<{
    show: boolean;
    title: string;
    description: string;
    pointsGained?: number;
    insentifGained?: number;
  } | null>(null);

  // Sync Top Navbar events with local activeTab
  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && ["tugas", "peta", "scan", "riwayat"].includes(customEvent.detail)) {
        setActiveTab(customEvent.detail as any);
        // Scroll to the main content area smoothly
        const el = document.getElementById("courier-profile-card-header");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    window.addEventListener("switch-kurir-tab", handleSwitchTab);
    return () => {
      window.removeEventListener("switch-kurir-tab", handleSwitchTab);
    };
  }, []);
  
  // Storage lists
  const [pickups, setPickups] = useState<ResidentPickup[]>([]);
  const [citizens, setCitizens] = useState<any[]>([]);
  
  // Real-time states for Stats Widget
  const [completedCount, setCompletedCount] = useState(8);
  const [totalCount, setTotalCount] = useState(10);
  const [totalWeight, setTotalWeight] = useState(145);
  const [voucherBensin, setVoucherBensin] = useState(20000);

  // States for bottom sheet obstacle dialog
  const [isObstacleOpen, setIsObstacleOpen] = useState(false);
  const [selectedPickupForObstacle, setSelectedPickupForObstacle] = useState<ResidentPickup | null>(null);
  const [obstacleReason, setObstacleReason] = useState("Rumah Warga Terkunci / Kosong");
  const [obstacleNote, setObstacleNote] = useState("");

  // States for Weigh-in "Selesaikan" Modal
  const [isWeighInOpen, setIsWeighInOpen] = useState(false);
  const [selectedPickupForWeigh, setSelectedPickupForWeigh] = useState<ResidentPickup | null>(null);
  const [actualWeightInput, setActualWeightInput] = useState<number>(0);
  const [selectedPricePerKg, setSelectedPricePerKg] = useState<number>(3500);

  // QR Scanning Simulation States
  const [simulatedCitizen, setSimulatedCitizen] = useState<any | null>(null);
  const [qrScanningActive, setQrScanningActive] = useState(false);
  const [qrSuccessMsg, setQrSuccessMsg] = useState("");
  const [manualCitizenId, setManualCitizenId] = useState("");
  const [qrWasteCategory, setQrWasteCategory] = useState("Plastik PET Gelas/Botol");
  const [qrWeightInput, setQrWeightInput] = useState<number>(5);

  // Load and sync database
  const loadLocalStorageData = () => {
    try {
      // Pickups
      const storedPickups = localStorage.getItem("lengkang_resident_pickups");
      let activePickups: ResidentPickup[] = [];
      if (storedPickups) {
        activePickups = JSON.parse(storedPickups);
      } else {
        // Mock fallback to seed if empty
        const defaultPickups = [
          {
            id: "REQ-201",
            wargaName: "Ibu Sumarni",
            wargaPhone: "081234567801",
            wargaAddress: "RW 02 - Sektor Hutan Lengkang, Gang Sentosa No. 12",
            wasteCategory: "Plastik PET Gelas & Botol",
            estimatedWeight: 14.5,
            requestDate: "2026-06-18",
            status: "Kurir Ditugaskan",
            assignedCourier: "Budi Santoso",
            pickupDate: "2026-06-19",
            pickupTimeSlot: "Pagi (08:00 - 11:00)"
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
            wargaName: "Ibu Aminah",
            wargaPhone: "085299881144",
            wargaAddress: "RW 02 - Gang Kamboja No. 5 Gg. Samping Masjid",
            wasteCategory: "Kardus Kering Bersih",
            estimatedWeight: 8.5,
            requestDate: "2026-06-19",
            status: "Kurir Ditugaskan",
            assignedCourier: "Budi Santoso",
            pickupDate: "2026-06-19",
            pickupTimeSlot: "Siang (13:00 - 15:00)"
          },
          {
            id: "REQ-204",
            wargaName: "Pak Triyono",
            wargaPhone: "081299335500",
            wargaAddress: "RW 06 - Kompleks Perum Kelapa Tua Sektor C-4",
            wasteCategory: "E-Waste / Elektronik",
            estimatedWeight: 5.2,
            requestDate: "2026-06-19",
            status: "Menunggu Penugasan"
          }
        ];
        localStorage.setItem("lengkang_resident_pickups", JSON.stringify(defaultPickups));
        activePickups = defaultPickups;
      }
      setPickups(activePickups);

      // Citizens database
      const storedCitizens = localStorage.getItem("lengkang_citizens_database");
      if (storedCitizens) {
        setCitizens(JSON.parse(storedCitizens));
      }

      // Sync stats widget counters
      const bensinStored = localStorage.getItem("lengkang_kurir_bensin_voucher");
      if (bensinStored) {
        setVoucherBensin(parseInt(bensinStored, 10));
      } else {
        localStorage.setItem("lengkang_kurir_bensin_voucher", "20000");
        setVoucherBensin(20000);
      }

      // Calculate dynamically:
      // Completed are status === "Selesai" or "Selesai (Ditimbang)"
      const budgetItems = activePickups.filter(p => p.assignedCourier === "Budi Santoso" || p.assignedCourier === courierEmail);
      const doneItems = budgetItems.filter(p => p.status === "Selesai" || p.status.startsWith("Selesai"));
      const doneCount = doneItems.length;
      
      setCompletedCount(8 + doneCount); 
      setTotalCount(10 + budgetItems.length);
      
      const addedWeight = doneItems.reduce((acc, current) => acc + (current.actualWeight || 0), 0);
      setTotalWeight(145 + Math.round(addedWeight));

    } catch (e) {
      console.error("Error loaded courier storage data", e);
    }
  };

  const courierUserId = parseInt(localStorage.getItem("lengkang_authenticated_user_id") || "2");
  const loadPickupsFromDB = () => {
    fetchPickups({ courier_id: courierUserId }).then((res) => {
      if (res.ok && res.data) {
        setPickups(res.data);
      }
    });
  };

  useEffect(() => {
    loadLocalStorageData();
    loadPickupsFromDB();
    const interval = setInterval(loadPickupsFromDB, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [courierEmail]);

  // Handle Obstacle Bottom Sheet Submission
  const handleObstacleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickupForObstacle) return;

    try {
      updatePickup(selectedPickupForObstacle.id, {
        status: "Kendala Lapangan",
        notes: `${obstacleReason}: ${obstacleNote.trim()}`
      }).then((res) => {
        if (res.ok) {
          loadPickupsFromDB();
          setSelectedPickupForObstacle(null);
        } else {
          alert("Gagal memperbarui kendala: " + (res.error || "Kesalahan server"));
        }
      });

      // Create Admin notice for obstacle
      const adminNotifsStr = localStorage.getItem("lengkang_admin_live_notifications");
      const adminNotifs = adminNotifsStr ? JSON.parse(adminNotifsStr) : [];
      const newAlert = {
        id: `ALERT-OBST-${selectedPickupForObstacle.id}-${Date.now()}`,
        type: "pickup",
        title: "KENDALA LAPANGAN!",
        desc: `Kurir melaporkan kendala di ${selectedPickupForObstacle.wargaName} - ${obstacleReason}: "${obstacleNote || 'Tidak ada catatan'}"`,
        timestamp: new Date().toISOString(),
        read: false
      };
      localStorage.setItem("lengkang_admin_live_notifications", JSON.stringify([newAlert, ...adminNotifs]));

      // Create Citizen notice
      const citizenNotifsStr = localStorage.getItem("lengkang_citizen_notifications") || "[]";
      const citizenNotifs = JSON.parse(citizenNotifsStr);
      const citizenAlert = {
        id: `NOTIF-OBST-${Date.now()}`,
        title: "Penjemputan Tertunda",
        text: `Kurir melaporkan kendala penjemputan: ${obstacleReason}. Catatan: ${obstacleNote || "-"}`,
        time: "Baru Saja",
        unread: true
      };
      localStorage.setItem("lengkang_citizen_notifications", JSON.stringify([citizenAlert, ...citizenNotifs]));

      // Reset
      setIsObstacleOpen(false);
      setSelectedPickupForObstacle(null);
      setObstacleReason("Rumah Warga Terkunci / Kosong");
      setObstacleNote("");
      
      // Sync stats count
      loadLocalStorageData();

      alert(`✅ Laporan Kendala Lapangan berhasil dikirim ke Admin & Warga secara real-time.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Open Weigh-In Completion modal
  const handleOpenWeighModal = (pickup: ResidentPickup) => {
    setSelectedPickupForWeigh(pickup);
    setActualWeightInput(pickup.estimatedWeight || 0);
    setIsWeighInOpen(true);
  };

  // Handle Weigh-in Submit ("Timbang & Selesaikan")
  const handleWeighInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickupForWeigh) return;

    try {
      const parsedWeight = parseFloat(actualWeightInput.toString()) || 0;

      updatePickup(selectedPickupForWeigh.id, {
        status: "Selesai",
        actual_weight: parsedWeight,
        notes: "Timbangan kurir"
      }).then((res) => {
        if (res.ok) {
          loadPickupsFromDB();
          setIsWeighInOpen(false);
        } else {
          alert("Gagal memperbarui timbangan: " + (res.error || "Kesalahan server"));
        }
      });

      // 2. Insert into "lengkang_pending_deposits" for Admin review
      const pendingDepsStr = localStorage.getItem("lengkang_pending_deposits");
      const pendingDeps = pendingDepsStr ? JSON.parse(pendingDepsStr) : [];
      
      const newDeposit = {
        id: "DEP-" + Math.floor(1000 + Math.random() * 9000),
        warga: `${selectedPickupForWeigh.wargaName} (${selectedPickupForWeigh.wargaAddress.split("-")[0].trim() || 'RW 02'})`,
        tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        kategori: selectedPickupForWeigh.wasteCategory,
        weightAI: selectedPickupForWeigh.estimatedWeight,
        weightCourier: parsedWeight,
        status: "Pending"
      };
      
      localStorage.setItem("lengkang_pending_deposits", JSON.stringify([newDeposit, ...pendingDeps]));

      // 3. Award petrol coupon/voucher Rp5.000
      const newBensin = voucherBensin + 5000;
      localStorage.setItem("lengkang_kurir_bensin_voucher", newBensin.toString());
      setVoucherBensin(newBensin);

      // 4. Update Citizen balance (Lengkang Green Points) directly if they are in the database!
      const citizenMatch = citizens.find(
        c => c.name.toLowerCase() === selectedPickupForWeigh.wargaName.toLowerCase() || 
        c.phone === selectedPickupForWeigh.wargaPhone
      );
      
      const calculatedPoints = Math.round(parsedWeight * selectedPricePerKg);
      
      if (citizenMatch) {
         const updatedCitizens = citizens.map((c) => {
           if (c.id === citizenMatch.id) {
             return {
               ...c,
               balance: (c.balance || 0) + calculatedPoints
             };
           }
           return c;
         });
         localStorage.setItem("lengkang_citizens_database", JSON.stringify(updatedCitizens));
         setCitizens(updatedCitizens);
      }

      // 5. Create Notification for Citizen
      const citizenNotifsStr = localStorage.getItem("lengkang_citizen_notifications") || "[]";
      const citizenNotifs = JSON.parse(citizenNotifsStr);
      const citizenAlert = {
        id: `NOTIF-DONE-${Date.now()}`,
        title: "Setoran Sampah Berhasil",
        text: `Kurir telah menimbang fisik seberat ${parsedWeight} Kg (${selectedPickupForWeigh.wasteCategory}). Selamat, poin Anda bertambah +${calculatedPoints.toLocaleString()} Koin!`,
        time: "Baru Saja",
        unread: true
      };
      localStorage.setItem("lengkang_citizen_notifications", JSON.stringify([citizenAlert, ...citizenNotifs]));

      // 6. Create Live system notification for Admin review
      const adminNotifsStr = localStorage.getItem("lengkang_admin_live_notifications");
      const adminNotifs = adminNotifsStr ? JSON.parse(adminNotifsStr) : [];
      const newAlert = {
        id: `ALERT-DONE-${selectedPickupForWeigh.id}-${Date.now()}`,
        type: "pickup",
        title: "Setoran Selesai Ditimbang",
        desc: `Kurir menyelesaikan penjemputan ${selectedPickupForWeigh.wargaName}: Est. ${selectedPickupForWeigh.estimatedWeight} Kg vs Berat Fisik Kurir ${parsedWeight} Kg.`,
        timestamp: new Date().toISOString(),
        read: false
      };
      localStorage.setItem("lengkang_admin_live_notifications", JSON.stringify([newAlert, ...adminNotifs]));

      // Close modal
      setIsWeighInOpen(false);
      setSelectedPickupForWeigh(null);
      
      // Reload stats
      loadLocalStorageData();

      // Trigger high-fidelity feedback animation overlay
      setSyncFeedback({
        show: true,
        title: "Timbangan Fisik Tersinkron!",
        description: `Timbangan fisik ${parsedWeight} Kg atas warga ${selectedPickupForWeigh.wargaName} berhasil dicatat. Status penjemputan diperbarui menjadi Selesai.`,
        pointsGained: calculatedPoints,
        insentifGained: 5000
      });

    } catch (e) {
      console.error(e);
    }
  };

  // Simulate Instant QR Code scanning
  const handleSimulateQrScan = () => {
    setQrScanningActive(true);
    setSimulatedCitizen(null);
    setQrSuccessMsg("");

    setTimeout(() => {
      // Find a random citizen from localStorage
      const validCitizens = citizens.length > 0 ? citizens : [
        { id: "WRG-101", name: "Ibu Sumarni", address: "RW 02", balance: 384500, phone: "081234567801", qrGenerated: true },
        { id: "WRG-881", name: "Mbah Kartowijoyo", address: "RW 02", balance: 135000, phone: "081122334455", qrGenerated: true },
        { id: "WRG-882", name: "Pak Budi Hartono", address: "RW 05", balance: 52000, phone: "081299884451", qrGenerated: true }
      ];

      const chosen = validCitizens[Math.floor(Math.random() * validCitizens.length)];
      setSimulatedCitizen(chosen);
      setQrScanningActive(false);
      setQrSuccessMsg(`✨ DIGITAL QR TERDETEKSI: ${chosen.name} (${chosen.id})`);

      // Trigger high-fidelity scanning alert
      setSyncFeedback({
        show: true,
        title: "KODE QR TERVERIFIKASI!",
        description: `Profil warga ${chosen.name} (${chosen.id}) berhasil diverifikasi dari database awan. Silakan isikan timbangan.`
      });
    }, 1500);
  };

  // Process manual or simulated deposit from QR scanner tab
  const handleQrDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedCitizen) return;

    try {
      const weightParsed = parseFloat(qrWeightInput.toString()) || 0;
      const calculatedPoints = Math.round(weightParsed * 3500);

      // 1. Credit Points to citizen
      const updatedCitizens = citizens.map((c) => {
        if (c.id === simulatedCitizen.id) {
          return {
            ...c,
            balance: (c.balance || 0) + calculatedPoints
          };
        }
        return c;
      });
      localStorage.setItem("lengkang_citizens_database", JSON.stringify(updatedCitizens));
      setCitizens(updatedCitizens);

      // 2. Put directly into pending deposits
      const pendingDepsStr = localStorage.getItem("lengkang_pending_deposits");
      const pendingDeps = pendingDepsStr ? JSON.parse(pendingDepsStr) : [];
      const newDepId = "DEP-" + Math.floor(1000 + Math.random() * 9000);
      const newDeposit = {
        id: newDepId,
        warga: `${simulatedCitizen.name} (${simulatedCitizen.address || 'RW 02'})`,
        tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        kategori: qrWasteCategory,
        weightAI: weightParsed,
        weightCourier: weightParsed,
        status: "Disetujui" // Approved immediately because QR was scanned face to face!
      };
      localStorage.setItem("lengkang_pending_deposits", JSON.stringify([newDeposit, ...pendingDeps]));

      // 3. Save as completed pickup record (even if direct walking check-in)
      const storedPickups = localStorage.getItem("lengkang_resident_pickups") || "[]";
      const activePickups = JSON.parse(storedPickups);
      const walkInPickup = {
        id: "QR-" + Math.floor(100 + Math.random() * 900),
        wargaName: simulatedCitizen.name,
        wargaPhone: simulatedCitizen.phone || "081234567800",
        wargaAddress: simulatedCitizen.address || "RW 02",
        wasteCategory: qrWasteCategory,
        estimatedWeight: weightParsed,
        requestDate: new Date().toLocaleDateString("en-CA"),
        status: "Selesai",
        assignedCourier: "Budi Santoso",
        actualWeight: weightParsed,
        completedAt: new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" }) + " WIB"
      };
      localStorage.setItem("lengkang_resident_pickups", JSON.stringify([walkInPickup, ...activePickups]));

      // 4. Update Voucher status
      const newBensin = voucherBensin + 5000;
      localStorage.setItem("lengkang_kurir_bensin_voucher", newBensin.toString());
      setVoucherBensin(newBensin);

      // Clear scanning area
      setSimulatedCitizen(null);
      setQrSuccessMsg("");
      setManualCitizenId("");
      
      // Reload stats
      loadLocalStorageData();

      // Trigger high-fidelity feed animation screen
      setSyncFeedback({
        show: true,
        title: "KREDIT POIN BERHASIL!",
        description: `Setoran seberat ${weightParsed} Kg untuk ${walkInPickup.wargaName} selesai. Tabungan bertambah secara real-time.`,
        pointsGained: calculatedPoints,
        insentifGained: 5000
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filter pickups for active queue
  // Show pickups where assignedCourier === "Budi Santoso" and status !== "Selesai" & "Dibatalkan" & "Kendala Lapangan"
  const activeQueue = pickups.filter(
    (p) =>
      (p.assignedCourier === "Budi Santoso" || p.assignedCourier === courierEmail) &&
      p.status === "Kurir Ditugaskan"
  );

  // Completed or obstacle tasks for today (Riwayat Hari Ini)
  const todayHistory = pickups.filter(
    (p) =>
      (p.assignedCourier === "Budi Santoso" || p.assignedCourier === courierEmail) &&
      (p.status === "Selesai" || p.status === "Kendala Lapangan" || p.status === "Dibatalkan")
  );

  return (
    <div 
      className="w-full lg:max-w-7xl max-w-lg mx-auto bg-slate-50 min-h-screen relative font-sans text-xs pb-24 text-left lg:shadow-none shadow-lg lg:px-4 lg:py-2"
      id="dashboard-kurir-container"
    >
      {/* 2. TOP BAR STICKY (Ramah sinar matahari, Latar Belakang putih, border tegas) */}
      <header className="sticky top-0 bg-white border-b-2 border-slate-300 px-4 py-3 z-40 flex items-center justify-between shadow-sm lg:rounded-2xl lg:border lg:mb-4 lg:mt-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition cursor-pointer border border-slate-200"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5">
            {/* Foto Profil Bulat */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80" 
                alt="Foto Profil Budi Santoso"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#008444] shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </div>
            
            {/* Informasi Profil */}
            <div className="text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none font-sans">Budi Santoso</h1>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-300 uppercase tracking-widest font-mono">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse"></span>
                  On Duty
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono leading-none flex items-center gap-1.5 flex-wrap">
                <span>ID: <strong className="text-slate-800 font-bold">LK-KRR-206</strong></span>
                <span className="text-slate-300">|</span>
                <span className="truncate max-w-[150px] sm:max-w-none">{courierEmail}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Grid wrapper for desktop view, normal layout on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Stats and Network Widget Panel (Sticky/Sidebar on desktop, normal column on mobile) */}
        <section className="lg:col-span-4 px-4 pt-4 pb-2 lg:p-6 bg-slate-50 lg:bg-white lg:border lg:border-slate-200 lg:rounded-3xl lg:shadow-sm border-b border-slate-200">
          
          {/* 👤 PROFIL KURIR LAPANGAN AKTIF */}
          <div 
            className="bg-white lg:bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3.5 shadow-xs mb-3.5 relative overflow-hidden" 
            id="courier-profile-card-header"
          >
            {/* Subtle green pattern bg decor */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
            
            {/* Profile Photo */}
            <div className="relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80" 
                alt="Foto Profil Budi Santoso"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#008444] shadow-xs"
                referrerPolicy="no-referrer"
              />
              {/* Green active status orb */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </div>

            {/* Profile Details */}
            <div className="flex-1 text-left min-w-0 font-sans">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#008444] font-extrabold text-[8px] px-1.5 py-0.5 rounded tracking-wider uppercase mb-1">
                Petugas Jemput Lapangan • Aktif
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight">Budi Santoso</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono truncate flex items-center gap-1.5 flex-wrap">
                <span>ID: <strong className="text-slate-800 font-bold">LK-KRR-206</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">{courierEmail}</span>
              </p>
            </div>
          </div>

          <KurirStatsWidget 
            completedCount={completedCount}
            totalCount={totalCount}
            totalWeight={totalWeight}
            voucherBensin={voucherBensin}
          />
          <div className="mt-2 text-right">
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Sesi Diotorisasi • Status Sinkron Aman 🌐
            </span>
          </div>
        </section>

        {/* CORE CONTENT SWITCHER (Wrapped with padding bottom so bottom-nav doesn't clip content) */}
        <main className="lg:col-span-8 px-4 py-4 min-y-96 lg:bg-white lg:border lg:border-slate-200 lg:rounded-3xl lg:p-6 lg:shadow-sm">
        
        {/* TAB 1: TUGAS RUTE */}
        {activeTab === "tugas" && (
          <div className="space-y-4 animate-fade-in" id="tugas-rute-tab-content">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ClipboardList className="w-4 h-4 text-[#008444]" />
                Urutan Rute Penjemputan ({activeQueue.length})
              </h2>
              {pickups.length > 0 && activeQueue.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    // Refill assignments to Budi Santoso
                    const reseted = pickups.map(p => ({
                      ...p,
                      status: "Kurir Ditugaskan",
                      assignedCourier: "Budi Santoso",
                      pickupDate: new Date().toLocaleDateString("en-CA"),
                      pickupTimeSlot: "Pagi (08:00 - 11:00)"
                    }));
                    localStorage.setItem("lengkang_resident_pickups", JSON.stringify(reseted));
                    setPickups(reseted);
                    loadLocalStorageData();
                    alert("🔄 Rute penjemputan lapangan berhasil di-reset untuk simulasi.");
                  }}
                  className="text-[10px] text-[#008444] font-bold hover:underline flex items-center gap-1 bg-white border px-2 py-1 rounded-lg"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Tugas</span>
                </button>
              )}
            </div>

            {activeQueue.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2.5" />
                <p className="font-bold text-slate-800 text-sm">Semua Tugas Selesai!</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Rute harian Anda hari ini sudah tuntas disisir. Silakan tambahkan tugas simulasi baru dari panel Admin atau klik tombol reset diatas.
                </p>
                <div className="mt-4 flex flex-col justify-center gap-2">
                  <button
                    onClick={() => {
                      // Generate and insert a sample pickup
                      const sample = {
                        id: "REQ-" + Math.floor(300 + Math.random() * 600),
                        wargaName: "Siti Suminah (Simulasi)",
                        wargaPhone: "081233005522",
                        wargaAddress: "Sektor RW 02, Jalan Anggrek No.31A",
                        wasteCategory: "Plastik PET Gelas & Botol",
                        estimatedWeight: 12.0,
                        requestDate: new Date().toLocaleDateString("en-CA"),
                        status: "Kurir Ditugaskan",
                        assignedCourier: "Budi Santoso",
                        pickupDate: new Date().toLocaleDateString("en-CA"),
                        pickupTimeSlot: "Pagi (08:00 - 11:00)"
                      };
                      const updated = [sample, ...pickups];
                      localStorage.setItem("lengkang_resident_pickups", JSON.stringify(updated));
                      setPickups(updated);
                      loadLocalStorageData();
                    }}
                    className="mx-auto text-xs bg-[#008444] text-white hover:bg-[#006633] px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Tugas Baru (Simulasi)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeQueue.map((pickup, index) => (
                  <div 
                    key={pickup.id}
                    className="bg-white border-2 border-slate-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition text-left flex flex-col gap-3 relative overflow-hidden"
                  >
                    {/* Urutan Rute Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-[11px] font-mono">
                          {index + 1}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {pickup.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {pickup.pickupTimeSlot || "Harap Ambil Segera"}
                      </span>
                    </div>

                    {/* Warga Info */}
                    <div className="space-y-1.5 font-sans">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-black text-slate-900">
                          {pickup.wargaName}
                        </p>
                      </div>
                      
                      {/* High Contrast Address */}
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-start gap-1.5 mt-1 text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-[#008444] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[11.5px] leading-snug">{pickup.wargaAddress}</p>
                          <p className="text-[9.5px] text-slate-400 mt-0.5">Kelurahan Lengkang Hijau, Jakarta Barat</p>
                        </div>
                      </div>

                      {/* Waste Category & weight details */}
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
                        <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                          <p className="text-[9px] text-[#006633] font-bold uppercase tracking-wider">Kategori</p>
                          <p className="font-black text-xs text-slate-900 mt-0.5 truncate">{pickup.wasteCategory}</p>
                        </div>
                        <div className="bg-sky-50 border border-sky-150 p-2 rounded-xl">
                          <p className="text-[9px] text-blue-800 font-bold uppercase tracking-wider">Est. AI Weight</p>
                          <p className="font-black text-xs text-slate-900 mt-0.5">{pickup.estimatedWeight} Kg</p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons (Batal/Kendala vs Selesai/Timbang) */}
                    <div className="flex gap-2.5 mt-2 border-t border-slate-100 pt-3">
                      {/* Obstacle Emergency button (Kuning-Oranye tua, kontras tinggi) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPickupForObstacle(pickup);
                          setObstacleReason("Rumah Warga Terkunci / Kosong");
                          setObstacleNote("");
                          setIsObstacleOpen(true);
                        }}
                        className="flex-1 font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-3 rounded-xl border border-amber-500 hover:border-amber-600 flex items-center justify-center gap-1 cursor-pointer transition shadow-xs active:scale-[0.98]"
                        title="Batal/Kendala Lapangan"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Kendala (Batal)</span>
                      </button>

                      {/* Selesai / Timbang Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenWeighModal(pickup)}
                        className="flex-1 font-bold text-xs bg-[#008444] hover:bg-[#006633] text-white py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shadow-xs active:scale-[0.98]"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Timbang & Selesai</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1.5: PETA RUTE & JADWAL TERINTEGRASI */}
        {activeTab === "peta" && (
          <div className="space-y-4 animate-fade-in" id="peta-rute-tab-content">
            <div className="border-b pb-2 border-slate-200">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 text-left">
                <Map className="w-4 h-4 text-[#008444]" />
                Peta Lokasi &amp; Jadwal Integrasi
              </h2>
              <p className="text-[10px] text-slate-400 text-left">Peta rute dinamis dari Admin Lengkang untuk petugas lapangan aktif</p>
            </div>

            {/* Elegant Interactive SVG Map Canvas */}
            <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-xl relative overflow-hidden">
              {/* Compass badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold text-[#00ff73] flex items-center gap-1 border border-slate-800 z-10">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>RADAR LENGKANG v2.4</span>
              </div>

              {/* Map Reset / Status Indicator */}
              <div className="absolute top-3 right-3 bg-emerald-950/90 px-2 py-1 rounded-lg text-[8px] font-bold text-emerald-400 z-10 font-mono">
                GPS: LOCKED (Sektor Barat)
              </div>

              {/* Map Body */}
              <div className="w-full relative mt-4 block" style={{ minHeight: "220px" }}>
                <svg 
                  viewBox="0 0 300 200" 
                  className="w-full h-full rounded-2xl bg-slate-950"
                  style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
                >
                  {/* 1. Road networks background (Illustrative high-fidelity lines) */}
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#1f2937" strokeWidth="6" />
                  <line x1="0" y1="120" x2="300" y2="120" stroke="#1f2937" strokeWidth="6" />
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#1f2937" strokeWidth="6" />
                  <line x1="220" y1="0" x2="220" y2="200" stroke="#1f2937" strokeWidth="6" />
                  
                  {/* Slim lanes line inner highlights */}
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#374151" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="120" x2="300" y2="120" stroke="#374151" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#374151" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="220" y1="0" x2="220" y2="200" stroke="#374151" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Parks and landmarks (Visual context) */}
                  <rect x="10" y="10" width="70" height="30" rx="4" fill="#042f1a" opacity="0.6" />
                  <text x="45" y="27" fill="#10b981" fontSize="6" fontWeight="bold" textAnchor="middle" opacity="0.8">Taman Lestari</text>

                  <rect x="120" y="70" width="80" height="35" rx="4" fill="#042f1a" opacity="0.6" />
                  <text x="160" y="90" fill="#10b981" fontSize="6" fontWeight="bold" textAnchor="middle" opacity="0.8">Kawasan Kompos</text>

                  <rect x="230" y="140" width="60" height="40" rx="4" fill="#172554" opacity="0.5" />
                  <text x="260" y="162" fill="#38bdf8" fontSize="5" fontWeight="bold" textAnchor="middle" opacity="0.8">Danau Penyerapan</text>

                  {/* 2. Lengkang HQ Central Centroid Base Hub */}
                  <circle cx="100" cy="120" r="10" fill="#059669" className="animate-pulse" opacity="0.4" />
                  <circle cx="100" cy="120" r="6" fill="#008444" />
                  <polygon points="100,115 105,123 95,123" fill="#ffffff" />
                  <text x="100" y="137" fill="#a7f3d0" fontSize="6.5" fontWeight="black" textAnchor="middle" letterSpacing="0.2">LENGKANG HQ</text>

                  {/* 3. Interactively plot active & completed nodes for the courier */}
                  {pickups
                    .filter(p => p.assignedCourier === "Budi Santoso" || p.assignedCourier === courierEmail)
                    .map((pickup, idx) => {
                      // Stable calculations so coordinates remain exactly aligned
                      const num = parseInt(pickup.id.replace(/\D/g, "")) || idx || 0;
                      const mapX = 40 + ((num * 17) % 220);
                      const mapY = 30 + ((num * 13) % 130);
                      const isSelected = selectedMapPickup?.id === pickup.id;

                      // Style factors depending on status
                      let color = "#3b82f6"; // default blue
                      let statusSymbol = pickup.id;

                      if (pickup.status === "Selesai") {
                        color = "#10b981"; // green
                      } else if (pickup.status === "Kendala Lapangan") {
                        color = "#f59e0b"; // amber obstacle
                      } else {
                        // assigned, active/pending
                        color = "#ef4444"; // high-contrast red-rose
                      }

                      return (
                        <g 
                          key={pickup.id} 
                          className="cursor-pointer"
                          onClick={() => setSelectedMapPickup(pickup)}
                        >
                          {/* Map point glowing halo */}
                          {pickup.status === "Kurir Ditugaskan" && (
                            <circle 
                              cx={mapX} 
                              cy={mapY} 
                              r={isSelected ? "11" : "8"} 
                              fill="none" 
                              stroke={color} 
                              strokeWidth="2.5" 
                              className="animate-ping"
                              opacity="0.75"
                              style={{ animationDuration: '2.5s' }}
                            />
                          )}

                          {/* Bigger selection ring */}
                          {isSelected && (
                            <circle cx={mapX} cy={mapY} r="14" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                          )}

                          {/* Solid pointer dot */}
                          <circle cx={mapX} cy={mapY} r="6.5" fill={color} />
                          <circle cx={mapX} cy={mapY} r="4" fill="#ffffff" />
                          <circle cx={mapX} cy={mapY} r="2" fill={color} />

                          {/* Fast HUD text showing label queue */}
                          <text 
                            x={mapX} 
                            y={mapY - 10} 
                            fill={isSelected ? "#ffffff" : "#cbd5e1"} 
                            fontSize="6.5" 
                            fontWeight="black" 
                            textAnchor="middle"
                            className="bg-slate-900 drop-shadow-md"
                          >
                            {pickup.id}
                          </text>
                        </g>
                      );
                    })}
                </svg>
              </div>

              {/* Directions Line Connecting Nodes (Dynamic routing feedback) */}
              <div className="mt-3 text-left border-t border-slate-800 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#00ff73] animate-bounce" />
                  <span className="text-[10px] text-slate-350 font-sans">
                    Sinyal: <strong className="text-white">Optimal</strong> • Rute Terpendek Dihitung Otomatis
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded font-black border border-emerald-900">
                  Pilih Pin ID untuk Review Detail
                </span>
              </div>
            </div>

            {/* Interactive Node Review Box */}
            <div className="bg-white border rounded-2xl p-4 shadow-sm text-left">
              {selectedMapPickup ? (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center font-mono">
                        📍
                      </span>
                      <strong className="text-sm font-black text-slate-900">{selectedMapPickup.id}</strong>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      selectedMapPickup.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                        : selectedMapPickup.status === "Kendala Lapangan"
                        ? "bg-amber-50 text-amber-700 border border-amber-150"
                        : "bg-rose-50 text-rose-700 border border-rose-150 animate-pulse"
                    }`}>
                      {selectedMapPickup.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-slate-900 text-sm">{selectedMapPickup.wargaName}</p>
                    <p className="text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#008444] shrink-0" />
                      <span>{selectedMapPickup.wargaAddress}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Klasifikasi</p>
                        <p className="font-bold text-slate-800 mt-0.5 truncate">{selectedMapPickup.wasteCategory}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Slot Jadwal</p>
                        <p className="font-bold text-slate-800 mt-0.5 truncate">{selectedMapPickup.pickupTimeSlot || "Harap Ambil"}</p>
                      </div>
                    </div>
                  </div>

                  {selectedMapPickup.status === "Kurir Ditugaskan" && (
                    <button
                      onClick={() => {
                        // Open weigh process directly
                        setSelectedPickupForWeigh(selectedMapPickup);
                        setIsWeighInOpen(true);
                      }}
                      className="w-full bg-[#008444] hover:bg-[#006633] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 mt-2 shadow-xs cursor-pointer"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Mulai Timbang Di Sini</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-slate-800 font-bold text-xs font-sans">Ketuk PIN pada Peta Radar</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans animate-pulse">Atau pilih salah satu daftar rute untuk dimuat di sini secara detail.</p>
                  <div id="quick-map-navigator" className="mt-4 flex flex-wrap gap-1.5 justify-center">
                    {pickups
                      .filter(p => p.assignedCourier === "Budi Santoso" || p.assignedCourier === courierEmail)
                      .slice(0, 4)
                      .map(p => (
                        <button 
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedMapPickup(p)}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold bg-slate-50 border hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                        >
                          {p.id}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* JADWAL PENJEMPUTAN TERINTEGRASI TOTAL BAR (Direct Sync Admin) */}
            <div className="bg-white border rounded-2xl p-4 shadow-sm text-left">
              <h3 className="font-serif font-black text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2 mb-3">
                <Calendar className="w-4 h-4 text-[#008444]" />
                Jadwal Penjemputan Terintegrasi Admin
              </h3>
              
              <p className="text-[10.5px] text-slate-400 mb-3 leading-relaxed font-sans">
                Jadwal ini disinkronisasikan langsung dari keputusan Dispatcher Admin Lengkang. Setiap penugasan baru atau pengubahan jadwal otomatis masuk ke rute genggam Anda.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {pickups.filter(p => p.assignedCourier === "Budi Santoso" || p.assignedCourier === courierEmail).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 font-sans">Belum ada agenda jadwal aktif dari admin hari ini.</p>
                ) : (
                  pickups
                    .filter(p => p.assignedCourier === "Budi Santoso" || p.assignedCourier === courierEmail)
                    .map((item, idx) => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedMapPickup(item)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          selectedMapPickup?.id === item.id
                            ? "bg-slate-50 border-slate-900"
                            : "bg-white border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1 text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[9px] bg-slate-100 text-slate-500 font-bold px-1 rounded">
                              {item.id}
                            </span>
                            <span className="font-sans font-bold text-slate-900 truncate max-w-[120px]">
                              {item.wargaName}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5 text-left font-sans">{item.wargaAddress}</p>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <span className="text-[10px] font-mono text-slate-800 font-bold block bg-slate-50 px-1.5 py-0.5 rounded border border-slate-150">
                            {item.pickupTimeSlot || "Sore (15:00-18:00)"}
                          </span>
                          <span className={`text-[8.5px] font-extrabold uppercase mt-1 inline-block font-sans ${
                            item.status === "Selesai"
                              ? "text-emerald-600"
                              : item.status === "Kendala Lapangan"
                              ? "text-amber-600"
                              : "text-rose-600 animate-pulse"
                          }`}>
                            • {item.status === "Kurir Ditugaskan" ? "Ditugaskan" : item.status}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCAN QR (Sinyal/Scanner Simulasi) */}
        {activeTab === "scan" && (
          <div className="space-y-4 animate-fade-in" id="scan-qr-tab-content">
            <div className="border-b pb-2 border-slate-200">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#008444]" />
                Verifikasi QR ID Anggota
              </h2>
              <p className="text-[10px] text-slate-400">Pindai kartu fisik/aplikasi warga secara tatap muka (face-to-face)</p>
            </div>

            {/* Immersive Camera Scan View Mock */}
            <div className="bg-slate-900 rounded-3xl p-6 border-4 border-slate-800 shadow-inner relative overflow-hidden text-center max-w-sm mx-auto">
              {/* Laser sweeping animation line */}
              {qrScanningActive && (
                <div className="absolute top-0 inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce z-10" />
              )}

              {/* Central scanning viewport */}
              <div className="w-48 h-48 mx-auto border-4 border-dashed border-emerald-500 rounded-2xl flex flex-col items-center justify-center relative bg-emerald-900/10 mb-6 group">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-emerald-400"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-emerald-400"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-emerald-400"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-emerald-400"></div>
                
                {qrScanningActive ? (
                  <div className="space-y-2 animate-pulse text-emerald-400">
                    <SpinIcon className="w-8 h-8 mx-auto animate-spin" />
                    <p className="text-[10px] font-mono tracking-widest font-bold">PINDAI AKTIF...</p>
                  </div>
                ) : simulatedCitizen ? (
                  <div className="text-emerald-400 space-y-1">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                    <span className="block text-[11px] font-black">{simulatedCitizen.id}</span>
                    <span className="block text-[10px] opacity-80 leading-none">{simulatedCitizen.name}</span>
                  </div>
                ) : (
                  <div className="text-slate-400 space-y-1 p-2">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                    <span className="block text-[10px] font-black font-mono">ARAHKAN KAMERA</span>
                    <span className="block text-[8.5px] leading-tight text-slate-500">Posisikan QR code kartu warga di baris tengah</span>
                  </div>
                )}
              </div>

              {/* Scanner Control Triggers */}
              <div className="space-y-3 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={handleSimulateQrScan}
                  disabled={qrScanningActive}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md border-2 border-emerald-500 hover:border-emerald-600 cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>Simulasi Scan QR Kamera</span>
                </button>
                
                <span className="block text-slate-500 text-[10px] uppercase font-bold font-mono">Atau Masukan ID Secara Manual</span>

                <div className="flex gap-2">
                  <select
                    value={manualCitizenId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setManualCitizenId(id);
                      const matched = citizens.find(c => c.id === id);
                      if (matched) {
                        setSimulatedCitizen(matched);
                        setQrSuccessMsg(`✨ MANUAL ID TERJALIN: ${matched.name} (${matched.id})`);
                      }
                    }}
                    className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-xl px-2 py-2.5 outline-none font-bold font-mono"
                  >
                    <option value="">-- Pilih ID Warga --</option>
                    {citizens.map(c => (
                      <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Simulated Deposit Input Form If QR Scanned successfully */}
            {simulatedCitizen && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 animate-slide-up mt-4">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-3">
                  <div className="text-left">
                    <h3 className="font-serif font-black text-slate-800 text-sm">Input Formulir Timbang QR</h3>
                    <p className="text-[10px] text-slate-500">Anggota berhak atas koin simpanan instan via scan</p>
                  </div>
                  <button 
                    onClick={() => { setSimulatedCitizen(null); setQrSuccessMsg(""); }}
                    className="text-slate-400 hover:text-rose-600 font-bold p-1 rounded hover:bg-slate-200 text-xs"
                  >
                    Batal
                  </button>
                </div>

                <div className="mb-3 p-2 bg-white/70 border border-emerald-100 rounded-xl space-y-1 text-slate-700">
                  <p>🔹 ID Anggota: <strong className="font-mono text-slate-900">{simulatedCitizen.id}</strong></p>
                  <p>🔹 Nama Lengkap: <strong className="text-slate-900">{simulatedCitizen.name}</strong></p>
                  <p>🔹 Saldo Koin Saat Ini: <strong className="text-slate-900">Rp{simulatedCitizen.balance?.toLocaleString() || "0"}</strong></p>
                </div>

                <form onSubmit={handleQrDepositSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Jenis Komoditas</label>
                      <select
                        value={qrWasteCategory}
                        onChange={(e) => setQrWasteCategory(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 outline-none font-sans font-bold"
                      >
                        <option value="Plastik PET Gelas/Botol">Plastik PET Gelas/Botol</option>
                        <option value="Kardus Kering Cokelat">Kardus Kering Cokelat</option>
                        <option value="Minyak Jelantah Murni">Minyak Jelantah Murni</option>
                        <option value="Logam & Besi Tua">Logam & Besi Tua</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Berat Fisik Timbangan</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={qrWeightInput}
                          onChange={(e) => setQrWeightInput(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2 pr-8 outline-none font-bold font-mono text-center"
                        />
                        <span className="absolute right-2.5 top-2.5 font-bold font-mono text-slate-400">Kg</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 px-4 rounded-xl border border-slate-800 cursor-pointer shadow-md flex items-center justify-center gap-1 text-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Konfirmasi Timbangan & Kreditkan Poin</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RIWAYAT HARI INI */}
        {activeTab === "riwayat" && (
          <div className="space-y-4 animate-fade-in" id="riwayat-tab-content">
            <div className="border-b pb-2 border-slate-200">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-700" />
                Histori Kerja Hari Ini ({todayHistory.length})
              </h2>
              <p className="text-[10px] text-slate-400">Log penjemputan berkendara kurir</p>
            </div>

            {todayHistory.length === 0 ? (
              <div className="bg-white border border-slate-250 p-8 rounded-2xl text-center text-slate-400">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                Belum ada rute yang diproses hari ini.
              </div>
            ) : (
              <div className="space-y-3">
                {todayHistory.map((item) => (
                  <div 
                    key={item.id}
                    className={`border rounded-2xl p-3 text-left relative overflow-hidden bg-white ${
                      item.status === "Selesai" 
                        ? "border-emerald-250/80 bg-emerald-50/15" 
                        : "border-amber-250/80 bg-amber-50/15"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Selesai" 
                          ? "bg-emerald-100 text-emerald-950 border border-emerald-300" 
                          : "bg-amber-100 text-amber-950 border border-amber-300"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-1 font-sans">
                      <p className="font-black text-slate-800 text-xs">{item.wargaName}</p>
                      <p className="text-[10.5px] text-slate-500">{item.wargaAddress}</p>
                      
                      {item.status === "Selesai" ? (
                        <div className="flex justify-between items-center bg-emerald-100/30 p-2 rounded-xl mt-2 font-mono text-[10px] text-emerald-950 border border-emerald-100">
                          <span>⚖️ Timbang Kurir: <strong className="font-black">{item.actualWeight} Kg</strong></span>
                          <span>⛽ Insentif: <strong className="font-black text-rose-700">+Rp5.000</strong></span>
                        </div>
                      ) : (
                        <div className="bg-amber-100/30 p-2 rounded-xl mt-2 text-[10px] border border-amber-100">
                          <p className="font-bold text-amber-950">⚠️ Kendala: {item.obstacleReason}</p>
                          {item.obstacleNote && <p className="text-[9.5px] text-slate-500 italic mt-0.5">Catatan: "{item.obstacleNote}"</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>



      {/* OBSTACLE EMERGENCIES DETAILED BOTTOM SHEET / TRIGGER MODAL */}
      {isObstacleOpen && selectedPickupForObstacle && (
        <div className="fixed inset-0 z-[1000] flex items-end lg:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={() => setIsObstacleOpen(false)} />
          
          <div className="bg-white rounded-t-3xl lg:rounded-3xl border-t lg:border border-slate-200 max-w-lg w-full p-5 relative z-10 animate-slide-up shadow-2xl">
            {/* Grab bar decor */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
            
            <div className="text-left border-b border-slate-100 pb-2 mb-4">
              <h3 className="font-serif font-black text-slate-800 text-base">⚠️ Laporkan Kendala Lapangan</h3>
              <p className="text-[10px] text-slate-400">Rute: {selectedPickupForObstacle.wargaName} ({selectedPickupForObstacle.id})</p>
            </div>

            <form onSubmit={handleObstacleSubmit} className="space-y-4">
              
              {/* Obstacle Select options */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Pilih Jenis Kendala Cepat:</label>
                <div className="space-y-2 font-sans text-xs">
                  {[
                    "Rumah Warga Terkunci / Kosong",
                    "Sampah Belum Dipilah (Ditolak)",
                    "Volume Sampah Terlalu Banyak (Butuh Truk Tambahan)"
                  ].map((option) => (
                    <label 
                      key={option} 
                      className={`flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ${
                        obstacleReason === option ? "bg-amber-50 border-amber-400 text-amber-950 font-bold" : "text-slate-700"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="obstacle" 
                        value={option}
                        checked={obstacleReason === option}
                        onChange={() => setObstacleReason(option)}
                        className="mt-0.5"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Extra text context bar */}
              <div className="space-y-1.5 text-left font-sans">
                <label className="block text-[10px] font-bold text-slate-405 uppercase">Catatan Lapangan Kurir Tambahan:</label>
                <textarea
                  value={obstacleNote}
                  required
                  onChange={(e) => setObstacleNote(e.target.value)}
                  placeholder="Isi catatan rincian kondisi lapangan..."
                  className="w-full bg-slate-55 border border-slate-250 rounded-xl p-3 outline-none focus:border-[#008444] text-xs font-sans h-20 leading-relaxed text-slate-800"
                />
              </div>

              {/* Slate Dark submit button */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsObstacleOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold cursor-pointer text-center text-xs"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-xl font-bold cursor-pointer text-center text-xs shadow-md transition"
                >
                  Kirim Kendala Lapangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WEIGH-IN INTERACTIVE POPUP / MODAL */}
      {isWeighInOpen && selectedPickupForWeigh && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-5 relative z-10 animate-fade-in shadow-2xl text-left">
            <div className="border-b border-slate-100 pb-2 mb-4">
              <h3 className="font-serif font-black text-slate-800 text-base flex items-center gap-1">
                <Scale className="w-5 h-5 text-[#008444]" />
                Verifikasi Timbangan Kurir
              </h3>
              <p className="text-[10px] text-slate-400">Verifikasikan estimasi AI vs timbangan fisik lapangan warga</p>
            </div>

            <div className="bg-emerald-50/50 p-2.5 rounded-xl text-slate-700 space-y-1 mb-4 text-xs font-sans">
              <p>🔹 Warga Anggota: <strong className="text-slate-900">{selectedPickupForWeigh.wargaName}</strong></p>
              <p>🔹 Kategori Sampah: <strong className="text-slate-900">{selectedPickupForWeigh.wasteCategory}</strong></p>
              <p>🔹 Estimasi Berat AI: <strong className="text-emerald-950 font-black">{selectedPickupForWeigh.estimatedWeight} Kg</strong></p>
            </div>

            <form onSubmit={handleWeighInSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Input Hasil Timbangan Kurir (Fisik - Kg):</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={actualWeightInput}
                    onChange={(e) => setActualWeightInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-350 rounded-xl p-3 outline-none text-base font-bold font-mono text-center tracking-wider text-slate-900 focus:border-[#008444]"
                  />
                  <span className="absolute right-3.5 top-3.5 font-bold text-slate-400">Kg</span>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Nilai Komoditas Saat Ini:</label>
                <select
                  value={selectedPricePerKg}
                  onChange={(e) => setSelectedPricePerKg(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold"
                >
                  <option value="3500">Plastik PET (Rp3.500 / Kg)</option>
                  <option value="2800">Kardus (Rp2.800 / Kg)</option>
                  <option value="7500">Minyak Jelantah (Rp7.500 / Kg)</option>
                  <option value="9000">Logam & Besi (Rp9.000 / Kg)</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWeighInOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold cursor-pointer text-center text-xs"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#008444] hover:bg-[#006633] text-white p-3 rounded-xl font-bold cursor-pointer text-center text-xs shadow-md transition"
                >
                  Selesaikan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 SECURE SYNC ANIMATION OVERLAY */}
      <AnimatePresence>
        {syncFeedback && syncFeedback.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSyncFeedback(null)}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Green Syncing Circuit Pattern bg */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"></div>
              
              {/* Animated Giant Icon Circle */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                {/* Radial pinging waves */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1.25, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 0.4 }}
                  className="absolute inset-0 bg-emerald-500/10 rounded-full"
                />
                
                {/* Main animated check ring */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.15 }}
                  className="w-20 h-20 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 z-10"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={4}
                    stroke="currentColor"
                    className="w-10 h-10 text-slate-900"
                    initial={{ strokeDasharray: 50, strokeDashoffset: 50 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </motion.svg>
                </motion.div>
              </div>

              {/* Success Info & Texts */}
              <div className="space-y-2">
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Real-Time Database Secured
                </motion.span>
                
                <h4 className="text-xl font-black text-white tracking-tight">
                  {syncFeedback.title}
                </h4>
                
                <p className="text-xs text-slate-400 font-sans leading-relaxed px-2">
                  {syncFeedback.description}
                </p>
              </div>

              {/* Dynamic Badges if Points/Insentif are specified */}
              {(syncFeedback.pointsGained || syncFeedback.insentifGained) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="bg-slate-800/80 border border-slate-705 rounded-2xl p-3.5 flex justify-around text-left gap-2"
                >
                  {syncFeedback.pointsGained !== undefined && (
                    <div className="text-center">
                      <span className="block text-[8px] font-black tracking-wider text-slate-450 uppercase">Tabungan Warga</span>
                      <strong className="text-emerald-400 text-sm font-mono font-black">+{syncFeedback.pointsGained.toLocaleString()} Poin</strong>
                    </div>
                  )}
                  {syncFeedback.pointsGained !== undefined && syncFeedback.insentifGained !== undefined && (
                    <div className="w-px bg-slate-700" />
                  )}
                  {syncFeedback.insentifGained !== undefined && (
                    <div className="text-center">
                      <span className="block text-[8px] font-black tracking-wider text-slate-455 uppercase">Bonus Bensin</span>
                      <strong className="text-amber-400 text-sm font-mono font-black">+Rp{syncFeedback.insentifGained.toLocaleString()}</strong>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Interactive Synced Progress Indicator */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Satelit Sync Status</span>
                  <span>100% (lat: 53ms)</span>
                </div>
                {/* Horizontal growing bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>

              {/* TAP TO DISMISS BUTTON */}
              <button
                type="button"
                onClick={() => setSyncFeedback(null)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition duration-200 mt-2 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                Selesai & Tutup Portal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
