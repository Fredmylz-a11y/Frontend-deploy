export const API_BASE = "https://rhinoversebackend.vercel.app/api";
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
export async function fetchProducts(){
  const res = await fetch(`${API_BASE}/products`);
  if(!res.ok) throw new Error("Failed fetch products");
  return await res.json();
}
