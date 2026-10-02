import { useState, useEffect } from 'react'

export default function Reservas() {
  const [servicios, setServicios] = useState([])
  const [reservas, setReservas] = useState([])
  const [form, setForm] = useState({ id_servicio: '', fecha: '', observaciones: '' })
  const [alerta, setAlerta] = useState({ msg: '', tipo: '' })

  useEffect(() => {
    fetch('https://backend-velvet-society.onrender.com/api/servicios').then(r => r.json()).then(setServicios)
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      const res = await fetch('https://backend-velvet-society.onrender.com/api/reservas/mis-reservas', { credentials: 'include' })
      if (res.status === 401) { setReservas([]); return }
      setReservas(await res.json())
    } catch { setReservas([]) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('https://backend-velvet-society.onrender.com/api/reservas', {
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
      const res = await fetch(`https://backend-velvet-society.onrender.com/api/reservas/${id}/cancelar`, { method: 'PUT', credentials: 'include' })
      if (res.ok) { setAlerta({ msg: 'Reserva cancelada', tipo: 'success' }); cargarReservas() }
    } catch { setAlerta({ msg: 'Error al cancelar', tipo: 'error' }) }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-light tracking-widest text-center text-[#F5F1E8] mb-2">Mis Reservas</h1>
      <p className="text-center text-[#A7A29A] mb-8">Gestiona y consulta tus reservas</p>
      {alerta.msg && <div className={`p-3 rounded-sm mb-4 text-sm ${alerta.tipo === 'success' ? 'bg-[#315C4A]' : 'bg-[#7A3030]'}`}>{alerta.msg}</div>}

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-6 mb-6">
        <h3 className="text-lg text-[#D8C08C] mb-4">Nueva Reserva</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select value={form.id_servicio} onChange={(e) => setForm({ ...form, id_servicio: e.target.value })} className="p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm" required>
            <option value="">Selecciona un servicio</option>
            {servicios.map(s => <option key={s.id_servicio} value={s.id_servicio}>{s.nombre} - ${Number(s.precio).toFixed(2)}</option>)}
          </select>
          <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm" required />
          <input type="text" value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm" placeholder="Observaciones (opcional)" />
          <button type="submit" className="py-3 bg-[#C9A227] text-[#0D0D0D] font-semibold uppercase tracking-widest rounded-sm hover:bg-[#D4AF37] transition-colors">Realizar Reserva</button>
        </form>
      </div>

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-6">
        <h3 className="text-lg text-[#D8C08C] mb-4">Historial de Reservas</h3>
        {reservas.length === 0 ? <p className="text-[#A7A29A]">No tienes reservas aún.</p> : (
          <table className="w-full text-left">
            <thead><tr className="border-b border-[#2A2A2A]"><th className="py-3 text-[#C9A227] text-xs uppercase">Servicio</th><th className="py-3 text-[#C9A227] text-xs uppercase">Fecha</th><th className="py-3 text-[#C9A227] text-xs uppercase">Estado</th><th className="py-3 text-[#C9A227] text-xs uppercase">Precio</th><th className="py-3 text-[#C9A227] text-xs uppercase">Acciones</th></tr></thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r.id_reserva} className="border-b border-[#2A2A2A] hover:bg-[#1E1E1E]">
                  <td className="py-3 text-[#A7A29A]">{r.nombre_servicio}</td>
                  <td className="py-3 text-[#A7A29A]">{r.fecha}</td>
                  <td className="py-3 text-[#A7A29A]">{r.estado}</td>
                  <td className="py-3 text-[#A7A29A]">${Number(r.precio).toFixed(2)}</td>
                  <td className="py-3">{r.estado === 'pendiente' && <button onClick={() => cancelarReserva(r.id_reserva)} className="text-[#7A3030] hover:text-[#8B3A3A] text-sm">Cancelar</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
