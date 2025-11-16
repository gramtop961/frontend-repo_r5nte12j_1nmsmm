import { Menu } from "lucide-react";
import { useState } from "react";

export default function Layout({ children, onLogout, user }) {
  const [open, setOpen] = useState(true);
  const menu = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Master Barang", key: "barang" },
    { label: "Master Supplier", key: "supplier" },
    { label: "Master Customer", key: "customer" },
    { label: "Pembelian", key: "pembelian" },
    { label: "Barang Masuk", key: "masuk" },
    { label: "Barang Keluar", key: "keluar" },
    { label: "Penjualan", key: "penjualan" },
    { label: "Laporan", key: "laporan" },
  ];
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`bg-white border-r ${open ? "w-64" : "w-16"} transition-all`}> 
        <div className="h-14 flex items-center justify-between px-3 border-b">
          <div className="font-bold text-blue-600">SAE Bakery</div>
          <button onClick={() => setOpen(!open)} className="p-2 hover:bg-slate-100 rounded">
            <Menu size={20} />
          </button>
        </div>
        <nav className="p-2 space-y-1">
          {menu.map((m) => (
            <a key={m.key} href={`#${m.key}`} className="block px-3 py-2 rounded hover:bg-blue-50 text-slate-700">{m.label}</a>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <header className="h-14 bg-white border-b flex items-center justify-between px-4">
          <div className="text-sm text-slate-500">{user?.name} • {user?.role}</div>
          <button onClick={onLogout} className="px-3 py-1.5 bg-blue-600 text-white rounded">Logout</button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
