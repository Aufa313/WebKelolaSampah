import React from "react";
import { ChevronRight } from "lucide-react";

interface Service {
  title: string;
  desc: string;
  icon: React.ReactNode;
  tag: string;
  points: string;
}

interface FeaturesProps {
  services: Service[];
  scrollToSection?: (id: string) => void;
}

export default function Features({ services, scrollToSection }: FeaturesProps) {
  return (
    <section id="layanan" className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-[#008444] font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
              PROGRAM DAUR ULANG TERPADU
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-slate-800 tracking-tight">
              Layanan Profesional yang Kami Sediakan
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm md:mb-2 font-sans">
            Setiap kategori sampah yang dikirimkan dipilah oleh tim profesional
            dan disalurkan kembali ke generator industri manufaktur nasional
            sebagai bahan baku hijau.
          </p>
        </div>

        {/* Services Grid (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <div
              key={i}
              className="bg-[#f8fafc] border border-slate-100 hover:border-emerald-300 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-700/5"
            >
              <div>
                {/* Service Icon */}
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 shadow-xs text-[#008444] group-hover:bg-[#008444] group-hover:text-white transition-colors">
                  {svc.icon}
                </div>

                {/* Tag and Title */}
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-[10px] font-bold font-mono text-[#008444] uppercase bg-emerald-100/50 px-2 py-0.5 rounded-sm">
                    {svc.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {svc.points}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800 mb-3 group-hover:text-[#008444] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans mb-6">
                  {svc.desc}
                </p>
              </div>

              <button
                onClick={() => scrollToSection?.("setor-sampah")}
                className="inline-flex items-center text-xs font-semibold text-[#008444] hover:text-[#006633] transition-colors mt-auto group/btn cursor-pointer"
              >
                <span>Mulai Estimasi</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
