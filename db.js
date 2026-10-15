// Rhinoverse DB - Vercel Postgres Backend
// This is the ONLY backend connection - no Firebase
export const API_BASE = "https://rhinoversebackend.vercel.app/api";

// Generic API caller with JWT support
export async function apiCall(path, method="GET", body=null){
  const token = localStorage.getItem("token");
  const headers = {"Content-Type":"application/json"};
  if(token) headers["Authorization"] = `Bearer ${token}`;
  const opts = {method, headers};
  if(body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||data.message||`API ${res.status}`);
  return data;
}

// Fetch all 7 products
export async function fetchProducts(){
  const res = await fetch(`${API_BASE}/products`);
  if(!res.ok) throw new Error("Failed fetch products");
  const json = await res.json();
  return json; // can be array or {data:[]}
}
