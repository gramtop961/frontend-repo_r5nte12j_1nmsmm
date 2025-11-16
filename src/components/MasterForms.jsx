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

export default function MasterForms(){
  const token = localStorage.getItem('token');
  const [barang, setBarang] = useState({ kode_barang: '', nama_barang: '', satuan: 'Gram', harga_beli_default: 0, kategori: 'Bahan Baku' });
  const [supplier, setSupplier] = useState({ kode_supplier: '', nama_supplier: '', alamat: '', nomor_hp: '' });
  const [customer, setCustomer] = useState({ kode_customer: '', nama_customer: '', alamat: '', nomor_hp: '' });
  const [msg, setMsg] = useState('');

  const autocode = async (url, setter, key)=>{
    const r = await fetch(`${API}${url}?token=${token}`);
    const d = await r.json();
    setter(prev=>({...prev, [key]: d.kode }));
  };

  useEffect(()=>{ autocode('/api/autocode/barang', setBarang, 'kode_barang'); }, []);
  useEffect(()=>{ autocode('/api/autocode/supplier', setSupplier, 'kode_supplier'); }, []);
  useEffect(()=>{ autocode('/api/autocode/customer', setCustomer, 'kode_customer'); }, []);

  const submit = async (path, payload)=>{
    setMsg('');
    const r = await fetch(`${API}${path}?token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.detail||'Gagal');
    setMsg('Tersimpan');
  };

  return (
    <div>
      {msg && <div className="mb-4 text-green-600">{msg}</div>}
      <Section title="Master Barang">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Kode</label>
            <input value={barang.kode_barang} onChange={e=>setBarang({...barang, kode_barang:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Nama Barang</label>
            <input value={barang.nama_barang} onChange={e=>setBarang({...barang, nama_barang:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Satuan</label>
            <select value={barang.satuan} onChange={e=>setBarang({...barang, satuan:e.target.value})} className="w-full border rounded px-3 py-2">
              <option>Gram</option><option>Kg</option><option>Ml</option><option>Pcs</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Harga Beli Default</label>
            <input type="number" value={barang.harga_beli_default} onChange={e=>setBarang({...barang, harga_beli_default:parseFloat(e.target.value)||0})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Kategori</label>
            <select value={barang.kategori} onChange={e=>setBarang({...barang, kategori:e.target.value})} className="w-full border rounded px-3 py-2">
              <option>Bahan Baku</option><option>Barang Jadi</option>
            </select>
          </div>
        </div>
        <button onClick={()=>submit('/api/barang', barang)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Simpan Barang</button>
      </Section>

      <Section title="Master Supplier">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Kode</label>
            <input value={supplier.kode_supplier} onChange={e=>setSupplier({...supplier, kode_supplier:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Nama</label>
            <input value={supplier.nama_supplier} onChange={e=>setSupplier({...supplier, nama_supplier:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Alamat</label>
            <input value={supplier.alamat} onChange={e=>setSupplier({...supplier, alamat:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Nomor HP</label>
            <input value={supplier.nomor_hp} onChange={e=>setSupplier({...supplier, nomor_hp:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <button onClick={()=>submit('/api/supplier', supplier)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Simpan Supplier</button>
      </Section>

      <Section title="Master Customer">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Kode</label>
            <input value={customer.kode_customer} onChange={e=>setCustomer({...customer, kode_customer:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Nama</label>
            <input value={customer.nama_customer} onChange={e=>setCustomer({...customer, nama_customer:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Alamat</label>
            <input value={customer.alamat} onChange={e=>setCustomer({...customer, alamat:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Nomor HP</label>
            <input value={customer.nomor_hp} onChange={e=>setCustomer({...customer, nomor_hp:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <button onClick={()=>submit('/api/customer', customer)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Simpan Customer</button>
      </Section>
    </div>
  );
}
