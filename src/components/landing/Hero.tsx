import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Leaf, Sparkles, Smile } from "lucide-react";

interface HeroProps {
  onRegister?: () => void;
  onLogin?: () => void;
  scrollToSection?: (id: string) => void;
}

export default function Hero({
  onRegister,
  onLogin,
  scrollToSection,
}: HeroProps) {
  // Dynamic stats
  const [stats, setStats] = useState({
    co2Reduced: 2500000,
    plasticSaved: 15000,
    activeMembers: 3400,
    organicComposted: 8500,
  });

  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-slate-50 via-emerald-50/25 to-white pt-10 pb-20 md:py-24 overflow-hidden rounded-br-[64px] md:rounded-br-[120px] border-b border-slate-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT SIDE - Text & Buttons */}
          <div
            className="lg:col-span-7 space-y-6 text-left"
            id="hero-left-content"
          >
            {/* Rating Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-50/80 border border-emerald-100 px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
                Pilihan Terpercaya #1
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1e293b] leading-[1.1] tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Mengolah Sampah <br />
              <span className="text-[#008444]">Menjadi Berkah</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-500 max-w-xl font-sans leading-relaxed">
              Bergabunglah bersama Lengkang untuk mewujudkan lingkungan bersih
              bebas limbah. Setor sampah terpilah Anda, kumpulkan poin berkah,
              dan konversikan langsung menjadi saldo tunai serta asuransi ramah
              bumi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onRegister}
                className="bg-[#008444] text-white px-8 py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-[#006633] shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                Daftar Sekarang
              </button>
              <button
                onClick={onLogin}
                className="bg-white text-[#008444] border-2 border-[#008444] hover:bg-emerald-50 px-8 py-3.5 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-2 active:scale-[0.98] cursor-pointer transition-all duration-200 shadow-sm"
              >
                Login Portal
              </button>
              <button
                onClick={() => scrollToSection?.("kontak")}
                className="bg-slate-100 text-[#1e293b] border border-slate-200 hover:border-slate-300 hover:bg-slate-200 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer transition-all duration-200"
              >
                <span>📞</span> Hubungi Kami
              </button>
            </div>

            {/* Info List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-[#008444] p-1 rounded-full text-xs">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Jemput Tanpa Biaya
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-[#008444] p-1 rounded-full text-xs">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Konversi Poin Instan
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-[#008444] p-1 rounded-full text-xs">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Sertifikat Resmi LH
                </span>
              </div>
            </div>

            {/* Floating Grid Decoration */}
            <div className="flex gap-2 pt-4 relative z-10">
              <div className="w-12 h-12 rounded-full border-4 border-[#f8fafc] bg-[#008444] shadow-sm flex items-center justify-center text-white text-xs font-bold font-mono">
                +500
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#f8fafc] bg-emerald-100 shadow-sm flex items-center justify-center text-[#008444] text-[11px] font-bold">
                Eco
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#f8fafc] bg-slate-200 shadow-sm flex items-center justify-center text-slate-500 text-[11px] font-bold">
                CSR
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Visual Elements & Stats */}
          <div className="lg:col-span-5 relative py-6" id="hero-right-visual">
            <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center">
              {/* Outer Rotating Border */}
              <div className="absolute inset-[6%] sm:inset-[4%] border border-dashed sm:border-2 border-emerald-300/80 rounded-full animate-spin-smooth"></div>

              {/* Top Right Badge */}
              <div className="absolute -top-1 -right-1 sm:top-2 sm:right-2 w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 text-blue-800 rounded-full flex flex-col items-center justify-center p-1 sm:p-2 shadow-sm text-center z-20">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-pulse" />
                <span className="text-[7px] sm:text-[8px] font-bold mt-0.5">
                  100% HIJAU
                </span>
              </div>

              {/* Bottom Left Card */}
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-lg w-[110px] sm:w-[140px] z-20 hover:scale-[1.02] transition">
                <div className="flex items-center space-x-1">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span className="text-[10px] sm:text-xs font-bold text-neutral-dark">
                    Eco-Asri
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1 leading-normal">
                  Kondisi sampah terawasi ramah.
                </p>
              </div>

              {/* Main Circular Container */}
              <div className="relative w-[84%] aspect-square bg-emerald-800 rounded-full overflow-hidden border-[6px] sm:border-8 border-white shadow-xl flex flex-col justify-between p-4 sm:p-6 items-center text-center animate-fade-in">
                <div className="absolute inset-0 bg-[#008444] opacity-90 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-800 to-emerald-600"></div>

                {/* Header Label */}
                <div className="relative z-10 pt-2 sm:pt-4">
                  <span className="inline-block bg-white/20 text-[8px] sm:text-[10px] font-bold py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-full text-emerald-50 tracking-widest uppercase">
                    Laporan Pengaruh Bumi
                  </span>
                </div>

                {/* Main Stat */}
                <div className="relative z-10 py-1 sm:py-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2.5 animate-bounce">
                    <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300 animate-pulse" />
                  </div>
                  <span className="text-2xl sm:text-4xl font-serif font-bold text-white block">
                    -{(stats.co2Reduced / 1000).toFixed(0)}T
                  </span>
                  <span className="text-[10px] sm:text-xs text-emerald-200 font-medium tracking-wider">
                    Laju Karbon Terpangkas
                  </span>
                </div>

                {/* Micro Stats Bar */}
                <div className="relative z-10 w-[92%] sm:w-[84%] mb-1 sm:mb-2 mx-auto bg-emerald-950/80 border border-emerald-700/50 py-1.5 sm:py-2 px-2 sm:px-4 rounded-xl flex items-center justify-between text-[11px] sm:text-xs text-white shadow-xs">
                  <div className="text-left">
                    <span className="text-[8px] sm:text-[10px] text-emerald-200 block">
                      Daur Ulang
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs">
                      {(stats.plasticSaved / 1000).toFixed(0)}k Ons
                    </span>
                  </div>
                  <div className="w-px h-6 bg-emerald-700/50"></div>
                  <div className="text-right">
                    <span className="text-[8px] sm:text-[10px] text-emerald-200 block">
                      Mitra Aktif
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs">
                      {stats.activeMembers.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Live Counter Badge */}
              <div className="absolute top-1/2 -right-3 sm:-right-8 -translate-y-1/2 bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-lg z-20 w-[140px] sm:w-[170px] hover:scale-[1.02] transition">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="w-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
                    Live Counter
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-neutral-dark block">
                  {stats.organicComposted.toLocaleString()}+ Kg
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-tight block">
                  Kompos telah terintegrasi subur.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
