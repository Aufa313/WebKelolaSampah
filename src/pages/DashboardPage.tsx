import React from "react";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import LoginCard from "../components/dashboard/LoginCard";
import DashboardAdmin from "../components/dashboard/DashboardAdmin";
import DashboardKurir from "../components/dashboard/DashboardKurir";
import DashboardWarga from "../components/dashboard/DashboardWarga";

interface DashboardPageProps {
  isLoggedIn: boolean;
  userRole: "warga" | "admin" | "kurir";
  dashboardLoading: boolean;
  authenticatedUser: string;
  onLoginSuccess: (username: string, role: "warga" | "admin" | "kurir") => void;
  onCloseDashboard: () => void;
}

export default function DashboardPage({
  isLoggedIn,
  userRole,
  dashboardLoading,
  authenticatedUser,
  onLoginSuccess,
  onCloseDashboard,
}: DashboardPageProps) {
  if (!isLoggedIn) {
    return (
      <div className="pt-12 pb-20">
        <LoginCard
          onBack={onCloseDashboard}
          onLoginSuccess={onLoginSuccess}
        />
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <DashboardSkeleton role={userRole} />
      </div>
    );
  }

  if (userRole === "admin") {
    return (
      <div className="pt-8 animate-fade-in">
        <DashboardAdmin
          onBack={onCloseDashboard}
          adminEmail={authenticatedUser || "admin"}
        />
      </div>
    );
  }

  if (userRole === "kurir") {
    return (
      <div className="pt-8 animate-fade-in">
        <DashboardKurir
          onBack={onCloseDashboard}
          courierEmail={authenticatedUser || "kurir"}
        />
      </div>
    );
  }

  return (
    <div className="pt-8 w-full">
      <DashboardWarga onBack={onCloseDashboard} />
    </div>
  );
}
