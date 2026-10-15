// firebase.js - kept for compatibility, now bridges to real backend (Postgres)
// Old admin.html referenced this, now it safely uses db.js underneath
import { API_BASE, apiCall, fetchProducts } from "./db.js";
console.log("firebase.js shim loaded -> using Postgres backend:", API_BASE);

// Export same names old code expected, so nothing breaks
export const db = { apiCall, fetchProducts };
export const auth = { getToken: () => localStorage.getItem("token") };
export { API_BASE, apiCall, fetchProducts };

// If old code does firebase.firestore() etc, give empty mock to prevent crash
export default { db, auth };
