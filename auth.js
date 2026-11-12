import { API_BASE } from './db.js';
export function getToken() { return localStorage.getItem('token'); }
export async function registerUser(username, phone, password, referral) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, phone, password, referrer: referral })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Register failed');
  if (data.token) localStorage.setItem('token', data.token);
  return data;
}
export async function loginUser(phone, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  if (data.token) localStorage.setItem('token', data.token);
  return data;
}
export function logoutUser() { localStorage.removeItem('token'); }
