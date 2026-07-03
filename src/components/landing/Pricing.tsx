import React from "react";
import { pricingData } from "../../data/pricing";

interface PricingProps {
  // Optional: can accept custom pricingData if needed
}

export default function Pricing({}: PricingProps) {
  return (
    <section
      id="pricing"
      className="w-full bg-white py-16 md:py-24 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#008444] font-bold text-xs uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Tabel Harga Sampah
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 tracking-tight">
            Konversi Berat Sampah Menjadi Nilai
          </h2>
          <p className="text-sm text-slate-500 mt-3 font-sans">
            Setiap kategori sampah memiliki nilai tukar yang berbeda berdasarkan
            kelangkaan material dan manfaat lingkungan.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(pricingData).map((key) => {
            const item = pricingData[key];
            return (
              <div
                key={key}
                className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-emerald-300 rounded-2xl p-6 md:p-8 transition-all duration-300 flex flex-col group hover:shadow-lg hover:shadow-emerald-700/10"
              >
                {/* Color indicator */}
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl mb-4 opacity-20`}
                ></div>

                {/* Title */}
                <h3 className="font-serif font-bold text-lg md:text-xl text-slate-800 mb-2 group-hover:text-[#008444] transition-colors">
                  {item.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed font-sans mb-6 flex-grow">
                  {item.desc}
                </p>

                {/* Pricing Info */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  {/* Points */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Poin Kebaikan
                    </span>
                    <span className="text-lg font-bold text-[#008444] font-mono">
                      {item.points}
                    </span>
                  </div>

                  {/* Rupiah */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Harga/Kg
                    </span>
                    <span className="text-lg font-bold text-slate-800 font-mono">
                      Rp {item.rupiah.toLocaleString()}
                    </span>
                  </div>

                  {/* CO2 Factor */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Faktor CO₂
                    </span>
                    <span className="text-lg font-bold text-slate-600 font-mono">
                      {item.co2Factor}x
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-emerald-50/50 border border-emerald-100/50 rounded-xl text-center">
          <p className="text-sm text-slate-600 font-sans">
            💡 <strong>Catatan:</strong> Harga sampah dapat berubah sesuai
            kondisi pasar dan musim. Update harga real-time tersedia di aplikasi
            mobile dan dashboard. Hubungi tim kami untuk penawaran khusus
            korporat atau bulk order.
          </p>
        </div>
      </div>
    </section>
  );
}
