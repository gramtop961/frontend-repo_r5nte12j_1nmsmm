import { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || 'Login gagal');
      localStorage.setItem('token', data.access_token);
      onLogin({ email });
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
      <form onSubmit={submit} className="bg-white w-full max-w-sm p-6 rounded-lg shadow border">
        <h1 className="text-xl font-semibold mb-1">Masuk ke SAE Bakery</h1>
        <p className="text-slate-500 text-sm mb-4">Gunakan akun admin/staff</p>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <label className="block text-sm mb-1">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2 mb-3" placeholder="admin@sae-bakery.local" />
        <label className="block text-sm mb-1">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2 mb-4" placeholder="••••••" />
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium">{loading? 'Memproses...' : 'Masuk'}</button>
        <p className="text-xs text-slate-500 mt-3">Default admin: admin@sae-bakery.local / admin123</p>
      </form>
    </div>
  );
}
