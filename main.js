import * as auth from './auth.js';
import * as db from './db.js';
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const checkinBtn = document.getElementById('checkinBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const rechargeBtn = document.getElementById('rechargeBtn');
if (auth.getToken()) { switchPage('page-home'); loadProducts(); updateWallet(); } else switchPage('page-register');
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const res = await auth.registerUser(document.getElementById('regUsername').value, document.getElementById('regPhone').value, document.getElementById('regPassword').value, document.getElementById('regReferral').value);
    alert(res.message || 'Welcome!'); switchPage('page-home'); loadProducts(); updateWallet();
  } catch(err){ alert(err.message); }
});
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const res = await auth.loginUser(document.getElementById('loginPhone').value, document.getElementById('loginPassword').value);
    alert(res.message || 'Welcome back!'); switchPage('page-home'); loadProducts(); updateWallet();
  } catch(err){ alert(err.message); }
});
logoutBtn?.addEventListener('click', () => { auth.logoutUser(); switchPage('page-register'); });
checkinBtn?.addEventListener('click', async () => { try{ const res = await db.dailyCheckin(); alert(res.message); updateWallet(); }catch(e){ alert(e.message);} });
withdrawBtn?.addEventListener('click', async () => {
  const amount = prompt('Enter amount (min 5000 UGX):'); if (!amount) return;
  const phone = prompt('Phone number:');
  try{ const res = await db.requestWithdrawal(parseInt(amount), phone); alert(res.message); updateWallet(); }catch(e){ alert(e.message); }
});
rechargeBtn?.addEventListener('click', async () => {
  const amount = prompt('Enter amount to recharge:'); if (!amount) return;
  const phone = prompt('Your phone number:');
  try{ const res = await db.rechargeWallet(parseInt(amount), phone); alert(res.message); if (res.data?.redirectUrl) window.location.href = res.data.redirectUrl; updateWallet(); }catch(e){ alert(e.message); }
});
async function loadProducts() {
  try{ const res = await db.fetchProducts(); const products = res.data || res.products || res || []; const c=document.getElementById('productsContainer'); if(!c) return; c.innerHTML = products.map(p => `<div class="product-card"><h3>${p.name}</h3><p>${p.price} UGX</p><button onclick="purchaseProduct('${p.id || p._id}')">Buy</button></div>`).join(''); }catch(e){ console.log(e.message); }
}
async function updateWallet() {
  try{ const res = await db.getWallet(); const d = res.data || res.user || res; const r=document.getElementById('walletRecharge'); const w=document.getElementById('walletWithdraw'); if(r) r.textContent=(d.rechargeWallet?? d.balance?? 0)+' UGX'; if(w) w.textContent=(d.withdrawalWallet?? 0)+' UGX'; }catch(e){ console.log(e.message); }
}
window.purchaseProduct = async (id) => { try{ const res = await db.purchaseProduct(id); alert(res.message); updateWallet(); loadProducts(); }catch(e){ alert(e.message); } };
function switchPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); const t=document.getElementById(id); if(t) t.classList.add('active'); }
window.switchPage = switchPage;
