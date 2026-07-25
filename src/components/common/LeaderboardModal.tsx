import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Award, Crown, Medal, X, Flame, Leaf, Sparkles, TrendingUp } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  totalKg: number;
  badgeTitle: string;
  badgeColor: string;
}

const DUMMY_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Ibu Ratna Pertiwi", avatar: "👩‍🌾", points: 14500, totalKg: 98.5, badgeTitle: "Sultan Daur Ulang", badgeColor: "bg-amber-100 text-amber-800 border-amber-300" },
  { rank: 2, name: "Pak Budi Santoso", avatar: "👨‍🌾", points: 12200, totalKg: 84.0, badgeTitle: "Pahlawan Bumi", badgeColor: "bg-gray-100 text-gray-800 border-gray-300" },
  { rank: 3, name: "Siti Rahmawati", avatar: "👩‍💼", points: 9800, totalKg: 65.2, badgeTitle: "Pelopor Hijau", badgeColor: "bg-orange-100 text-orange-800 border-orange-300" },
  { rank: 4, name: "Ahmad Dahlan", avatar: "👨‍🔧", points: 7650, totalKg: 52.0, badgeTitle: "Pejuang Kompos", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { rank: 5, name: "Anda (Warga RT 05)", avatar: "🌟", points: 5400, totalKg: 38.5, badgeTitle: "Sahabat Lingkungan", badgeColor: "bg-blue-100 text-blue-800 border-blue-300" },
  { rank: 6, name: "Deni Kurniawan", avatar: "👨‍💻", points: 4200, totalKg: 31.0, badgeTitle: "Pilah Pemula", badgeColor: "bg-purple-100 text-purple-800 border-purple-300" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [filterTime, setFilterTime] = useState<"month" | "all">("month");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-100 dark:border-gray-800 my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/20">
                  <Trophy className="w-7 h-7 text-yellow-200 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Papan Peringkat Warga</h3>
                  <p className="text-amber-100 text-xs mt-0.5">
                    Juara Daur Ulang & Pengumpul Poin Terbanyak RT 05 / RW 02
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

            {/* Time Filter Tabs */}
            <div className="flex items-center justify-center gap-2 mt-4 bg-black/10 p-1 rounded-xl max-w-xs mx-auto text-xs font-semibold">
              <button
                onClick={() => setFilterTime("month")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${filterTime === "month" ? "bg-white text-amber-900 shadow-md" : "text-white/80 hover:text-white"}`}
              >
                Bulan Ini (Juli)
              </button>
              <button
                onClick={() => setFilterTime("all")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${filterTime === "all" ? "bg-white text-amber-900 shadow-md" : "text-white/80 hover:text-white"}`}
              >
                Sepanjang Masa
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Top 3 Podium Highlights */}
            <div className="grid grid-cols-3 gap-3 mb-6 items-end pt-2">
              {/* Rank 2 */}
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-3 text-center flex flex-col items-center shadow-sm">
                <div className="relative mb-2">
                  <span className="text-3xl">{DUMMY_LEADERBOARD[1].avatar}</span>
                  <span className="absolute -bottom-2 -right-1 bg-gray-300 text-gray-800 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">2</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate w-full">{DUMMY_LEADERBOARD[1].name}</h4>
                <p className="text-[11px] font-black text-amber-600 mt-1"><AnimatedCounter value={DUMMY_LEADERBOARD[1].points} /> pt</p>
              </div>

              {/* Rank 1 */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 rounded-2xl p-4 text-center flex flex-col items-center shadow-lg relative -translate-y-2">
                <Crown className="w-5 h-5 text-amber-500 absolute -top-3 animate-pulse" />
                <div className="relative mb-2 mt-1">
                  <span className="text-4xl">{DUMMY_LEADERBOARD[0].avatar}</span>
                  <span className="absolute -bottom-2 -right-1 bg-amber-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">1</span>
                </div>
                <h4 className="text-xs font-extrabold text-amber-900 dark:text-amber-200 truncate w-full">{DUMMY_LEADERBOARD[0].name}</h4>
                <p className="text-xs font-black text-amber-600 mt-1"><AnimatedCounter value={DUMMY_LEADERBOARD[0].points} /> pt</p>
                <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full mt-1">
                  {DUMMY_LEADERBOARD[0].badgeTitle}
                </span>
              </div>

              {/* Rank 3 */}
              <div className="bg-orange-50/50 dark:bg-gray-800/50 border border-orange-200 dark:border-gray-700/60 rounded-2xl p-3 text-center flex flex-col items-center shadow-sm">
                <div className="relative mb-2">
                  <span className="text-3xl">{DUMMY_LEADERBOARD[2].avatar}</span>
                  <span className="absolute -bottom-2 -right-1 bg-orange-400 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">3</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate w-full">{DUMMY_LEADERBOARD[2].name}</h4>
                <p className="text-[11px] font-black text-amber-600 mt-1"><AnimatedCounter value={DUMMY_LEADERBOARD[2].points} /> pt</p>
              </div>
            </div>

            {/* Staggered Full Leaderboard List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2.5"
            >
              {DUMMY_LEADERBOARD.map((user) => {
                const isUser = user.rank === 5;
                return (
                  <motion.div
                    key={user.rank}
                    variants={itemVariants}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isUser
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20 shadow-md"
                        : "bg-gray-50/80 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 text-center font-black text-sm text-gray-500 dark:text-gray-400">
                        {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : `#${user.rank}`}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-xl shadow-sm border border-gray-200 dark:border-gray-600">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isUser ? "text-emerald-700 dark:text-emerald-300" : "text-gray-800 dark:text-gray-200"}`}>
                            {user.name}
                          </span>
                          {isUser && (
                            <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                              ANDA
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${user.badgeColor}`}>
                            {user.badgeTitle}
                          </span>
                          <span className="text-[10px] text-gray-400">• {user.totalKg} kg disetor</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-amber-600 dark:text-amber-400 block">
                        <AnimatedCounter value={user.points} />
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">Poin</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
