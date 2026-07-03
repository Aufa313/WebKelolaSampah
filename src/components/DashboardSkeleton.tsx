import React from "react";

interface DashboardSkeletonProps {
  role?: "warga" | "admin";
}

export default function DashboardSkeleton({ role = "warga" }: DashboardSkeletonProps) {
  if (role === "admin") {
    return (
      <div className="w-full animate-pulse space-y-8 text-left" id="dashboard-admin-skeleton">
        {/* 1. Header Admin Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 bg-slate-250 rounded-lg w-52"></div>
              <div className="h-5 bg-amber-200/60 rounded-full w-20"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded-md w-96 max-w-full"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="space-y-1 text-right hidden sm:block">
              <div className="h-3.5 bg-slate-200 rounded w-24"></div>
              <div className="h-4 bg-slate-300 rounded w-40"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-28 shrink-0"></div>
          </div>
        </div>

        {/* 2. Anti-fraud Warning Alert Placeholder */}
        <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-start space-x-4">
          <div className="w-10 h-10 bg-rose-200 rounded-xl shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-rose-200 rounded w-1/3"></div>
            <div className="h-3.5 bg-rose-150 rounded w-3/4"></div>
          </div>
        </div>

        {/* 3. Recharts Analisis Tren & Komposisi Grid Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bar Chart skeleton */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 bg-slate-300 rounded w-44"></div>
                <div className="h-3 bg-slate-200 rounded w-28"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-3.5 bg-slate-250 rounded w-10"></div>
                <div className="h-3.5 bg-slate-250 rounded w-10"></div>
                <div className="h-3.5 bg-slate-250 rounded w-10"></div>
              </div>
            </div>
            <div className="h-56 bg-slate-200/80 rounded-lg w-full flex items-end justify-between p-4">
              <div className="h-32 bg-slate-300 w-12 rounded"></div>
              <div className="h-44 bg-slate-300 w-12 rounded"></div>
              <div className="h-28 bg-slate-300 w-12 rounded"></div>
              <div className="h-48 bg-slate-300 w-12 rounded"></div>
              <div className="h-36 bg-slate-300 w-12 rounded"></div>
            </div>
          </div>

          {/* Pie Chart skeleton */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="h-4 bg-slate-300 rounded w-52 mb-1"></div>
              <div className="h-3 bg-slate-200 rounded w-40"></div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="h-28 w-28 rounded-full border-12 border-slate-300 flex items-center justify-center">
                <div className="h-10 bg-slate-200 rounded w-12"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-white border border-slate-200 rounded-xl w-full"></div>
              <div className="h-5 bg-white border border-slate-200 rounded-xl w-full"></div>
            </div>
          </div>
        </div>

        {/* 4. Buku Kas & Financial ledger scorecard placeholder */}
        <div className="pb-4 border-b border-slate-100">
          <div className="h-5 bg-slate-350 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-96 max-w-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl space-y-3">
            <div className="h-3.5 bg-emerald-250 rounded w-24"></div>
            <div className="h-7 bg-emerald-350 rounded w-36"></div>
          </div>
          <div className="h-24 bg-rose-50/30 border border-rose-105 p-4 rounded-xl space-y-3">
            <div className="h-3.5 bg-rose-250 rounded w-24"></div>
            <div className="h-7 bg-rose-350 rounded w-36"></div>
          </div>
          <div className="h-24 bg-slate-100/50 border border-slate-200 p-4 rounded-xl space-y-3">
            <div className="h-3.5 bg-slate-350 rounded w-24"></div>
            <div className="h-7 bg-slate-400 rounded w-36"></div>
          </div>
          <div className="h-24 bg-blue-50/40 border border-blue-105 p-4 rounded-xl space-y-3">
            <div className="h-3.5 bg-blue-250 rounded w-24"></div>
            <div className="h-7 bg-blue-350 rounded w-36"></div>
          </div>
        </div>

        {/* 5. Two Column Grid for ledger books */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-5 bg-slate-300 rounded w-40"></div>
            <div className="bg-white border border-slate-200 rounded-xl h-44 w-full"></div>
          </div>
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 h-44 space-y-3">
            <div className="h-4 bg-slate-300 rounded w-32"></div>
            <div className="h-8 bg-white border border-slate-200 rounded-xl w-full"></div>
            <div className="h-8 bg-white border border-slate-200 rounded-xl w-full"></div>
          </div>
        </div>

      </div>
    );
  }

  // Fallback to Citizen skeleton layout
  return (
    <div className="w-full animate-pulse space-y-8" id="dashboard-skeleton">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
        <div className="space-y-2 w-full max-w-xs">
          <div className="h-7 bg-slate-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-32 shrink-0"></div>
      </div>

      {/* 2. Top Stats Grid Skeleton (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 (Main Card replica) */}
        <div className="h-44 bg-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-3.5 bg-slate-300 rounded-sm w-1/2"></div>
            <div className="h-8 bg-slate-300 rounded-md w-3/4"></div>
          </div>
          <div className="h-9 bg-slate-300 rounded-xl w-1/3 mt-4"></div>
        </div>

        {/* Card 2 */}
        <div className="h-44 bg-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-3.5 bg-slate-300/80 rounded-sm w-1/3"></div>
            <div className="h-8 bg-slate-300/80 rounded-md w-1/2"></div>
          </div>
          <div className="h-5 bg-slate-350 rounded-sm w-2/3"></div>
        </div>

        {/* Card 3 */}
        <div className="h-44 bg-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-3.5 bg-slate-300/80 rounded-sm w-1/2"></div>
            <div className="h-8 bg-slate-300/80 rounded-md w-2/3"></div>
          </div>
          <div className="h-6 bg-slate-300 rounded-full w-24"></div>
        </div>
      </div>

      {/* 3. Transaction Summary Panel Skeleton */}
      <div className="bg-slate-200 rounded-2xl h-16 w-full"></div>

      {/* 4. Table Skeleton */}
      <div className="space-y-4">
        <div className="h-5 bg-slate-200 rounded-md w-1/4"></div>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Table Header mock */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-150 flex justify-between gap-4">
            <div className="h-4 bg-slate-200 rounded-sm w-16"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-24"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-12"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-20"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-16"></div>
          </div>
          {/* Table Rows mock */}
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="px-6 py-5 flex justify-between gap-4">
                <div className="h-4 bg-slate-200 rounded-sm w-20"></div>
                <div className="h-4 bg-slate-200/80 rounded-sm w-28"></div>
                <div className="h-4 bg-slate-250 rounded-sm w-10"></div>
                <div className="h-4 bg-slate-200 rounded-sm w-16"></div>
                <div className="h-5 bg-slate-200 rounded-full w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
