import * as auth from './auth.js';
import { db, API_BASE } from './db.js';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const checkinBtn = document.getElementById('checkinBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const rechargeBtn = document.getElementById('rechargeBtn');

if (auth.getToken()) { 
  switchPage('page-home'); 
  loadProducts(); 
  updateWallet(); 
} else {
  switchPage('page-register');
}

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const username = document.getElementById('regUsername').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const referralEl = document.getElementById('regReferral') || document.getElementById('referral');
    const referral = referralEl ? referralEl.value.trim() : '';
    if (!username || !phone || !password) throw new Error('Fill all fields');
    const res = await auth.registerUser(username, phone, password, referral);
    alert(res.message || 'Welcome! 3000 UGX bonus added');
    switchPage('page-home'); 
    loadProducts(); 
    updateWallet();
  } catch(err){ alert(err.message); }
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;
    const res = await auth.loginUser(phone, password);
    alert(res.message || 'Welcome back!'); 
    switchPage('page-home'); 
    loadProducts(); 
    updateWallet();
  } catch(err){ alert(err.message); }
});

logoutBtn?.addEventListener('click', () => { auth.logoutUser(); switchPage('page-register'); });

checkinBtn?.addEventListener('click', async () => { 
  try{ 
    const res = await db.dailyCheckin(); 
    alert(`Check-in success! Earned ${res.earned || 0} UGX`); 
    updateWallet(); 
  }catch(e){ alert(e.message);} 
});

withdrawBtn?.addEventListener('click', async () => {
  const amount = prompt('Enter withdrawal amount (minimum 1000 UGX):'); if (!amount) return;
  if (!Number.isFinite(Number(amount)) || Number(amount) < 1000) { alert('Minimum withdrawal is 1000 UGX'); return; }
  try { const res = await db.requestWithdrawal(Number(amount)); alert(res.message || 'Withdrawal request submitted'); updateWallet(); } catch(e) { alert(e.message); }
});

rechargeBtn?.addEventListener('click', async () => {
  const amount = prompt('Enter recharge amount in UGX (minimum 500):'); if (!amount) return;
  const phone = prompt('Enter your Uganda mobile-money number (e.g. +2567XXXXXXXX):'); if (!phone) return;
  try { const res = await db.rechargeWallet(Number(amount), phone.trim()); alert(res.message || 'MARZ Pay prompt sent. Approve it on your phone.'); } catch(e) { alert(e.message); }
});

async function loadProducts() {
  try{ 
    const res = await db.fetchProducts(); 
    // backend returns array directly
    const products = Array.isArray(res) ? res : (res.data || res.products || []);
    console.log('Products loaded:', products.length);
    const c = document.getElementById('productsContainer'); 
    if(!c) { console.log('No productsContainer found'); return; } 
    if (products.length === 0) {
      c.innerHTML = '<p>No products found</p>';
      return;
    }
    c.innerHTML = products.map(p => `
      <div class="product-card" style="border:1px solid #ddd;padding:12px;margin:8px;border-radius:8px">
        <h3>${p.name}</h3>
        <p>Price: ${p.price.toLocaleString()} UGX</p>
        <p>Daily: ${p.dailyIncome.toLocaleString()} UGX x ${p.cycleDays} days</p>
        <p>Total: ${(p.totalIncome || p.dailyIncome* p.cycleDays).toLocaleString()} UGX</p>
        <button onclick="purchaseProduct('${p.id}')" style="background:#f5c518;padding:8px 16px;border:none;border-radius:4px;font-weight:bold">Buy - ${p.price} UGX</button>
      </div>
    `).join(''); 
  }catch(e){ console.error('Load products error', e); }
}

async function updateWallet() {
  try{ 
    const data = await db.getWallet(); 
    console.log('Wallet data:', data);
    // backend user has wallets: { recharge, withdrawal }
    const wallets = data.wallets || data;
    const rechargeVal = wallets.recharge ?? wallets.rechargeWallet ?? wallets.balance ?? 0;
    const withdrawVal = wallets.withdrawal ?? wallets.withdrawalWallet ?? 0;
    const rEl = document.getElementById('walletRecharge'); 
    const wEl = document.getElementById('walletWithdraw'); 
    if(rEl) rEl.textContent = rechargeVal.toLocaleString() + ' UGX'; 
    if(wEl) wEl.textContent = withdrawVal.toLocaleString() + ' UGX'; 
    // also update any other wallet displays
    document.querySelectorAll('[data-wallet="recharge"]').forEach(el => el.textContent = rechargeVal.toLocaleString() + ' UGX');
    document.querySelectorAll('[data-wallet="withdraw"]').forEach(el => el.textContent = withdrawVal.toLocaleString() + ' UGX');
  }catch(e){ console.log('Wallet error', e.message); }
}

window.purchaseProduct = async (id) => { 
  try{ 
    if(!confirm(`Buy product ${id}?`)) return;
    const res = await db.purchaseProduct(id); 
    alert(res.message || 'Purchased!'); 
    updateWallet(); 
  }catch(e){ alert(e.message); } 
};

function switchPage(id) { 
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); 
  const t=document.getElementById(id); 
  if(t) t.classList.add('active'); 
}
window.switchPage = switchPage;

// Auto load if logged in
window.loadProducts = loadProducts;
window.updateWallet = updateWallet;
