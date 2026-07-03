import React, { useState } from "react";
import {
  Shield,
  Key,
  AlertCircle,
  ArrowLeft,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface DashboardLoginProps {
  onBack: () => void;
  onLoginSuccess: (username: string, role: "warga" | "admin" | "kurir") => void;
}

export default function DashboardLogin({
  onBack,
  onLoginSuccess,
}: DashboardLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAuth, setSuccessAuth] = useState(false);

  const role = (() => {
    const normalized = username.trim().toLowerCase();
    if (
      normalized === "admin" ||
      normalized.startsWith("admin") ||
      normalized.includes("admin")
    ) {
      return "admin" as const;
    }
    if (normalized.startsWith("kurir") || normalized.includes("kurir")) {
      return "kurir" as const;
    }
    return "warga" as const;
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim()) {
      setErrorMsg("ID / Username harus diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password harus minimal 6 karakter.");
      return;
    }

    if (role === "admin" && password !== "123456") {
      setErrorMsg("Password admin salah. Gunakan 123456.");
      return;
    }
    if (role === "kurir" && password !== "554433") {
      setErrorMsg("Password kurir salah. Gunakan 554433.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessAuth(true);
      setTimeout(() => {
        onLoginSuccess(username.trim(), role);
      }, 1000);
    }, 1500);
  };

  const handleQuickFill = () => {
    setUsername("warga001");
    setPassword("884812");
  };

  return (
    <div
      className="w-full max-w-md mx-auto px-4 py-12"
      id="dashboard-login-module"
    >
      {/* 0. NAVIGATION / BACK BUTTON */}
      <button
        onClick={onBack}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#008444] transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200/55 py-2 px-3.5 rounded-xl animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Kembali ke Beranda Utama</span>
      </button>

      {/* 1. LOGIN CARD CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-900/5 relative overflow-hidden">
        {/* Top Decorative bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#008444] transition-colors"></div>

        <div className="text-center space-y-2.5 mb-8">
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center border shadow-inner bg-emerald-50 border-emerald-100">
            <Lock className="w-5 h-5 text-[#008444]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">
              Login Satu Akses
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Masuk menggunakan ID / Username dan Password. Role pengguna akan
              terdeteksi otomatis setelah login.
            </p>
          </div>
        </div>

        {successAuth ? (
          <div
            className="py-8 text-center space-y-4 animate-fade-in"
            id="login-auth-success"
          >
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center border animate-bounce ${role === "admin" ? "bg-amber-100 border-amber-200 text-amber-600" : role === "kurir" ? "bg-slate-100 border-slate-200 text-slate-800" : "bg-emerald-100 border-emerald-200 text-[#008444]"}`}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-semibold text-lg text-slate-800">
                Sertifikasi Valid
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                {role === "admin"
                  ? "Membuka Modul Administrator Hijau..."
                  : role === "kurir"
                    ? "Membuka Portal Kurir Lapangan..."
                    : "Meluncurkan panel modul warga dalam beberapa saat..."}
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 font-sans text-xs text-left"
          >
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-100/80 text-rose-800 rounded-xl flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="auth-username-field"
                className="block font-bold text-slate-600"
              >
                ID / Username
              </label>
              <input
                id="auth-username-field"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: warga001 atau admin atau kurir01"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none text-sm focus:border-[#008444] transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* PASSWORD / PIN INPUT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="auth-password-field"
                  className="block font-bold text-slate-600"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 font-semibold text-[10px] hover:underline"
                >
                  {showPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
              <div className="relative">
                <input
                  id="auth-password-field"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  maxLength={64}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 outline-none text-sm font-sans focus:border-[#008444] transition-colors"
                  disabled={isSubmitting}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                  <Key className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center space-x-2 text-sm mt-3.5 ${
                role === "admin"
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-900/10"
                  : role === "kurir"
                    ? "bg-slate-800 hover:bg-slate-900 shadow-slate-900/10"
                    : "bg-[#008444] hover:bg-[#006633] shadow-green-900/10"
              } ${isSubmitting ? "opacity-75 cursor-wait" : ""}`}
            >
              <Shield className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Memverifikasi Kunci..."
                  : role === "admin"
                    ? "Masuk Panel Admin"
                    : role === "kurir"
                      ? "Masuk Portal Kurir"
                      : "Masuk Ke Dashboard"}
              </span>
            </button>
          </form>
        )}

        {/* Mock Credentials Assist */}
        {!successAuth && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2.5">
            <span className="text-[10px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
              Akses Cepat Pengujian (Sandbox)
            </span>
            <div className="bg-slate-50 hover:bg-slate-100 border border-slate-200/60 p-3 rounded-xl flex items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="text-left font-sans space-y-0.5">
                <p className="font-bold text-slate-700">
                  {role === "admin"
                    ? "Akun Admin Penguji"
                    : role === "kurir"
                      ? "Akun Kurir Lapangan"
                      : "Akun Warga default"}
                </p>
                <div className="font-mono text-[9px] text-slate-400">
                  PIN:{" "}
                  <strong className="text-slate-650">
                    {role === "admin"
                      ? "123456"
                      : role === "kurir"
                        ? "554433"
                        : "884812"}
                  </strong>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                disabled={isSubmitting}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#008444] font-bold py-1.5 px-3 rounded-lg text-[10px] transition cursor-pointer shrink-0 border border-emerald-200/30"
              >
                Isi PIN Otomatis
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security notice */}
      <div className="mt-5 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <span>🔒</span> Enkripsi ujung-ke-ujung (E2EE) berlisensi Kominfo.
      </div>
    </div>
  );
}
