export type UserRole = "warga" | "kurir" | "admin";

export interface User {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
  full_name?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingItem {
  label: string;
  points: number;
  rupiah: number;
  desc: string;
}
