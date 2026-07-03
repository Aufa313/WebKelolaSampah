import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, MapPin, Truck, Award } from "lucide-react";

interface KurirStatsWidgetProps {
  completedCount: number;
  totalCount: number;
  totalWeight: number;
  voucherBensin: number;
}

export default function KurirStatsWidget({
  completedCount = 8,
  totalCount = 10,
  totalWeight = 145,
  voucherBensin = 20000
}: KurirStatsWidgetProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial online status
    setIsOnline(window.navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div 
      id="kurir-stats-widget-container"
      className="w-full bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 shadow-sm text-slate-900"
    >
      {/* 1. Offline/Online Status Banner with high contrast colors */}
      <div 
        className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 text-xs font-black font-mono tracking-wide ${
          isOnline 
            ? "bg-emerald-100/90 border border-emerald-300 text-emerald-950" 
            : "bg-rose-100/90 border border-rose-300 text-rose-950"
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 shrink-0 animate-pulse text-emerald-800" />
            <span>Status Aplikasi: ⚡ Online & Tersinkronisasi</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 shrink-0 animate-bounce text-rose-800" />
            <span>⚠️ Mode Offline - Data Disimpan di HP</span>
          </>
        )}
      </div>

      {/* 2. Horisontal Work Summary Row with high visibility readable fonts */}
      <div className="grid grid-cols-3 divide-x-2 divide-amber-200/80 gap-1 text-center bg-white/65 p-2 rounded-xl border border-amber-200">
        {/* Total Rumah */}
        <div className="flex flex-col justify-center items-center px-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>RUMAH</span>
          </div>
          <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight mt-0.5">
            {completedCount}/{totalCount}
          </p>
        </div>

        {/* Total Muatan */}
        <div className="flex flex-col justify-center items-center px-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <Truck className="w-3 h-3 text-[#008444] shrink-0" />
            <span>MUATAN</span>
          </div>
          <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight mt-0.5">
            {totalWeight} Kg
          </p>
        </div>

        {/* Voucher Bensin */}
        <div className="flex flex-col justify-center items-center px-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 text-amber-600 shrink-0" />
            <span>BENSIN</span>
          </div>
          <p className="text-sm sm:text-base font-black text-rose-700 tracking-tight mt-0.5">
            Rp{voucherBensin.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
      
      {/* Sun/Glare high-readability disclaimer */}
      <span className="block text-[8.5px] font-bold text-amber-800/75 uppercase tracking-widest text-center mt-2.5">
        ☀️ Kontras Tinggi Ramah Sinar Matahari Lapangan
      </span>
    </div>
  );
}
