import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Star, Eye } from "lucide-react";

interface FooterProps {
  simple?: boolean;
}

export default function Footer({ simple = false }: FooterProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "Pilah Sampah Rutin",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Silakan lengkapi kolom Nama dan Nomor Telepon terlebih dahulu.");
      return;
    }

    const newConsultation = {
      id: "CNS-" + Math.floor(1000 + Math.random() * 9000),
      name: formData.name,
      phone: formData.phone,
      category: formData.category,
      message: formData.message || "Tidak ada detail tambahan.",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      status: "Pending",
      reply: ""
    };

    try {
      const existingStr = localStorage.getItem("lengkang_consultations");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(newConsultation);
      localStorage.setItem("lengkang_consultations", JSON.stringify(existing));
    } catch (err) {
      console.error("Error saving consultation", err);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        category: "Pilah Sampah Rutin",
        message: "",
      });
      setIsSubmitted(false);
    }, 4500);
  };

  const categories = [
    "Pilah Sampah Rutin",
    "Kemitraan Perusahaan",
    "Sponsorship Event",
    "Layanan Jemput Khusus Sektor Komersial",
    "Konsultasi Pengolahan Kompos",
  ];

  if (simple) {
    return (
      <footer className="w-full bg-[#f4fbf7] border-t border-emerald-150/50 py-8 text-xs text-slate-500 font-sans mt-auto">
        <div id="simple-footer-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-neutral-dark font-serif">Lengkang Ltd.</span> All Rights Reserved.
            </p>
            <p className="text-slate-400 text-center md:text-left mt-0.5">
              Mengolah Sampah Menjadi Berkah • Terregistrasi Kementerian LH RI.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#kebijakan" className="hover:text-[#008444] transition-colors">Kebijakan Privasi</a>
            <a href="#ketentuan" className="hover:text-[#008444] transition-colors">Syarat & Ketentuan</a>
            <a href="#pusat-bantuan" className="hover:text-[#008444] transition-colors">Pusat Bantuan</a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <section id="kontak" className="w-full bg-[#fafdfa] border-t border-slate-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Ajukan Pertanyaan & Konsultasi
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-neutral-dark tracking-tight">
            Hubungi Kami & Temukan Lokasi Lengkang
          </h2>
          <p className="text-sm text-slate-500 mt-3 font-sans">
            Tim ahli kami siap melayani kebutuhan konsultasi pilah sampah, kerjasama kemitraan CSR, hingga penjemputan sampah berskala industri.
          </p>
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch" id="contact-split-layout">
          
          {/* 1. KIRI: Visual Interactive Map Placeholder (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-neutral-dark">Pusat Daur Ulang Lengkang</h3>
                  <p className="text-xs text-slate-400">Hub Pengolahan & Distribusi Berkah</p>
                </div>
              </div>

              {/* Mock Vector Map Graphics */}
              <div 
                className="relative w-full h-64 bg-slate-200 rounded-3xl overflow-hidden border border-slate-300 shadow-inner group flex items-center justify-center p-3"
                style={{ backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", backgroundSize: "20px 20px" }}
              >
                
                {/* Visual Grid overlay */}
                <div className="absolute inset-0 bg-slate-200/40"></div>
                
                {/* Mock Roads */}
                <div className="absolute w-[200%] h-4 bg-white/95 rotate-12 -left-1/3 top-1/4 shadow-xs"></div>
                <div className="absolute w-[200%] h-5 bg-white/95 -rotate-45 -left-1/3 top-2/3 shadow-xs"></div>
                
                {/* Mock Parks/Green Zone */}
                <div className="absolute w-24 h-24 bg-emerald-100 rounded-full blur-xl left-10 top-1/3 opacity-70"></div>
                <div className="absolute w-32 h-32 bg-emerald-200/40 rounded-full blur-lg right-12 top-6 opacity-50"></div>

                {/* Main Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    {/* Ring Waves */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <div className="relative bg-[#008444] text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 animate-bounce" />
                    </div>
                  </div>
                  <div className="mt-3 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-md text-center max-w-[170px]">
                    <span className="text-[11px] font-bold text-neutral-dark block leading-none">Lengkang HQ Utama</span>
                    <span className="text-[9px] text-[#008444] font-mono mt-1 inline-block">Menerima Semua Sampah</span>
                  </div>
                </div>

                {/* Secondary Markers */}
                <div className="absolute top-1/3 right-1/4 flex flex-col items-center">
                  <div className="bg-emerald-600 text-white p-1 rounded-full shadow">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-medium bg-neutral-dark text-white px-2 py-0.5 rounded-full shadow mt-1">Sektor Plastik</span>
                </div>

                <div className="absolute bottom-1/4 left-1/4 flex flex-col items-center animate-pulse">
                  <div className="bg-[#008444] text-white p-1 rounded-full shadow">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-medium bg-neutral-dark text-white px-2 py-0.5 rounded-full shadow mt-1">Sektor Organik</span>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-slate-200 shadow-xs">
                  Jl. Hutan Lengkang No. 88, Jakarta
                </div>
              </div>
 
              {/* Address details */}
              <div className="mt-5 space-y-3 font-sans text-xs">
                <div className="flex items-start space-x-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Jl. Hutan Lengkang No. 88, Sektor Daur Ulang Mandiri, Jakarta Selatan, 12340</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>+62-812-3456-7890</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>hub@lengkang-clean.id</span>
                </div>
              </div>
            </div>

            {/* Business hours indicator card */}
            <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-dark block">Jam Operasional Hub:</span>
                <span className="text-slate-500">Senin - Saptu (08.00 - 17.00 WIB)</span>
              </div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-sm">
                BUKA SEKARANG
              </span>
            </div>
          </div>

          {/* 2. KANAN: Elegant Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between animate-on-scroll">
            <div>
              <div className="mb-6">
                <h3 className="font-serif font-bold text-2xl text-neutral-dark">Have Questions? Contact Us</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Kirimkan pesan mendetail Anda dan tim konsultan sampah kami akan merespons dalam waktu 1x24 jam.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center my-6 h-64 transition-all">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mb-4 shadow-sm animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-neutral-dark">Pesan Anda Terkirim Berhasil!</h4>
                  <p className="text-sm text-slate-600 max-w-sm mt-2 font-sans">
                    Terima kasih, <span className="font-semibold text-primary">{formData.name}</span>. Tim Hubungan Masyarakat Lengkang akan segera menghubungi Anda di <span className="font-mono text-xs">{formData.phone}</span>.
                  </p>
                  <p className="text-xs text-slate-400 mt-4 italic font-mono">
                    #MengolahSampahMenjadiBerkah-ID: {Math.floor(Math.random() * 90000) + 10000}
                  </p>
                </div>
              ) : (
                <form id="lengkang-contact-form" onSubmit={handleSubmit} className="space-y-4 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Nama Lengkap Anda <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nama Lengkap"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#008444] transition-colors"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Nomor WhatsApp / Telepon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Telepon"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#008444] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Category Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Kategori Konsultasi / Minat Layanan
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none text-slate-500 focus:border-[#008444] transition-colors appearance-none cursor-pointer"
                    >
                      {categories.map((cat, i) => (
                        <option key={i} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Pesan Tambahan (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tulis detail sampah, volume/kg, atau pertanyaan kerjasama disini..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#008444] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#008444] hover:bg-[#006633] text-white py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer shadow-md shadow-green-900/10 flex items-center justify-center space-x-2 text-sm mt-2"
                  >
                    <span>Kirim Pesan</span>
                    <Send className="w-4 h-4 ml-1" />
                  </button>
                </form>
              )}
            </div>

            {/* Value Trust badge */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center space-x-3.5 text-xs text-slate-500">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-6 h-6 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-bold text-white uppercase">
                    L{n}
                  </div>
                ))}
              </div>
              <span>Dikelola secara bertanggung jawab oleh tim surveyor bersertifikasi nasional.</span>
            </div>
          </div>
        </div>

        {/* 4. FOOTER BASE (Kaki Halaman) */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-sans gap-4" id="footer-base-area">
          <div>
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-neutral-dark font-serif">Lengkang Ltd.</span> All Rights Reserved.
            </p>
            <p className="text-slate-400 text-center md:text-left mt-0.5">
              Mengolah Sampah Menjadi Berkah • Terregistrasi Kementerian LH RI.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#kebijakan" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
            <a href="#ketentuan" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
            <a href="#pusat-bantuan" className="hover:text-primary transition-colors">Pusat Bantuan</a>
            <a href="#karir" className="hover:text-primary transition-colors">Karir Pengubah Dunia</a>
          </div>
        </div>

      </div>
    </section>
  );
}
