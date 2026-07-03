// Service layer connected to PHP/MySQL backend

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost/layanan-setor-sampah/backend";

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

    if (result.ok) {
      return {
        ok: true,
        data: {
          username: result.data.username,
          role: result.data.role,
        },
      };
    } else {
      return {
        ok: false,
        error: result.error || "Login failed",
      };
    }
  } catch (error) {
    console.error("API login error:", error);
    return {
      ok: false,
      error:
        "Network error or backend unavailable. Make sure XAMPP/MySQL is running and backend is accessible at " +
        API_URL,
    };
  }
}

export async function fetchPricing() {
  try {
    const response = await fetch(`${API_URL}/api.php/pricing`);
    if (!response.ok) throw new Error("Bad response");
    const result = await response.json();
    return { ok: true, data: result.data };
  } catch (e) {
    console.warn("Pricing fetch failed, using fallback:", e);
    // fallback: import local data
    const mod = await import("../data/pricing");
    return { ok: true, data: mod.pricingData };
  }
}

export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${API_URL}/api.php/leaderboard`);
    if (!response.ok) throw new Error("Bad response");
    const result = await response.json();
    return {
      ok: true,
      data: { weekly: result.data.weekly, monthly: result.data.monthly },
    };
  } catch (e) {
    console.warn("Leaderboard fetch failed, using fallback:", e);
    // fallback: import local data
    const mod = await import("../data/leaderboard");
    return {
      ok: true,
      data: { weekly: mod.weeklyLeaderboard, monthly: mod.monthlyLeaderboard },
    };
  }
}
