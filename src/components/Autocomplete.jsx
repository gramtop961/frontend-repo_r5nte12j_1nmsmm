import { useEffect, useMemo, useRef, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Autocomplete({ endpoint, mapper, placeholder, onSelect }) {
  const [term, setTerm] = useState("");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useRef();

  useEffect(()=>{
    if (!term) { setItems([]); return; }
    const id = setTimeout(async ()=>{
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const r = await fetch(`${API}${endpoint}?term=${encodeURIComponent(term)}&token=${token}`);
        const data = await r.json();
        setItems(data);
        setOpen(true);
      } catch {}
      setLoading(false);
    }, 300);
    return ()=>clearTimeout(id);
  }, [term, endpoint]);

  return (
    <div className="relative">
      <input value={term} onChange={(e)=>setTerm(e.target.value)} placeholder={placeholder}
        className="w-full border rounded px-3 py-2" onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false), 150)} />
      {open && items.length>0 && (
        <div className="absolute z-10 bg-white border rounded mt-1 w-full shadow max-h-60 overflow-auto">
          {items.map((it,i)=>{
            const label = mapper(it);
            return (
              <div key={i} onMouseDown={()=>{ onSelect(it); setTerm(label); setOpen(false); }} className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm">
                {label}
              </div>
            )
          })}
        </div>
      )}
      {loading && <div className="absolute right-2 top-2 text-xs text-slate-400">Loading...</div>}
    </div>
  );
}
