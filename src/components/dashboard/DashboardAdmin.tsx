import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, ShieldAlert, BadgeInfo, CheckCircle, XCircle, Info, Edit3, 
  Trash2, RefreshCw, Star, Download, Printer, TrendingUp, Check, 
  AlertCircle, ChevronRight, Scale, Leaf, Truck, UserCheck, QrCode,
  MessageSquare, Send, Calendar, MapPin, Clock, Plus, Navigation, Compass, Radio, Map, Activity, Play, Milestone, Search, Navigation2, CheckSquare, Sparkles,
  Bell, Volume2, VolumeX
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { fetchStats, fetchWithdrawals, updateWithdrawal } from "../../services/api";

interface PendingDeposit {
  id: string;
  warga: string;
  tanggal: string;
  kategori: string;
  imageUrl: string;
  weightAI: number; // in Kg
  weightCourier: number; // in Kg
  status: "Pending" | "Disetujui" | "Ditolak";
}

interface CommodityPrice {
  id: string;
  name: string;
  code: string;
  slug: string;
  pricePerKg: number;
  unit: string;
  trend: "naik" | "turun" | "stabil";
}

interface SembakoWarga {
  id: string;
  name: string;
  address: string;
  balance: number;
  incentiveChoice: "Sembako" | "Uang Tunai";
  hasPhone: boolean;
  qrGenerated: boolean;
  phone?: string;
}

interface CourierSchedule {
  id: string;
  courierName: string;
  location: string;
  date: string;
  timeSlot: string;
  vehicleCapacity: number;
  status: "Aktif" | "Selesai" | "Tertunda";
}

interface ResidentPickup {
  id: string;
  wargaName: string;
  wargaPhone: string;
  wargaAddress: string;
  wasteCategory: string;
  estimatedWeight: number; // in Kg
  requestDate: string;
  status: "Menunggu Penugasan" | "Kurir Ditugaskan" | "Selesai Penjemputan";
  assignedCourier?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
}

interface Consultation {
  id: string;
  name: string;
  phone: string;
  category: string;
  message: string;
  date: string;
  status: "Pending" | "Terjawab";
  reply: string;
}

interface DashboardAdminProps {
  onBack: () => void;
  adminEmail: string;
}

const defaultConsultations: Consultation[] = [
  {
    id: "CNS-5102",
    name: "Budi Santoso",
    phone: "081299887766",
    category: "Pilah Sampah Rutin",
    message: "Saya punya minyak jelantah sekitar 10 liter dari warung makan. Rumah saya di dekat gapura RW 02, apakah bisa sekalian dikoordinasikan penjemputan berkala tiap minggu?",
    date: "17 Jun 2026",
    status: "Pending",
    reply: ""
  },
  {
    id: "CNS-3912",
    name: "Ibu Ratna Asih",
    phone: "082133445566",
    category: "Konsultasi Pengolahan Kompos",
    message: "Bagaimana cara membedakan sampah sisa buah-buahan yang agak asam agar tidak merusak pH starter kompos saya? Terima kasih tim Lengkang.",
    date: "16 Jun 2026",
    status: "Pending",
    reply: ""
  },
  {
    id: "CNS-8022",
    name: "PT Hijau Makmur (Heri)",
    phone: "085211223344",
    category: "Kemitraan Perusahaan",
    message: "Kami dari divisi CSR PT Hijau Makmur ingin mendiskusikan peluang sponsorship penyediaan tempat sampah pilah 3 warna sebanyak 50 unit di kelurahan Lengkang Hijau.",
    date: "15 Jun 2026",
    status: "Terjawab",
    reply: "Halo Pak Heri, terima kasih atas niat mulia perusahaan Bapak. Kami akan mengirimkan proposal detail lokasi penempatan dan rancangan aksi kolaborasi green-partnership Lengkang ke email Anda hari ini."
  }
];

const defaultRwSectors = [
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

export default function DashboardAdmin({ onBack, adminEmail }: DashboardAdminProps) {
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
    if (window.confirm(`Apakah Anda yakin ingin ${status} penarikan ini?`)) {
      updateWithdrawal(id, status).then(res => {
        if (res.ok) {
          alert(`Penarikan ${status}!`);
          loadStatsAndWithdrawals();
        } else {
          alert("Gagal memproses penarikan: " + res.error);
        }
      });
    }
  };

  // --- RW Sectors Live State & Synchronization ---
  const [sectors, setSectors] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("lengkang_rw_sectors");
      if (stored) return JSON.parse(stored);
      localStorage.setItem("lengkang_rw_sectors", JSON.stringify(defaultRwSectors));
    } catch (e) {
      console.error("Error loading sectors from localStorage", e);
    }
    return defaultRwSectors;
  });

  const [selectedrwId, setSelectedrwId] = useState("RW-02");
  const [mapOrListTab, setMapOrListTab] = useState<"map" | "list">("map");
  const [searchRWQuery, setSearchRWQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Edit states for selected RW Sektor
  const [isEditingSector, setIsEditingSector] = useState(false);
  const [editPickupSchedule, setEditPickupSchedule] = useState("");
  const [editPickupTime, setEditPickupTime] = useState("");
  const [editDropOffPoint, setEditDropOffPoint] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCoordinator, setEditCoordinator] = useState("");
  const [editCoordinatorPhone, setEditCoordinatorPhone] = useState("");
  const [editMainWaste, setEditMainWaste] = useState("");
  const [editCapacityPct, setEditCapacityPct] = useState(50);
  const [editDesc, setEditDesc] = useState("");

  // Sync edits to fields whenever selected sector ID or database state changes
  useEffect(() => {
    const rw = sectors.find(item => item.id === selectedrwId) || sectors[0];
    if (rw) {
      setEditPickupSchedule(rw.pickupSchedule);
      setEditPickupTime(rw.pickupTime);
      setEditDropOffPoint(rw.dropOffPoint);
      setEditAddress(rw.address);
      setEditCoordinator(rw.coordinator);
      setEditCoordinatorPhone(rw.coordinatorPhone);
      setEditMainWaste(rw.mainWaste);
      setEditCapacityPct(rw.capacityPct);
      setEditDesc(rw.desc);
      setIsEditingSector(false);
    }
  }, [selectedrwId, sectors]);

  const handleSaveSectorEdit = (sectorId: string) => {
    let capStatus: "Bagus" | "Menengah" | "Hampir Penuh" = "Bagus";
    if (editCapacityPct >= 75) capStatus = "Hampir Penuh";
    else if (editCapacityPct >= 40) capStatus = "Menengah";

    const updatedSectors = sectors.map((s) => {
      if (s.id === sectorId) {
        return {
          ...s,
          pickupSchedule: editPickupSchedule,
          pickupTime: editPickupTime,
          dropOffPoint: editDropOffPoint,
          address: editAddress,
          coordinator: editCoordinator,
          coordinatorPhone: editCoordinatorPhone,
          mainWaste: editMainWaste,
          capacityPct: editCapacityPct,
          capacityStatus: capStatus,
          desc: editDesc,
        };
      }
      return s;
    });

    setSectors(updatedSectors);
    try {
      localStorage.setItem("lengkang_rw_sectors", JSON.stringify(updatedSectors));
      alert(`Sukses memperbarui Sektor ${sectorId}! Perubahan jadwal penjemputan dan tingkat muatan kontainer otomatis tersinkronisasi ke portal warga secara real-time.`);
      setIsEditingSector(false);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Consultations State ---
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    try {
      const stored = localStorage.getItem("lengkang_consultations");
      if (stored) {
        return JSON.parse(stored);
      } else {
        localStorage.setItem("lengkang_consultations", JSON.stringify(defaultConsultations));
        return defaultConsultations;
      }
    } catch (e) {
      return defaultConsultations;
    }
  });

  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const syncConsultations = () => {
      try {
        const stored = localStorage.getItem("lengkang_consultations");
        if (stored) {
          setConsultations(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error syncing consultations with localStorage", err);
      }
    };
    syncConsultations();
    const interval = setInterval(syncConsultations, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendReply = (id: string) => {
    const text = replyTexts[id];
    if (!text || !text.trim()) {
      alert("Harap tulis tanggapan / jawaban konsultasi terlebih dahulu!");
      return;
    }

    const updated = consultations.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: "Terjawab" as const,
          reply: text
        };
      }
      return c;
    });

    setConsultations(updated);
    try {
      localStorage.setItem("lengkang_consultations", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving consultation replies", err);
    }
    setReplyTexts(prev => ({ ...prev, [id]: "" }));
    alert(`Tanggapan berhasil dikirim dan status konsultasi diubah menjadi Terjawab.`);
  };

  // --- 1. Pending Deposits (Anti-Fraud) State ---
  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>(() => {
    const defaultDeps = [
      {
        id: "DEP-9042",
        warga: "Ibu Sumarni (RW 02)",
        tanggal: "18 Jun 2026",
        kategori: "Plastik PET Premium",
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=120",
        weightAI: 8.5,
        weightCourier: 8.7,
        status: "Pending"
      },
      {
        id: "DEP-9043",
        warga: "Bpk. Heri Susanto (RW 05)",
        tanggal: "17 Jun 2026",
        kategori: "Minyak Jelantah Rumahan",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=120",
        weightAI: 12.0,
        weightCourier: 15.6, // Discrepancy +30.0% (FRAUD WARNING!)
        status: "Pending"
      },
      {
        id: "DEP-9044",
        warga: "Siti Rahmaawati (RW 01)",
        tanggal: "17 Jun 2026",
        kategori: "Kardus Kering Bersih",
        imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=120",
        weightAI: 25.0,
        weightCourier: 24.8,
        status: "Pending"
      },
      {
        id: "DEP-9045",
        warga: "Ahmad Dahlan (RW 03)",
        tanggal: "16 Jun 2026",
        kategori: "Kaleng & Besi Daur Ulang",
        imageUrl: "https://images.unsplash.com/photo-1516216629131-1b9198f43431?auto=format&fit=crop&q=80&w=120",
        weightAI: 4.2,
        weightCourier: 5.9, // Discrepancy +40.4% (FRAUD WARNING!)
        status: "Pending"
      }
    ];
    try {
      const stored = localStorage.getItem("lengkang_pending_deposits");
      if (stored) return JSON.parse(stored);
      localStorage.setItem("lengkang_pending_deposits", JSON.stringify(defaultDeps));
      return defaultDeps;
    } catch (e) {
      return defaultDeps;
    }
  });

  // --- 2. Pricing Controller State ---
  const [prices, setPrices] = useState<CommodityPrice[]>([
    { id: "P-1", name: "Plastik PET Gelas/Botol", code: "PET", slug: "plastik", pricePerKg: 3500, unit: "Kg", trend: "naik" },
    { id: "P-2", name: "Kardus Kering Cokelat", code: "KRD", slug: "kertas", pricePerKg: 2800, unit: "Kg", trend: "stabil" },
    { id: "P-3", name: "Minyak Jelantah Murni", code: "JLT", slug: "jelantah", pricePerKg: 7500, unit: "Kg", trend: "naik" },
    { id: "P-4", name: "Logam & Besi Tua", code: "MET", slug: "logam", pricePerKg: 9000, unit: "Kg", trend: "turun" }
  ]);

  const [savingPrices, setSavingPrices] = useState(false);
  const [successSaveMsg, setSuccessSaveMsg] = useState(false);

  // --- 3. Sembako and Non-HP Citizens State ---
  const [sembakoCitizens, setSembakoCitizens] = useState<SembakoWarga[]>(() => {
    const defaultCitizens: SembakoWarga[] = [
      { id: "WRG-101", name: "Ibu Sumarni", address: "RW 02 - Sektor Hutan Lengkang, Gang Sentosa No. 12", balance: 384500, incentiveChoice: "Sembako", hasPhone: true, qrGenerated: true, phone: "081234567801" },
      { id: "WRG-881", name: "Mbah Kartowijoyo (RW 02)", address: "Jl. Lengkang Hijau No.12", balance: 135000, incentiveChoice: "Sembako", hasPhone: false, qrGenerated: true, phone: "081122334455" },
      { id: "WRG-882", name: "Nenek Sutriani (RW 04)", address: "Gg. Damai Lestari No. 9B", balance: 78000, incentiveChoice: "Sembako", hasPhone: false, qrGenerated: true, phone: "082233445566" },
      { id: "WRG-883", name: "Bpk. Jumadi (RW 02)", address: "Kavling Bumi Bersih Kav.8", balance: 94000, incentiveChoice: "Sembako", hasPhone: false, qrGenerated: false, phone: "083344556677" },
      { id: "WRG-884", name: "Ibu Enny Aminah (RW 05)", address: "Samping Masjid Al-Barokah", balance: 12000, incentiveChoice: "Uang Tunai", hasPhone: true, qrGenerated: false, phone: "084455667788" }
    ];
    try {
      const stored = localStorage.getItem("lengkang_citizens_database");
      if (stored) return JSON.parse(stored);
      localStorage.setItem("lengkang_citizens_database", JSON.stringify(defaultCitizens));
      return defaultCitizens;
    } catch (e) {
      return defaultCitizens;
    }
  });

  const [activeTab, setActiveTab] = useState<"sembako" | "non-hp">("sembako");
  const [editingCitizen, setEditingCitizen] = useState<SembakoWarga | null>(null);

  // --- 4. Warehouse logisic / B2B State ---
  const [warehouseStock, setWarehouseStock] = useState({
    plastik: 450, // Kg from 1000 MAX
    kertas: 870,  // Kg from 1000 MAX
    jelantah: 210 // Liters from 500 MAX
  });

  const [b2bPickup, setB2bPickup] = useState({
    partner: "PT Sinergi Daur Ulang Jakarta",
    truckPlate: "B 9801 COG",
    driver: "Bpk. Rahmat Sanusi",
    status: "Menunggu Selesai Muat", // or "Selesai Muat / Siap Berangkat", or "Berangkat"
    notified: true
  });

  // --- Weekly Waste Trend States ---
  const [weeklyTrends, setWeeklyTrends] = useState(() => {
    const defaultTrends = [
      { name: "M-1", Plastik: 120, Kardus: 180, Minyak: 80, Logam: 45, EWaste: 15 },
      { name: "M-2", Plastik: 150, Kardus: 220, Minyak: 95, Logam: 50, EWaste: 20 },
      { name: "M-3", Plastik: 180, Kardus: 190, Minyak: 110, Logam: 75, EWaste: 12 },
      { name: "M-4", Plastik: 210, Kardus: 250, Minyak: 130, Logam: 60, EWaste: 30 },
      { name: "M-5 (Kini)", Plastik: 245, Kardus: 278, Minyak: 155, Logam: 85, EWaste: 28 },
    ];
    try {
      const stored = localStorage.getItem("lengkang_weekly_trends");
      if (stored) return JSON.parse(stored);
      localStorage.setItem("lengkang_weekly_trends", JSON.stringify(defaultTrends));
      return defaultTrends;
    } catch (e) {
      return defaultTrends;
    }
  });

  // Image error handling states for Anti-Fraud panel
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string, category: string, weightAI: number, weightCourier: number } | null>(null);

  // --- New Citizen Registration Requests state ---
  const [registrationRequests, setRegistrationRequests] = useState<{
    id: string;
    name: string;
    phone: string;
    address: string;
    incentiveChoice: "Sembako" | "Uang Tunai";
    timestamp: string;
  }[]>(() => {
    try {
      const stored = localStorage.getItem("lengkang_registration_requests");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // --- Real-Time Notifications State & References ---
  const [liveNotifications, setLiveNotifications] = useState<{
    id: string;
    type: "registration" | "pickup";
    title: string;
    desc: string;
    timestamp: string;
    read: boolean;
  }[]>(() => {
    try {
      const stored = localStorage.getItem("lengkang_admin_live_notifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toastQueue, setToastQueue] = useState<{
    id: string;
    type: "registration" | "pickup";
    title: string;
    desc: string;
    timestamp: string;
  }[]>([]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Keep track of evaluated IDs to prevent alerting on old entities upon mount
  const evaluatedRegIds = React.useRef<Set<string>>(new Set());
  const evaluatedPickupIds = React.useRef<Set<string>>(new Set());
  const isFirstSyncRef = React.useRef(true);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, start: number, duration: number, type: 'sine' | 'triangle' = 'sine') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = ctx.currentTime;
      playTone(523.25, now, 0.25, "sine"); // C5
      playTone(659.25, now + 0.1, 0.25, "sine"); // E5
      playTone(783.99, now + 0.2, 0.45, "sine"); // G5
    } catch (err) {
      console.warn("Chime blocked or err:", err);
    }
  };

  const removeToast = (id: string) => {
    setToastQueue((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSimulateRegistration = () => {
    const randomNames = ["Siti Rahma", "Joko Purwanto", "Sri Wahyuni", "Ahmad Fauzi", "Dewi Lestari", "Budi Wijaya", "Lina Marlina"];
    const randomRWs = ["RW 02", "RW 05", "RW 04", "RW 06"];
    const name = randomNames[Math.floor(Math.random() * randomNames.length)] + " (Simulasi)";
    const phone = "08" + Math.floor(1000000000 + Math.random() * 9000000000);
    const address = `Jl. Kembang Mawar No. ${Math.floor(1 + Math.random() * 80)}, ${randomRWs[Math.floor(Math.random() * randomRWs.length)]}, Kelurahan Lengkang Hijau`;
    
    const newReg = {
      id: "REQ-" + Math.floor(100 + Math.random() * 900),
      name,
      phone,
      address,
      incentiveChoice: Math.random() > 0.5 ? "Sembako" as const : "Uang Tunai" as const,
      timestamp: new Date().toISOString()
    };
    
    try {
      const storedStr = localStorage.getItem("lengkang_registration_requests");
      const list = storedStr ? JSON.parse(storedStr) : [];
      list.push(newReg);
      localStorage.setItem("lengkang_registration_requests", JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateBooking = () => {
    const randomWargas = ["Ibu Sumiyati", "Bapak Herawan", "Ibu Aminah", "Mas Randy", "Nenek Fatimah", "Pak RT Heru", "Siti Aisyah"];
    const randomCategories = ["Plastik PET (Botol/Gelas)", "Minyak Jelantah Rumahan", "E-Waste / Elektronik", "Sampah Logam & Kaleng"];
    const randomWeights = [4.5, 8, 12, 3.2, 5.5];
    const wargaName = randomWargas[Math.floor(Math.random() * randomWargas.length)] + " (Simulasi)";
    
    const newPickup = {
      id: "PCK-" + Math.floor(1000 + Math.random() * 9000),
      wargaName,
      wargaPhone: "08" + Math.floor(1000000000 + Math.random() * 9000000000),
      wargaAddress: `RT 04 / RW 02, No. ${Math.floor(1 + Math.random() * 40)}, Gg. Melati`,
      wasteCategory: randomCategories[Math.floor(Math.random() * randomCategories.length)],
      estimatedWeight: randomWeights[Math.floor(Math.random() * randomWeights.length)],
      requestDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      status: "Menunggu Penugasan",
      assignedCourier: "",
      pickupDate: "",
      pickupTimeSlot: ""
    };

    try {
      const storedStr = localStorage.getItem("lengkang_resident_pickups");
      const list = storedStr ? JSON.parse(storedStr) : [];
      list.push(newPickup);
      localStorage.setItem("lengkang_resident_pickups", JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDeposit = (id: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data setoran ${id} ini secara permanen dari sistem?`)) {
      const updated = pendingDeposits.filter(dep => dep.id !== id);
      setPendingDeposits(updated);
      try {
        localStorage.setItem("lengkang_pending_deposits", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteCitizen = (id: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus warga dengan ID ${id} ini dari daftar penerima bantuan sembako?`)) {
      setSembakoCitizens(prev => {
        const u = prev.filter(c => c.id !== id);
        try {
          localStorage.setItem("lengkang_citizens_database", JSON.stringify(u));
        } catch (e) {
          console.error(e);
        }
        return u;
      });
    }
  };

  const handleApproveRegistration = (reqId: string) => {
    const targetReq = registrationRequests.find(r => r.id === reqId);
    if (!targetReq) return;

    if (window.confirm(`Setujui permohonan pendaftaran keanggotaan atas nama ${targetReq.name}?`)) {
      const nextId = "WRG-" + (100 + sembakoCitizens.length + 1) + Math.floor(Math.random() * 10);
      const newCitizen: SembakoWarga = {
        id: nextId,
        name: targetReq.name,
        address: targetReq.address,
        phone: targetReq.phone,
        balance: 0,
        incentiveChoice: targetReq.incentiveChoice || "Sembako",
        hasPhone: true,
        qrGenerated: false
      };

      const updatedCitizens = [...sembakoCitizens, newCitizen];
      setSembakoCitizens(updatedCitizens);
      try {
        localStorage.setItem("lengkang_citizens_database", JSON.stringify(updatedCitizens));
      } catch (err) {
        console.error(err);
      }

      const updatedRequests = registrationRequests.filter(r => r.id !== reqId);
      setRegistrationRequests(updatedRequests);
      try {
        localStorage.setItem("lengkang_registration_requests", JSON.stringify(updatedRequests));
      } catch (err) {
        console.error(err);
      }

      alert(`Pendaftaran Berhasil! ${targetReq.name} resmi terdaftar sebagai anggota koperasi baru dengan ID: ${newCitizen.id}`);
    }
  };

  const handleRejectRegistration = (reqId: string) => {
    const targetReq = registrationRequests.find(r => r.id === reqId);
    if (!targetReq) return;

    if (window.confirm(`Tolak permohonan pendaftaran dari ${targetReq.name}?`)) {
      const updatedRequests = registrationRequests.filter(r => r.id !== reqId);
      setRegistrationRequests(updatedRequests);
      try {
        localStorage.setItem("lengkang_registration_requests", JSON.stringify(updatedRequests));
      } catch (err) {
        console.error(err);
      }
      alert(`Permohonan pendaftaran ${targetReq.name} telah ditolak.`);
    }
  };

  const handleDeleteConsultation = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pertanyaan konsultasi ini?")) {
      const updated = consultations.filter((c) => c.id !== id);
      setConsultations(updated);
      try {
        localStorage.setItem("lengkang_consultations", JSON.stringify(updated));
      } catch (err) {
        console.error("Error deleting consultation", err);
      }
    }
  };

  // --- Courier Scheduling States ---
  const [courierSchedules, setCourierSchedules] = useState<CourierSchedule[]>(() => {
    const defaultSchedules: CourierSchedule[] = [
      {
        id: "SCH-101",
        courierName: "Budi Santoso",
        location: "RW 02 - Sektor Hutan Lengkang",
        date: "2026-06-19",
        timeSlot: "Pagi (08:00 - 11:00)",
        vehicleCapacity: 150,
        status: "Aktif"
      },
      {
        id: "SCH-102",
        courierName: "Rahmat Sanusi",
        location: "RW 05 - Jl. Masjid Al-Barokah",
        date: "2026-06-19",
        timeSlot: "Siang (13:00 - 16:00)",
        vehicleCapacity: 200,
        status: "Aktif"
      },
      {
        id: "SCH-103",
        courierName: "Heri Wijaya",
        location: "RW 04 - Gg. Damai Lestari",
        date: "2026-06-20",
        timeSlot: "Pagi (08:00 - 11:00)",
        vehicleCapacity: 150,
        status: "Tertunda"
      }
    ];
    try {
      const stored = localStorage.getItem("lengkang_courier_schedules");
      if (stored) {
        return JSON.parse(stored);
      } else {
        localStorage.setItem("lengkang_courier_schedules", JSON.stringify(defaultSchedules));
        return defaultSchedules;
      }
    } catch (e) {
      return defaultSchedules;
    }
  });

  const [newCourierName, setNewCourierName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("Pagi (08:00 - 11:00)");
  const [newVehicleCapacity, setNewVehicleCapacity] = useState(150);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourierName.trim() || !newLocation.trim() || !newDate) {
      alert("Harap isi seluruh input form penjadwalan kurir!");
      return;
    }
    const newSched: CourierSchedule = {
      id: `SCH-${Math.floor(Math.random() * 900) + 100}`,
      courierName: newCourierName,
      location: newLocation,
      date: newDate,
      timeSlot: newTimeSlot,
      vehicleCapacity: Number(newVehicleCapacity) || 150,
      status: "Aktif"
    };
    const updated = [newSched, ...courierSchedules];
    setCourierSchedules(updated);
    try {
      localStorage.setItem("lengkang_courier_schedules", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    // reset form
    setNewCourierName("");
    setNewLocation("");
    setNewDate("");
    setNewTimeSlot("Pagi (08:00 - 11:00)");
    setNewVehicleCapacity(150);
    alert(`Berhasil menjadwalkan penjemputan baru untuk Kurir ${newCourierName} di ${newLocation}.`);
  };

  const handleToggleScheduleStatus = (id: string, currentStatus: "Aktif" | "Selesai" | "Tertunda") => {
    const nextStatusMap: Record<"Aktif" | "Selesai" | "Tertunda", "Aktif" | "Selesai" | "Tertunda"> = {
      "Tertunda": "Aktif",
      "Aktif": "Selesai",
      "Selesai": "Tertunda"
    };
    const updated = courierSchedules.map(sch => {
      if (sch.id === id) {
        return { ...sch, status: nextStatusMap[currentStatus] };
      }
      return sch;
    });
    setCourierSchedules(updated);
    try {
      localStorage.setItem("lengkang_courier_schedules", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal penjemputan ini secara permanen?")) {
      const updated = courierSchedules.filter(sch => sch.id !== id);
      setCourierSchedules(updated);
      try {
        localStorage.setItem("lengkang_courier_schedules", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Resident Pickup Request States ---
  const [residentPickups, setResidentPickups] = useState<ResidentPickup[]>(() => {
    const defaultPickups: ResidentPickup[] = [
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
    try {
      const stored = localStorage.getItem("lengkang_resident_pickups");
      if (stored) {
        return JSON.parse(stored);
      } else {
        localStorage.setItem("lengkang_resident_pickups", JSON.stringify(defaultPickups));
        return defaultPickups;
      }
    } catch (e) {
      return defaultPickups;
    }
  });

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [pickupToAssign, setPickupToAssign] = useState<ResidentPickup | null>(null);
  const [assignCourier, setAssignCourier] = useState("Budi Santoso");
  const [assignDate, setAssignDate] = useState("2026-06-19");
  const [assignTimeSlot, setAssignTimeSlot] = useState("Pagi (08:00 - 11:00)");

  const [lastNotificationMsg, setLastNotificationMsg] = useState("");

  const handleOpenAssignModal = (pickup: ResidentPickup) => {
    setPickupToAssign(pickup);
    setAssignCourier("Budi Santoso");
    setAssignDate("2026-06-19");
    setAssignTimeSlot("Pagi (08:00 - 11:00)");
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setPickupToAssign(null);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupToAssign) return;

    const updated = residentPickups.map(p => {
      if (p.id === pickupToAssign.id) {
        return {
          ...p,
          status: "Kurir Ditugaskan" as const,
          assignedCourier: assignCourier,
          pickupDate: assignDate,
          pickupTimeSlot: assignTimeSlot
        };
      }
      return p;
    });

    setResidentPickups(updated);
    try {
      localStorage.setItem("lengkang_resident_pickups", JSON.stringify(updated));
      
      const msg = `UPDATE NOTIFIKASI WARGA: Penjemputan atas nama ${pickupToAssign.wargaName} telah ditugaskan kepada Kurir ${assignCourier} pada tanggal ${assignDate} (${assignTimeSlot}). Notifikasi push otomatis terkirim.`;
      setLastNotificationMsg(msg);
      
      const notifications = JSON.parse(localStorage.getItem("lengkang_citizen_notifications") || "[]");
      const newNotif = {
        id: `NTF-${Math.floor(Math.random() * 9000) + 1000}`,
        targetWarga: pickupToAssign.wargaName,
        phone: pickupToAssign.wargaPhone,
        message: `Halo ${pickupToAssign.wargaName}, kurir ${assignCourier} telah ditugaskan untuk menjemput sampah ${pickupToAssign.wasteCategory} Anda pada ${assignDate} sesi ${assignTimeSlot}. Harap siapkan wadah di depan pintu.`,
        timestamp: new Date().toLocaleTimeString(),
        status: "Terkirim"
      };
      localStorage.setItem("lengkang_citizen_notifications", JSON.stringify([newNotif, ...notifications]));

    } catch (err) {
      console.error(err);
    }

    setIsAssignModalOpen(false);
    setPickupToAssign(null);
    alert(`Berhasil menugaskan Kurir ${assignCourier} untuk ${pickupToAssign.wargaName}! Sistem secara real-time mengirimkan notifikasi SMS/WA ke ponsel warga.`);
  };

  const handleDeletePickupRequest = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan/menghapus permintaan penjemputan ini?")) {
      const updated = residentPickups.filter(p => p.id !== id);
      setResidentPickups(updated);
      try {
        localStorage.setItem("lengkang_resident_pickups", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Unified interval to sync registrations, pickups, and detect new real-time additions!
  useEffect(() => {
    // 1. Initial populations of known IDs to prevent spam notices on initial load
    try {
      const initialRegsStr = localStorage.getItem("lengkang_registration_requests");
      const initialRegs = initialRegsStr ? JSON.parse(initialRegsStr) : [];
      initialRegs.forEach((r: any) => evaluatedRegIds.current.add(r.id));
    } catch (e) {
      console.error(e);
    }

    try {
      const initialPickupsStr = localStorage.getItem("lengkang_resident_pickups");
      const initialPickups = initialPickupsStr ? JSON.parse(initialPickupsStr) : [];
      initialPickups.forEach((p: any) => evaluatedPickupIds.current.add(p.id));
    } catch (e) {
      console.error(e);
    }

    isFirstSyncRef.current = false;

    const performSync = () => {
      let isSomethingNew = false;
      let newAlerts: any[] = [];
      let newToasts: any[] = [];

      // A. Check Registration requests
      try {
        const storedRegStr = localStorage.getItem("lengkang_registration_requests");
        const currentRegs = storedRegStr ? JSON.parse(storedRegStr) : [];
        
        // Always sync the state first so the UI remains fresh
        setRegistrationRequests(currentRegs);

        if (!isFirstSyncRef.current) {
          currentRegs.forEach((req: any) => {
            if (!evaluatedRegIds.current.has(req.id)) {
              // Found a brand new registration request!
              evaluatedRegIds.current.add(req.id);
              isSomethingNew = true;

              const alertItem = {
                id: `ALERT-REG-${req.id}-${Date.now()}`,
                type: "registration" as const,
                title: "Pendaftaran Anggota Baru!",
                desc: `${req.name} mengajukan diri sebagai anggota koperasi dari portal warga.`,
                timestamp: new Date().toISOString(),
                read: false
              };

              newAlerts.push(alertItem);
              newToasts.push(alertItem);
            }
          });
        }
      } catch (err) {
        console.error("Error syncing registrations:", err);
      }

      // B. Check Pickup requests
      try {
        const storedPickupStr = localStorage.getItem("lengkang_resident_pickups");
        const currentPickups = storedPickupStr ? JSON.parse(storedPickupStr) : [];

        // Always sync state first so the UI remains fresh
        setResidentPickups(currentPickups);

        if (!isFirstSyncRef.current) {
          currentPickups.forEach((pickup: any) => {
            if (!evaluatedPickupIds.current.has(pickup.id)) {
              // Found a brand new pickup request!
              evaluatedPickupIds.current.add(pickup.id);
              isSomethingNew = true;

              const alertItem = {
                id: `ALERT-PCK-${pickup.id}-${Date.now()}`,
                type: "pickup" as const,
                title: "Booking Penjemputan Baru!",
                desc: `${pickup.wargaName} melakukan booking penjemputan baru (${pickup.wasteCategory}).`,
                timestamp: new Date().toISOString(),
                read: false
              };

              newAlerts.push(alertItem);
              newToasts.push(alertItem);
            }
          });
        }
      } catch (err) {
        console.error("Error syncing pickups:", err);
      }

      // Add to notifications database
      if (newAlerts.length > 0) {
        setLiveNotifications((prev) => {
          const updated = [...newAlerts, ...prev].slice(0, 55); // limit to 55 logs
          try {
            localStorage.setItem("lengkang_admin_live_notifications", JSON.stringify(updated));
          } catch(e) {
            console.error(e);
          }
          return updated;
        });

        // Add to toast queue
        setToastQueue((prev) => [...prev, ...newToasts]);
        
        // Play sound chime
        playChime();
      }
    };

    // Run first sync immediately after initial populations
    performSync();

    // Setup interval
    const intervalId = setInterval(performSync, 2000); // 2 seconds frequency for extreme instant responsive feel

    return () => clearInterval(intervalId);
  }, [soundEnabled]);

  // Toast self-clearing timer
  useEffect(() => {
    if (toastQueue.length > 0) {
      const lastToast = toastQueue[toastQueue.length - 1];
      const timer = setTimeout(() => {
        setToastQueue((prev) => prev.filter((t) => t.id !== lastToast.id));
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toastQueue]);

  const [selectedFilter, setSelectedFilter] = useState<"Semua" | "Menunggu Penugasan" | "Kurir Ditugaskan">("Semua");

  const filteredPickups = residentPickups.filter(p => {
    if (selectedFilter === "Semua") return true;
    return p.status === selectedFilter;
  });

  // --- Live GPS Tracking Simulation ---
  const [courierLocationData, setCourierLocationData] = useState<Array<{
    courierId: string;
    courierName: string;
    route: string;
    progress: number; // 0 to 100
    latitude: number;
    longitude: number;
    speed: number;
    fuel: number;
    battery: number;
    status: "Mengemudi" | "Menimbang" | "Standby" | "Kembali ke Pusat";
    activeTask: string;
  }>>([
    {
      courierId: "SCH-101",
      courierName: "Budi Santoso",
      route: "RW 02 -> Pusat HQ",
      progress: 35,
      latitude: -6.2295,
      longitude: 106.8166,
      speed: 28,
      fuel: 72.5,
      battery: 92,
      status: "Mengemudi",
      activeTask: "Penjemputan Plastik Mandiri"
    },
    {
      courierId: "SCH-102",
      courierName: "Rahmat Sanusi",
      route: "RW 05 -> Sektor Plastik",
      progress: 68,
      latitude: -6.2302,
      longitude: 106.8210,
      speed: 34,
      fuel: 54.2,
      battery: 81,
      status: "Mengemudi",
      activeTask: "Angkut Jelantah Rumahan"
    },
    {
      courierId: "SCH-103",
      courierName: "Heri Wijaya",
      route: "RW 04 (Gg. Damai)",
      progress: 15,
      latitude: -6.2341,
      longitude: 106.8188,
      speed: 0,
      fuel: 90.0,
      battery: 65,
      status: "Standby",
      activeTask: "Standby & Verifikasi"
    }
  ]);

  const [selectedCourierId, setSelectedCourierId] = useState<string>("SCH-101");
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(true);

  useEffect(() => {
    if (!isPlayingSimulation) return;

    const interval = setInterval(() => {
      setCourierLocationData((prev) =>
        prev.map((c) => {
          if (c.status === "Standby") {
            let nextProgress = c.progress + (Math.random() * 0.5);
            if (nextProgress > 100) nextProgress = 0;
            return {
              ...c,
              progress: parseFloat(nextProgress.toFixed(1))
            };
          }
          
          let nextProgress = c.progress + (Math.random() * 2 + 1.5);
          let nextStatus = c.status;
          let nextSpeed = c.speed;

          if (nextProgress >= 100) {
            nextProgress = 0;
            if (c.status === "Mengemudi") {
              nextStatus = "Menimbang";
              nextSpeed = 0;
            } else {
              nextStatus = "Mengemudi";
              nextSpeed = Math.floor(Math.random() * 15) + 20;
            }
          } else {
            if (c.status === "Mengemudi") {
              nextSpeed = Math.max(15, Math.min(45, c.speed + (Math.random() * 6 - 3)));
            }
          }

          let hqLat = -6.2280;
          let hqLng = 106.8150;
          let startLat = c.courierId === "SCH-101" ? -6.2360 : c.courierId === "SCH-102" ? -6.2310 : -6.2340;
          let startLng = c.courierId === "SCH-101" ? 106.8240 : c.courierId === "SCH-102" ? 106.8290 : 106.8190;

          let fraction = nextProgress / 100;
          let nextLat = startLat + (hqLat - startLat) * fraction;
          let nextLng = startLng + (hqLng - startLng) * fraction;

          let nextFuel = Math.max(10, c.fuel - (Math.random() * 0.08));
          let nextBattery = Math.max(15, c.battery - (Math.random() * 0.05));

          return {
            ...c,
            progress: parseFloat(nextProgress.toFixed(1)),
            latitude: parseFloat(nextLat.toFixed(5)),
            longitude: parseFloat(nextLng.toFixed(5)),
            speed: parseFloat(nextSpeed.toFixed(0)),
            status: nextStatus,
            fuel: parseFloat(nextFuel.toFixed(1)),
            battery: parseFloat(nextBattery.toFixed(1)),
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlayingSimulation]);

  // --- 5. Report Downloader State & Logic ---
  const [reportPeriod, setReportPeriod] = useState<"harian" | "bulanan">("bulanan");
  const [selectedDate, setSelectedDate] = useState("2026-06-18");
  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const [selectedReportCategory, setSelectedReportCategory] = useState("Semua");

  // --- 6. Laporan Keuangan State & Logic ---
  
  const exportLedgerToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Tanggal,Tipe,Kategori,Deskripsi,Jumlah (Rp)\n";
    ledgerEntries.forEach(entry => {
      const row = `${entry.id},${entry.date},${entry.type},${entry.category},"${entry.description.replace(/"/g, '""')}",${entry.amount}`;
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Buku_Besar_Koperasi_Lengkang_Clean_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
const [ledgerEntries, setLedgerEntries] = useState(() => {
    const defaultLedger = [
      { id: "TX-1102", date: "2026-06-18", type: "Pengeluaran", category: "Pencairan Warga", description: "Pencairan Tabungan Ibu Sumarni (RW 02) dlm Sembako", amount: 54000 },
      { id: "TX-1101", date: "2026-06-18", type: "Pemasukan", category: "Penjualan B2B", description: "Penjualan 278Kg Kardus & Plastik ke Pabrik Daur Ulang", amount: 1390000 },
      { id: "TX-1103", date: "2026-06-17", type: "Pemasukan", category: "Hibah Pemerintah", description: "Dana Hibah Operasional Koperasi Hijau Kelurahan", amount: 2500000 },
      { id: "TX-1104", date: "2026-06-17", type: "Pengeluaran", category: "Insentif Kurir", description: "Upah Penjemputan Gelombang 1 Kurir Budi Santoso", amount: 150000 },
      { id: "TX-1105", date: "2026-06-16", type: "Pemasukan", category: "Penjualan B2B", description: "Setor Minyak Jelantah 155 Liter ke Vendor Biodiesel", amount: 1860000 },
      { id: "TX-1106", date: "2026-06-16", type: "Pengeluaran", category: "Operasional", description: "Pembelian printer label thermal & roll cetak QR kartu", amount: 350000 }
    ];
    try {
      const stored = localStorage.getItem("lengkang_financial_ledger");
      if (stored) return JSON.parse(stored);
      localStorage.setItem("lengkang_financial_ledger", JSON.stringify(defaultLedger));
      return defaultLedger;
    } catch (e) {
      return defaultLedger;
    }
  });

  // For adding a new manual cash ledger entry
  const [newLedgerDate, setNewLedgerDate] = useState("2026-06-18");
  const [newLedgerType, setNewLedgerType] = useState<"Pemasukan" | "Pengeluaran">("Pemasukan");
  const [newLedgerCategory, setNewLedgerCategory] = useState("Penjualan B2B");
  const [newLedgerDesc, setNewLedgerDesc] = useState("");
  const [newLedgerAmount, setNewLedgerAmount] = useState(100000);
  const [searchLedgerQuery, setSearchLedgerQuery] = useState("");
  const [filterLedgerType, setFilterLedgerType] = useState("Semua");
  const [financialChartTab, setFinancialChartTab] = useState<"Pengeluaran" | "Pemasukan">("Pengeluaran");

  const handleAddLedgerEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLedgerDesc.trim() || newLedgerAmount <= 0) {
      alert("Mohon masukkan deskripsi transaksi dan nominal yang valid!");
      return;
    }
    const newTx = {
      id: `TX-${Math.floor(2000 + Math.random() * 8000)}`,
      date: newLedgerDate,
      type: newLedgerType,
      category: newLedgerCategory,
      description: newLedgerDesc,
      amount: newLedgerAmount
    };
    const updated = [newTx, ...ledgerEntries];
    setLedgerEntries(updated);
    try {
      localStorage.setItem("lengkang_financial_ledger", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setNewLedgerDesc("");
    alert(`Transaksi ${newTx.type} ${newTx.id} senilai Rp ${newTx.amount.toLocaleString()} berhasil dicatat dalam Buku Kas Umum!`);
  };

  const handleDeleteLedgerEntry = (id: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi ${id} ini secara permanen dari buku kas?`)) {
      const updated = ledgerEntries.filter(entry => entry.id !== id);
      setLedgerEntries(updated);
      try {
        localStorage.setItem("lengkang_financial_ledger", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getCategoryChartData = () => {
    const categories: Record<string, { Pemasukan: number; Pengeluaran: number }> = {};
    ledgerEntries.forEach(entry => {
      const cat = entry.category;
      if (!categories[cat]) {
        categories[cat] = { Pemasukan: 0, Pengeluaran: 0 };
      }
      if (entry.type === "Pemasukan") {
        categories[cat].Pemasukan += entry.amount;
      } else {
        categories[cat].Pengeluaran += entry.amount;
      }
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      Pemasukan: categories[cat].Pemasukan,
      Pengeluaran: categories[cat].Pengeluaran
    }));
  };

  const getPieChartData = (type: "Pemasukan" | "Pengeluaran") => {
    const categories: Record<string, number> = {};
    ledgerEntries.forEach((entry: any) => {
      if (entry.type === type) {
        const cat = entry.category;
        categories[cat] = (categories[cat] || 0) + entry.amount;
      }
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat]
    }));
  };

  const getGeneratedReportRows = () => {
    const baseWarga = [
      "Ibu Sumarni (RW 02)", "Bpk. Heri Susanto (RW 05)", "Siti Rahmaawati (RW 01)", 
      "Ahmad Dahlan (RW 03)", "Mbah Kartowijoyo (RW 02)", "Nenek Sutriani (RW 04)", 
      "Bpk. Jumadi (RW 02)", "Ibu Enny Aminah (RW 05)"
    ];
    
    const baseKategori = [
      { name: "Plastik PET Gelas/Botol", code: "PET", price: 3500 },
      { name: "Kardus Kering Cokelat", code: "KRD", price: 2800 },
      { name: "Minyak Jelantah Murni", code: "JLT", price: 7500 },
      { name: "Logam & Besi Tua", code: "MET", price: 9000 }
    ];

    const rows = [];
    const dateStr = reportPeriod === "harian" ? selectedDate : selectedMonth;
    const seed = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rowCount = 5 + (seed % 6);

    for (let i = 0; i < rowCount; i++) {
      const citizenIndex = (seed + i) % baseWarga.length;
      const categoryObj = baseKategori[(seed * (i + 1)) % baseKategori.length];
      
      const weightAI = parseFloat((3 + ((seed + i * 7) % 30) + ((seed % 10) / 10)).toFixed(1));
      const discrepancyFactor = ((seed + i) % 7 === 0) ? 1.25 : 1.02;
      const weightCourier = parseFloat((weightAI * discrepancyFactor).toFixed(1));
      const priceRate = categoryObj.price;
      const totalRupiah = Math.round(weightCourier * priceRate);
      
      let finalDateStr = "";
      if (reportPeriod === "harian") {
        const parts = selectedDate.split("-");
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        const day = parseInt(parts[2]) || 18;
        const monthIdx = (parseInt(parts[1]) - 1) || 5;
        const year = parts[0] || "2026";
        finalDateStr = `${day} ${months[monthIdx]} ${year}`;
      } else {
        const parts = selectedMonth.split("-");
        const day = 1 + ((seed + i * 4) % 28);
        const monthIdx = (parseInt(parts[1]) - 1) || 5;
        const year = parts[0] || "2026";
        const shortMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        finalDateStr = `${day} ${shortMonths[monthIdx]} ${year}`;
      }

      rows.push({
        id: `TX-${2000 + i + (seed % 1000)}`,
        warga: baseWarga[citizenIndex],
        tanggal: finalDateStr,
        kategori: categoryObj.name,
        code: categoryObj.code,
        weightAI,
        weightCourier,
        totalRupiah
      });
    }

    if (selectedReportCategory !== "Semua") {
      return rows.filter(r => r.kategori.toLowerCase().includes(selectedReportCategory.toLowerCase()) || r.code.toLowerCase() === selectedReportCategory.toLowerCase());
    }

    return rows;
  };

  const handleDownloadCSV = () => {
    const rows = getGeneratedReportRows();
    if (rows.length === 0) {
      alert("Tidak ada data untuk diunduh.");
      return;
    }

    let csvContent = "\uFEFFID Transaksi,Nama Warga,Tanggal,Kategori Sampah,Berat AI (Kg),Berat Kurir (Kg),Total Pembayaran (Rupiah)\n";
    rows.forEach(r => {
      csvContent += `"${r.id}","${r.warga.replace(/"/g, '""')}","${r.tanggal}","${r.kategori}",${r.weightAI},${r.weightCourier},${r.totalRupiah}\n`;
    });

    const totalWeightAI = rows.reduce((acc, r) => acc + r.weightAI, 0).toFixed(1);
    const totalWeightCourier = rows.reduce((acc, r) => acc + r.weightCourier, 0).toFixed(1);
    const totalRupiah = rows.reduce((acc, r) => acc + r.totalRupiah, 0);
    csvContent += `\n`;
    csvContent += `TOTAL,,,,"${totalWeightAI} Kg","${totalWeightCourier} Kg","Rp ${totalRupiah}"\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = reportPeriod === "harian"
      ? `laporan-harian-lengkang-${selectedDate}.csv`
      : `laporan-bulanan-lengkang-${selectedMonth}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    const rows = getGeneratedReportRows();
    if (rows.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }

    const totalWeightAI = rows.reduce((acc, r) => acc + r.weightAI, 0).toFixed(1);
    const totalWeightCourier = rows.reduce((acc, r) => acc + r.weightCourier, 0).toFixed(1);
    const totalRupiah = rows.reduce((acc, r) => acc + r.totalRupiah, 0);

    const titleStr = reportPeriod === "harian"
      ? `LAPORAN HARIAN TRANSAKSI - TANGGAL ${selectedDate}`
      : `LAPORAN BULANAN TRANSAKSI - PERIODE ${selectedMonth}`;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(`
        <html>
          <head>
            <title>${titleStr}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.4; }
              .kop-surat { text-align: center; border-bottom: 3px double #008444; padding-bottom: 12px; margin-bottom: 25px; }
              .logo-name { font-size: 22px; font-weight: 900; color: #008444; letter-spacing: -0.5px; }
              .sub-logo { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-top: 3px; }
              .doc-title { font-size: 14px; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 20px; text-decoration: underline; }
              .meta-info { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 15px; color: #475569; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #cbd5e1; padding: 10px 8px; text-align: left; font-size: 11px; }
              th { background-color: #f1f5f9; font-weight: bold; text-transform: uppercase; color: #334155; }
              .tr-total { font-weight: bold; background-color: #f8fafc; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              .disclaim { margin-top: 40px; font-size: 10px; color: #64748b; font-style: italic; line-height: 1.5; }
              .sign-area { margin-top: 60px; display: flex; justify-content: space-between; }
              .sign-box { width: 220px; text-align: center; border-top: 1px dashed #64748b; padding-top: 6px; font-size: 11px; }
            </style>
          </head>
          <body>
            <div class="kop-surat">
              <div class="logo-name">UNIT PENGELOLAAN & DAUR ULANG DEPOSIT LENGKANG</div>
              <div class="sub-logo" style="font-family: monospace;">DINAS LINGKUNGAN HIDUP PROVINSI DKI JAKARTA • RW 02 / RW 05</div>
            </div>

            <div class="doc-title">${titleStr}</div>

            <div class="meta-info">
              <div>Tanggal Cetak: <strong>${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</strong></div>
              <div>Oleh Admin: <strong>${adminEmail}</strong></div>
            </div>

            <table>
              <thead>
                <tr>
                  <th width="12%">ID Transaksi</th>
                  <th>Nama Anggota / Warga</th>
                  <th width="15%" class="text-center">Tanggal</th>
                  <th width="18%">Jenis Sampah</th>
                  <th width="10%" class="text-center">Est. AI (Kg)</th>
                  <th width="10%" class="text-center">Timbang Kurir (Kg)</th>
                  <th width="15%" class="text-right">Kompensasi Cair</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(r => `
                  <tr>
                    <td style="font-family: monospace; font-weight: bold;">${r.id}</td>
                    <td><strong>${r.warga}</strong></td>
                    <td class="text-center">${r.tanggal}</td>
                    <td>${r.kategori}</td>
                    <td class="text-center">${r.weightAI} Kg</td>
                    <td class="text-center">${r.weightCourier} Kg</td>
                    <td class="text-right">Rp ${r.totalRupiah.toLocaleString()}</td>
                  </tr>
                `).join("")}
                <tr class="tr-total">
                  <td colspan="4" class="text-right">REKAPITULASI TOTAL VOLUME & PEMBAYARAN:</td>
                  <td class="text-center">${totalWeightAI} Kg</td>
                  <td class="text-center">${totalWeightCourier} Kg</td>
                  <td class="text-right">Rp ${totalRupiah.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <p class="disclaim">
              * Dokumen ini sah dan dicetak secara automatis menggunakan sistem verifikasi timbangan AI Koperasi Lengkang Hijau. Seluruh data transaksi di atas telah disetujui, dicairkan ke saldo tabungan warga masing-masing, dan dicatat pada buku besar pembukuan kelurahan.
            </p>

            <div class="sign-area">
              <div>
                <p style="font-size: 11px; margin-bottom: 60px;">Disahkan Oleh,</p>
                <div class="sign-box">Kepala Unit Bank Sampah Lengkang</div>
              </div>
              <div>
                <p style="font-size: 11px; margin-bottom: 60px;">Diverifikasi Oleh,</p>
                <div class="sign-box">Staf Logistik & Keuangan</div>
              </div>
            </div>
            
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    } else {
      alert("Gagal mencetak dokumen. Silakan izinkan pop-up di browser Anda.");
    }
  };

  // --- Helper calculations ---
  const getDiscrepancyAndValue = (dep: PendingDeposit) => {
    const diff = ((dep.weightCourier - dep.weightAI) / dep.weightAI) * 100;
    // Calculate money value using dummy standard price 3000/kg
    const value = dep.weightCourier * 3500;
    return {
      diffPercent: parseFloat(diff.toFixed(1)),
      valRp: Math.round(value)
    };
  };

  const extremeDiscrepancies = pendingDeposits.filter((dep) => {
    if (dep.status !== "Pending") return false;
    const { diffPercent } = getDiscrepancyAndValue(dep);
    return Math.abs(diffPercent) > 20;
  });

  // --- Actions ---
  const handleApproveDeposit = (id: string, warga: string, amount: number) => {
    // 1. Update pending deposits state and localStorage
    let approvedDepositWeight = 0;
    let approvedDepositCategory = "";
    
    const updatedDeps = pendingDeposits.map(d => {
      if (d.id === id) {
        approvedDepositWeight = d.weightCourier;
        approvedDepositCategory = d.kategori;
        return { ...d, status: "Disetujui" };
      }
      return d;
    });
    
    setPendingDeposits(updatedDeps);
    try {
      localStorage.setItem("lengkang_pending_deposits", JSON.stringify(updatedDeps));
    } catch (e) {
      console.error("Error saving approved pending deposit", e);
    }

    // 2. Map category and update the weekly trends
    if (approvedDepositWeight > 0 && approvedDepositCategory) {
      let categoryKey: "Plastik" | "Kardus" | "Minyak" | "Logam" | "EWaste" | null = null;
      const catLower = approvedDepositCategory.toLowerCase();
      if (catLower.includes("plastik")) categoryKey = "Plastik";
      else if (catLower.includes("kardus") || catLower.includes("kertas")) categoryKey = "Kardus";
      else if (catLower.includes("minyak") || catLower.includes("jelantah")) categoryKey = "Minyak";
      else if (catLower.includes("logam") || catLower.includes("besi") || catLower.includes("kaleng")) categoryKey = "Logam";
      else if (catLower.includes("e-waste") || catLower.includes("elektronik")) categoryKey = "EWaste";

      if (categoryKey) {
        const updatedTrends = [...weeklyTrends];
        // Week index 4 is the current "M-5"
        updatedTrends[4] = {
          ...updatedTrends[4],
          [categoryKey]: parseFloat((updatedTrends[4][categoryKey] + approvedDepositWeight).toFixed(1))
        };
        setWeeklyTrends(updatedTrends);
        try {
          localStorage.setItem("lengkang_weekly_trends", JSON.stringify(updatedTrends));
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 3. Append to Ledger state automatically
    const autoTx = {
      id: `TX-${Math.floor(2000 + Math.random() * 8000)}`,
      date: new Date().toISOString().split('T')[0],
      type: "Pengeluaran" as const,
      category: "Pencairan Warga",
      description: `Kompensasi Tabungan otomatis: ${warga} (${approvedDepositCategory} ${approvedDepositWeight} Kg)`,
      amount: amount
    };
    const updatedLedger = [autoTx, ...ledgerEntries];
    setLedgerEntries(updatedLedger);
    try {
      localStorage.setItem("lengkang_financial_ledger", JSON.stringify(updatedLedger));
    } catch (e) {
      console.error(e);
    }

    alert(`Sukses! Setoran ${id} milik ${warga} disetujui. Saldo senilai Rp ${amount.toLocaleString()} telah dicairkan ke tabungan warga, dan berat timbangan sebesar ${approvedDepositWeight} Kg otomatis terakumulasi ke tren grafik mingguan (Kategori: ${approvedDepositCategory})!`);
  };

  const handleInvestigateDeposit = (id: string, warga: string) => {
    const updatedDeps = pendingDeposits.map(d => d.id === id ? { ...d, status: "Ditolak" } : d);
    setPendingDeposits(updatedDeps);
    try {
      localStorage.setItem("lengkang_pending_deposits", JSON.stringify(updatedDeps));
    } catch (e) {
      console.error(e);
    }
    alert(`Perhatian! Setoran ${id} milik ${warga} ditangguhkan untuk investigasi internal / audit timbangan fisik.`);
  };

  const handlePriceChange = (id: string, value: string) => {
    const cleanNum = parseInt(value) || 0;
    setPrices(prev => prev.map(p => p.id === id ? { ...p, pricePerKg: cleanNum } : p));
  };

  const handleSavePrices = () => {
    setSavingPrices(true);
    setTimeout(() => {
      setSavingPrices(false);
      setSuccessSaveMsg(true);
      setTimeout(() => setSuccessSaveMsg(false), 3000);
    }, 1200);
  };

  const handlePrintManifest = () => {
    // Generate specialized print popup mockup
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Manifes Pengeluaran Sembako Lengkang</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; line-height: 1.5; color: #1e293b; }
              h1 { text-align: center; font-size: 20px; margin-bottom: 5px; }
              p { text-align: center; font-size: 11px; margin-top: 0; color: #555; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px; }
              th { background-color: #f3f4f6; }
              .sign-area { margin-top: 50px; display: flex; justify-content: space-between; }
              .sign-box { border-top: 1px dashed #000; width: 180px; text-align: center; padding-top: 5px; font-size: 10px; }
            </style>
          </head>
          <body>
            <h1>MANIFES PENGELUARAN SEMBAKO LENGKANG</h1>
            <p>RW 02 / RW 05 - KELURAHAN LENGKANG HIJAU, KOTA JAKARTA BARAT</p>
            <p style="font-style: italic">Dicetak secara digital oleh Admin: ${adminEmail}</p>
            
            <table>
              <thead>
                <tr>
                  <th>ID Warga</th>
                  <th>Nama Penerima</th>
                  <th>Alamat Distribusi</th>
                  <th>Saldo Terdebit</th>
                  <th>Paket Sembako</th>
                  <th>Tanda Tangan Fisik Warga</th>
                </tr>
              </thead>
              <tbody>
                ${sembakoCitizens.filter(c => c.incentiveChoice === "Sembako" && c.balance >= 50000).map(c => `
                  <tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.address}</td>
                    <td>Rp 50.000 (Potong Otomatis)</td>
                    <td>1 Paket Sembako Berkah (Beras 5Kg, Gula 1Kg, Tepung 1Kg)</td>
                    <td style="height: 45px"></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div class="sign-area">
              <div class="sign-box" style="margin-top: 40px">Kepalat Unit Bank Sampah</div>
              <div class="sign-box" style="margin-top: 40px">Petugas Bagian Logistik</div>
            </div>
            
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert("Popup blocker menghalangi pencetakan manifes. Silakan izinkan popup untuk aplikasi ini.");
    }
  };

  const handlePrintQR = (wargaName: string, id: string) => {
    const qrWin = window.open("", "_blank");
    if (qrWin) {
      qrWin.document.write(`
        <html>
          <head>
            <title>Kartu Fisik QR ID - ${wargaName}</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: 'Helvetica Neue', Helvetica, sans-serif; }
              .card { width: 340px; border: 3px solid #008444; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; }
              .header { font-weight: bold; font-size: 16px; color: #008444; margin-bottom: 2px; }
              .sub { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
              .qr-mock { width: 140px; height: 140px; border: 2px solid #ccc; margin: 10px auto; display: flex; justify-content: center; align-items: center; font-size: 9px; font-weight: bold; background: #fafafa; position: relative; }
              .qr-square { width: 110px; height: 110px; background-image: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%); background-size: 10px 10px; opacity: 0.85; }
              .warga-info { font-size: 13px; font-weight: bold; margin-top: 10px; color: #333; }
              .warga-id { font-family: monospace; font-size: 11px; color: #777; margin-top: 4px; }
              .footer-rule { font-size: 8px; color: #999; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">KARTU ANGGOTA KOPERASI LENGKANG</div>
              <div class="sub">Validasi QR Tanpa Handphone Pemda DKI Jakarta</div>
              
              <div class="qr-mock">
                <div class="qr-square"></div>
              </div>

              <div class="warga-info">${wargaName}</div>
              <div class="warga-id">ID: ${id} • EXPIRED: DIS 2029</div>
              <div class="footer-rule">Simpan kartu ini dengan rahasia untuk melayani pengambilan sembako dan pencairan.</div>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      qrWin.document.close();
    } else {
      alert("Gagal mencetak QR. Harap izinkan popup di browser Anda.");
    }
  };

  const handleUpdateB2bStatus = () => {
    if (b2bPickup.status === "Menunggu Selesai Muat") {
      setB2bPickup(prev => ({ ...prev, status: "Selesai Muat / Siap Berangkat" }));
      alert("Konfirmasi Sukses! Truk logistik telah diisi penuh. Status diperbarui ke SIAP BERANGKAT.");
    } else if (b2bPickup.status === "Selesai Muat / Siap Berangkat") {
      setB2bPickup(prev => ({ ...prev, status: "Truk Telah Berangkat menuju Vendor" }));
      // Deduct warehouse capacity by mock values simulating dispatch
      setWarehouseStock({ plastik: 50, kertas: 100, jelantah: 30 });
      alert("Truk resmi diberangkatkan ke tujuan pabrik daur ulang. Kapasitas timbangan inventaris gudang utama dikosongkan kembali.");
    } else {
      setB2bPickup(prev => ({ ...prev, status: "Menunggu Selesai Muat" }));
      alert("Alur simulasi di-reset kembali.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col" id="dashboard-admin-layer">
      {/* HEADER SECTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4 order-1">
        <div className="flex items-center space-x-3 text-left">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer text-slate-650"
            title="Keluar ke Menu Utama"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-black text-slate-800 tracking-tight">Dashboard Admin</h1>
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase">SUPERUSER</span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Mengelola anti-fraud real-time, nominal harga komoditas pasar, sembako & QR ID warga.</p>
          </div>
        </div>

        {/* Status Indicator Panel */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {/* Real-time Notifications Bell */}
          <div className="relative">
            <button
              id="admin-notification-bell"
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer text-slate-650 flex items-center justify-center shadow-xs"
              title="Notifikasi Aktivitas Real-Time"
            >
              <Bell className={`w-4 h-4 ${liveNotifications.some(n => !n.read) ? "animate-pulse text-[#008444]" : "text-slate-500"}`} />
              {liveNotifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm animate-bounce">
                  {liveNotifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {isNotifDropdownOpen && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <div className="fixed inset-0 z-[140]" onClick={() => setIsNotifDropdownOpen(false)} />
                
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-[150] overflow-hidden text-left"
                  id="admin-notification-dropdown"
                >
                  {/* Dropdown Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 font-sans">Notifikasi Real-Time</h4>
                      <p className="text-[10px] text-slate-400 font-sans">Aktivitas pendaftaran & booking penjemputan warga</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-550 transition"
                        title={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
                      >
                        {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      {liveNotifications.length > 0 && (
                        <button
                          onClick={() => {
                            const updated = liveNotifications.map(n => ({ ...n, read: true }));
                            setLiveNotifications(updated);
                            try {
                              localStorage.setItem("lengkang_admin_live_notifications", JSON.stringify(updated));
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="text-[10px] text-[#008444] font-semibold hover:underline"
                        >
                          Baca Semua
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Simulation Sandbox Triggers inside Bell */}
                  <div className="p-3 bg-emerald-50/50 border-b border-slate-100 space-y-2">
                    <span className="block text-[9px] font-bold text-emerald-800 uppercase tracking-wider">🛠️ Simulasi Event Real-Time (Uji Coba):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateRegistration}
                        className="text-[9px] font-bold bg-[#008444] text-white hover:bg-[#006633] px-2 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Daftar Anggota</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSimulateBooking}
                        className="text-[9px] font-bold bg-emerald-700 text-white hover:bg-emerald-950 px-2 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Booking Kurir</span>
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {liveNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-sans">
                        <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        Belum ada notifikasi baru saat ini.
                      </div>
                    ) : (
                      liveNotifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            // Mark as read
                            const updated = liveNotifications.map(item => item.id === n.id ? { ...item, read: true } : item);
                            setLiveNotifications(updated);
                            try {
                              localStorage.setItem("lengkang_admin_live_notifications", JSON.stringify(updated));
                            } catch (e) {
                              console.error(e);
                            }
                            
                            // Scroll to corresponding sections
                            const idToScroll = n.type === "registration" ? "new-registrations-notification-panel" : "resident-pickup-requests-panel";
                            const element = document.getElementById(idToScroll);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                              // Highlight effect
                              element.classList.add("ring-4", "ring-[#008444]/30");
                              setTimeout(() => {
                                element.classList.remove("ring-4", "ring-[#008444]/30");
                              }, 3000);
                            } else if (n.type === "registration") {
                              document.getElementById("dashboard-admin-layer")?.scrollIntoView({ behavior: "smooth" });
                            }
                            
                            setIsNotifDropdownOpen(false);
                          }}
                          className={`p-3 hover:bg-slate-50 transition cursor-pointer text-xs flex gap-3 ${!n.read ? "bg-emerald-50/25 font-semibold" : ""}`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            n.type === "registration" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {n.type === "registration" ? <UserCheck className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0 space-y-0.5 text-left">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-bold text-slate-800 truncate">{n.title}</span>
                              {!n.read && <span className="w-1.5 h-1.5 bg-rose-600 rounded-full shrink-0 animate-ping font-sans" />}
                            </div>
                            <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed font-sans">{n.desc}</p>
                            <span className="text-[9px] text-slate-400 block pt-0.5 font-mono">
                              {new Date(n.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  {liveNotifications.length > 0 && (
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <button
                        onClick={() => {
                          setLiveNotifications([]);
                          try {
                            localStorage.setItem("lengkang_admin_live_notifications", JSON.stringify([]));
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="text-[10px] text-slate-400 hover:text-rose-600 font-bold tracking-wide transition uppercase"
                      >
                        Kosongkan Riwayat
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="h-9 w-px bg-slate-200 hidden sm:block"></div>

          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Petugas Masuk Sebagai / System Admin</p>
            <p className="text-xs font-mono font-bold text-slate-700">{adminEmail}</p>
          </div>
          <div className="h-9 w-px bg-slate-200 hidden sm:block"></div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-250 py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs font-sans"
          >
            <span>Log Out Admin</span>
          </button>
        </div>
      </div>

      {/* REAL-TIME ALERTS FOR EXTREME WEIGHT DISCREPANCY */}
      {extremeDiscrepancies.length > 0 && (
        <div className="mb-8 p-5 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm text-left animate-fade-in order-2" id="realtime-alerts-panel">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-serif font-black text-rose-900 text-base md:text-lg flex items-center gap-2">
                  <span>Peringatan Selisih Berat Ekstrem Terdeteksi!</span>
                </h3>
                <span className="text-[10px] font-bold font-mono text-rose-700 bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full uppercase self-start sm:self-center">
                  {extremeDiscrepancies.length} Kejanggalan Aktif
                </span>
              </div>
              <p className="text-xs text-rose-750 font-sans mt-1 leading-relaxed">
                Sistem mendeteksi setoran sampah aktif dengan deviasi berat curah antara taksiran AI dan masukan lapangan kurir melampaui toleransi &gt; 20%. Silakan lakukan langkah persetujuan penyesuaian atau penolakan setoran di bawah ini.
              </p>
              
              {/* Cards layout for individual anomalies */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {extremeDiscrepancies.map((dep) => {
                  const { diffPercent } = getDiscrepancyAndValue(dep);
                  return (
                    <div 
                      key={dep.id} 
                      className="bg-white/80 backdrop-blur-xs border border-rose-100/80 rounded-xl p-3.5 flex items-center justify-between transition-all duration-200 hover:bg-white hover:shadow-md hover:border-rose-300"
                    >
                      <div className="space-y-1 flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-rose-800">{dep.id}</span>
                          <span className="text-[9px] font-bold font-mono text-rose-700 bg-rose-100/55 px-1.5 py-0.5 rounded uppercase tracking-wider">{dep.kategori}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate">Warga: {dep.warga}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Timbangan: <span className="font-bold text-slate-755">{dep.weightAI} Kg (AI)</span> vs <span className="font-bold text-rose-700">{dep.weightCourier} Kg (Kurir)</span>
                        </p>
                      </div>
                      
                      <div className="text-right shrink-0 flex flex-col items-end justify-between h-full space-y-3">
                        <span className="text-xs font-black font-mono text-rose-600 bg-rose-100/50 border border-rose-200 px-2 py-0.5 rounded-lg">
                          Selisih: {diffPercent > 0 ? `+${diffPercent}` : diffPercent}%
                        </span>
                        <a 
                          href={`#deposit-row-${dep.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(`deposit-row-${dep.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              element.classList.add('bg-rose-100/70', 'ring-2', 'ring-rose-300');
                              setTimeout(() => {
                                element.classList.remove('bg-rose-100/70', 'ring-2', 'ring-rose-300');
                              }, 2500);
                            }
                          }}
                          className="text-[10px] font-bold text-[#008444] hover:text-[#006633] transition-all flex items-center gap-0.5 underline hover:scale-[1.03]"
                        >
                          <span>Review Timbangan</span>
                          <ChevronRight className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFIKASI REAL-TIME: PENDAFTARAN ANGGOTA WARGA BARU */}
      {registrationRequests.length > 0 && (
        <div className="mb-8 p-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl shadow-sm text-left animate-fade-in order-2" id="new-registrations-notification-panel">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-[#008444] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <UserCheck className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-serif font-black text-emerald-900 text-base md:text-lg flex items-center gap-2">
                  <span>Permintaan Pendaftaran Anggota Baru Menunggu Persetujuan</span>
                  <span className="w-2.5 h-2.5 bg-[#008444] rounded-full animate-ping shrink-0" />
                </h3>
                <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full uppercase self-start sm:self-center">
                  {registrationRequests.length} Pengajuan Baru
                </span>
              </div>
              <p className="text-xs text-emerald-950 font-sans mt-1 leading-relaxed">
                Beberapa warga telah mengisi formulir pendaftaran Online dari halaman utama. Silakan verifikasi data identitas default di bawah ini sebelum menyetujui kartu tabungan koperasi mereka.
              </p>
              
              {/* Cards layout for individual applicants */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {registrationRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="bg-white/95 border border-emerald-100 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-emerald-300"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider">{req.id}</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(req.timestamp).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="space-y-1 text-left">
                        <h4 className="text-sm font-bold text-slate-800">{req.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">📞 {req.phone}</p>
                        <p className="text-xs text-slate-450 font-sans line-clamp-2">📍 {req.address}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          Insentif Pilihan: <strong className="text-[#008444] font-bold">{req.incentiveChoice}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleRejectRegistration(req.id)}
                        className="text-[10px] font-bold py-1.5 px-3 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-lg transition cursor-pointer border border-slate-200"
                      >
                        Tolak
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveRegistration(req.id)}
                        className="text-[10px] font-bold py-1.5 px-3.5 bg-[#008444] text-white hover:bg-[#006633] rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        ✓ Setujui Pendaftaran
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: TREN & ANALISIS VISUAL SETORAN SAMPAH MINGGUAN (BAR & PIE CHART) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-left animate-fade-in order-10 scroll-mt-24" id="weekly-trends-analytics-charts">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <TrendingUp className="w-5 h-5 text-[#008444]" />
              <span>Analisis Komparatif &amp; Tren Sampah Mingguan</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Visualisasi komprehensif perkembangan tonase setoran warga berdasarkan 5 kategori komoditas utama dalam 5 minggu terakhir.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-50 text-[#008444] px-2.5 py-1 font-mono font-bold rounded-full border border-emerald-200 uppercase">
              RECHARTS ACTIVE v2
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMN 1: BAR CHART COMPARATIVE (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <strong className="text-slate-800 text-xs uppercase tracking-wider block font-bold">Tren Setoran Antar Kategori (Kg)</strong>
                <span className="text-[10px] text-slate-450">Sumbu-X: Minggu Rute (M-1 s.d M-5)</span>
              </div>
              <div className="flex gap-2 text-[10px] text-slate-500 font-sans">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-xs"></span> Plastik</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span> Kardus</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span> Minyak</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-violet-500 rounded-xs"></span> Logam</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                    stroke="#cbd5e1"
                  />
                  <YAxis 
                    tick={{ fill: "#64748b", fontSize: 10 }} 
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#f8fafc", fontSize: "11px" }}
                    labelStyle={{ fontWeight: "bold", color: "#38bdf8", marginBottom: "4px" }}
                  />
                  <Bar dataKey="Plastik" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Kardus" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Minyak" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Logam" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="EWaste" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-5 text-center gap-1 font-mono text-[10px]">
              {weeklyTrends.map((t: any, idx: number) => {
                const total = t.Plastik + t.Kardus + t.Minyak + t.Logam + t.EWaste;
                return (
                  <div key={idx} className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-slate-400 block font-sans font-bold">{t.name}</span>
                    <strong className="text-slate-750">{total} Kg</strong>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: PIE CHART PROPORTION (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <strong className="text-slate-800 text-xs uppercase tracking-wider block font-bold">Proporsi Distribusi Komoditas (M-5)</strong>
              <span className="text-[10px] text-slate-450">Kontribusi berat relatif (%) terhadap total timbulan</span>
            </div>

            {/* Calculate values of latest week */}
            {(() => {
              const currentWeek = weeklyTrends[weeklyTrends.length - 1];
              const pieData = [
                { name: "Plastik PET", value: currentWeek.Plastik, color: "#3b82f6" },
                { name: "Kardus Bekas", value: currentWeek.Kardus, color: "#f59e0b" },
                { name: "Minyak Jelantah", value: currentWeek.Minyak, color: "#10b981" },
                { name: "Logam & Besi", value: currentWeek.Logam, color: "#8b5cf6" },
                { name: "E-Waste Spesial", value: currentWeek.EWaste, color: "#ef4444" },
              ];
              const totalVal = pieData.reduce((acc, curr) => acc + curr.value, 0);

              return (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2">
                  <div className="w-36 h-36 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ fontSize: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#1e293b' }} 
                          formatter={(val: number) => [`${val} Kg`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest leading-none">TOTAL</span>
                      <span className="font-mono text-base font-black text-slate-800">{totalVal} Kg</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5 text-[11px] font-sans w-full pl-2">
                    {pieData.map((item, idx) => {
                      const share = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(1) : "0";
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1 rounded-lg border border-slate-150">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="font-medium text-slate-650 truncate">{item.name}</span>
                          </div>
                          <span className="font-mono text-slate-750 font-bold shrink-0">
                            {item.value} Kg ({share}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Interactive S-5 Weight Simulator Slider */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                Simulasi Input Timbangan - Minggu 5 (Kini)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Plastik:</span>
                    <strong className="font-mono text-blue-600">{weeklyTrends[4].Plastik} Kg</strong>
                  </div>
                  <input 
                    type="range" min="50" max="400" 
                    value={weeklyTrends[4].Plastik} 
                    onChange={(e) => {
                      const updated = [...weeklyTrends];
                      updated[4] = { ...updated[4], Plastik: parseInt(e.target.value) };
                      setWeeklyTrends(updated);
                      localStorage.setItem("lengkang_weekly_trends", JSON.stringify(updated));
                    }}
                    className="h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Kardus:</span>
                    <strong className="font-mono text-amber-600">{weeklyTrends[4].Kardus} Kg</strong>
                  </div>
                  <input 
                    type="range" min="50" max="400" 
                    value={weeklyTrends[4].Kardus} 
                    onChange={(e) => {
                      const updated = [...weeklyTrends];
                      updated[4] = { ...updated[4], Kardus: parseInt(e.target.value) };
                      setWeeklyTrends(updated);
                      localStorage.setItem("lengkang_weekly_trends", JSON.stringify(updated));
                    }}
                    className="h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID BLOCK ROW 1: COMPONENT ANTI-FRAUD / VALIDATION (FULL WIDTH LARGE TABLE) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-left order-4 scroll-mt-24" id="anti-fraud-deposit-control">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-rose-800 font-serif font-bold text-lg">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
              <span>Anti-Fraud Control Panel (Validasi Berat AI vs Kurir)</span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Mendeteksi manipulasi timbangan di lapangan oleh kurir/petugas eksternal secara otomatis.</p>
          </div>
          <span className="text-[10px] font-bold font-mono text-rose-700 bg-rose-50 border border-rose-100 py-1.5 px-3 rounded-full uppercase self-start sm:self-center">
            Pemicu Sinyal Bahaya: Selisih &gt; 20%
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-150">
          <table className="w-full border-collapse text-left text-xs min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-700 font-bold">
                <th className="px-5 py-3.5">ID Setoran</th>
                <th className="px-5 py-3.5">Nama Warga</th>
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5">Jenis Sampah</th>
                <th className="px-5 py-3.5 text-center">Foto Sampah (AI)</th>
                <th className="px-5 py-3.5 text-center bg-emerald-50/20">Estimasi AI (Kg)</th>
                <th className="px-5 py-3.5 text-center bg-amber-50/20">Input Kurir (Kg)</th>
                <th className="px-5 py-3.5 text-center">Selisih (%)</th>
                <th className="px-5 py-3.5 text-right">Nilai Rupiah</th>
                <th className="px-5 py-3.5 text-center">Aksi Pengelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {pendingDeposits.map((dep) => {
                const { diffPercent, valRp } = getDiscrepancyAndValue(dep);
                const isFraudTriggered = Math.abs(diffPercent) > 20 && dep.status === "Pending";
                
                return (
                  <motion.tr 
                    key={dep.id} 
                    id={`deposit-row-${dep.id}`}
                    whileHover={{ scale: 1.005, backgroundColor: isFraudTriggered ? "rgba(254, 226, 226, 1)" : "rgba(16, 185, 129, 0.04)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}
                    transition={{ duration: 0.15 }}
                    className={`${
                      dep.status !== "Pending" 
                        ? "bg-slate-50/40 opacity-70" 
                        : isFraudTriggered 
                          ? "bg-rose-50" 
                          : "bg-white"
                    }`}
                  >
                    {/* ID */}
                    <td className="px-5 py-4 font-mono font-bold text-slate-800">{dep.id}</td>
                    
                    {/* Citizen Name */}
                    <td className="px-5 py-4 font-bold text-slate-800">{dep.warga}</td>
                    
                    {/* Date */}
                    <td className="px-5 py-4 font-mono text-slate-500">{dep.tanggal}</td>
                    
                    {/* Waste type */}
                    <td className="px-5 py-4 font-medium text-slate-600">{dep.kategori}</td>
                    
                    {/* Mock Image thumbnail */}
                    <td className="px-5 py-4 text-center">
                      <div className="inline-block relative group cursor-zoom-in">
                        {imgErrors[dep.id] ? (
                          <div 
                            onClick={() => setLightboxImage({ url: "", title: dep.warga, category: dep.kategori, weightAI: dep.weightAI, weightCourier: dep.weightCourier })}
                            className="w-12 h-10 bg-slate-100 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform"
                          >
                            <Leaf className="w-5 h-5 text-[#008444]" />
                          </div>
                        ) : (
                          <img 
                            src={dep.imageUrl} 
                            alt="Daur Ulang" 
                            className="w-12 h-10 object-cover rounded-lg border-2 border-slate-200 group-hover:scale-125 transition-transform" 
                            onError={() => setImgErrors(prev => ({ ...prev, [dep.id]: true }))}
                            onClick={() => setLightboxImage({ url: dep.imageUrl, title: dep.warga, category: dep.kategori, weightAI: dep.weightAI, weightCourier: dep.weightCourier })}
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="absolute bottom-0 right-0 bg-[#008444] text-white rounded-full text-[7px] p-0.5 px-1 font-bold pointer-events-none">AI OK</span>
                      </div>
                    </td>

                    {/* AI calculation estimates */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-[#008444] bg-emerald-50/10">
                      {dep.weightAI} Kg
                    </td>

                    {/* Handheld driver weights scales inputs */}
                    <td className={`px-5 py-4 text-center font-mono font-bold bg-amber-50/10 ${isFraudTriggered ? "text-rose-700 underline text-sm" : "text-amber-800"}`}>
                      {dep.weightCourier} Kg
                    </td>

                    {/* Variance percentage comparison flags */}
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 font-mono font-black text-[11px] px-2 py-1 rounded-sm ${
                        isFraudTriggered 
                          ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse" 
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`}
                        {isFraudTriggered && " (FRAUD!)"}
                      </span>
                    </td>

                    {/* Calculated Rupiah value based on catalog pricing rates */}
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                      Rp {valRp.toLocaleString()}
                    </td>

                    {/* Responsive Actions callbacks */}
                    <td className="px-5 py-4 text-center">
                      {dep.status === "Pending" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproveDeposit(dep.id, dep.warga, valRp)}
                            className="bg-[#008444] hover:bg-[#006633] text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
                            title="Setujui dan cairkan nominal ke warga"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Setujui & Cairkan</span>
                          </button>
                          <button
                            onClick={() => handleInvestigateDeposit(dep.id, dep.warga)}
                            className="bg-outlined border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold py-1.5 px-3 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shrink-0"
                            title="Tolak berat kurir dan adakan audit"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Tolak / Investigasi</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDeposit(dep.id)}
                            className="p-1.5 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer shrink-0"
                            title="Hapus setoran ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <span className={`inline-flex items-center gap-1 font-bold font-mono uppercase text-[9px] py-1 px-3.5 rounded-full ${dep.status === "Disetujui" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                            {dep.status === "Disetujui" ? "SELESAI / CAIR" : "DITOLAK / INVESTIGASI"}
                          </span>
                          <button
                            onClick={() => handleDeleteDeposit(dep.id)}
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                            title="Hapus rekaman transaksi ini secara aman"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRID BLOCK ROW 2: PRICING CONTROLLER (STEP 2) AND LOGISTICS INVENTORY METERS (STEP 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 text-left order-5">
        
      {/* PANEL A: KATALOG KENDALI HARGA PASAR KOMODITAS (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between scroll-mt-24" id="pricing-controller-section">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-neutral-dark">Katalog Kendali Harga Pasar Komoditas</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Sesuaikan tarif bayaran beli bank sampah per Kg mengikuti perkembangan fluktuasi pasar dunia.</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600 animate-pulse shrink-0" />
            </div>

            {/* Price Edit Inputs Grid Cards (grid-cols-1 md:grid-cols-4) as requested */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="pricing-editable-grid-block">
              {prices.map((p) => {
                const getTrendIcon = (tr: string) => {
                  if (tr === "naik") return "📈";
                  if (tr === "turun") return "📉";
                  return "↔️";
                };

                return (
                  <motion.div 
                    key={p.id} 
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="bg-slate-50 border border-slate-205 rounded-xl p-3 flex flex-col justify-between cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{p.code} Trend {getTrendIcon(p.trend)}</span>
                    <label htmlFor={`pricing-input-${p.id}`} className="font-serif font-black text-xs text-slate-800 leading-snug line-clamp-2 min-h-[32px] mb-2">{p.name}</label>
                    <div className="space-y-1">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Rp</span>
                        <input
                          id={`pricing-input-${p.id}`}
                          type="number"
                          value={p.pricePerKg}
                          onChange={(e) => handlePriceChange(p.id, e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-lg py-1.5 pl-7 pr-7 font-mono font-extrabold text-xs text-slate-800 outline-none focus:border-[#008444]"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">/{p.unit}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-primary" />
              Perubahan harga langsung berdampak pada kalkulator estimasi saldo warga di landing page.
            </span>
            
            <div className="flex items-center gap-2">
              {successSaveMsg && (
                <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 p-1.5 px-3 rounded-lg flex items-center gap-1 animate-fade-in">
                  ✓ Berhasil di-broadcast!
                </span>
              )}
              <button
                type="button"
                onClick={handleSavePrices}
                disabled={savingPrices}
                className="bg-[#008444] hover:bg-[#006a36] text-white font-bold py-2 px-5 rounded-xl cursor-pointer text-xs transition duration-150 flex items-center justify-center gap-1.5 self-end"
              >
                {savingPrices ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span>Perbarui Harga Seluruh Kategori</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* PANEL B: RINGKASAN INVENTARIS LOGISTIK & DISTRIBUSI MITRA (5 Cols) (STEP 4) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="logistics-b2b-section">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-neutral-dark">Ringkasan Inventaris & Distribusi B2B</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Volume timbangan terakumulasi di Gudang Utama Lengkang sebelum ditransfer ke Mitra Pengepul Cargo.</p>
              </div>
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            {/* capacities trackers (Progress Bars) */}
            <div className="space-y-4 font-sans text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                  <span>Stok Plastik PET</span>
                  <span className="font-mono">{warehouseStock.plastik} Kg / 1000 Kg (Kapasitas Maksimal Truk)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${(warehouseStock.plastik / 1000) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                  <span>Stok Kertas & Kardus</span>
                  <span className="font-mono text-amber-800 font-extrabold">{warehouseStock.kertas} Kg / 1000 Kg (STOK HAMPIR PENUH)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${(warehouseStock.kertas / 1000) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                  <span>Stok Minyak Jelantah</span>
                  <span className="font-mono">{warehouseStock.jelantah} Liters / 500 Liters MAX</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full transition-all duration-300" style={{ width: `${(warehouseStock.jelantah / 500) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* B2B request panel widget */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                <span>Permintaan Penjemputan Cargo B2B</span>
              </span>
              <span className="font-mono text-slate-400">{b2bPickup.truckPlate}</span>
            </div>

            <div className="text-[11.5px] text-slate-600 font-sans leading-relaxed space-y-1">
              <div>Mitra Buyer: <strong className="text-slate-800">{b2bPickup.partner}</strong></div>
              <div>Pengemudi Cargo: <span className="font-semibold text-slate-700">{b2bPickup.driver}</span></div>
              <div className="flex items-center gap-1">
                <span>Status Log: </span>
                <span className="font-bold underline text-slate-900">{b2bPickup.status}</span>
              </div>
            </div>

            <button
              onClick={handleUpdateB2bStatus}
              className="w-full bg-neutral-dark hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg text-xs transition duration-150 text-center cursor-pointer"
            >
              Update Logisitik: {b2bPickup.status === "Menunggu Selesai Muat" ? "Konfirmasi Selesai Muat" : b2bPickup.status === "Selesai Muat / Siap Berangkat" ? "Lepas Cargo / Truk Berangkat" : "Reset Alur Simulasi"}
            </button>
          </div>
        </div>

      </div>

      {/* SECTION: DAFTAR PERMINTAAN PENJEMPUTAN SAMPAH WARGA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-6 scroll-mt-24" id="resident-pickup-requests-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <Calendar className="w-5 h-5 text-[#008444]" />
              <span>Daftar Permintaan Penjemputan Sampah Warga</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Pantau antrean permintaan penjemputan dari Portal Warga. Tekan tombol <strong>Assign Kurir</strong> untuk menentukan kurir penjemput dan jadwal sesi yang langsung terupdate ke notifikasi warga.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] bg-emerald-50 text-[#008444] px-3 py-1.5 font-mono font-bold rounded-full border border-emerald-100 animate-pulse flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Live Sync Aktif
            </span>
            <button
              onClick={() => {
                const names = ["Ibu Ratna Asih", "Heri Susanto", "Mbah Kartowijoyo", "Nenek Sutriani", "Ibu Enny Aminah"];
                const addresses = ["RW 02 - Sektor Hutan Lengkang, Gang Sentosa No. 12", "RW 05 - Jl. Hutan Lengkang No. 88, RT 01", "RW 02 - Jl. Lengkang Hijau No. 12", "RW 04 - Gg. Damai Lestari No. 9B", "RW 05 - Gg. Mawar 3"];
                const categories = ["Minyak Jelantah Rumahan", "Plastik PET Gelas & Botol", "Kardus Kering Bersih", "Logam & Besi Tua", "Layanan E-Waste Khusus"];
                const randIdx = Math.floor(Math.random() * names.length);
                const newReq: ResidentPickup = {
                  id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
                  wargaName: names[randIdx],
                  wargaPhone: `08${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                  wargaAddress: addresses[randIdx],
                  wasteCategory: categories[randIdx],
                  estimatedWeight: parseFloat((5 + Math.random() * 35).toFixed(1)),
                  requestDate: new Date().toISOString().split("T")[0],
                  status: "Menunggu Penugasan"
                };
                const updated = [newReq, ...residentPickups];
                setResidentPickups(updated);
                localStorage.setItem("lengkang_resident_pickups", JSON.stringify(updated));
                alert(`Simulasi: Permintaan Penjemputan Baru dari ${newReq.wargaName} berhasil masuk ke antrean!`);
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#008444] font-bold py-1.5 px-3 rounded-lg text-xs transition duration-150 flex items-center gap-1 cursor-pointer border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulasi Warga Request</span>
            </button>
          </div>
        </div>

        {/* Real-time sync feedback banner */}
        {lastNotificationMsg && (
          <div className="mb-4 bg-[#008444]/10 text-emerald-955 p-3 rounded-xl border border-[#008444]/20 text-xs flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#008444] shrink-0" />
              <span>{lastNotificationMsg}</span>
            </div>
            <button 
              onClick={() => setLastNotificationMsg("")}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 font-sans"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Filters and search info */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            {(["Semua", "Menunggu Penugasan", "Kurir Ditugaskan"] as const).map((filterOpt) => {
              const count = filterOpt === "Semua" 
                ? residentPickups.length 
                : residentPickups.filter(p => p.status === filterOpt).length;
              return (
                <button
                  key={filterOpt}
                  type="button"
                  onClick={() => setSelectedFilter(filterOpt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedFilter === filterOpt
                      ? "bg-white text-slate-805 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {filterOpt} <span className="font-mono text-[10px] px-1 bg-slate-200 rounded text-slate-500">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-450 font-sans italic flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse animate-duration-1000" />
            <span>Terintegrasi dengan Pusat Notifikasi & SMS Gateway Warga</span>
          </div>
        </div>

        {/* Pickups Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-650 font-bold font-sans">
                <th className="px-4 py-3 font-semibold">TID &amp; TANGGAL</th>
                <th className="px-4 py-3 font-semibold">NAMA WARGA / PONSEL</th>
                <th className="px-4 py-3 font-semibold">ALAMAT PENJEMPUTAN</th>
                <th className="px-4 py-3 font-semibold">KATEGORI &amp; ESTIMASI</th>
                <th className="px-4 py-3 font-semibold text-center font-sans">STATUS PENJADWALAN</th>
                <th className="px-4 py-3 font-semibold text-right">TINDAKAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredPickups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-50" />
                    Belum ada antrean penjemputan warga dalam kategori ini.
                  </td>
                </tr>
              ) : (
                filteredPickups.map((pickup) => {
                  const isAssigned = pickup.status === "Kurir Ditugaskan";
                  return (
                    <tr key={pickup.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-700 block">{pickup.id}</span>
                        <span className="text-[10px] text-slate-450 block mt-0.5">{pickup.requestDate}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <strong className="text-slate-800 block text-[13px]">{pickup.wargaName}</strong>
                        <span className="font-mono text-[10px] text-slate-450 block mt-0.5">{pickup.wargaPhone}</span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs truncate" title={pickup.wargaAddress}>
                        <span className="text-slate-600 text-[11.5px]">{pickup.wargaAddress}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[#008444] font-bold block">{pickup.wasteCategory}</span>
                        <span className="font-mono font-bold text-slate-750 block mt-0.5 text-[11px]">
                          {pickup.estimatedWeight} Kg
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isAssigned ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                              {pickup.assignedCourier}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {pickup.pickupDate} ({pickup.pickupTimeSlot?.split(" ")[0]})
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100/80 text-amber-950 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Belum Ditugaskan
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(pickup)}
                            className={`font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer ${
                              isAssigned
                                ? "bg-slate-100 hover:bg-[#008444] text-slate-600 hover:text-white border border-slate-200"
                                : "bg-[#008444] hover:bg-[#006633] text-white shadow-xs hover:scale-105"
                            }`}
                          >
                            {isAssigned ? "Ubah Kurir" : "Assign Kurir"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePickupRequest(pickup.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 rounded-lg transition-all cursor-pointer"
                            title="Batalkan Permintaan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: PENJADWALAN LOKASI & SESI PENJEMPUTAN KURIR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-7" id="courier-scheduling-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <Truck className="w-5 h-5 text-[#008444]" />
              <span>Pusat Penjadwalan Lokasi &amp; Sesi Penjemputan Kurir</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Kelola penugasan operasional kurir sampah Lengkang Clean, tentukan rute wilayah RW, tanggal, serta alokasi muatan armada secara langsung.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMN 1: FORM TAMBAH JADWAL (4 cols) */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-150 rounded-xl p-5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#008444]" />
              <span>Tambah Jadwal Baru</span>
            </h4>

            <form onSubmit={handleAddSchedule} className="space-y-4">
              {/* Courier Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">Nama Petugas Kurir</label>
                <input
                  type="text"
                  placeholder="Contoh: Adi Iskandar"
                  value={newCourierName}
                  onChange={(e) => setNewCourierName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">Lokasi RW / Wilayah Target</label>
                <select
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition"
                  required
                >
                  <option value="">-- Pilih Wilayah --</option>
                  <option value="RW 01 - Sektor Plastik Mandiri">RW 01 - Sektor Plastik Mandiri</option>
                  <option value="RW 02 - Sektor Hutan Lengkang">RW 02 - Sektor Hutan Lengkang</option>
                  <option value="RW 03 - Sektor Organik Subur">RW 03 - Sektor Organik Subur</option>
                  <option value="RW 04 - Gg. Damai Lestari">RW 04 - Gg. Damai Lestari</option>
                  <option value="RW 05 - Jl. Hutan Lengkang No. 88">RW 05 - Jl. Hutan Lengkang No. 88</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">Tanggal</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 outline-none focus:border-[#008444] transition"
                    required
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">Kapasitas (Kg)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={newVehicleCapacity}
                    onChange={(e) => setNewVehicleCapacity(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 outline-none focus:border-[#008444] transition font-mono"
                    required
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">Sesi Jam Kerja</label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition"
                >
                  <option value="Pagi (08:00 - 11:00)">Pagi (08:00 - 11:00)</option>
                  <option value="Siang (13:00 - 16:00)">Siang (13:00 - 16:00)</option>
                  <option value="Sore (16:30 - 18:30)">Sore (16:30 - 18:30)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#008444] hover:bg-[#006633] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Simpan Jadwal Kurir</span>
              </button>
            </form>
          </div>

          {/* COLUMN 2: TABEL JADWAL AKTIF (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="w-full overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full border-collapse text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-700 font-bold font-sans">
                    <th className="px-4 py-3">Juru Kurir</th>
                    <th className="px-4 py-3">Alamat / Wilayah Target</th>
                    <th className="px-4 py-3">Tanggal &amp; Waktu</th>
                    <th className="px-4 py-3 text-center">Limit Muatan</th>
                    <th className="px-4 py-3 text-center">Status Sesi</th>
                    <th className="px-4 py-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-sans">
                  {courierSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        <MapPin className="w-10 h-10 text-slate-300 mx-auto stroke-1 mb-2 animate-bounce" />
                        Belum ada penugasan kurir terdaftar untuk minggu ini.
                      </td>
                    </tr>
                  ) : (
                    courierSchedules.map((sch) => (
                      <tr key={sch.id} className="hover:bg-slate-50/55 transition duration-100">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#008444] flex items-center justify-center font-bold text-[10px]">
                              {sch.courierName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{sch.courierName}</p>
                              <span className="text-[9px] text-slate-400 font-mono font-medium">{sch.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-medium text-slate-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>{sch.location}</span>
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{sch.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{sch.timeSlot}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">
                          {sch.vehicleCapacity} Kg
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleScheduleStatus(sch.id, sch.status)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full cursor-pointer transition uppercase border ${
                              sch.status === "Aktif"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100"
                                : sch.status === "Selesai"
                                ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                : "bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100"
                            }`}
                            title="Klik untuk ubah status tugas"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              sch.status === "Aktif" ? "bg-emerald-500 animate-pulse" : sch.status === "Selesai" ? "bg-slate-500" : "bg-amber-500 animate-pulse"
                            }`} />
                            <span>{sch.status}</span>
                          </button>
                        </td>

                        <td className="px-4 py-3.5 text-right font-medium text-slate-600">
                          <button
                            type="button"
                            onClick={() => handleDeleteSchedule(sch.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition shrink-0 cursor-pointer"
                            title="Batalkan penugasan kurir ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3.5 bg-emerald-50/40 border border-emerald-100/50 rounded-xl flex items-center gap-2.5 text-[11px] text-slate-600">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="leading-relaxed">
                <strong className="text-emerald-800">Petunjuk Operasional:</strong> Gunakan status <span className="font-bold text-amber-800">Tertunda</span> untuk penugasan standby, <span className="font-bold text-[#008444]">Aktif</span> untuk armada bensin on-duty, dan <span className="font-bold text-slate-700">Selesai</span> setelah pelaporan timbangan rampung disetujui admin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL WITHDRAWAL BARU */}
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
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        w.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' : 
                        w.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
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

      {/* SECTION: REAL-TIME GPS TRACKING & TELEMETRY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-8" id="courier-gps-tracking-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <Compass className="w-5 h-5 text-[#008444] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Sistem Monitor &amp; Pelacak GPS Kurir Real-Time</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Pantau koordinat pergerakan armada Lengkang Clean di lapangan, evaluasi efisiensi rute, dan berikan estimasi waktu kedatangan kontainer.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                isPlayingSimulation 
                  ? "bg-emerald-50 text-[#008444] hover:bg-emerald-100 border border-emerald-200" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isPlayingSimulation ? "animate-pulse text-[#008444]" : "text-slate-500"}`} />
              <span>{isPlayingSimulation ? "SIMULASI AKTIF" : "SIMULASI BERHENTI"}</span>
            </button>
            <button
              onClick={() => {
                setCourierLocationData(prev => prev.map(c => ({ ...c, progress: 0 })));
                alert("Simulator GPS dikembalikan ke titik awal penjemputan warga.");
              }}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer text-slate-500"
              title="Reset Rute"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: VISUAL INTERACTIVE VECTOR-MAP (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden select-none min-h-[380px] flex flex-col justify-between shadow-inner">
            {/* Background glowing matrix overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            
            {/* Satellite Signal Status Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlayingSimulation ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlayingSimulation ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              <p className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">
                SAT-CONN: <span className="text-emerald-400">AKTIF ({isPlayingSimulation ? "3 KURIR LIVE" : "HOLD"})</span>
              </p>
            </div>

            {/* Satellite Latency Indicator */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-slate-450">
              <Activity className="w-3.5 h-3.5 text-[#008444] animate-pulse" />
              <span>RT LATENCY: 24ms</span>
            </div>

            {/* MAP STAGE (SVG AREA) */}
            <div className="relative w-full h-[280px] bg-slate-950/20 rounded-xl overflow-hidden mt-6 flex items-center justify-center">
              <svg className="w-full h-full absolute inset-0 text-slate-800" viewBox="0 0 500 300" id="hq-fleet-map-svg">
                {/* SVG grid coordinate helper lines */}
                <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="0" y1="200" x2="500" y2="200" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="125" y1="0" x2="125" y2="300" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="250" y1="0" x2="250" y2="300" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="375" y1="0" x2="375" y2="300" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />

                {/* HQ - Pusat Daur Ulang Lengkang (Coordinates: [250, 110]) */}
                <circle cx="250" cy="110" r="18" fill="rgba(16, 185, 129, 0.15)" className="animate-pulse" />
                <circle cx="250" cy="110" r="28" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />
                
                {/* Dashed route lines to HQ */}
                <path d="M 100 240 Q 150 180 250 110" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4" />
                <path d="M 420 80 Q 330 130 250 110" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4" />
                <path d="M 200 230 Q 220 180 250 110" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-55" />

                {/* Region Circles / Pinned Sectors */}
                <circle cx="100" cy="240" r="6" fill="#f43f5e" />
                <text x="100" y="258" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Sektor HW (RW 02)</text>
                
                <circle cx="420" cy="80" r="6" fill="#f59e0b" />
                <text x="420" y="98" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Masjid (RW 05)</text>

                <circle cx="200" cy="230" r="5" fill="#a855f7" className="opacity-75" />
                <text x="200" y="246" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">Gg. Damai (RW 04)</text>

                {/* DRAW COURIER MARKERS ON THE SVG */}
                {courierLocationData.map((co) => {
                  let x = 250;
                  let y = 110;
                  const progFraction = co.progress / 100;

                  if (co.courierId === "SCH-101") {
                    const t = progFraction;
                    x = (1 - t) * (1 - t) * 100 + 2 * (1 - t) * t * 150 + t * t * 250;
                    y = (1 - t) * (1 - t) * 240 + 2 * (1 - t) * t * 180 + t * t * 110;
                  } else if (co.courierId === "SCH-102") {
                    const t = progFraction;
                    x = (1 - t) * (1 - t) * 420 + 2 * (1 - t) * t * 330 + t * t * 250;
                    y = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * 130 + t * t * 110;
                  } else {
                    const t = progFraction;
                    x = (1 - t) * (1 - t) * 200 + 2 * (1 - t) * t * 220 + t * t * 250;
                    y = (1 - t) * (1 - t) * 230 + 2 * (1 - t) * t * 180 + t * t * 110;
                  }

                  const isSelected = selectedCourierId === co.courierId;
                  
                  return (
                    <g 
                      key={co.courierId} 
                      onClick={() => setSelectedCourierId(co.courierId)}
                      className="cursor-pointer group"
                    >
                      {isSelected && (
                        <circle cx={x} cy={y} r="15" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
                      )}
                      
                      <circle cx={x} cy={y} r="9" fill={isSelected ? "rgba(16, 185, 129, 0.45)" : "rgba(30, 41, 59, 0.85)"} stroke={isSelected ? "#10b981" : "#475569"} strokeWidth="1.5" />
                      
                      <circle cx={x} cy={y} r="4.5" fill={co.status === "Mengemudi" ? "#10b981" : co.status === "Standby" ? "#a855f7" : "#3b82f6"} />
                      
                      <text x={x} y={y - 12} fill={isSelected ? "#10b981" : "#cbd5e1"} fontSize="7" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                        {co.courierName.split(" ")[0]} ({co.progress}%)
                      </text>
                    </g>
                  );
                })}

                {/* HQ Flag Center */}
                <g transform="translate(242, 98)">
                  <path d="M0 0 L16 0 L16 12 L0 12 Z" fill="#008444" opacity="0.9" />
                  <circle cx="8" cy="6" r="2" fill="#fff" />
                  <path d="M0 0 L0 25" stroke="#10b981" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="2" fill="#fff" />
                </g>
                <text x="250" y="132" fill="#10b981" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="black" letterSpacing="1">HQ LENGKANG</text>
              </svg>
            </div>

            {/* Bottom mini legend */}
            <div className="flex items-center justify-between mt-4 border-t border-slate-800/60 pt-3 text-[10px] text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>Mengemudi</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                  <span>Menimbang</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                  <span>Standby</span>
                </span>
              </div>
              <p className="font-mono text-[9px] text-slate-500">Klik ikon kurir pada peta untuk informasi individual</p>
            </div>
          </div>

          {/* RIGHT: COURIER TELEMETRY & CONTROLS (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between" id="courier-telemetry-panel">
            {(() => {
              const selectedCourier = courierLocationData.find(c => c.courierId === selectedCourierId) || courierLocationData[0];
              
              return (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-full text-left space-y-4">
                  <div>
                    {/* Telemetry Header */}
                    <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-[#008444] border border-emerald-500/25 flex items-center justify-center font-bold text-sm">
                          {selectedCourier.courierName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{selectedCourier.courierName}</h4>
                          <span className="text-[10px] font-mono font-bold text-slate-400">{selectedCourier.courierId} • Live GPS Feed</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-black border uppercase px-2.5 py-0.5 rounded-full ${
                        selectedCourier.status === "Mengemudi" 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 animate-pulse" 
                          : selectedCourier.status === "Standby"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}>
                        {selectedCourier.status}
                      </span>
                    </div>

                    {/* Live Parameters Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-2xs">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Tugas</span>
                        <span className="text-xs font-bold text-slate-700 truncate block mt-0.5" title={selectedCourier.activeTask}>
                          {selectedCourier.activeTask}
                        </span>
                      </div>
                      <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-2xs">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Rute Perjalanan</span>
                        <span className="text-xs font-bold text-[#008444] block mt-0.5">{selectedCourier.route}</span>
                      </div>
                    </div>

                    {/* Progress tracking indicator */}
                    <div className="mt-4 space-y-2 bg-white border border-slate-150 p-3.5 rounded-xl shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600 flex items-center gap-1">
                          <Milestone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Progress Rute</span>
                        </span>
                        <span className="font-mono font-bold text-slate-700">{selectedCourier.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#008444] rounded-full transition-all duration-300"
                          style={{ width: `${selectedCourier.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-1">
                        <span>Penjemputan</span>
                        <span>{selectedCourier.progress >= 100 ? "Tiba di HQ" : "Dalam Perjalanan"}</span>
                        <span>Pusat HQ</span>
                      </div>
                    </div>

                    {/* Real-time Telemetry Data (Coordinates, Speed) */}
                    <div className="mt-4 space-y-3">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metrik Sinyal Telemetry</h5>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {/* Speed */}
                        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-2.5 rounded-xl text-center font-mono">
                          <span className="text-[8px] text-slate-500 uppercase block">Kecepatan</span>
                          <span className="text-sm font-black text-emerald-400">{selectedCourier.speed}</span>
                          <span className="text-[8px] text-slate-400 block pb-0.5">Km/Jam</span>
                        </div>

                        {/* Latitude */}
                        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-2.5 rounded-xl text-center font-mono">
                          <span className="text-[8px] text-slate-500 uppercase block">Latitude</span>
                          <span className="text-xs font-bold block py-1 tracking-tight text-slate-200">{selectedCourier.latitude}</span>
                          <span className="text-[8px] text-slate-400 block pb-0.5">DEG E</span>
                        </div>

                        {/* Longitude */}
                        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-2.5 rounded-xl text-center font-mono">
                          <span className="text-[8px] text-slate-500 uppercase block">Longitude</span>
                          <span className="text-xs font-bold block py-1 tracking-tight text-slate-200">{selectedCourier.longitude}</span>
                          <span className="text-[8px] text-slate-400 block pb-0.5">DEG N</span>
                        </div>
                      </div>

                      {/* Gas / Tank capacity */}
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-white border border-slate-150 rounded-xl p-2.5 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Sisa Bensin</span>
                            <span className="text-xs font-bold font-mono text-slate-700 block">{selectedCourier.fuel}%</span>
                          </div>
                          <div className="w-10 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${selectedCourier.fuel < 25 ? "bg-rose-500" : selectedCourier.fuel < 60 ? "bg-amber-500" : "bg-emerald-500"}`} 
                              style={{ width: `${selectedCourier.fuel}%` }}
                            />
                          </div>
                        </div>

                        <div className="bg-white border border-slate-150 rounded-xl p-2.5 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Baterai HP</span>
                            <span className="text-xs font-bold font-mono text-slate-700 block">{selectedCourier.battery}%</span>
                          </div>
                          <div className="w-10 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full animate-pulse" 
                              style={{ width: `${selectedCourier.battery}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Quick Actions (Ping, contact) */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-2.5">
                    <h5 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tindakan Kontak Cepat Pengelola</span>
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Sinyal PING Darurat dikirim ke HP ${selectedCourier.courierName}! Ponsel kurir akan bergetar dan membunyikan alarm navigasi.`);
                        }}
                        className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 py-1.5 px-3 rounded-lg text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Radio className="w-3 h-3 text-[#008444] shrink-0" />
                        <span>Kirim Ping Darurat</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Membuka WhatsApp Web untuk mengirim pesan penjemputan ke ${selectedCourier.courierName}.`);
                        }}
                        className="w-full bg-[#008444] hover:bg-[#006633] text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        <span>Kirim Koordinat WA</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* SECTION: PETA RUTE & JADWAL PENJEMPUTAN RW (DROP-OFF MAP & SCHEDULE) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-9" id="rw-sectors-dropoff-map-schedule-admin">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <Map className="w-5 h-5 text-[#008444]" />
              <span>Manajemen Peta Rute &amp; Jadwal Penjemputan RW (Drop-off Map)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Pantau jadwal pick-up rute m-5 mingguan, pantau kapasitas penampungan, dan perbarui rincian posko RW langsung ke portal warga.
            </p>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="bg-emerald-50 text-[#008444] border border-emerald-250 py-1 px-3 rounded-full font-bold">
              Database Terkoneksi (6 Sektor)
            </span>
          </div>
        </div>

        {/* Outer Grid layer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* COLUMN 1: INTERACTIVE SVG MAP (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-3 left-3 bg-white/95 border border-slate-200/60 py-1 px-2.5 rounded-lg text-[10px] font-bold text-slate-500 flex items-center gap-1 shadow-xs z-10 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PETA ZONA LENGKANG: MODUL ADMINISTRATOR
            </div>

            {/* Responsive SVG Map canvas */}
            <div className="relative w-full overflow-hidden flex items-center justify-center p-2 mt-4 sm:mt-0" style={{ minHeight: "230px" }}>
              <svg
                viewBox="0 0 380 170"
                className="w-full h-auto max-w-[450px] overflow-visible drop-shadow-md"
              >
                <defs>
                  <filter id="glow-filter-admin" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* RW Zones */}
                {sectors.map((rw) => {
                  const isSelected = selectedrwId === rw.id;
                  const capColor = rw.capacityPct >= 75 ? "#ef4444" : rw.capacityPct >= 40 ? "#f59e0b" : "#10b981";
                  
                  return (
                    <g
                      key={rw.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedrwId(rw.id)}
                    >
                      <path
                        d={rw.svgCoords.path}
                        fill={isSelected ? "#10b981" : "#cbd5e1"}
                        fillOpacity={isSelected ? 0.35 : 0.15}
                        stroke={isSelected ? "#008444" : "#94a3b8"}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                        strokeLinejoin="round"
                        className="hover:fill-emerald-100 hover:fill-opacity-50 hover:stroke-emerald-500 transition-all duration-200"
                        style={{
                          filter: isSelected ? "url(#glow-filter-admin)" : "none"
                        }}
                      />

                      {/* Code Tag Centroid */}
                      <text
                        x={rw.svgCoords.cx}
                        y={rw.svgCoords.cy - 1}
                        fontSize="9"
                        fontWeight={isSelected ? "bold" : "bold"}
                        textAnchor="middle"
                        fill={isSelected ? "#065f46" : "#475569"}
                        className="select-none pointer-events-none font-mono"
                      >
                        {rw.id}
                      </text>

                      {/* Capacity Indicator Dot on Centroid */}
                      <circle 
                        cx={rw.svgCoords.cx} 
                        cy={rw.svgCoords.cy + 7} 
                        r="3.5" 
                        fill={capColor} 
                        stroke="#ffffff" 
                        strokeWidth="1" 
                      />

                      {/* Highlight mark for selected sector */}
                      {isSelected && (
                        <g transform={`translate(${rw.svgCoords.cx}, ${rw.svgCoords.cy - 12})`}>
                          <path
                            d="M 0,0 L -3,-5 L 3,-5 Z"
                            fill="#008444"
                          />
                          <circle
                            cx="0"
                            cy="-8"
                            r="4"
                            fill="#008444"
                            className="animate-bounce"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Legends overlay */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[9px] font-mono tracking-tight text-slate-450 uppercase">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block"></span>
                  <span>Kapasitas Baik (&lt;40%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block"></span>
                  <span>Sedang (40%-74%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block"></span>
                  <span>Penuh (&ge;75%)</span>
                </div>
              </div>
            </div>

            {/* Quick list filters bottom */}
            <div className="mt-4 pt-3 border-t border-slate-150 grid grid-cols-6 gap-2 text-center font-mono text-[10px]">
              {sectors.map((rw) => {
                const isSelected = selectedrwId === rw.id;
                return (
                  <button
                    key={rw.id}
                    onClick={() => setSelectedrwId(rw.id)}
                    className={`py-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-[#008444] text-white font-bold border-[#008444]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {rw.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: SELECTED INFO PANEL AND LIVE EDITOR (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between" id="rw-detail-card-panel-admin">
            {(() => {
              const rw = sectors.find(item => item.id === selectedrwId) || sectors[0];
              const capColor = rw.capacityPct >= 75 ? "bg-rose-500" : rw.capacityPct >= 40 ? "bg-amber-500" : "bg-emerald-500";
              const textCapColor = rw.capacityPct >= 75 ? "text-rose-700 bg-rose-50 border-rose-200" : rw.capacityPct >= 40 ? "text-amber-700 bg-amber-50 border-amber-200" : "text-emerald-700 bg-emerald-50 border-emerald-200";

              return (
                <div className="flex flex-col justify-between h-full space-y-4 text-left">
                  {/* Viewing State */}
                  {!isEditingSector ? (
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider mb-1.5 ${textCapColor}`}>
                            Kontainer {rw.capacityStatus} ({rw.capacityPct}%)
                          </span>
                          <h3 className="font-serif font-bold text-base text-slate-805 tracking-tight leading-tight">
                            {rw.name}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold bg-[#008444] text-white p-2 rounded-xl h-9 w-10 flex items-center justify-center shrink-0">
                          {rw.id}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 italic mt-1 leading-relaxed font-sans">
                        "{rw.desc}"
                      </p>

                      <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-xs font-sans text-slate-650">
                        {/* Schedule */}
                        <div className="flex items-start gap-2.5">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Jadwal Pick-up Rutin</p>
                            <p className="font-bold text-slate-800 mt-0.5">{rw.pickupSchedule} • {rw.pickupTime}</p>
                          </div>
                        </div>

                        {/* Drop off point & Address */}
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Nama &amp; Lokasi Posko RW</p>
                            <p className="font-bold text-slate-800 mt-0.5">{rw.dropOffPoint}</p>
                            <p className="text-slate-450 text-[11px] mt-0.5">{rw.address}</p>
                          </div>
                        </div>

                        {/* Coordinator */}
                        <div className="flex items-start gap-2.5">
                          <Radio className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Koordinator Posko</p>
                            <p className="font-bold text-slate-800 mt-0.5">{rw.coordinator} ({rw.coordinatorPhone})</p>
                          </div>
                        </div>

                        {/* Main Waste focus */}
                        <div className="flex items-start gap-2.5">
                          <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Komoditas Fokus Pemilahan</p>
                            <p className="font-medium text-slate-700 mt-0.5">{rw.mainWaste}</p>
                          </div>
                        </div>
                      </div>

                      {/* Simulated Capacity Bar inside Info Panel */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex justify-between items-center text-xs mb-1.5 font-bold text-slate-600">
                          <span>Volume Kontainer Penampungan</span>
                          <span className={`${rw.capacityPct >= 75 ? "text-rose-600" : rw.capacityPct >= 40 ? "text-amber-600" : "text-emerald-700"}`}>
                            {rw.capacityPct}% Terisi
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-205">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${capColor}`}
                            style={{ width: `${rw.capacityPct}%` }}
                          />
                        </div>
                      </div>

                      {/* EDIT ACTOR BUTTON */}
                      <button
                        onClick={() => setIsEditingSector(true)}
                        className="w-full border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100"
                      >
                        <Edit3 className="w-4 h-4 text-[#008444]" />
                        <span>Sunting Rincian &amp; Jadwal Sektor</span>
                      </button>
                    </div>
                  ) : (
                    /* Editing State Form */
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1" style={{ maxHeight: "380px" }}>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md uppercase">
                          SUNTING AKTIF: {rw.id}
                        </span>
                        <button 
                          onClick={() => setIsEditingSector(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs font-bold font-sans"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs text-left">
                        {/* Pick-up Schedule */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Hari Pick-up Sampah</label>
                          <input
                            type="text"
                            value={editPickupSchedule}
                            onChange={(e) => setEditPickupSchedule(e.target.value)}
                            className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444]"
                          />
                        </div>

                        {/* Pick-up Time */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Jam Operasional</label>
                          <input
                            type="text"
                            value={editPickupTime}
                            onChange={(e) => setEditPickupTime(e.target.value)}
                            className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444]"
                          />
                        </div>

                        {/* Drop-off Point Name */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Posko / Depo</label>
                          <input
                            type="text"
                            value={editDropOffPoint}
                            onChange={(e) => setEditDropOffPoint(e.target.value)}
                            className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444]"
                          />
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Alamat Posko RW</label>
                          <input
                            type="text"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444]"
                          />
                        </div>

                        {/* Coordinator Info */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Koordinator</label>
                            <input
                              type="text"
                              value={editCoordinator}
                              onChange={(e) => setEditCoordinator(e.target.value)}
                              className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">HP Koordinator</label>
                            <input
                              type="text"
                              value={editCoordinatorPhone}
                              onChange={(e) => setEditCoordinatorPhone(e.target.value)}
                              className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444]"
                            />
                          </div>
                        </div>

                        {/* Capacity Percentage Slider */}
                        <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                            <span>Simulasikan Muatan Kontainer</span>
                            <span className="font-mono text-[#008444] font-black">{editCapacityPct}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editCapacityPct}
                            onChange={(e) => setEditCapacityPct(Number(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008444]"
                          />
                          <p className="text-[9px] text-slate-400 mt-0.5">Tingkat kepenuhan akan dikalkulasikan ke status "Bagus", "Menengah", atau "Hampir Penuh" secara dinamis.</p>
                        </div>

                        {/* Main Waste Types */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Fokus Komoditas Utama</label>
                          <input
                            type="text"
                            value={editMainWaste}
                            onChange={(e) => setEditMainWaste(e.target.value)}
                            className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444]"
                          />
                        </div>

                        {/* Sector Short Description */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Deskripsi Ringkat Sektor</label>
                          <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-slate-205 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-[#008444] resize-none"
                          />
                        </div>
                      </div>

                      {/* SAVE ACTION BUTTONS */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setIsEditingSector(false)}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-1.5 px-3.5 rounded-xl text-xs transition cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveSectorEdit(rw.id)}
                          className="bg-[#008444] hover:bg-[#006633] text-white font-bold py-1.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Simpan Database Sektor</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* GRID BLOCK ROW 3: AUTOMATION AND DISABILITY / NON-HP PRINT MANIFEST (STEP 3) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-13" id="disability-nonhp-manifest-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-dark">Manifes Pengambilan Sembako & Pembuatan QR ID</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">Mengakomodasi warga lansia atau warga tanpa gadget (Non-HP) untuk menukarkan tabungan mereka secara fisik.</p>
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("sembako")}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === "sembako" 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Manifes Sembako Bulanan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("non-hp")}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === "non-hp" 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Cetak Kartu Fisik QR ID (Warga Non-HP)
            </button>
          </div>
        </div>

        {activeTab === "sembako" ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <div className="font-sans text-slate-650 space-y-0.5 max-w-xl text-left">
                <span className="font-bold text-[#008444]">PERSYARATAN INTEGRASI SEMBAKO:</span>
                <p className="text-[11px] leading-relaxed">
                  Anggota koperasi dengan total saldo akumulasi minimal **Rp 50.000** berhak mengonfirmasi klaim "Insentif Sembako". Tanda tangan basah pada dokumen cetak wajib dibawa untuk verifikasi pembukuan pertanggungjawaban Pemprov.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrintManifest}
                className="bg-[#008444] hover:bg-[#006633] text-white font-bold py-2.5 px-5 rounded-xl transition duration-150 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-center"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Manifes Pengambilan Sembako</span>
              </button>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full border-collapse text-left text-xs text-slate-600 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-150">
                    <th className="px-5 py-3">ID Warga</th>
                    <th className="px-5 py-3">Nama Anggota</th>
                    <th className="px-5 py-3">Alamat</th>
                    <th className="px-5 py-3 text-right">Saldo Saat Ini</th>
                    <th className="px-5 py-3 text-center">Opsi Insentif</th>
                    <th className="px-5 py-3 text-center">Status Kelayakan</th>
                    <th className="px-5 py-3 text-center">Aksi &amp; Cetak</th>
                  </tr>
                </thead>
                <tbody>
                  {sembakoCitizens.map((c) => {
                    const isEligible = c.balance >= 50000 && c.incentiveChoice === "Sembako";
                    return (
                      <tr key={c.id} className="transition-all duration-150 hover:bg-slate-50/40 hover:scale-[1.005] hover:shadow-xs border-b border-slate-100">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-800">{c.id}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-700">{c.name} {!c.hasPhone && "👵👴"}</td>
                        <td className="px-5 py-3.5 text-slate-500">{c.address}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-700">Rp {c.balance.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block font-sans text-[10px] font-bold px-2 py-0.5 rounded ${c.incentiveChoice === "Sembako" ? "bg-amber-100 text-amber-900" : "bg-emerald-50 text-emerald-800"}`}>
                            {c.incentiveChoice}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {isEligible ? (
                            <span className="text-emerald-700 font-extrabold flex items-center justify-center gap-1">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Bisa Klaim</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">Saldo Kurang / Tunai</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingCitizen(c)}
                              className="font-semibold py-1 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] transition cursor-pointer"
                              title="Edit Profil Warga"
                            >
                              Edit Profil
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!isEligible) {
                                  alert("Warga ini belum berhak menerima kompensasi sembako (Saldo wajib Rp 50k+).");
                                  return;
                                }
                                alert(`Kupon Pengambilan individu berhasil dibuat untuk ${c.name}! Kupon otomatis masuk antrean cetak logistik.`);
                              }}
                              className={`font-semibold py-1 px-3 rounded-lg text-[10px] transition cursor-pointer ${isEligible ? "bg-emerald-50 hover:bg-emerald-100 text-[#008444]" : "bg-slate-50 text-slate-400 border border-slate-150 cursor-not-allowed"}`}
                            >
                              Buat Kupon Pengambilan
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCitizen(c.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition border border-transparent hover:border-rose-200 cursor-pointer"
                              title="Hapus warga ini dari daftar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Sub-panel Tab 2: Non-HP Citizens physical badges lists */
          <div className="space-y-5 animate-fade-in">
            <div className="text-left text-xs bg-amber-50/50 p-4 rounded-xl border border-amber-200/40 text-slate-600 font-sans leading-relaxed">
              <span className="font-bold text-amber-900 block mb-1">👵 PORTAL ID NON-HP DENGAN KARTU FISIK LAMINATED:</span>
              Anggota koperasi yang berusia lansia atau tidak menggunakan ponsel pintar dibekali dengan kartu identifikasi QR unik. Petugas unit penimbangan tinggal memindai kartu fisik ini di timbangan berat AI lapangan untuk merekam setoran.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sembakoCitizens.filter(c => !c.hasPhone).map((c) => (
                <div key={c.id} className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                  <div className="text-left font-sans space-y-1">
                    <p className="font-bold text-slate-805 text-sm">{c.name}</p>
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-400">{c.id} • {c.address}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#008444]">
                      <span className="w-2 h-2 bg-[#008444] rounded-full"></span>
                      <span>QR ID Aktif</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white border border-slate-300 rounded flex items-center justify-center relative p-1">
                      <QrCode className="w-full h-full text-slate-700" />
                      <div className="absolute inset-0 bg-[#008444]/10 rounded flex items-center justify-center">
                        <span className="text-[6px] font-black font-serif text-[#008444] bg-white px-0.5 border border-[#008444]/30 rounded">QR</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePrintQR(c.name, c.id)}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold py-1 px-2.5 rounded-md text-[9px] transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Printer className="w-3 h-3 text-[#008444]" />
                      <span>Cetak QR Kartu</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION: LAPORAN KEUANGAN & BUKU KAS KOPERASI LENGKANG HIJAU */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-3 scroll-mt-24" id="koperasi-financial-ledger-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <TrendingUp className="w-5 h-5 text-[#008444]" />
              <span>Sistem Pencatatan Keuangan &amp; Buku Kas Umum</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Transparansi anggaran kas Koperasi Lengkang Hijau. Kelola pemasukan hasil penjualan B2B, dana hibah, kompensasi cair warga, serta beban operasional.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Kas Terintegrasi Sistem Timbangan AI</span>
          </div>
        </div>

        {/* FINANCIAL SUMMARY SCORECARDS */}
        {(() => {
          const totalIn = ledgerEntries
            .filter(e => e.type === "Pemasukan")
            .reduce((sum, e) => sum + e.amount, 0);
          const totalOut = ledgerEntries
            .filter(e => e.type === "Pengeluaran")
            .reduce((sum, e) => sum + e.amount, 0);
          const netBalance = totalIn - totalOut;
          
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div 
                whileHover={{ scale: 1.02, translateY: -2 }}
                className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Kas Masuk (Inflow)</span>
                  <span className="text-xl font-mono font-black text-emerald-900 block mt-1">Rp {totalIn.toLocaleString()}</span>
                </div>
                <div className="text-[9px] text-emerald-700/80 mt-2 font-sans flex items-center justify-between">
                  <span>Dari B2B &amp; Hibah</span>
                  <span className="font-bold">+{((totalIn / (totalIn || 1)) * 100).toFixed(0)}%</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, translateY: -2 }}
                className="bg-rose-50/30 border border-rose-100/60 p-4 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Total Kas Keluar (Outflow)</span>
                  <span className="text-xl font-mono font-black text-rose-900 block mt-1">Rp {totalOut.toLocaleString()}</span>
                </div>
                <div className="text-[9px] text-rose-700/80 mt-2 font-sans flex items-center justify-between">
                  <span>Pencairan &amp; Operasional</span>
                  <span className="font-bold text-rose-800">-{totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(1) : 0}% Kas</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, translateY: -2 }}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Saldo Kas Tersedia</span>
                  <span className={`text-xl font-mono font-black block mt-1 ${netBalance >= 0 ? "text-slate-800" : "text-rose-700"}`}>
                    Rp {netBalance.toLocaleString()}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 mt-2 font-sans flex items-center justify-between">
                  <span>Treasury Koperasi</span>
                  <span className={`font-mono font-bold ${netBalance >= 500000 ? "text-emerald-650" : "text-amber-650"}`}>
                    {netBalance >= 500000 ? "Aman" : "Minimal"}
                  </span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, translateY: -2 }}
                className="bg-blue-50/40 border border-blue-100 p-4 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Tingkat surplus margin</span>
                  <span className="text-xl font-mono font-black text-blue-900 block mt-1">
                    {totalIn > 0 ? (100 - (totalOut / totalIn * 100)).toFixed(1) : "100"}%
                  </span>
                </div>
                <div className="text-[9px] text-blue-700 mt-2 font-sans flex items-center justify-between">
                  <span>Optimalisasi Anggaran</span>
                  <span className="font-bold">Aktif</span>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* TWO COLUMN GRID WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMN 1: BUKU KAS UTAMA (LEDGER ENTRIES LIST) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
              
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

              
              {/* Filter and search controls */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari deskripsi..."
                    value={searchLedgerQuery}
                    onChange={(e) => setSearchLedgerQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#008444] w-full sm:w-44 placeholder:text-slate-400 font-sans"
                  />
                </div>
                
                {/* Type selector */}
                <select
                  value={filterLedgerType}
                  onChange={(e) => setFilterLedgerType(e.target.value)}
                  className="bg-slate-50 border border-slate-205 rounded-xl py-1.5 px-3 text-xs text-slate-800 outline-none focus:border-[#008444]"
                >
                  <option value="Semua">Semua Arus</option>
                  <option value="Pemasukan">Pemasukan (+)</option>
                  <option value="Pengeluaran">Pengeluaran (-)</option>
                </select>
              </div>
            </div>

            {/* LEDGER ENTRIES LIST TABLE */}
            {(() => {
              const filtered = ledgerEntries.filter(entry => {
                const matchesSearch = entry.description.toLowerCase().includes(searchLedgerQuery.toLowerCase()) ||
                                      entry.category.toLowerCase().includes(searchLedgerQuery.toLowerCase());
                const matchesType = filterLedgerType === "Semua" || entry.type === filterLedgerType;
                return matchesSearch && matchesType;
              });

              return (
                <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-3xs">
                  <table className="w-full border-collapse text-left text-xs min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-650 font-bold border-b border-slate-200">
                        <th className="px-4 py-3 font-semibold">Ref ID</th>
                        <th className="px-4 py-3 font-semibold">Tanggal</th>
                        <th className="px-4 py-3 font-semibold">Arus Kas</th>
                        <th className="px-4 py-3 font-semibold">Kategori</th>
                        <th className="px-4 py-3 font-semibold">Deskripsi / Keterangan</th>
                        <th className="px-4 py-3 font-semibold text-right">Nominal (Rp)</th>
                        <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 font-sans bg-white">
                            Tidak ditemukan pencatatan transaksi yang cocok dengan filter atau kata kunci.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((item, index) => {
                          const isInflow = item.type === "Pemasukan";
                          return (
                            <motion.tr 
                              key={item.id}
                              whileHover={{ scale: 1.002, backgroundColor: "rgba(241, 245, 249, 0.4)" }}
                              className={`border-b last:border-b-0 border-slate-100 text-slate-650 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}
                            >
                              <td className="px-4 py-3 font-mono font-bold text-slate-800">{item.id}</td>
                              <td className="px-4 py-3 text-slate-550 font-sans whitespace-nowrap">{item.date}</td>
                              <td className="px-4 py-3 font-sans font-medium">
                                <span className={`inline-flex items-center gap-1 font-sans text-[10px] font-black px-2 py-0.5 rounded-full ${isInflow ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                                  {isInflow ? "+" : "-"} {item.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-sans font-bold text-slate-700 whitespace-nowrap">{item.category}</td>
                              <td className="px-4 py-3 font-sans text-[11px] text-slate-600 leading-normal max-w-[200px] truncate" title={item.description}>
                                {item.description}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono font-black whitespace-nowrap ${isInflow ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}`}>
                                {isInflow ? "+" : "-"}Rp {item.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLedgerEntry(item.id)}
                                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition border border-transparent hover:border-rose-200 cursor-pointer text-center inline-block"
                                  title="Hapus pencatatan transaksi kas ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>

          {/* COLUMN 2: ADD LEDGER TRANSACTION FORM & PERFORMANCE GRAPH */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CARD 2A: RECORD NEW TRANSACTION FORM */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left">
              <span className="font-serif font-black text-xs text-slate-800 uppercase tracking-wider block mb-3">Catat Kas Manual (Buku Kas Umum)</span>
              
              <form onSubmit={handleAddLedgerEntry} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1 font-sans">Tanggal</label>
                    <input
                      type="date"
                      value={newLedgerDate}
                      onChange={(e) => setNewLedgerDate(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl py-1 px-2.5 text-xs text-slate-800 font-mono outline-none focus:border-[#008444]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Arus Kas</label>
                    <select
                      value={newLedgerType}
                      onChange={(e) => {
                        const val = e.target.value as "Pemasukan" | "Pengeluaran";
                        setNewLedgerType(val);
                        setNewLedgerCategory(val === "Pemasukan" ? "Penjualan B2B" : "Pencairan Warga");
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl py-1 px-2 text-xs text-slate-800 outline-none focus:border-[#008444]"
                    >
                      <option value="Pemasukan">Pemasukan (+)</option>
                      <option value="Pengeluaran">Pengeluaran (-)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Kategori Anggaran</label>
                    <select
                      value={newLedgerCategory}
                      onChange={(e) => setNewLedgerCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2 text-xs text-slate-800 outline-none focus:border-[#008444]"
                    >
                      {newLedgerType === "Pemasukan" ? (
                        <>
                          <option value="Penjualan B2B">Penjualan B2B (Setor Hasil)</option>
                          <option value="Hibah Pemerintah">Hibah Kelurahan / Pemerintah</option>
                          <option value="Donasi Warga">Donasi Sosial / Swadaya</option>
                          <option value="Lainnya">Lainnya</option>
                        </>
                      ) : (
                        <>
                          <option value="Pencairan Warga">Pencairan Warga (Klaim)</option>
                          <option value="Insentif Kurir">Insentif Kurir Lapangan</option>
                          <option value="Operasional Kantor">Operasional &amp; ATK</option>
                          <option value="Biaya Transportasi">Solar &amp; Transportasi</option>
                          <option value="Lainnya">Lainnya / Sembako</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Nominal Transaksi (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-sans text-xs">Rp</span>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={newLedgerAmount}
                        onChange={(e) => setNewLedgerAmount(parseInt(e.target.value) || 0)}
                        required
                        className="pl-8 pr-3 py-1.5 w-full bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono outline-none focus:border-[#008444]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-sans">Deskripsi / Keterangan</label>
                    <textarea
                      placeholder="Contoh: Pembayaran hasil timbangan..."
                      value={newLedgerDesc}
                      onChange={(e) => setNewLedgerDesc(e.target.value)}
                      required
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] placeholder:text-slate-400 resize-none"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#008444] hover:bg-[#006633] text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sahkan &amp; Rekam Buku Kas</span>
                </motion.button>
              </form>
            </div>

            {/* CARD 2B: CHART FOR VISUAL BREAKDOWN (RECHARTS) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-xs">
              <span className="font-serif font-black text-xs text-slate-800 uppercase tracking-wider block mb-1">Grafik Proporsi Komposisi Alokasi Kas</span>
              <p className="text-[10px] text-slate-400 font-sans mb-3 leading-normal">
                Visualisasi persentase rekapitulasi dana kas masuk (Inflow) dan kas keluar (Outflow) berdasarkan klasifikasi anggaran aktif.
              </p>

              {/* Toggles for Chart Type mapping */}
              <div className="flex bg-slate-100 p-0.5 rounded-xl text-[10px] font-bold mb-4 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setFinancialChartTab("Pengeluaran")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center transition duration-150 whitespace-nowrap cursor-pointer font-sans font-bold text-[9px] ${
                    financialChartTab === "Pengeluaran" 
                      ? "bg-rose-600 text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  📉 Alokasi Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFinancialChartTab("Pemasukan")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center transition duration-150 whitespace-nowrap cursor-pointer font-sans font-bold text-[9px] ${
                    financialChartTab === "Pemasukan" 
                      ? "bg-emerald-600 text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  📈 Sumber Pemasukan
                </button>
              </div>

              {(() => {
                const pieDataRaw = getPieChartData(financialChartTab);
                const colors = financialChartTab === "Pemasukan"
                  ? ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0"]
                  : ["#f43f5e", "#fb7185", "#be123c", "#fca5a5", "#fda4af"];
                
                const totalAmount = pieDataRaw.reduce((sum, item) => sum + item.value, 0);

                if (pieDataRaw.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl text-xs font-sans">
                      Daftar transaksi {financialChartTab} kosong. Rekam data di kas umum terlebih dahulu.
                    </div>
                  );
                }

                const pieDataWithColors = pieDataRaw.map((item, idx) => ({
                  ...item,
                  color: colors[idx % colors.length]
                }));

                return (
                  <div className="space-y-4">
                    <div className="w-full h-36 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieDataWithColors}
                            cx="50%"
                            cy="50%"
                            innerRadius={38}
                            outerRadius={55}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieDataWithColors.map((entry, index) => (
                              <Cell key={`cell-fin-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ fontSize: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#1e293b' }} 
                            formatter={(val: number) => [`Rp ${val.toLocaleString()}`]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[7px] font-sans font-bold text-slate-400 uppercase tracking-wider leading-none">TOTAL {financialChartTab === "Pemasukan" ? "IN" : "OUT"}</span>
                        <span className="font-mono text-[11px] font-black text-slate-800">Rp {totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {pieDataWithColors.map((item, idx) => {
                        const percent = totalAmount > 0 ? ((item.value / totalAmount) * 100).toFixed(1) : "0";
                        return (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/60 hover:shadow-3xs transition-all duration-150 text-[10px]">
                            <div className="flex items-center gap-1.5 truncate pr-2">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="font-bold text-slate-700 truncate">{item.name}</span>
                            </div>
                            <div className="text-right shrink-0 flex items-center gap-2 font-mono">
                              <span className="text-slate-500 font-medium font-sans">Rp {item.value.toLocaleString()}</span>
                              <span className={`font-mono font-bold px-1.5 py-0.2 rounded text-[9.5px] ${financialChartTab === "Pemasukan" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-rose-50 text-rose-800 border-rose-100"} border`}>{percent}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </div>

      {/* GRID BLOCK: LAPORAN HARIAN / BULANAN YANG BISA DIDOWNLOAD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-11" id="laporan-unduh-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <Download className="w-5 h-5 text-[#008444]" />
              <span>Pusat Laporan Transaksi Harian &amp; Bulanan</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Pantau total timbunan sampah, rekapitulasi dana kompensasi warga, dan unduh arsip laporan dalam format CSV atau cetak PDF resmi.
            </p>
          </div>
        </div>

        {/* CONTROLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Period Toggle */}
          <div className="space-y-1">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Metode Rekapitulasi</span>
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setReportPeriod("harian")}
                className={`flex-1 py-1 px-2.5 text-center rounded-lg transition cursor-pointer ${
                  reportPeriod === "harian" 
                    ? "bg-white text-slate-900 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Harian (Daily)
              </button>
              <button
                type="button"
                onClick={() => setReportPeriod("bulanan")}
                className={`flex-1 py-1 px-2.5 text-center rounded-lg transition cursor-pointer ${
                  reportPeriod === "bulanan" 
                    ? "bg-white text-slate-900 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Bulanan (Monthly)
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-1">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {reportPeriod === "harian" ? "Pilih Tanggal Laporan" : "Pilih Bulan Laporan"}
            </span>
            {reportPeriod === "harian" ? (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-1.5 px-3 font-mono text-xs text-slate-800 outline-none focus:border-[#008444]"
              />
            ) : (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-1.5 px-3 font-mono text-xs text-slate-800 outline-none focus:border-[#008444]"
              />
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kategori Komoditas</span>
            <select
              value={selectedReportCategory}
              onChange={(e) => setSelectedReportCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444]"
            >
              <option value="Semua">Semua Kategori Sampah</option>
              <option value="PET">Plastik PET Gelas/Botol</option>
              <option value="KRD">Kardus Kering Cokelat</option>
              <option value="JLT">Minyak Jelantah Murni</option>
              <option value="MET">Logam &amp; Besi Tua</option>
            </select>
          </div>

          {/* Export Buttons */}
          <div className="space-y-1 flex flex-col justify-end">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="flex-1 bg-[#008444] hover:bg-[#006633] text-white font-bold py-2 px-3 rounded-xl transition duration-150 text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                title="Unduh file dokumen dalam format Excel/CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
              <button
                type="button"
                onClick={handlePrintPDF}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-3 rounded-xl transition duration-150 text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                title="Cetak/Simpan Laporan secara Resmi"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* PREVIEW AGGREGATES CARDS */}
        {(() => {
          const rows = getGeneratedReportRows();
          const totalWeightAI = rows.reduce((acc, r) => acc + r.weightAI, 0);
          const totalWeightCourier = rows.reduce((acc, r) => acc + r.weightCourier, 0);
          const totalRupiah = rows.reduce((acc, r) => acc + r.totalRupiah, 0);
          const averageDiscrepancy = rows.length > 0
            ? (rows.reduce((acc, r) => acc + ((r.weightCourier - r.weightAI) / r.weightAI * 100), 0) / rows.length).toFixed(1)
            : "0.0";

          return (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Volume AI</p>
                  <p className="text-xl font-mono font-black text-emerald-800 mt-1">{totalWeightAI.toFixed(1)} Kg</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Estimasi AI berdasarkan foto</p>
                </div>

                <div className="bg-amber-50/30 border border-amber-200/40 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Volume Kurir</p>
                  <p className="text-xl font-mono font-black text-amber-800 mt-1">{totalWeightCourier.toFixed(1)} Kg</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Timbangan fisik agen kurir</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Komisi Cair Warga</p>
                  <p className="text-xl font-mono font-black text-slate-800 mt-1">Rp {totalRupiah.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Dana terdistribusi otomatis</p>
                </div>

                <div className="bg-rose-50/30 border border-rose-100/40 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Selisih</p>
                  <p className="text-xl font-mono font-black text-rose-805 mt-1">+{averageDiscrepancy}%</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Tingkat anomali timbangan</p>
                </div>
              </div>

              {/* TRANSACTIONS TABLE PREVIEW */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pratinjau Data Transaksi ({rows.length} Baris Data Terpilih)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono italic">
                    Format cetak otomatis - RW 02/05 Lengkang
                  </span>
                </div>

                {rows.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-lg text-xs">
                    Tidak ada transaksi tercatat untuk parameter pencarian di atas.
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full border-collapse text-left text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="px-4 py-2.5">ID TRX</th>
                          <th className="px-4 py-2.5">Warga</th>
                          <th className="px-4 py-2.5">Tanggal</th>
                          <th className="px-4 py-2.5">Kategori</th>
                          <th className="px-4 py-2.5 text-center">AI (Kg)</th>
                          <th className="px-4 py-2.5 text-center">Kurir (Kg)</th>
                          <th className="px-4 py-2.5 text-right">Pembayaran</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {rows.map((r) => (
                          <tr key={r.id} className="transition-all duration-150 hover:bg-slate-50/75 hover:scale-[1.005] hover:shadow-xs">
                            <td className="px-4 py-2 font-mono font-bold text-slate-800">{r.id}</td>
                            <td className="px-4 py-2 font-bold text-slate-700">{r.warga}</td>
                            <td className="px-4 py-2 text-slate-500">{r.tanggal}</td>
                            <td className="px-4 py-2 text-slate-600">{r.kategori}</td>
                            <td className="px-4 py-2 text-center font-mono text-[#008444] font-semibold">{r.weightAI} Kg</td>
                            <td className="px-4 py-2 text-center font-mono text-amber-800 font-semibold">{r.weightCourier} Kg</td>
                            <td className="px-4 py-2 text-right font-mono font-extrabold text-slate-800">Rp {r.totalRupiah.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          );
        })()}
      </div>

      {/* GRID BLOCK ROW 4: CONSULTATION & QnA RESPONDER CONTROL PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-left order-12 scroll-mt-24" id="consultation-management-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#008444] font-serif font-bold text-lg">
              <MessageSquare className="w-5 h-5 text-[#008444]" />
              <span>Manajemen Konsultasi & Pertanyaan Warga</span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Menerima pertanyaan, proposal kemitraan CSR, dan keluhan pilah sampah warga yang dikirimkan secara langsung dari Landing Page.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#008444] bg-emerald-50 border border-emerald-100 py-1.5 px-3 rounded-full">
            <span>Total Masuk: {consultations.length}</span>
          </div>
        </div>

        {consultations.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300 animate-pulse" />
            <p className="font-semibold text-sm">Tidak Ada Konsultasi Tersedia</p>
            <p className="text-xs mt-1">Belum ada warga yang mengirimkan konsultasi lewat form kontak.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {consultations.map((c) => {
              const isPending = c.status === "Pending";
              return (
                <div 
                  key={c.id} 
                  className={`border rounded-2xl p-5 transition-all ${
                    isPending 
                      ? "border-amber-200 bg-amber-50/10 hover:border-amber-300" 
                      : "border-slate-150 bg-slate-50/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {c.id}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {c.name}
                        </h4>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-mono font-medium text-slate-500">
                          {c.phone}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#008444] tracking-tight uppercase">
                        Kategori: {c.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-medium font-mono text-slate-400">
                        {c.date}
                      </span>
                      <span className={`inline-flex text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isPending 
                          ? "bg-amber-100 text-amber-900 border border-amber-200" 
                          : "bg-[#008444]/15 text-[#008444] border border-[#008444]/30"
                      }`}>
                        {c.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteConsultation(c.id)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition border border-transparent hover:border-rose-200 cursor-pointer ml-1"
                        title="Hapus konsultasi ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-4 mb-4 text-xs text-slate-700 leading-relaxed font-sans shadow-inner">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Pesan Konsultasi:</div>
                    "{c.message}"
                  </div>

                  {isPending ? (
                    <div className="space-y-2">
                      <label htmlFor={`reply-${c.id}`} className="block text-[11px] font-bold text-slate-500 uppercase">
                        Tulis Jawaban / Masukan Tim Ahli Lengkang
                      </label>
                      <div className="flex gap-3">
                        <textarea
                          id={`reply-${c.id}`}
                          rows={2}
                          value={replyTexts[c.id] || ""}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder="Ketik balasan resmi, saran pengolahan sampah, atau link panduan disini..."
                          className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#008444] transition-colors resize-none font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(c.id)}
                          className="bg-[#008444] hover:bg-[#006633] text-white font-bold px-4 rounded-xl transition duration-150 text-xs flex flex-col justify-center items-center gap-1.5 shrink-0 self-stretch min-w-[90px] cursor-pointer shadow-xs"
                        >
                          <Send className="w-4 h-4" />
                          <span>Kirim</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-950 font-sans leading-relaxed">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 mb-1 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Jawaban Resmi Admin:</span>
                      </div>
                      "{c.reply}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: ASSIGN COURIER & SCHEDULE TIME */}
      {isAssignModalOpen && pickupToAssign && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in text-left" id="assign-courier-modal-overlay">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start pb-4 border-b border-slate-150 mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#008444]" />
                  <span>Assign Kurir &amp; Jadwal Penjemputan</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Permintaan ID: <strong className="font-mono text-slate-600">{pickupToAssign.id}</strong></p>
              </div>
              <button 
                onClick={handleCloseAssignModal}
                className="text-slate-450 hover:text-slate-650 transition p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mb-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 font-sans">
                <span>Nama Warga:</span>
                <strong className="text-slate-800">{pickupToAssign.wargaName}</strong>
              </div>
              <div className="flex justify-between text-slate-500 font-sans">
                <span>Kontak Ponsel:</span>
                <span className="font-mono font-semibold text-slate-800">{pickupToAssign.wargaPhone}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-sans">
                <span>Jenis Sampah Daur Ulang:</span>
                <span className="font-bold text-[#008444]">{pickupToAssign.wasteCategory}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-sans">
                <span>Est. Berat / Volume:</span>
                <span className="font-mono font-bold text-slate-800">{pickupToAssign.estimatedWeight} Kg</span>
              </div>
              <div className="text-slate-500 pt-2 border-t border-slate-200 text-[11px] leading-relaxed">
                <span className="font-semibold text-slate-700">Alamat Lengkap Warga:</span>
                <p className="mt-0.5 text-slate-600">{pickupToAssign.wargaAddress}</p>
              </div>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Pilih Kurir Tersedia</label>
                <select
                  value={assignCourier}
                  onChange={(e) => setAssignCourier(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition cursor-pointer"
                  required
                >
                  <option value="Budi Santoso">Budi Santoso (Motor Box Tiga Roda - Sektor Utara)</option>
                  <option value="Rahmat Sanusi">Rahmat Sanusi (Suzuki Carry Pick-up - Sektor Timur)</option>
                  <option value="Heri Wijaya">Heri Wijaya (Viar Motor Gerobak - Sektor Barat)</option>
                  <option value="Adi Iskandar">Adi Iskandar (Motor Box Tiga Roda - Sektor Selatan)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tanggal Penjemputan</label>
                  <input
                    type="date"
                    value={assignDate}
                    onChange={(e) => setAssignDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-[#008444] transition cursor-pointer"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Sesi Waktu Kerja</label>
                  <select
                    value={assignTimeSlot}
                    onChange={(e) => setAssignTimeSlot(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-805 outline-none focus:border-[#008444] transition cursor-pointer"
                  >
                    <option value="Pagi (08:00 - 11:00)">Pagi (08:00 - 11:00)</option>
                    <option value="Siang (13:00 - 16:00)">Siang (13:00 - 16:00)</option>
                    <option value="Sore (16:30 - 18:30)">Sore (16:30 - 18:30)</option>
                  </select>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-805 border border-emerald-100 p-3 rounded-xl text-[10px] leading-relaxed flex gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Setelah menyimpan, kurir akan mendapatkan tugas baru di app driver dan warga langsung mendapat push notifikasi detail penjemputan di ponsel mereka.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAssignModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#008444] hover:bg-[#006633] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer text-center shadow-xs"
                >
                  Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREMIUM LIGHTBOX PREVIEW MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 transition-all duration-300 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative border border-slate-105 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-slate-800 text-lg">Bukti Foto Timbangan AI</h3>
                <span className="text-slate-450 text-[11px] font-sans">Verifikasi anti-manipulasi visual Lengkang UI</span>
              </div>
              <button 
                onClick={() => setLightboxImage(null)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content body with image */}
            <div className="p-6 space-y-4">
              <div className="w-full h-64 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center relative shadow-xs">
                {lightboxImage.url ? (
                  <img 
                    src={lightboxImage.url} 
                    alt="Bukti Setoran" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Leaf className="w-12 h-12 text-[#008444] animate-bounce" />
                    <span className="text-xs font-mono">Timbangan AI Aktif - Foto Kosong</span>
                  </div>
                )}
              </div>

              {/* Description metadata list */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/70 border border-slate-150 p-4 rounded-2xl font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">Warga Penyetor</span>
                  <strong className="text-slate-800 font-sans">{lightboxImage.title}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">Komoditas</span>
                  <strong className="text-[#008444] font-sans">{lightboxImage.category}</strong>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">Estimasi Berat AI</span>
                  <strong className="text-slate-750 text-sm">{lightboxImage.weightAI} Kg</strong>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] text-rose-500 font-sans block uppercase font-bold">Pengukuran Kurir</span>
                  <strong className="text-rose-700 text-sm">{lightboxImage.weightCourier} Kg</strong>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setLightboxImage(null)}
                className="bg-[#008444] text-white font-bold py-2 px-6 rounded-xl hover:bg-[#006633] transition cursor-pointer text-xs shadow-xs"
              >
                Selesai Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3B) MODAL EDIT PROFIL WARGA (ADMIN PORTAL) */}
      {editingCitizen && (
        <div id="admin-edit-citizen-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[1000] animate-fade-in/70">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden text-left flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#008444] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg">Edit Profil &amp; Data Anggota</h3>
                <p className="text-[11px] text-emerald-100 mt-0.5">Ubah rincian identitas warga secara manual di buku koperasi.</p>
              </div>
              <button 
                onClick={() => setEditingCitizen(null)} 
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>
            
            {/* Form Content */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem("citizenName") as HTMLInputElement).value;
              const address = (form.elements.namedItem("citizenAddress") as HTMLInputElement).value;
              const phone = (form.elements.namedItem("citizenPhone") as HTMLInputElement).value;
              const balance = parseFloat((form.elements.namedItem("citizenBalance") as HTMLInputElement).value) || 0;
              const choice = (form.elements.namedItem("citizenChoice") as HTMLSelectElement).value as "Sembako" | "Uang Tunai";
              const hasPhone = (form.elements.namedItem("citizenHasPhone") as HTMLSelectElement).value === "true";

              const updatedList = sembakoCitizens.map(c => {
                if (c.id === editingCitizen.id) {
                  return {
                    ...c,
                    name,
                    address,
                    phone,
                    balance,
                    incentiveChoice: choice,
                    hasPhone
                  };
                }
                return c;
              });

              setSembakoCitizens(updatedList);
              try {
                localStorage.setItem("lengkang_citizens_database", JSON.stringify(updatedList));
                // If it is Ibu Sumarni (WRG-101), update her specific profile keys in localStorage as well to synchronize instantly!
                if (editingCitizen.id === "WRG-101") {
                  localStorage.setItem("lengkang_profile_name", name);
                  localStorage.setItem("lengkang_profile_phone", phone);
                  localStorage.setItem("lengkang_profile_address", address);
                }
              } catch (err) {
                console.error(err);
              }
              
              setEditingCitizen(null);
              alert("Data profil warga berhasil diperbarui secara permanen.");
            }} className="p-6 space-y-4 overflow-y-auto">
              
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID Warga</label>
                <input 
                  type="text" 
                  value={editingCitizen.id} 
                  disabled 
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-500 font-mono focus:outline-none cursor-not-allowed" 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="citizenName"
                  defaultValue={editingCitizen.name}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:border-[#008444] outline-none transition" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">No HP / WA</label>
                  <input 
                    type="text" 
                    name="citizenPhone"
                    defaultValue={editingCitizen.phone || (editingCitizen.id === "WRG-101" ? "081234567801" : "")}
                    placeholder="Contoh: 08123456789"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:border-[#008444] outline-none transition" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gawai / HP</label>
                  <select 
                    name="citizenHasPhone"
                    defaultValue={editingCitizen.hasPhone ? "true" : "false"}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 outline-none focus:border-[#008444] transition"
                  >
                    <option value="true">Ada HP (Smartphone)</option>
                    <option value="false">Tanpa HP (Lansia/Non-HP)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alamat Lengkap</label>
                <textarea 
                  name="citizenAddress"
                  defaultValue={editingCitizen.address}
                  required
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:border-[#008444] outline-none transition resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saldo Tabungan (Rp)</label>
                  <input 
                    type="number" 
                    name="citizenBalance"
                    defaultValue={editingCitizen.balance}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 font-mono outline-none focus:border-[#008444] transition" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Opsi Insentif</label>
                  <select 
                    name="citizenChoice"
                    defaultValue={editingCitizen.incentiveChoice}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-805 outline-none focus:border-[#008444] transition"
                  >
                    <option value="Sembako">Sembako</option>
                    <option value="Uang Tunai">Uang Tunai</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 p-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setEditingCitizen(null)}
                  className="bg-white border border-slate-200 text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#008444] text-white font-bold py-2 px-5 rounded-xl hover:bg-[#006633] transition cursor-pointer text-xs shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* REAL-TIME TOAST FLOATER STACK */}
      <div 
        id="realtime-toast-container" 
        className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      >
        <AnimatePresence>
          {toastQueue.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex gap-3 pointer-events-auto cursor-pointer font-sans"
              onClick={() => {
                // Remove from toast queue
                setToastQueue(prev => prev.filter(t => t.id !== toast.id));
                
                // Open notifications dropdown and scroll to corresponding panel
                setIsNotifDropdownOpen(true);
                const idToScroll = toast.type === "registration" ? "new-registrations-notification-panel" : "resident-pickup-requests-panel";
                const element = document.getElementById(idToScroll);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  // Highlight effect
                  element.classList.add("ring-4", "ring-[#008444]/40");
                  setTimeout(() => {
                    element.classList.remove("ring-[#008444]/40", "ring-4");
                  }, 3000);
                }
              }}
            >
              <div className={`p-2 rounded-xl shrink-0 ${toast.type === "registration" ? "bg-emerald-500/15 text-emerald-400" : "bg-sky-500/15 text-sky-400"}`}>
                {toast.type === "registration" ? <UserCheck className="w-5 h-5" /> : <Truck className="w-5 h-5 animate-pulse" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                  <span className="font-bold text-xs text-white">{toast.title}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeToast(toast.id);
                    }}
                    className="text-white/40 hover:text-white p-0.5 hover:bg-white/10 rounded transition"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[10px] text-slate-350 leading-normal font-sans">{toast.desc}</p>
                <div className="flex items-center justify-between text-[8.5px] text-slate-400 mt-1.5 pt-1 border-t border-white/5 font-sans">
                  <span className="font-mono">{new Date(toast.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
                  <span className="font-semibold text-emerald-400 hover:underline">Lihat Detail →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
