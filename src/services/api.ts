const API_URL = "http://localhost/layanan-setor-sampah/backend";

export async function login(username: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/api.php/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API login error:", error);
    return {
      ok: false,
      error: "Network error",
      user: null
    };
  }
}

export async function fetchPricing() {
  try {
    const response = await fetch(`${API_URL}/api.php/pricing`);
    if (!response.ok) {
      throw new Error("Failed to fetch pricing");
    }
    const result = await response.json();
    return { ok: true, data: result.data };
  } catch (error) {
    console.error("API fetchPricing error:", error);
    return { ok: false, error: "Network error", data: [] };
  }
}

export async function updatePricing(
  id: string,
  data: {
    pricePerKg: number;
    trend: string;
  }
) {
  try {
    const response = await fetch(`${API_URL}/api.php/pricing`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...data }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API updatePricing error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function fetchPickups(params?: { user_id?: number; courier_id?: number }) {
  try {
    let url = `${API_URL}/api.php/pickups`;
    if (params) {
      const q = new URLSearchParams();
      if (params.user_id) q.append("user_id", String(params.user_id));
      if (params.courier_id) q.append("courier_id", String(params.courier_id));
      url += `?${q.toString()}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch pickups");
    const result = await response.json();
    return { ok: true, data: result.data };
  } catch (error) {
    console.error("API fetchPickups error:", error);
    return { ok: false, error: "Network error", data: [] };
  }
}

export async function createPickup(data: {
  user_id: number;
  waste_category: string;
  estimated_weight: number;
  pickup_address: string;
  pickup_date?: string;
  pickup_time_slot?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/api.php/pickups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API createPickup error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function updatePickup(id: number, data: {
  assigned_courier_id?: number | null;
  status?: string;
  actual_weight?: number;
  notes?: string;
  pickup_date?: string;
  pickup_time_slot?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/api.php/pickups`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...data }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API updatePickup error:", error);
    return { ok: false, error: "Network error" };
  }
}

// --- Transactions ---

export async function fetchTransactions(userId: number) {
  try {
    const response = await fetch(`${API_URL}/api.php/transactions?user_id=${userId}`);
    if (!response.ok) throw new Error("Gagal mengambil transaksi");
    return await response.json();
  } catch (err) {
    console.error("fetchTransactions error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// --- Leaderboard ---

export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${API_URL}/api.php/leaderboard`);
    if (!response.ok) throw new Error("Gagal mengambil leaderboard");
    return await response.json();
  } catch (err) {
    console.error("fetchLeaderboard error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// --- Admin Stats ---

export async function fetchStats() {
  try {
    const response = await fetch(`${API_URL}/api.php/stats`);
    if (!response.ok) throw new Error("Gagal mengambil statistik");
    return await response.json();
  } catch (err) {
    console.error("fetchStats error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// --- Withdrawals ---

export async function fetchWithdrawals(userId?: number) {
  try {
    const url = userId 
      ? `${API_URL}/api.php/withdrawals?user_id=${userId}` 
      : `${API_URL}/api.php/withdrawals`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil daftar pencairan");
    return await response.json();
  } catch (err) {
    console.error("fetchWithdrawals error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function requestWithdrawal(userId: number, amount: number, type: "Uang" | "Sembako") {
  try {
    const response = await fetch(`${API_URL}/api.php/withdrawals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, amount, withdrawal_type: type })
    });
    if (!response.ok) throw new Error("Gagal mengajukan pencairan");
    return await response.json();
  } catch (err) {
    console.error("requestWithdrawal error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function updateWithdrawal(id: number, status: "Disetujui" | "Ditolak") {
  try {
    const response = await fetch(`${API_URL}/api.php/withdrawals`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    if (!response.ok) throw new Error("Gagal memproses pencairan");
    return await response.json();
  } catch (err) {
    console.error("updateWithdrawal error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// --- Notifications ---

export async function fetchNotifications(userId: number) {
  try {
    const response = await fetch(`${API_URL}/api.php/notifications?user_id=${userId}`);
    if (!response.ok) throw new Error("Gagal mengambil notifikasi");
    return await response.json();
  } catch (err) {
    console.error("fetchNotifications error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err), data: [] };
  }
}

export async function createNotification(userId: number, title: string, message: string) {
  try {
    const response = await fetch(`${API_URL}/api.php/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, title, message })
    });
    if (!response.ok) throw new Error("Gagal membuat notifikasi");
    return await response.json();
  } catch (err) {
    console.error("createNotification error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function markNotificationRead(id?: number, userId?: number) {
  try {
    const response = await fetch(`${API_URL}/api.php/notifications`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, user_id: userId })
    });
    if (!response.ok) throw new Error("Gagal memperbarui status notifikasi");
    return await response.json();
  } catch (err) {
    console.error("markNotificationRead error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

