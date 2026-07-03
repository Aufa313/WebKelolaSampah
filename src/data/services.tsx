import React from "react";
import { Trash2, Leaf, Shield, Award } from "lucide-react";

export const services = [
  {
    title: "Pilah & Setor Sampah Kering",
    desc: "Konversikan sampah anorganik Anda (plastik, logam, kertas, botol kaca) menjadi poin digital dan uang tunai secara langsung.",
    icon: (
      <Trash2 className="w-5 h-5 text-current transition-colors duration-300" />
    ),
    tag: "Populer",
    points: "Hingga 350 pts/kg",
  },
  {
    title: "Layanan Kompos Subur Organik",
    desc: "Kami menjemput sisa makanan untuk diproses menjadi pupuk kompos berkualitas tinggi. Kembalikan nutrisi organik ke bumi pasif.",
    icon: (
      <Leaf className="w-5 h-5 text-current transition-colors duration-300" />
    ),
    tag: "Ekologis",
    points: "50 pts/kg",
  },
  {
    title: "Kemitraan Komersial B2B",
    desc: "Kustom program pengelolaan limbah perkantoran, perumahan elit, resort, dan pusat perbelanjaan dengan sertifikat pengelolaan hijau.",
    icon: (
      <Shield className="w-5 h-5 text-current transition-colors duration-300" />
    ),
    tag: "Sertifikasi",
    points: "Penawaran Khusus",
  },
  {
    title: "Jemput Elektronik Berbahaya",
    desc: "Disposal sisa komponen elektronik pintar, baterai litium, lampu pijar usang, dan kabel beracun dengan metode modern bebas polutan.",
    icon: (
      <Award className="w-5 h-5 text-current transition-colors duration-300" />
    ),
    tag: "High-Tech",
    points: "Hingga 450 pts/kg",
  },
];
