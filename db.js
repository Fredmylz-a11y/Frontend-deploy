export const API_BASE = 'https://rhinoversebackend.vercel.app/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export const db = {
  fetchProducts: async () => {
    const r = await fetch(`${API_BASE}/products`);
    if (!r.ok) throw new Error('Failed to load products');
    return r.json(); // returns array of 7
  },
  getWallet: async () => {
    const r = await fetch(`${API_BASE}/user`, { headers: getHeaders() });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed wallet');
    return data; // contains wallets
  },
  getUser: async () => {
    const r = await fetch(`${API_BASE}/user`, { headers: getHeaders() });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    return data;
  },
  purchaseProduct: async (productId) => {
    const r = await fetch(`${API_BASE}/buy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId: Number(productId) })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Buy failed');
    return data;
  },
  dailyCheckin: async () => {
    const r = await fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Checkin failed');
    return data;
  },
  requestWithdrawal: async (amount, phone) => {
    // Placeholder - add withdraw endpoint later
    return { message: `Withdraw ${amount} to ${phone} requested (coming soon)` };
  },
  rechargeWallet: async (amount, phone) => {
    // Placeholder - add recharge endpoint later
    return { message: `Recharge ${amount} from ${phone} initiated (coming soon)` };
  },
  getTeam: async () => {
    const r = await fetch(`${API_BASE}/team`, { headers: getHeaders() });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    return data;
  }
};
