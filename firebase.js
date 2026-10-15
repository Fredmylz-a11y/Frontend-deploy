// firebase.js kept for backward compatibility
// Old code referenced Firebase, now it points to Postgres backend safely
import { API_BASE, apiCall, fetchProducts } from "./db.js";
console.log("firebase.js shim -> Postgres backend:", API_BASE);
export const db = { apiCall, fetchProducts };
export const auth = { getToken: () => localStorage.getItem("token") };
export { API_BASE, apiCall, fetchProducts };
export default { db, auth };
