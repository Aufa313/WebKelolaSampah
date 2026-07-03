import React from "react";
import DashboardLogin from "./DashboardLogin";

interface LoginCardProps {
  onBack: () => void;
  onLoginSuccess: (username: string, role: "warga" | "admin" | "kurir") => void;
}

export default function LoginCard({ onBack, onLoginSuccess }: LoginCardProps) {
  return <DashboardLogin onBack={onBack} onLoginSuccess={onLoginSuccess} />;
}
