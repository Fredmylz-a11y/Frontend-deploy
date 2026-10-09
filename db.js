export const API_BASE = 'https://rhinoversebackend.vercel.app/api';
export const db = {
  fetchProducts: async () => {
    const r = await fetch(`${API_BASE}/products`);
    return r.json();
  }
};
