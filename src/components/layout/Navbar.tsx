import React, { useState, useEffect } from "react";
import { Phone, Mail, Search, Menu, X, Leaf, ChevronRight, LogOut, ShieldAlert, Award, ArrowUp, Sparkles, Trophy } from "lucide-react";
import { motion } from "motion/react";
import AIWasteClassifierModal from "../common/AIWasteClassifierModal";
import LeaderboardModal from "../common/LeaderboardModal";

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  isLoggedIn?: boolean;
  userRole?: "warga" | "admin" | "kurir";
  onLogout?: () => void;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
  onOpenAIScan?: () => void;
  onOpenLeaderboard?: () => void;
}

export default function Navbar({ 
  onNavigate, 
  activeSection, 
  isLoggedIn = false, 
  userRole = "warga", 
  onLogout,
  onOpenRegister,
  onOpenLogin,
  onOpenAIScan,
  onOpenLeaderboard
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAIScanOpenLocal, setIsAIScanOpenLocal] = useState(false);
  const [isLeaderboardOpenLocal, setIsLeaderboardOpenLocal] = useState(false);

  useEffect(() => {
    const handleScrollEffects = () => {
      // 1. Scroll state for floating/glass header
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Scroll percentage for the dynamic progress bar
      const h = document.documentElement;
      const b = document.body;
      const st = "scrollTop";
      const sh = "scrollHeight";
      const percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
      setScrollPercent(Math.min(Math.max(percent, 0), 100)); // Clamp between 0 and 100

      // 3. Keep track of when to show back to top button
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScrollEffects);
    // Call once initially to set proper values
    handleScrollEffects();
    return () => window.removeEventListener("scroll", handleScrollEffects);
  }, []);

  // Base landing page links
  let navItems = [
    { label: "Home", id: "home" },
    { label: "Layanan", id: "layanan" },
    { label: "Setor Sampah", id: "setor-sampah" },
    // { label: "Kemitraan", id: "kemitraan" },
    { label: "Hubungi Kami", id: "kontak" },
  ];

  // If user is logged in, adjust the navigation links shown in the top header
  if (isLoggedIn) {
    if (userRole === "admin") {
      navItems = [
        { label: "Buku Kas", id: "koperasi-financial-ledger-section" },
        { label: "Anti-Fraud AI", id: "anti-fraud-deposit-control" },
        { label: "Harga Pasar", id: "pricing-controller-section" },
        { label: "Kurir", id: "resident-pickup-requests-panel" },
        { label: "Laporan", id: "weekly-trends-analytics-charts" },
        { label: "Konsultasi", id: "consultation-management-panel" },
      ];
    } else if (userRole === "kurir") {
      navItems = [
        { label: "Tugas Rute", id: "kurir-tugas-tab" },
        { label: "Peta & Jadwal", id: "kurir-peta-tab" },
        { label: "Scan & Timbang QR", id: "kurir-scan-tab" },
        { label: "Riwayat Ambil", id: "kurir-riwayat-tab" },
      ];
    } else {
      navItems = [
        { label: "Profil", id: "top-stats-cards" },
        { label: "Jadwal Kurir", id: "warga-courier-notification-panel" },
        { label: "Grafik Tabungan", id: "interactive-balance-chart-container" },
        { label: "Riwayat Mutasi", id: "riwayat-mutasi-section" },
      ];
    }
  }

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <header className={`w-full sticky top-0 transition-all duration-300 bg-white/95 backdrop-blur-md ${
      isLoggedIn && userRole === "admin" ? "z-[120]" : "z-50"
    } ${isScrolled ? "shadow-md bg-white/90 border-b border-slate-100" : ""}`}>
      {/* 1. TOP BAR (Bilah Atas) - Hidden on mobile and smoothly collapses on scroll to prevent layout jumps */}
      <div 
        id="navbar-top-bar"
        className={`text-white transition-all duration-300 ease-in-out border-b flex items-center justify-between px-8 font-medium hidden md:flex overflow-hidden ${
          isScrolled
            ? "max-h-0 py-0 border-transparent opacity-0 pointer-events-none"
            : isLoggedIn 
              ? userRole === "admin"
                ? "bg-[#854d0e] border-[#a16207]/30 max-h-7 text-[10px] py-1"
                : "bg-[#065f46] border-[#047857]/30 max-h-7 text-[10px] py-1"
              : "bg-[#008444] border-emerald-700/20 max-h-8 text-[11px] py-1.5"
        }`}
      >
        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            userRole === "admin" ? (
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-250 animate-pulse shrink-0" />
                <strong>Sistem Administrasi Pusat WebSampah</strong> - Mode Keamanan Komoditas & Anti-Fraud Aktif.
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-305 shrink-0" />
                Selamat Datang kembali di Portal Tabungan Warga! Setiap gram pilahan Anda bernilai maslahat.
              </span>
            )
          ) : (
            <span>🌟Gratis Penjemputan Sampah Anorganik!</span>
          )}
        </div>
        <div className="flex items-center space-x-6">
          <a href="tel:+6281234567890" className="flex items-center space-x-1 hover:text-white transition-colors">
            <span>📞 +62 812 3456 7890</span>
          </a>
          <span className="w-px h-3 bg-white/20"></span>
          <a href="mailto:lengkangw@gmail.com" className="flex items-center space-x-1 hover:text-white transition-colors">
            <span>✉️ lengkangw@gmail.com</span>
          </a>
        </div>
      </div>

      {/* 2. MAIN NAV (Bilah Utama) */}
      <nav
        id="navbar-main"
        className={`w-full transition-[padding,background-color,border-color] duration-300 ${
          isScrolled 
            ? "py-3 shadow-xs" 
            : "relative py-4 md:py-5"
        }`}
      >
        {/* Dynamic Scroll Progress Bar */}
        <div 
          className={`absolute top-0 left-0 h-[3.5px] transition-all duration-100 z-50 ${
            isLoggedIn && userRole === "admin" ? "bg-amber-600" : "bg-[#008444]"
          }`}
          style={{ width: `${scrollPercent}%` }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Role Badge */}
          <motion.div 
            id="navbar-logo"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavClick(isLoggedIn ? (userRole === "admin" ? "dashboard-admin-layer" : "dashboard-warga-view") : "home")}
            className="flex items-center space-x-2.5 cursor-pointer group text-left shrink-0 mr-4"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs transition-colors shrink-0 ${
              isLoggedIn && userRole === "admin" ? "bg-amber-600 group-hover:bg-amber-700" : "bg-[#008444] group-hover:bg-[#006633]"
            }`}>
              <span className="text-white font-bold text-lg font-sans">W</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xl md:text-2xl font-bold tracking-tight select-none transition-colors ${
                  isLoggedIn && userRole === "admin" ? "text-amber-805" : "text-[#008444]"
                }`} style={{ fontFamily: "Georgia, serif" }}>
                  WebSampah
                </span>
                {isLoggedIn && (
                  <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded font-mono ${
                    userRole === "admin" 
                      ? "bg-amber-100 text-amber-850 border border-amber-300 animate-pulse" 
                      : "bg-emerald-100 text-emerald-850 border border-emerald-300"
                  }`}>
                    {userRole === "admin" ? "ADMIN" : "WARGA"}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Nav Links - Desktop */}
          <div id="navbar-links" className="hidden lg:flex items-center space-x-5 lg:space-x-7 shrink-0">
            {navItems.map((item) => {
              const isSelected = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs lg:text-sm font-semibold transition-colors cursor-pointer py-1.5 relative whitespace-nowrap px-1 ${
                    isSelected
                      ? isLoggedIn && userRole === "admin" ? "text-amber-805" : "text-[#008444]"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                  {isSelected && (
                    <motion.span 
                      layoutId={isLoggedIn ? (userRole === "admin" ? "activeNavIndicatorAdmin" : "activeNavIndicatorWarga") : "activeNavIndicatorPublic"}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isLoggedIn && userRole === "admin" ? "bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]" : "bg-[#008444] shadow-[0_0_8px_rgba(0,132,68,0.6)]"
                      }`} 
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Action Zone - Desktop */}
          <div id="navbar-actions" className="flex items-center space-x-3 shrink-0">
            {/* AI Waste Classifier & Leaderboard Quick Buttons - ONLY FOR LOGGED IN WARGA */}
            {isLoggedIn && userRole === "warga" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenAIScan ? onOpenAIScan() : setIsAIScanOpenLocal(true)}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all cursor-pointer ring-2 ring-emerald-400/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <span>Scan AI</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenLeaderboard ? onOpenLeaderboard() : setIsLeaderboardOpenLocal(true)}
                  className="hidden md:inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Peringkat</span>
                </motion.button>
              </>
            )}

            <div className="hidden xl:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-primary transition-colors">
              <input 
                type="text" 
                placeholder={isLoggedIn ? "Cari database..." : "Cari info pengolahan..."} 
                className="bg-transparent text-xs text-neutral-dark focus:outline-none w-32"
              />
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </div>
            
            {/* CTA Button / Session Logout */}
            {isLoggedIn ? (
              <button 
                id="navbar-cta-logout"
                onClick={onLogout}
                className={`hidden sm:inline-flex items-center gap-1.5 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-sm ${
                  userRole === "admin" 
                    ? "bg-amber-700 hover:bg-amber-800 shadow-amber-800/10" 
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-700/10"
                }`}
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Keluar Panel</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  id="navbar-cta-register"
                  onClick={() => {
                    if (onOpenRegister) {
                      onOpenRegister();
                    } else {
                      handleNavClick("setor-sampah");
                    }
                  }}
                  className="sm:inline-flex items-center bg-[#008444] text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-[#006633] transition-colors cursor-pointer shadow-sm shadow-emerald-700/10"
                >
                  Daftar Sekarang
                </button>
                <button 
                  id="navbar-cta-login"
                  onClick={() => {
                    if (onOpenLogin) {
                      onOpenLogin();
                    } else {
                      handleNavClick("dashboard-saldo");
                    }
                  }}
                  className="sm:inline-flex items-center bg-white border-2 border-[#008444] text-[#008444] hover:bg-emerald-50 text-xs px-4 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-xs"
                >
                  Login Portal
                </button>
              </div>
            )}

            {/* Hamburger Button for Mobile */}
            <button
              id="navbar-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-dark hover:text-primary hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu layout"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 3. MOBILE MENU (Drawer) */}
      <div
        id="navbar-mobile-drawer"
        className={`fixed inset-0 bg-black/40 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          id="navbar-drawer-panel"
          className={`absolute top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl p-6 transition-transform duration-300 flex flex-col justify-between ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* Header Drawer */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 text-left">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg text-white ${isLoggedIn && userRole === "admin" ? "bg-amber-600" : "bg-primary"}`}>
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-serif font-black text-neutral-dark">
                    WebSampah
                  </span>
                  {isLoggedIn && (
                    <span className="block text-[8px] font-bold font-mono text-slate-400 mt-0.5 leading-none">
                      AKUN: {userRole.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <button 
                id="close-drawer-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items Link */}
            <div className="py-6 space-y-3">
              {navItems.map((item) => {
                const isSelected = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    id={`nav-mobile-${item.id}`}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left font-semibold ${
                      isSelected
                        ? isLoggedIn && userRole === "admin" 
                          ? "bg-amber-50 text-amber-900 border border-amber-200" 
                          : "bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected ? (
                      <span className={`w-2 h-2 rounded-full ${isLoggedIn && userRole === "admin" ? "bg-amber-600" : "bg-[#008444]"}`} />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Search on Mobile */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center">
              <input 
                type="text" 
                placeholder="Cari info instan..." 
                className="bg-transparent text-sm text-neutral-dark focus:outline-none w-full"
              />
              <Search className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Drawer Footer info */}
          <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-3 text-left">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>0812-3456-7890</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>info@lengkangui.com</span>
            </div>
            
            {isLoggedIn ? (
              <button
                id="logout-now-mobile"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className={`w-full text-white py-3 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  userRole === "admin" ? "bg-amber-700 hover:bg-amber-800" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Keluar Sesi</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  id="setor-now-mobile"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenRegister) {
                      onOpenRegister();
                    } else {
                      handleNavClick("setor-sampah");
                    }
                  }}
                  className="w-full bg-[#008444] text-white py-3 rounded-xl font-bold hover:bg-[#006633] transition-colors shadow-sm block text-center text-xs"
                >
                  Daftar Sekarang
                </button>
                <button
                  id="login-portal-mobile"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenLogin) {
                      onOpenLogin();
                    } else {
                      handleNavClick("dashboard-saldo");
                    }
                  }}
                  className="w-full bg-white text-[#008444] border-2 border-[#008444] py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-xs block text-center text-xs"
                >
                  Login Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Waste Classifier & Leaderboard Modals */}
      <AIWasteClassifierModal
        isOpen={isAIScanOpenLocal}
        onClose={() => setIsAIScanOpenLocal(false)}
        onApplyResult={(res) => {
          handleNavClick("setor-sampah");
        }}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpenLocal}
        onClose={() => setIsLeaderboardOpenLocal(false)}
      />
    </header>
  );
}
