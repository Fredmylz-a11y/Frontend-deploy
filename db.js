export const API_BASE = 'https://rhinoversebackend.vercel.app/api';
function getHeaders() {
  const token = localStorage.getItem('token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}
export const db = {
  fetchProducts: async () => {
    const r = await fetch(`${API_BASE}/products?t=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) throw new Error('Failed to load products');
    const data = await r.json();
    return Array.isArray(data) ? data : (data.products || data.data || []);
  },
  getWallet: async () => {
    let r = await fetch(`${API_BASE}/wallet/balance`, { headers: getHeaders(), cache: 'no-store' });
    if (r.ok) {
      const d = await r.json();
      return d.wallets || d.data || d;
    }
    r = await fetch(`${API_BASE}/user`, { headers: getHeaders(), cache: 'no-store' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed wallet');
    return data.wallets || data;
  },
  getUser: async () => {
    const r = await fetch(`${API_BASE}/user`, { headers: getHeaders(), cache: 'no-store' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    return data;
  },
  purchaseProduct: async (productId) => {
    const r = await fetch(`${API_BASE}/buy`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ productId: Number(productId) })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Buy failed');
    return data;
  },
  dailyCheckin: async () => {
    const r = await fetch(`${API_BASE}/checkin`, { method: 'POST', headers: getHeaders() });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Checkin failed');
    return data;
  },
  requestWithdrawal: async (amount, phone) => { return { message: `Withdraw ${amount} to ${phone} requested` }; },
  rechargeWallet: async (amount, phone) => { return { message: `Recharge ${amount} from ${phone} initiated` }; },
  getTeam: async () => {
    const r = await fetch(`${API_BASE}/team`, { headers: getHeaders(), cache: 'no-store' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    return data;
  }
};
