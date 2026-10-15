import { apiCall } from "./db.js";
export async function login(phone,password){
  const data = await apiCall("/auth/login","POST",{phone,password});
  if(data.token) localStorage.setItem("token",data.token);
  if(data.user) localStorage.setItem("user",JSON.stringify(data.user));
  return data;
}
export async function register(phone,password){
  return await apiCall("/auth/register","POST",{phone,password});
}
export function getToken(){return localStorage.getItem("token")}
export function logout(){localStorage.removeItem("token");localStorage.removeItem("user");location.reload()}
