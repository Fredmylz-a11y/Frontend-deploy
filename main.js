// Rhinoverse Main - Renders 7 products + 7 nav buttons
import { fetchProducts, apiCall, API_BASE } from "./db.js";
const $ = id => document.getElementById(id);
const fmt = n => Number(n||0).toLocaleString();

async function loadProducts(){
  const container = $("homeProductsContainer");
  if(!container){ console.error("homeProductsContainer missing"); return; }
  container.innerHTML = '<div style="padding:20px;color:#9a9188">🦏 Loading 7 products from '+API_BASE+'...</div>';
  try{
    const raw = await fetchProducts();
    const products = Array.isArray(raw) ? raw : (raw.data || raw.products || []);
    console.log("✅ PRODUCTS LOADED:", products.length, products);
    if(!products.length) throw new Error("Backend returned 0 products");
    container.innerHTML = products.map(p=>`
      <div class="product">
        <div>
          <div style="font-weight:700">${p.name} ${p.badge?`<span style="border:1px solid #d4af37;color:#d4af37;padding:2px 6px;border-radius:999px;font-size:.6rem">${p.badge}</span>`:''}</div>
          <div style="font-size:.8rem;color:#9a9188">${fmt(p.price)} UGX • ${fmt(p.dailyIncome)}/day • ${p.cycleDays}d</div>
          <div style="font-size:.85rem;color:#f5d547;font-weight:600">Total ${fmt(p.totalIncome||p.dailyIncome*p.cycleDays)} UGX</div>
        </div>
        <button class="buy-btn" data-id="${p.id}" style="background:linear-gradient(135deg,#d4af37,#f5d547);border:none;border-radius:.8rem;padding:10px 16px;font-weight:800;cursor:pointer">BUY</button>
      </div>
    `).join('');
    // Bind BUY buttons
    document.querySelectorAll('.buy-btn').forEach(btn=>{
      btn.onclick = async()=>{
        const id = btn.dataset.id;
        btn.textContent='...';
        try{
          const r = await apiCall('/orders','POST',{productId:Number(id)});
          alert('✅ Purchased! '+JSON.stringify(r).slice(0,100));
        }catch(e){ alert('Login required: '+e.message); }
        btn.textContent='BUY';
      };
    });
  }catch(e){
    console.error(e);
    container.innerHTML = `<div style="color:#ff6b6b;padding:16px;border:1px solid #ff6b6b66;border-radius:1rem">❌ ${e.message}<br><small>${API_BASE}/products</small><br><button class="btn" style="margin-top:8px" onclick="location.reload()">Retry</button></div>`;
  }
}

function initNav(){
  const items = document.querySelectorAll('.nav-item[data-tab]');
  console.log("Nav buttons found:", items.length, "(should be 5+2=7)");
  items.forEach(item=>{
    item.addEventListener('click',()=>{
      const tab = item.dataset.tab;
      document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
      document.querySelectorAll('.nav-item[data-tab]').forEach(n=>n.classList.remove('active'));
      const target = document.getElementById(tab+'Page');
      if(target) target.classList.add('active');
      item.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  console.log("Rhinoverse boot - API:", API_BASE);
  loadProducts();
  initNav();
});
