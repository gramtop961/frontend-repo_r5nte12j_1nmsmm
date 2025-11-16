import { useEffect, useMemo, useState } from "react";
import Autocomplete from "./Autocomplete";
const API = import.meta.env.VITE_BACKEND_URL || "";

function Money({ value }){ return <span>{Number(value||0).toLocaleString()}</span> }

function RowBarang({ onChange, type }){
  const [row, setRow] = useState({ nama_barang: '', kode_barang: '', qty: 0, satuan: '', harga_beli: 0, harga_jual: 0 });
  useEffect(()=>{ onChange(row); }, [row]);
  return (
    <tr className="border-t">
      <td className="p-2">
        <Autocomplete endpoint="/api/barang/search" placeholder="Cari barang" mapper={(it)=>`${it.kode_barang} — ${it.nama_barang}`} onSelect={(it)=>setRow(r=>({...r, nama_barang: it.nama_barang, kode_barang: it.kode_barang, satuan: it.satuan, harga_beli: it.harga_beli_default || r.harga_beli }))} />
      </td>
      <td className="p-2 text-sm text-slate-600">{row.kode_barang}</td>
      <td className="p-2"><input type="number" value={row.qty} onChange={e=>setRow({...row, qty: parseFloat(e.target.value)||0})} className="w-24 border rounded px-2 py-1"/></td>
      <td className="p-2 text-sm text-slate-600">{row.satuan}</td>
      {type==='pembelian' && <td className="p-2"><input type="number" value={row.harga_beli} onChange={e=>setRow({...row, harga_beli: parseFloat(e.target.value)||0})} className="w-28 border rounded px-2 py-1"/></td>}
      {type==='penjualan' && <td className="p-2"><input type="number" value={row.harga_jual} onChange={e=>setRow({...row, harga_jual: parseFloat(e.target.value)||0})} className="w-28 border rounded px-2 py-1"/></td>}
      <td className="p-2 text-right text-slate-700"><Money value={(type==='pembelian'? row.harga_beli: row.harga_jual)*row.qty} /></td>
      <td className="p-2"><button onClick={()=>onChange(null)} className="text-red-600">Hapus</button></td>
    </tr>
  );
}

function TableBarang({ type, rows, setRows }){
  const addRow = ()=> setRows([...rows, {}]);
  const update = (idx, data)=>{
    const copy = [...rows];
    if (data===null) copy.splice(idx,1); else copy[idx] = data;
    setRows(copy);
  };
  const total = rows.reduce((a,r)=>a + ((type==='pembelian'? (r?.harga_beli||0) : (r?.harga_jual||0)) * (r?.qty||0)), 0);
  return (
    <div className="mt-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Nama Barang</th>
            <th className="p-2">Kode</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Satuan</th>
            {(type==='pembelian') && <th className="p-2">Harga</th>}
            {(type==='penjualan') && <th className="p-2">Harga Jual</th>}
            <th className="p-2 text-right">Total</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i)=> <RowBarang key={i} onChange={(data)=>update(i, data)} type={type} />)}
        </tbody>
      </table>
      <button onClick={addRow} className="mt-2 px-3 py-1.5 bg-slate-800 text-white rounded">Tambah Baris</button>
      <div className="mt-2 text-right font-semibold">Grand Total: <Money value={total}/></div>
    </div>
  );
}

export default function Transactions(){
  const token = localStorage.getItem('token');
  // Pembelian
  const [pembelian, setPembelian] = useState({ nomor_faktur: '', tanggal: '', supplier: null, kode_supplier: '', keterangan: '' });
  const [rowsPembelian, setRowsPembelian] = useState([]);
  const totalPembelian = rowsPembelian.reduce((a,r)=>a+((r?.harga_beli||0)*(r?.qty||0)),0);
  useEffect(()=>{ (async()=>{ const r=await fetch(`${API}/api/autocode/invoice?token=${token}`); const d=await r.json(); setPembelian(p=>({...p, nomor_faktur: d.kode})); })(); }, []);

  const submitPembelian = async ()=>{
    const items = rowsPembelian.filter(Boolean).map(r=>({ ...r }));
    const payload = { nomor_faktur: pembelian.nomor_faktur, tanggal: pembelian.tanggal, kode_supplier: pembelian.kode_supplier, supplier_name: pembelian.supplier?.nama_supplier, keterangan: pembelian.keterangan, items, grand_total: totalPembelian };
    const r = await fetch(`${API}/api/transaksi/pembelian?token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    alert(r.ok? 'Pembelian tersimpan' : 'Gagal');
  };

  // Barang Masuk
  const [masuk, setMasuk] = useState({ tanggal: '', kode_barang: '', nama_barang: '', satuan: '', qty: 0, catatan: '' });
  const submitMasuk = async ()=>{
    const r = await fetch(`${API}/api/transaksi/barang-masuk?token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(masuk) });
    alert(r.ok? 'Barang masuk tersimpan' : 'Gagal');
  };

  // Barang Keluar
  const [keluar, setKeluar] = useState({ tanggal: '', kode_barang: '', nama_barang: '', satuan: '', qty: 0, catatan: '' });
  const submitKeluar = async ()=>{
    const r = await fetch(`${API}/api/transaksi/barang-keluar?token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(keluar) });
    alert(r.ok? 'Barang keluar tersimpan' : 'Gagal');
  };

  // Penjualan
  const [penjualan, setPenjualan] = useState({ nomor_penjualan: '', tanggal: '', kode_customer: '', customer: null, keterangan: '' });
  const [rowsJual, setRowsJual] = useState([]);
  const totalJual = rowsJual.reduce((a,r)=>a+((r?.harga_jual||0)*(r?.qty||0)),0);
  useEffect(()=>{ (async()=>{ const r=await fetch(`${API}/api/autocode/sales?token=${token}`); const d=await r.json(); setPenjualan(p=>({...p, nomor_penjualan: d.kode})); })(); }, []);
  const submitPenjualan = async ()=>{
    const items = rowsJual.filter(Boolean).map(r=>({ ...r }));
    const payload = { nomor_penjualan: penjualan.nomor_penjualan, tanggal: penjualan.tanggal, kode_customer: penjualan.kode_customer, customer_name: penjualan.customer?.nama_customer, keterangan: penjualan.keterangan, items, grand_total: totalJual };
    const r = await fetch(`${API}/api/transaksi/penjualan?token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    alert(r.ok? 'Penjualan tersimpan' : 'Gagal');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-4">
        <div className="font-semibold mb-2">Pembelian Bahan Baku</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">No Faktur</label>
            <input value={pembelian.nomor_faktur} readOnly className="w-full border rounded px-3 py-2 bg-slate-50"/>
          </div>
          <div>
            <label className="text-sm">Tanggal</label>
            <input type="date" value={pembelian.tanggal} onChange={e=>setPembelian({...pembelian, tanggal:e.target.value})} className="w-full border rounded px-3 py-2"/>
          </div>
          <div className="col-span-2">
            <label className="text-sm">Supplier</label>
            <Autocomplete endpoint="/api/supplier/search" placeholder="Cari supplier" mapper={(it)=>`${it.kode_supplier} — ${it.nama_supplier}`} onSelect={(it)=>setPembelian(p=>({...p, supplier: it, kode_supplier: it.kode_supplier}))} />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Keterangan</label>
            <input value={pembelian.keterangan} onChange={e=>setPembelian({...pembelian, keterangan:e.target.value})} className="w-full border rounded px-3 py-2"/>
          </div>
        </div>
        <TableBarang type="pembelian" rows={rowsPembelian} setRows={setRowsPembelian} />
        <button onClick={submitPembelian} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Simpan Pembelian</button>
      </div>

      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="font-semibold mb-2">Barang Masuk</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-sm">Nama Barang</label>
              <Autocomplete endpoint="/api/barang/search" placeholder="Cari barang" mapper={(it)=>`${it.kode_barang} — ${it.nama_barang}`} onSelect={(it)=>setMasuk(m=>({...m, nama_barang: it.nama_barang, kode_barang: it.kode_barang, satuan: it.satuan}))} />
            </div>
            <div>
              <label className="text-sm">Tanggal</label>
              <input type="date" value={masuk.tanggal} onChange={e=>setMasuk({...masuk, tanggal:e.target.value})} className="w-full border rounded px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm">Qty</label>
              <input type="number" value={masuk.qty} onChange={e=>setMasuk({...masuk, qty:parseFloat(e.target.value)||0})} className="w-full border rounded px-3 py-2"/>
            </div>
            <div className="text-sm text-slate-600">Kode: {masuk.kode_barang} • Satuan: {masuk.satuan}</div>
            <div className="col-span-2">
              <label className="text-sm">Catatan</label>
              <input value={masuk.catatan} onChange={e=>setMasuk({...masuk, catatan:e.target.value})} className="w-full border rounded px-3 py-2"/>
            </div>
          </div>
          <button onClick={submitMasuk} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Simpan Barang Masuk</button>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="font-semibold mb-2">Barang Keluar</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-sm">Nama Barang</label>
              <Autocomplete endpoint="/api/barang/search" placeholder="Cari barang" mapper={(it)=>`${it.kode_barang} — ${it.nama_barang}`} onSelect={(it)=>setKeluar(m=>({...m, nama_barang: it.nama_barang, kode_barang: it.kode_barang, satuan: it.satuan}))} />
            </div>
            <div>
              <label className="text-sm">Tanggal</label>
              <input type="date" value={keluar.tanggal} onChange={e=>setKeluar({...keluar, tanggal:e.target.value})} className="w-full border rounded px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm">Qty</label>
              <input type="number" value={keluar.qty} onChange={e=>setKeluar({...keluar, qty:parseFloat(e.target.value)||0})} className="w-full border rounded px-3 py-2"/>
            </div>
            <div className="text-sm text-slate-600">Kode: {keluar.kode_barang} • Satuan: {keluar.satuan}</div>
            <div className="col-span-2">
              <label className="text-sm">Catatan</label>
              <input value={keluar.catatan} onChange={e=>setKeluar({...keluar, catatan:e.target.value})} className="w-full border rounded px-3 py-2"/>
            </div>
          </div>
          <button onClick={submitKeluar} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Simpan Barang Keluar</button>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white border rounded-lg p-4">
        <div className="font-semibold mb-2">Penjualan Barang Jadi</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">No Penjualan</label>
            <input readOnly value={penjualan.nomor_penjualan} className="w-full border rounded px-3 py-2 bg-slate-50"/>
          </div>
          <div>
            <label className="text-sm">Tanggal</label>
            <input type="date" value={penjualan.tanggal} onChange={e=>setPenjualan({...penjualan, tanggal:e.target.value})} className="w-full border rounded px-3 py-2"/>
          </div>
          <div className="col-span-2">
            <label className="text-sm">Customer</label>
            <Autocomplete endpoint="/api/customer/search" placeholder="Cari customer" mapper={(it)=>`${it.kode_customer} — ${it.nama_customer}`} onSelect={(it)=>setPenjualan(p=>({...p, customer: it, kode_customer: it.kode_customer}))} />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Keterangan</label>
            <input value={penjualan.keterangan} onChange={e=>setPenjualan({...penjualan, keterangan:e.target.value})} className="w-full border rounded px-3 py-2"/>
          </div>
        </div>
        <TableBarang type="penjualan" rows={rowsJual} setRows={setRowsJual} />
        <button onClick={submitPenjualan} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Simpan Penjualan</button>
      </div>
    </div>
  );
}
