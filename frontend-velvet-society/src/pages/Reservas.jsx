import { useState, useEffect } from 'react'

export default function Reservas() {
  const [servicios, setServicios] = useState([])
  const [reservas, setReservas] = useState([])
  const [form, setForm] = useState({ id_servicio: '', fecha: '', observaciones: '' })
  const [alerta, setAlerta] = useState({ msg: '', tipo: '' })

  useEffect(() => {
    fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/servicios').then(r => r.json()).then(setServicios)
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      const res = await fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/reservas/mis-reservas', { credentials: 'include' })
      if (res.status === 401) { setReservas([]); return }
      setReservas(await res.json())
    } catch { setReservas([]) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) { setAlerta({ msg: 'Reserva creada exitosamente', tipo: 'success' }); cargarReservas(); setForm({ id_servicio: '', fecha: '', observaciones: '' }) }
      else setAlerta({ msg: data.error, tipo: 'error' })
    } catch { setAlerta({ msg: 'Error de conexión', tipo: 'error' }) }
  }

  const cancelarReserva = async (id) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return
    try {
      const res = await fetch(`https://velvet-society-backend-velvet-socie.vercel.app/api/reservas/${id}/cancelar`, { method: 'PUT', credentials: 'include' })
      if (res.ok) { setAlerta({ msg: 'Reserva cancelada', tipo: 'success' }); cargarReservas() }
    } catch { setAlerta({ msg: 'Error al cancelar', tipo: 'error' }) }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#181818] border-r border-[#2A2A2A] p-6 hidden md:block">
        <h3 className="text-xs uppercase tracking-[0.3em] text-[#D8C08C] mb-6">Nueva reserva</h3>
        {alerta.msg && <div className={`p-3 text-xs mb-4 ${alerta.tipo === 'success' ? 'bg-[#315C4A]' : 'bg-[#7A3030]'}`}>{alerta.msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={form.id_servicio} onChange={(e) => setForm({ ...form, id_servicio: e.target.value })} className="w-full p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] text-sm" required>
            <option value="">Selecciona un servicio</option>
            {servicios.map(s => <option key={s.id_servicio} value={s.id_servicio}>{s.nombre} - ${Number(s.precio).toFixed(2)}</option>)}
          </select>
          <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] text-sm" required />
          <input type="text" value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="w-full p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] text-sm" placeholder="Observaciones" />
          <button type="submit" className="w-full py-3 bg-[#C9A227] text-[#0D0D0D] text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37]">Realizar reserva</button>
        </form>
      </aside>

      {/* Contenido */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-light tracking-widest text-[#F5F1E8] mb-2">Mis reservas</h1>
        <p className="text-[#A7A29A] text-sm mb-8">Gestiona y consulta tus reservas</p>

        {reservas.length === 0 ? (
          <p className="text-[#A7A29A]">No tienes reservas aún.</p>
        ) : (
          <div className="space-y-4">
            {reservas.map(r => (
              <div key={r.id_reserva} className="bg-[#181818] border border-[#2A2A2A] p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[#F5F1E8] text-sm">{r.nombre_servicio}</h3>
                  <p className="text-[#A7A29A] text-xs">{r.fecha} · ${Number(r.precio).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs uppercase tracking-[0.2em] px-2 py-1 ${r.estado === 'pendiente' ? 'bg-[#C9A227]/20 text-[#C9A227]' : r.estado === 'confirmada' ? 'bg-[#315C4A]/20 text-[#315C4A]' : 'bg-[#7A3030]/20 text-[#7A3030]'}`}>{r.estado}</span>
                  {r.estado === 'pendiente' && <button onClick={() => cancelarReserva(r.id_reserva)} className="text-[#7A3030] text-xs hover:underline">Cancelar</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
