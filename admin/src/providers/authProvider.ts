import type { AuthProvider } from "react-admin";

const API = "/api";

// Remove any legacy bearer token left by the previous localStorage-based login.
if (typeof localStorage !== "undefined") localStorage.removeItem("norda_admin_token");

async function currentUser() {
  const response = await fetch(API + "/admin/auth/me", { credentials: "include" });
  if (!response.ok) throw new Error("Not authenticated");
  const payload = await response.json();
  return payload.user;
}

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    const response = await fetch(API + "/admin/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.user) throw new Error(payload.error || "Login failed");
  },
  async logout() {
    await fetch(API + "/admin/auth/logout", { method: "POST", credentials: "include" });
  },
  async checkAuth() {
    await currentUser();
  },
  async checkError(error) {
    if (error?.status === 401 || error?.status === 403) throw new Error("Session expired");
  },
  async getIdentity() {
    const user = await currentUser();
    return { id: user.id, fullName: user.username };
  },
  async getPermissions() {
    const user = await currentUser();
    return user?.role || "support";
  }
};