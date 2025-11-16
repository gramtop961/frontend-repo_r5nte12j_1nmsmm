import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Layout from './components/Layout'
import MasterForms from './components/MasterForms'
import Transactions from './components/Transactions'
import Reports from './components/Reports'

const API = import.meta.env.VITE_BACKEND_URL || ''

function Dashboard(){
  const [stock, setStock] = useState([])
  const token = localStorage.getItem('token')
  useEffect(()=>{ (async()=>{ try{ const r = await fetch(`${API}/api/laporan/stock?token=${token}`); const d = await r.json(); setStock(d.slice(0,5)); }catch(e){} })(); },[])
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border rounded-lg p-4">
        <div className="font-semibold mb-3">Ringkasan Stok</div>
        <table className="w-full text-sm border">
          <thead><tr className="bg-slate-50"><th className="p-2 text-left">Nama</th><th className="p-2 text-left">Kode</th><th className="p-2 text-left">Stok</th><th className="p-2 text-left">Satuan</th></tr></thead>
          <tbody>
            {stock.map((s,i)=> <tr key={i} className="border-t"><td className="p-2">{s.nama_barang}</td><td className="p-2">{s.kode_barang}</td><td className="p-2">{s.stok_total}</td><td className="p-2">{s.satuan}</td></tr>)}
          </tbody>
        </table>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <div className="font-semibold mb-2">Panduan Cepat</div>
        <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
          <li>Masuk dengan akun admin</li>
          <li>Buat master barang, supplier, customer</li>
          <li>Lakukan pembelian/masuk/keluar/penjualan</li>
          <li>Lihat laporan untuk memantau stok</li>
        </ol>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('dashboard')

  useEffect(()=>{
    // lightweight check
    const token = localStorage.getItem('token')
    if(token){ setUser({ name: 'User', role: 'unknown' }) }
  }, [])

  if(!user){ return <Auth onLogin={()=>setUser({ name: 'User', role: 'admin' })} /> }

  return (
    <Layout user={user} onLogout={()=>{ localStorage.removeItem('token'); location.reload(); }}>
      <div className="mb-4 flex gap-2">
        {['dashboard','barang','supplier','customer','pembelian','masuk','keluar','penjualan','laporan'].map(k=> (
          <button key={k} onClick={()=>setTab(k)} className={`px-3 py-1.5 rounded border ${tab===k? 'bg-blue-600 text-white border-blue-600':'bg-white'}`}>{k}</button>
        ))}
      </div>
      {tab==='dashboard' && <Dashboard/>}
      {tab==='barang' && <MasterForms/>}
      {tab==='supplier' && <MasterForms/>}
      {tab==='customer' && <MasterForms/>}
      {tab==='pembelian' && <Transactions/>}
      {tab==='masuk' && <Transactions/>}
      {tab==='keluar' && <Transactions/>}
      {tab==='penjualan' && <Transactions/>}
      {tab==='laporan' && <Reports/>}
    </Layout>
  )
}

export default App
