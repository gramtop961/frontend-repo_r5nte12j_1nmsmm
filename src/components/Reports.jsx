import { useEffect, useState } from "react";
const API = import.meta.env.VITE_BACKEND_URL || "";

function Section({ title, children }){
  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
}

export default function Reports(){
  const token = localStorage.getItem('token');
  const [pembelian, setPembelian] = useState([]);
  const [masuk, setMasuk] = useState([]);
  const [keluar, setKeluar] = useState([]);
  const [penjualan, setPenjualan] = useState([]);
  const [stok, setStok] = useState([]);
  const [filters, setFilters] = useState({ tanggal: '', supplier: '', nama: '', customer: '' });

  const fetcher = async (url, setter)=>{ const r = await fetch(`${API}${url}&token=${token}`); const d = await r.json(); setter(d); };

  return (
    <div>
      <Section title="Laporan Pembelian">
        <div className="flex gap-2 mb-2">
          <input type="date" value={filters.tanggal} onChange={e=>setFilters({...filters, tanggal:e.target.value})} className="border rounded px-2 py-1"/>
          <input placeholder="Kode Supplier" value={filters.supplier} onChange={e=>setFilters({...filters, supplier:e.target.value})} className="border rounded px-2 py-1"/>
          <button onClick={()=>fetcher(`/api/laporan/pembelian?tanggal=${filters.tanggal}&supplier=${filters.supplier}`, setPembelian)} className="px-3 py-1.5 bg-slate-800 text-white rounded">Terapkan</button>
        </div>
        <table className="w-full text-sm border">
          <thead><tr className="bg-slate-50"><th className="p-2 text-left">No Faktur</th><th className="p-2 text-left">Tanggal</th><th className="p-2 text-left">Supplier</th><th className="p-2 text-right">Grand Total</th></tr></thead>
          <tbody>
            {pembelian.map((p,i)=> <tr key={i} className="border-t"><td className="p-2">{p.nomor_faktur}</td><td className="p-2">{p.tanggal}</td><td className="p-2">{p.kode_supplier}</td><td className="p-2 text-right">{(p.grand_total||0).toLocaleString()}</td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="Laporan Barang Masuk">
        <div className="flex gap-2 mb-2">
          <input type="date" value={filters.tanggal} onChange={e=>setFilters({...filters, tanggal:e.target.value})} className="border rounded px-2 py-1"/>
          <input placeholder="Nama" value={filters.nama} onChange={e=>setFilters({...filters, nama:e.target.value})} className="border rounded px-2 py-1"/>
          <button onClick={()=>fetcher(`/api/laporan/barang-masuk?tanggal=${filters.tanggal}&nama=${filters.nama}`, setMasuk)} className="px-3 py-1.5 bg-slate-800 text-white rounded">Terapkan</button>
        </div>
        <table className="w-full text-sm border">
          <thead><tr className="bg-slate-50"><th className="p-2 text-left">Tanggal</th><th className="p-2 text-left">Nama</th><th className="p-2 text-left">Kode</th><th className="p-2 text-left">Qty</th></tr></thead>
          <tbody>
            {masuk.map((p,i)=> <tr key={i} className="border-t"><td className="p-2">{p.tanggal}</td><td className="p-2">{p.nama_barang}</td><td className="p-2">{p.kode_barang}</td><td className="p-2">{p.qty}</td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="Laporan Barang Keluar">
        <div className="flex gap-2 mb-2">
          <input type="date" value={filters.tanggal} onChange={e=>setFilters({...filters, tanggal:e.target.value})} className="border rounded px-2 py-1"/>
          <input placeholder="Nama" value={filters.nama} onChange={e=>setFilters({...filters, nama:e.target.value})} className="border rounded px-2 py-1"/>
          <button onClick={()=>fetcher(`/api/laporan/barang-keluar?tanggal=${filters.tanggal}&nama=${filters.nama}`, setKeluar)} className="px-3 py-1.5 bg-slate-800 text-white rounded">Terapkan</button>
        </div>
        <table className="w-full text-sm border">
          <thead><tr className="bg-slate-50"><th className="p-2 text-left">Tanggal</th><th className="p-2 text-left">Nama</th><th className="p-2 text-left">Kode</th><th className="p-2 text-left">Qty</th></tr></thead>
          <tbody>
            {keluar.map((p,i)=> <tr key={i} className="border-t"><td className="p-2">{p.tanggal}</td><td className="p-2">{p.nama_barang}</td><td className="p-2">{p.kode_barang}</td><td className="p-2">{p.qty}</td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="Laporan Penjualan">
        <div className="flex gap-2 mb-2">
          <input type="date" value={filters.tanggal} onChange={e=>setFilters({...filters, tanggal:e.target.value})} className="border rounded px-2 py-1"/>
          <input placeholder="Kode Customer" value={filters.customer} onChange={e=>setFilters({...filters, customer:e.target.value})} className="border rounded px-2 py-1"/>
          <button onClick={()=>fetcher(`/api/laporan/penjualan?tanggal=${filters.tanggal}&customer=${filters.customer}`, setPenjualan)} className="px-3 py-1.5 bg-slate-800 text-white rounded">Terapkan</button>
        </div>
        <table className="w-full text-sm border">
          <thead><tr className="bg-slate-50"><th className="p-2 text-left">No</th><th className="p-2 text-left">Tanggal</th><th className="p-2 text-left">Customer</th><th className="p-2 text-right">Grand Total</th></tr></thead>
          <tbody>
            {penjualan.map((p,i)=> <tr key={i} className="border-t"><td className="p-2">{p.nomor_penjualan}</td><td className="p-2">{p.tanggal}</td><td className="p-2">{p.kode_customer}</td><td className="p-2 text-right">{(p.grand_total||0).toLocaleString()}</td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="Laporan Stok">
        <div className="mb-2"><button onClick={()=>fetcher(`/api/laporan/stock?x=1`, setStok)} className="px-3 py-1.5 bg-slate-800 text-white rounded">Muat Stok</button></div>
        <table className="w-full text-sm border">
          <thead><tr className="bg-slate-50"><th className="p-2 text-left">Nama</th><th className="p-2 text-left">Kode</th><th className="p-2 text-left">Stok</th><th className="p-2 text-left">Satuan</th></tr></thead>
          <tbody>
            {stok.map((p,i)=> <tr key={i} className="border-t"><td className="p-2">{p.nama_barang}</td><td className="p-2">{p.kode_barang}</td><td className="p-2">{p.stok_total}</td><td className="p-2">{p.satuan}</td></tr>)}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
