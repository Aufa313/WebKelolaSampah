import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Leaf,
  Globe2,
  Gift,
  DollarSign,
  Scale,
  Calendar,
  Smile,
  MapPin,
} from "lucide-react";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import LandingFaq from "../components/landing/LandingFaq";
import { pricingData } from "../data/pricing";
import { weeklyLeaderboard, monthlyLeaderboard } from "../data/leaderboard";
import { testimonials } from "../data/testimonials";
import { services } from "../data/services";

interface LandingPageProps {
  onRegister: () => void;
  onLogin: () => void;
  scrollToSection: (id: string) => void;
}

export default function LandingPage({
  onRegister,
  onLogin,
  scrollToSection,
}: LandingPageProps) {
  // States for Interactive Estimator
  const [selectedCategory, setSelectedCategory] = useState("plastik");
  const [weight, setWeight] = useState(15);
  const [address, setAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupRequested, setPickupRequested] = useState(false);
  const [pickupCode, setPickupCode] = useState("");

  // Landing Page Leaderboards Tab State
  const [landingLeaderboardTab, setLandingLeaderboardTab] = useState<
    "weekly" | "monthly"
  >("weekly");

  const selectedData = pricingData[selectedCategory] || pricingData.plastik;
  const calculatedPoints = weight * selectedData.points;
  const calculatedRupiah = weight * selectedData.rupiah;
  const calculatedCO2 = (weight * selectedData.co2Factor).toFixed(1);

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !pickupDate) {
      alert("Harap isi alamat penjemputan dan tanggal.");
      return;
    }
    const code = "CSL-" + Math.floor(100000 + Math.random() * 900000);
    setPickupCode(code);
    setPickupRequested(true);
  };

  return (
    <>
      {/* CORE BODY HERO SECTION */}
      <Hero
        onRegister={onRegister}
        onLogin={onLogin}
        scrollToSection={scrollToSection}
      />

      {/* CORE LOGO / PARTNERSHIP SLIDER SECTION */}
      <section
        id="kemitraan"
        className="w-full bg-white py-12 border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
              Dilahirkan melayani solusi lingkungan berkelanjutan
            </span>
          </div>

          {/* Logo grid simulating standard high contrast B2B logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center opacity-70">
            <div className="flex items-center space-x-1.5 hover:text-primary hover:opacity-100 transition-all font-serif font-black text-lg text-slate-400 cursor-default">
              <Leaf className="w-5 h-5 text-emerald-700" />
              <span>KLH REPUBLIK ID</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-primary hover:opacity-100 transition-all font-sans font-bold text-base text-slate-400 cursor-default">
              <span>PT BUMI SENTOSA</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-primary hover:opacity-100 transition-all font-mono tracking-wider text-base text-slate-400 cursor-default">
              <span>[ GREEN_CORP ]</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-primary hover:opacity-100 transition-all font-serif font-semibold italic text-base text-slate-400 cursor-default">
              <span>EcoCapital Sinergi</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES / FEATURES SECTION */}
      <Features services={services} scrollToSection={scrollToSection} />

      {/* PRICING / CONVERSION PANEL */}
      <Pricing />

      {/* INTERACTIVE SAMPAH-TO-VALUE CALCULATOR & ESTIMATOR */}
      <section
        id="setor-sampah"
        className="w-full bg-[#f8fafc] py-16 md:py-24 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch"
            id="estimator-panel-structure"
          >
            {/* KIRI - Penjelasan & Pilihan Category Sampah (5 Cols) */}
            <div className="lg:col-span-5 text-left flex flex-col justify-between">
              <div>
                <span className="text-primary font-bold text-xs uppercase tracking-widest bg-emerald-100/50 px-3 py-1 rounded-full inline-block mb-3">
                  Pilah & Konversikan Nilai Sampah
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-neutral-dark tracking-tight">
                  Kalkulator Berkah: <br />
                  Ubah Sampah Jadi Saldo
                </h2>
                <p className="text-sm text-slate-500 mt-4 font-sans leading-relaxed">
                  Pilih kategori sampah yang siap Anda setorkan dari rumah,
                  gunakan slider di sebelah kanan untuk menentukan berat
                  sampah dalam kilogram, dan lihat langsung akumulasi Poin
                  Kebaikan serta taksiran Rupiah Anda.
                </p>

                {/* Category List buttons */}
                <div className="mt-8 space-y-2.5">
                  {(
                    Object.keys(pricingData) as Array<
                      keyof typeof pricingData
                    >
                  ).map((key) => {
                    const item = pricingData[key];
                    const isSelected = selectedCategory === key;
                    return (
                      <motion.button
                        key={key}
                        id={`category-btn-${key}`}
                        onClick={() => setSelectedCategory(key)}
                        whileHover={{
                          scale: 1.025,
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left cursor-pointer ${
                          isSelected
                            ? "bg-white border-primary shadow-md ring-1 ring-primary/20"
                            : "bg-transparent border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                              {item.desc.substring(0, 50)}...
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-primary block">
                            {item.points} Pts/kg
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Rp {item.rupiah.toLocaleString()}/kg
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Environmental Fact card */}
              <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start space-x-3">
                <Globe2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-neutral-dark block leading-snug">
                    Rasio Penyelamatan Karbon
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
                    Penyaluran dan peleburan plastik PET yang tepat mampu
                    menekan hingga 75% kebutuhan emisi hidrokarbon mentah
                    industri kimia lokal.
                  </p>
                </div>
              </div>
            </div>

            {/* KANAN - Slider & Dynamic Estimates & Schedule Pickup Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-800">
                      Detail Estimasi & Pengambilan
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Lengkapi formulir untuk penjemputan gratis oleh
                      surveyor
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary py-1 px-3 rounded-full text-xs font-bold font-mono">
                    {selectedData.label}
                  </div>
                </div>

                {/* Slider Input for Weight */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-600">
                      Perkiraan Berat Total
                    </span>
                    <span className="text-base font-bold text-primary bg-emerald-50 px-3 py-1 rounded-md font-mono">
                      {weight} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full accent-primary h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>1 kg</span>
                    <span>50 kg</span>
                    <span>100 kg</span>
                    <span>150 kg</span>
                  </div>
                </div>

                {/* Real-time Dynamic Results Container */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
                  id="kalkulator-results-grid"
                >
                  {/* Poin Kebaikan */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Poin Kebaikan
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-[#008444] font-mono mt-1 block">
                      {calculatedPoints.toLocaleString()}{" "}
                      <span className="text-xs font-sans">Pts</span>
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block leading-tight">
                      Gunakan untuk voucher asuransi
                    </span>
                  </div>

                  {/* Saldo Cash Equivalent */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Taksiran Tunai
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-[#008444] font-mono mt-1 block">
                      Rp {calculatedRupiah.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block leading-tight">
                      Di-transfer saat sampah dijemput
                    </span>
                  </div>

                  {/* CO2 Emissions Prevented */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                      <Scale className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Potensi Karbon
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-[#008444] font-mono mt-1 block">
                      -{calculatedCO2}{" "}
                      <span className="text-xs font-sans">Kg</span>
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block leading-tight">
                      Setara jejak emisi CO₂ diredam
                    </span>
                  </div>
                </div>

                {/* Sub-form: Jadwalkan Penjemputan */}
                <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                    <Calendar className="w-4 h-4 text-primary mr-2" />
                    Jadwalkan Penjemputan Gratis
                  </h4>

                  {pickupRequested ? (
                    <div className="bg-white border border-emerald-200 p-4 rounded-lg text-center transition-all">
                      <Smile className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                      <span className="text-xs font-bold text-slate-800 block">
                        Jadwal Penjemputan Teredam Berhasil
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto font-sans">
                        Petugas surveyor kami akan menuju alamat Anda pada
                        tanggal{" "}
                        <strong className="text-primary">
                          {pickupDate}
                        </strong>
                        .
                      </p>
                      <div className="bg-slate-50 border border-dashed border-slate-300 py-1.5 px-3 rounded-md inline-block mt-3 text-xs font-mono font-bold tracking-wider text-primary">
                        Kode Booking: {pickupCode}
                      </div>
                      <button
                        onClick={() => {
                          setPickupRequested(false);
                          setAddress("");
                          setPickupDate("");
                        }}
                        className="text-[10px] font-semibold text-slate-400 hover:text-primary block mx-auto mt-2.5 underline cursor-pointer"
                      >
                        Buat Jadwal Baru
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handlePickupSubmit}
                      className="space-y-3 font-sans"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Pilih Tanggal Penjemputan
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split("T")[0]}
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-neutral-dark cursor-pointer font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Nomor Hubungan Handphone
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 0812XXXXXXXX"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-neutral-dark font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Alamat Lengkap Rumah / Lokasi Sampah
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Tulis nama jalan, nomor rumah, RT/RW, kelurahan..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-neutral-dark"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-[#006633] text-white py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center space-x-2"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Kirim Booking Surveyor</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Secure statement */}
              <p className="text-[10px] text-slate-400 mt-4 text-center leading-normal">
                Setiap laporan dan timangan diverifikasi di depan mata Anda
                menggunakan timbangan laboratorium bersertifikat ISO.
                Keamanan tinggi dan kemudahan digital terjamin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI TESTIMONIAL / FEEDBACK GRID */}
      <section
        id="testimonial-section"
        className="w-full bg-[#1e293b] text-white py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="text-[#008444] font-bold text-xs uppercase tracking-widest bg-emerald-955/60 text-emerald-300 border border-emerald-900/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Kisah Berkah Nyata Pelanggan
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white tracking-tight">
              Apresiasi dari Sahabat Hijau Lengkang
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-sans">
              Feedback autentik dari komoditas rukun tetangga, relawan
              aktivis, hingga jajaran industri komersial yang bersinergi
              menekan polutan.
            </p>
          </div>

          {/* Testimonial Cards Grid (3 Cards) */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            id="testimonials-card-grid"
          >
            {testimonials.map((test, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl relative text-left flex flex-col justify-between hover:bg-white/10 transition-all duration-300"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex text-yellow-500 mb-4 items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>★</span>
                    ))}
                    <span className="text-[10px] text-slate-300 font-bold ml-1.5">
                      5.0
                    </span>
                  </div>

                  {/* Quote text */}
                  <p className="text-xs md:text-sm text-slate-200 italic leading-relaxed font-sans mb-6 relative z-10">
                    "{test.quote}"
                  </p>
                </div>

                {/* Profile Avatar & Name in the bottom border corner */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {test.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {test.role}
                    </span>
                  </div>
                  {/* Avatar badge */}
                  <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center font-bold text-emerald-305 font-mono text-xs border border-emerald-500/20">
                    {test.avatar}
                  </div>
                </div>

                {/* Quotes Background Stamp */}
                <span className="absolute top-4 right-6 text-7xl font-serif text-white/5 select-none z-0">
                  ”
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKSI KLASEMEN WARGA HIJAU (LEADERBOARD) - SEBELUM FAQ */}
      <section
        id="leaderboard-section"
        className="w-full bg-white border-t border-slate-200 py-16 md:py-24 text-left scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#008444] font-bold text-xs uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
                🏆 Kompetisi Hijau Kelurahan
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">
                Klasemen Kontributor Hijau Teraktif
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-2 font-sans">
                Apresiasi untuk warga Kelurahan Lengkang yang paling
                konsisten mendaur ulang limbah rumah tangga. Mari berlomba
                menjaga kelestarian lingkungan!
              </p>
            </div>

            {/* Weekly / Monthly Tab Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs shrink-0 self-start md:self-auto border border-slate-200">
              <button
                type="button"
                onClick={() => setLandingLeaderboardTab("weekly")}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  landingLeaderboardTab === "weekly"
                    ? "bg-[#008444] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Pekan Ini (Weekly)
              </button>
              <button
                type="button"
                onClick={() => setLandingLeaderboardTab("monthly")}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  landingLeaderboardTab === "monthly"
                    ? "bg-[#008444] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Bulan Ini (Monthly)
              </button>
            </div>
          </div>

          {/* Dynamic Rankings Generation */}
          {(() => {
            const activeList =
              landingLeaderboardTab === "weekly"
                ? weeklyLeaderboard
                : monthlyLeaderboard;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Podium Visuals (Top 3 Cards for Mobile/Desktop layout rhythm) */}
                <div className="lg:col-span-4 space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Juara Podium{" "}
                    {landingLeaderboardTab === "weekly"
                      ? "Pekan Ini"
                      : "Bulan Ini"}
                  </span>

                  {activeList.slice(0, 3).map((contributor) => {
                    const isGold = contributor.rank === 1;
                    const isSilver = contributor.rank === 2;
                    const isBronze = contributor.rank === 3;

                    return (
                      <div
                        key={contributor.name}
                        className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between hover:shadow-xs transition duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">
                            {contributor.badge}
                          </span>
                          <div className="text-left">
                            <h4
                              className={`text-xs md:text-sm font-bold ${
                                isGold
                                  ? "text-amber-600"
                                  : isSilver
                                    ? "text-slate-500"
                                    : isBronze
                                      ? "text-amber-800"
                                      : "text-slate-700"
                              }`}
                            >
                              {contributor.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 block font-sans">
                              Spesialis: {contributor.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs md:text-sm font-bold text-[#008444] font-mono">
                            {contributor.points.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-sans">
                            Poin
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table Detailed Leaderboard (5 positions with beautiful highlights) */}
                <div className="lg:col-span-8">
                  <div className="bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 py-3.5 px-5 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="col-span-2 text-center">Posisi</div>
                      <div className="col-span-6 text-left">
                        Kontributor
                      </div>
                      <div className="col-span-4 text-right">
                        Perolehan Poin
                      </div>
                    </div>

                    {/* List Rows */}
                    <div className="divide-y divide-slate-200 bg-white">
                      {activeList.map((contributor) => {
                        const isTop3 = contributor.rank <= 3;
                        return (
                          <div
                            key={contributor.name}
                            className="grid grid-cols-12 items-center py-4 px-5 transition duration-150 hover:bg-slate-50"
                          >
                            {/* Rank */}
                            <div className="col-span-2 flex justify-center">
                              {isTop3 ? (
                                <span className="text-xl leading-none">
                                  {contributor.badge}
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-slate-400 font-mono w-6 h-6 flex items-center justify-center bg-slate-100 rounded-full">
                                  {contributor.rank}
                                </span>
                              )}
                            </div>

                            {/* Contributor Name & Tag */}
                            <div className="col-span-6 text-left">
                              <span className="text-xs md:text-sm font-bold text-slate-800">
                                {contributor.name}
                              </span>
                              <span className="text-[9px] text-slate-400 block font-sans">
                                Setor: {contributor.category}
                              </span>
                            </div>

                            {/* Points */}
                            <div className="col-span-4 text-right flex flex-col justify-center items-end">
                              <div className="flex items-center gap-1 justify-end w-full">
                                <span className="text-xs md:text-sm font-bold text-slate-800 font-mono">
                                  {contributor.points.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400 font-sans">
                                  Poin
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 font-sans text-right">
                                Setara{" "}
                                {Math.round(contributor.points / 2.5)} Kg
                                Sampah
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Motivational Banner and Form anchor */}
                  <div className="mt-6 p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs flex flex-wrap items-center justify-between gap-4 font-sans">
                    <div className="flex items-center gap-3 text-slate-600 text-left max-w-xl">
                      <span className="text-2xl shrink-0">🌱</span>
                      <span>
                        <strong className="text-slate-800">
                          Ingin nama Anda tampil di sini?
                        </strong>{" "}
                        Yuk berpartisipasi! Kumpulkan dan setorkan sampah
                        kering di sekitar kelurahan kita untuk mengumpulkan
                        poin dan mengklaim insentif sembako.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const regSection = document.getElementById(
                          "pendaftaran-anggota-baru"
                        );
                        if (regSection) {
                          regSection.scrollIntoView({ behavior: "smooth" });
                        } else {
                          onRegister();
                        }
                      }}
                      className="text-[11px] bg-[#008444] text-white hover:bg-[#006633] font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      Daftar Jadi Warga Hijau
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SEKSI FAQ (PERTANYAAN UMUM ACCORDION) - SEBELUM FOOTER */}
      <section
        id="faq-section"
        className="w-full bg-slate-50 border-t border-b border-slate-100 py-16 md:py-24 text-left"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#008444] font-bold text-xs uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Kamus Bantuan &amp; Panduan
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2 font-sans">
              Mulai dari konversi berat timbangan, pencairan dana tunai
              koperasi kedaulatan warga hingga penggunaan detektor AI di
              kelurahan.
            </p>
          </div>

          {/* Accordion List Container */}
          <div className="space-y-4" id="faq-accordion-container">
            <LandingFaq />
          </div>
        </div>
      </section>
    </>
  );
}
