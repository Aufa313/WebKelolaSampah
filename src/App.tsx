import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Check } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">(
    "landing"
  );
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState("");
  const [userRole, setUserRole] = useState<"warga" | "admin" | "kurir">(
    "warga"
  );

  // States for Resident Registration Form & Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regFormName, setRegFormName] = useState("");
  const [regFormPhone, setRegFormPhone] = useState("");
  const [regFormAddress, setRegFormAddress] = useState("");
  const [regFormIncentive, setRegFormIncentive] = useState<
    "Sembako" | "Uang Tunai"
  >("Sembako");
  const [regFormSuccess, setRegFormSuccess] = useState(false);

  const handleOpenDashboard = () => {
    setCurrentView("dashboard");
    setActiveSection("dashboard-saldo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (
    username: string,
    role: "warga" | "admin" | "kurir"
  ) => {
    setAuthenticatedUser(username);
    setUserRole(role);
    setIsLoggedIn(true);
    setDashboardLoading(true);

    // Simulate Supabase/Firestore real database fetching for a premium skeletal effect
    setTimeout(() => {
      setDashboardLoading(false);
    }, 1500);
  };

  const handleCloseDashboard = () => {
    setIsLoggedIn(false); // Reset authentication state when citizen logs out/closes
    setUserRole("warga"); // Reset default role back to resident
    setCurrentView("landing");
    setActiveSection("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    if (id === "dashboard-saldo") {
      handleOpenDashboard();
      return;
    }

    // Handles Courier custom tab navigation dispatching
    if (id.startsWith("kurir-")) {
      const tabName = id.replace("kurir-", "").replace("-tab", "");
      window.dispatchEvent(
        new CustomEvent("switch-kurir-tab", { detail: tabName })
      );
      setActiveSection(id);
      return;
    }

    // First, check if the ID is visible or rendered on the current screen (e.g. inside dashboard)
    const el = document.getElementById(id);
    if (el) {
      // Offset calculation for sticky header navigation
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      return;
    }

    // Only transition to landing and log out if the target is explicitly a landing page ID
    const landingSections = [
      "home",
      "layanan",
      "setor-sampah",
      "kemitraan",
      "kontak",
    ];
    if (currentView === "dashboard" && landingSections.includes(id)) {
      setCurrentView("landing");
      setIsLoggedIn(false);
      setUserRole("warga");
      setTimeout(() => {
        const landingEl = document.getElementById(id);
        if (landingEl) {
          const yOffset = -90;
          const y =
            landingEl.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          setActiveSection(id);
        }
      }, 150);
      return;
    }

    // Otherwise, do not log out. Just scroll to the top of the dashboard wrapper to maintain position gracefully
    const dashboardWrapper = document.getElementById("dashboard-wrapper-layer");
    if (dashboardWrapper) {
      const yOffset = -90;
      const y =
        dashboardWrapper.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Section Tracking via High-Precision Scroll and Edge Trigger Tracking
  useEffect(() => {
    const handleScrollTracking = () => {
      // Find the active section list based on role & view state
      let activeSections = [
        "home",
        "layanan",
        "setor-sampah",
        "kemitraan",
        "kontak",
      ];
      if (isLoggedIn) {
        if (userRole === "admin") {
          activeSections = [
            "koperasi-financial-ledger-section",
            "anti-fraud-deposit-control",
            "pricing-controller-section",
            "resident-pickup-requests-panel",
            "weekly-trends-analytics-charts",
            "consultation-management-panel",
          ];
        } else {
          activeSections = [
            "top-stats-cards",
            "warga-courier-notification-panel",
            "interactive-balance-chart-container",
            "riwayat-mutasi-section",
          ];
        }
      }

      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.documentElement.scrollHeight;

      // Edge trigger: if scrolled near the bottom, force the last section to be selected
      if (
        scrollPos + windowHeight >= bodyHeight - 120 &&
        activeSections.length > 0
      ) {
        setActiveSection(activeSections[activeSections.length - 1]);
        return;
      }

      // Edge trigger: if scrolled near the top, force the first section to be selected
      if (scrollPos <= 80 && activeSections.length > 0) {
        setActiveSection(activeSections[0]);
        return;
      }

      // Find which section element is most centered in the upper 30% of the screen
      const targetY = scrollPos + windowHeight * 0.35;
      let closestSection = activeSections[0];
      let minDistance = Infinity;

      for (const id of activeSections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + scrollPos;
          const elementBottom = elementTop + rect.height;

          if (targetY >= elementTop && targetY <= elementBottom) {
            closestSection = id;
            break;
          }

          const distance = Math.abs(elementTop - targetY);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = id;
          }
        }
      }

      if (closestSection) {
        setActiveSection(closestSection);
      }
    };

    window.addEventListener("scroll", handleScrollTracking);
    // Execute helper immediately with a small delay to allow domestic DOM mounting
    const timer = setTimeout(handleScrollTracking, 150);

    return () => {
      window.removeEventListener("scroll", handleScrollTracking);
      clearTimeout(timer);
    };
  }, [currentView, isLoggedIn, userRole]);

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-neutral-dark selection:bg-emerald-100 selection:text-emerald-950">
      {/* Navbar Component */}
      <Navbar
        onNavigate={scrollToSection}
        activeSection={activeSection}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={handleCloseDashboard}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenLogin={handleOpenDashboard}
      />

      {currentView === "landing" ? (
        <>
          <LandingPage
            onRegister={() => setIsRegisterModalOpen(true)}
            onLogin={handleOpenDashboard}
            scrollToSection={scrollToSection}
          />
          <Footer />
        </>
      ) : (
        <div className="min-h-screen bg-[#fcfdfc] id=dashboard-wrapper-layer">
          <DashboardPage
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            dashboardLoading={dashboardLoading}
            authenticatedUser={authenticatedUser}
            onLoginSuccess={handleLoginSuccess}
            onCloseDashboard={handleCloseDashboard}
          />
          <Footer simple={userRole === "admin" || userRole === "kurir"} />
        </div>
      )}

      {/* MODAL PENDAFTARAN ANGGOTA BARU (DENGAN NOTIFIKASI ADMIN) */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div
            id="register-member-modal-overlay"
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in text-left"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden text-left flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#008444] text-white p-6 relative">
                <button
                  onClick={() => {
                    setIsRegisterModalOpen(false);
                    setRegFormSuccess(false);
                    setRegFormName("");
                    setRegFormPhone("");
                    setRegFormAddress("");
                  }}
                  className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition text-lg"
                >
                  ✕
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/15 rounded-xl">
                    <Leaf className="w-6 h-6 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">
                      Daftar Anggota Koperasi
                    </h3>
                    <p className="text-xs text-emerald-100 mt-1">
                      Daftarkan profil Anda untuk mengaktifkan tabungan sampah
                      kelurahan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-8 space-y-5">
                {regFormSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#008444]">
                      <Check className="w-8 h-8 animate-bounce text-[#008444]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-lg text-slate-800">
                        Pendaftaran Terkirim!
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Data identitas Anda telah berhasil diajukan ke
                        kelurahan. Notifikasi instan telah dikirimkan ke{" "}
                        <strong className="text-[#008444] font-semibold">
                          Dashboard Admin
                        </strong>{" "}
                        untuk persetujuan & pencetakan kartu anggota.
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left space-y-2 max-w-sm mx-auto">
                      <p className="text-xs text-slate-600">
                        <strong>Nama:</strong> {regFormName}
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong>HP / WA:</strong> {regFormPhone}
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong>Opsi Insentif:</strong> {regFormIncentive}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsRegisterModalOpen(false);
                        setRegFormSuccess(false);
                        setRegFormName("");
                        setRegFormPhone("");
                        setRegFormAddress("");
                      }}
                      className="bg-[#008444] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#006633] transition-all text-xs cursor-pointer shadow-sm"
                    >
                      Selesai
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        !regFormName.trim() ||
                        !regFormPhone.trim() ||
                        !regFormAddress.trim()
                      ) {
                        alert("Harap lengkapi semua bidang isian formulir.");
                        return;
                      }

                      // Generate a unique request ID
                      const requestId =
                        "REQ-" + Math.floor(100 + Math.random() * 900);
                      const newRequest = {
                        id: requestId,
                        name: regFormName,
                        phone: regFormPhone,
                        address: regFormAddress,
                        incentiveChoice: regFormIncentive,
                        timestamp: new Date().toISOString(),
                      };

                      // Append to localStorage
                      try {
                        const existingStr = localStorage.getItem(
                          "lengkang_registration_requests"
                        );
                        const list = existingStr ? JSON.parse(existingStr) : [];
                        list.push(newRequest);
                        localStorage.setItem(
                          "lengkang_registration_requests",
                          JSON.stringify(list)
                        );
                      } catch (err) {
                        console.error(err);
                      }

                      setRegFormSuccess(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={regFormName}
                        onChange={(e) => setRegFormName(e.target.value)}
                        placeholder="Contoh: Ibu Siti Sumarni"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 outline-none focus:border-[#008444] focus:ring-1 focus:ring-primary/20 transition"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Nomor Handphone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={regFormPhone}
                        onChange={(e) => setRegFormPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 outline-none focus:border-[#008444] focus:ring-1 focus:ring-primary/20 transition font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide font-sans">
                        Alamat Lengkap Sesuai KTP
                      </label>
                      <textarea
                        required
                        value={regFormAddress}
                        onChange={(e) => setRegFormAddress(e.target.value)}
                        rows={3}
                        placeholder="Masukkan nama jalan, nomor rumah, RT/RW, kelurahan..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 outline-none focus:border-[#008444] focus:ring-1 focus:ring-primary/20 transition resize-none font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Opsi Insentif Penukaran
                      </label>
                      <select
                        value={regFormIncentive}
                        onChange={(e) =>
                          setRegFormIncentive(
                            e.target.value as "Sembako" | "Uang Tunai"
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 outline-none focus:border-[#008444] focus:ring-1 focus:ring-primary/40 transition"
                      >
                        <option value="Sembako">
                          Sembako (Beras, Minyak Goreng, Gula, dll)
                        </option>
                        <option value="Uang Tunai">
                          Uang Tunai (Transfer / Cair Tunai Fisik)
                        </option>
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Anda dapat mengubah opsi pilihan insentif ini kapan saja
                        melalui dashboard portal warga.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegisterModalOpen(false);
                          setRegFormName("");
                          setRegFormPhone("");
                          setRegFormAddress("");
                        }}
                        className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-[#008444] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#006633] transition-all cursor-pointer text-xs shadow-md shadow-emerald-700/10 flex items-center gap-1.5"
                      >
                        <span>Daftarkan Diri</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
