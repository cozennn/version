import type { DataProvider } from "react-admin";

const API = "/api";

export async function adminRequest(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const response = await fetch(API + path, { ...init, headers, credentials: "include" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) window.location.reload();
    throw Object.assign(new Error(payload.error || "Request failed"), { status: response.status });
  }
  return payload;
}

export const dataProvider: DataProvider = {
  async getList(resource, params) {
    const pagination = params.pagination || { page: 1, perPage: 25 };
    const sort = params.sort || { field: "created_at", order: "DESC" };
    const query = new URLSearchParams({ page: String(pagination.page), perPage: String(pagination.perPage), sort: String(sort.field), order: String(sort.order) });
    if (params.filter?.q) query.set("q", String(params.filter.q));
    return adminRequest("/admin/" + resource + "?" + query).then(result => ({ data: result.data || [], total: result.total || 0 }));
  },
  async getOne(resource, params) {
    const result = await adminRequest("/admin/" + resource + "/" + encodeURIComponent(String(params.id)));
    return { data: result.data || result };
  },
  async getMany(resource, params) {
    const query = new URLSearchParams({ ids: params.ids.join(",") });
    const result = await adminRequest("/admin/" + resource + "?" + query);
    return { data: result.data || [] };
  },
  async getManyReference(resource, params) {
    const pagination = params.pagination || { page: 1, perPage: 25 };
    const query = new URLSearchParams({ page: String(pagination.page), perPage: String(pagination.perPage), [params.target]: String(params.id) });
    const result = await adminRequest("/admin/" + resource + "?" + query);
    return { data: result.data || [], total: result.total || 0 };
  },
  async create(resource, params) {
    const result = await adminRequest("/admin/" + resource, { method: "POST", body: JSON.stringify(params.data) });
    return { data: result.data || result };
  },
  async update(resource, params) {
    const result = await adminRequest("/admin/" + resource + "/" + encodeURIComponent(String(params.id)), { method: "POST", body: JSON.stringify(params.data) });
    return { data: result.data || result };
  },
  async updateMany(resource, params) {
    await Promise.all(params.ids.map(id => adminRequest("/admin/" + resource + "/" + encodeURIComponent(String(id)), { method: "POST", body: JSON.stringify(params.data) })));
    return { data: params.ids };
  },
  async delete(resource, params) {
    const result = await adminRequest("/admin/" + resource + "/" + encodeURIComponent(String(params.id)) + "/delete", { method: "POST", body: "{}" });
    return { data: result.data || { id: params.id } };
  },
  async deleteMany(resource, params) {
    await Promise.all(params.ids.map(id => adminRequest("/admin/" + resource + "/" + encodeURIComponent(String(id)) + "/delete", { method: "POST", body: "{}" })));
    return { data: params.ids };
  }
};