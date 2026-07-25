import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Upload, X, RefreshCw, CheckCircle, ArrowRight, ShieldCheck, Info, Leaf, Camera } from "lucide-react";
import { analyzeWasteImage, WasteAnalysisResult } from "../../services/aiService";
import AnimatedCounter from "./AnimatedCounter";
import ConfettiEffect from "./ConfettiEffect";

interface AIWasteClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult?: (result: WasteAnalysisResult) => void;
}

const DEMO_SAMPLES = [
  { key: "botol", label: "Botol Plastik PET", icon: "🍾", bg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
  { key: "kardus", label: "Kardus Gelombang", icon: "📦", bg: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
  { key: "kaleng", label: "Kaleng Aluminium", icon: "🥫", bg: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100" },
  { key: "organik", label: "Sisa Buah & Sayur", icon: "🥬", bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
];

export default function AIWasteClassifierModal({ isOpen, onClose, onApplyResult }: AIWasteClassifierModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sampleKey, setSampleKey] = useState<string | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        setSampleKey(undefined);
        runAnalysis(base64, undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof DEMO_SAMPLES[0]) => {
    setSelectedImage(null);
    setSampleKey(sample.key);
    runAnalysis("", sample.key);
  };

  const runAnalysis = async (base64: string, sample?: string) => {
    setIsScanning(true);
    setResult(null);
    try {
      const res = await analyzeWasteImage(base64, sample);
      setResult(res);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSampleKey(undefined);
    setResult(null);
    setIsScanning(false);
  };

  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case "Plastik": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Kertas": return "bg-amber-100 text-amber-800 border-amber-300";
      case "Logam": return "bg-gray-100 text-gray-800 border-gray-300";
      case "Organik": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Kaca": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-red-100 text-red-800 border-red-300";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        {showConfetti && <ConfettiEffect active={showConfetti} />}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 dark:border-gray-800 my-8"
        >
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-6 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/20">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">AI Klasifikasi Sampah Cerdas</h3>
                  <p className="text-emerald-100 text-xs mt-0.5">
                    Deteksi otomatis material, estimasi poin & panduan daur ulang powered by Gemini AI
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Initial Selection Stage */}
            {!selectedImage && !sampleKey && !isScanning && !result && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-emerald-300 dark:border-gray-700 rounded-2xl p-8 text-center bg-emerald-50/50 dark:bg-gray-800/40 hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all cursor-pointer group relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    Unggah / Ambil Foto Sampah Anda
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Pilih file gambar atau ambil foto menggunakan kamera. Format PNG, JPG, atau WEBP.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Atau Coba Sampel Demo Instant:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DEMO_SAMPLES.map((sample) => (
                      <motion.button
                        key={sample.key}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSelectSample(sample)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm ${sample.bg}`}
                      >
                        <span className="text-2xl">{sample.icon}</span>
                        <span className="text-xs font-medium text-center">{sample.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scanning / Processing State */}
            {isScanning && (
              <div className="py-12 text-center space-y-6">
                <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-500/30">
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl">
                    {sampleKey === "botol" ? "🍾" : sampleKey === "kardus" ? "📦" : sampleKey === "kaleng" ? "🥫" : sampleKey === "organik" ? "🥬" : "📷"}
                  </div>
                  {/* Laser Beam Animation */}
                  <motion.div
                    animate={{ y: [0, 180, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
                  />
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px]" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold animate-pulse">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Menganalisis Komposisi Sampah...
                  </div>
                  <p className="text-xs text-gray-500">Menghubungkan ke Gemini AI Engine & Kalkulator Poin</p>
                </div>
              </div>
            )}

            {/* Results Display State */}
            {result && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result Header Badge & Metrics */}
                <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getCategoryBadgeClass(result.category)}`}>
                          Kategori: {result.category}
                        </span>
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Akurasi {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {result.subType}
                      </h4>
                    </div>

                    {/* Reward Points Badge */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-4 shadow-lg text-center min-w-[130px]">
                      <span className="text-xs text-emerald-100 block font-medium">Estimasi Hadiah</span>
                      <div className="text-2xl font-black tracking-tight">
                        +<AnimatedCounter value={result.estimatedPoints} /> <span className="text-xs font-normal">Poin</span>
                      </div>
                      <span className="text-[10px] text-emerald-100/90 block mt-0.5">
                        ~ {(result.estimatedPoints / 100).toLocaleString("id-ID")} Rupiah
                      </span>
                    </div>
                  </div>

                  {/* Weight & Recyclability */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/60 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Estimasi Bobot:</span>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{result.estimatedWeightKg} kg</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Tingkat Daur Ulang:</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{result.recyclability}</p>
                    </div>
                  </div>
                </div>

                {/* Eco Tip */}
                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-300">
                  <Leaf className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-800 dark:text-amber-200 mb-0.5">Fakta Dampak Lingkungan:</span>
                    <p className="leading-relaxed">{result.ecoTip}</p>
                  </div>
                </div>

                {/* Preparation Instructions */}
                <div>
                  <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-500" /> Panduan Persiapan Sebelum Disetor:
                  </h5>
                  <ul className="space-y-2">
                    {result.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Pindai Ulang
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (onApplyResult && result) {
                        onApplyResult(result);
                      }
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
                  >
                    <span>Lanjutkan Setor ({result.category})</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
