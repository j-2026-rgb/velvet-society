import { useState, useEffect } from 'react'

export default function Admin() {
  const [servicios, setServicios] = useState([])
  const [clientes, setClientes] = useState([])
  const [reservas, setReservas] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' })
  const [alerta, setAlerta] = useState({ msg: '', tipo: '' })

  useEffect(() => { cargarTodo() }, [])

  const cargarTodo = async () => {
    try {
      const [s, c, r] = await Promise.all([
        fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/servicios/todos').then(r => r.json()),
        fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/clientes').then(r => r.json()),
        fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/reservas').then(r => r.json())
      ])
      setServicios(s); setClientes(c); setReservas(r)
    } catch { console.error('Error cargando datos') }
  }

  const crearServicio = async (e) => {
    e.preventDefault()
    const res = await fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/servicios', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) { setAlerta({ msg: 'Servicio creado', tipo: 'success' }); setForm({ nombre: '', descripcion: '', precio: '' }); cargarTodo() }
    else setAlerta({ msg: data.error, tipo: 'error' })
  }

  const cambiarEstadoServicio = async (id, estado) => {
    await fetch(`https://velvet-society-backend-velvet-socie.vercel.app/api/servicios/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado })
    })
    cargarTodo()
  }

  const actualizarReserva = async (id, estado) => {
    await fetch(`https://velvet-society-backend-velvet-socie.vercel.app/api/reservas/${id}/estado`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado })
    })
    cargarTodo()
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-light tracking-widest text-center text-[#F5F1E8] mb-2">Panel Administrativo</h1>
      <p className="text-center text-[#A7A29A] mb-8">Gestión integral de Velvet Society</p>
      {alerta.msg && <div className={`p-3 rounded-sm mb-4 text-sm ${alerta.tipo === 'success' ? 'bg-[#315C4A]' : 'bg-[#7A3030]'}`}>{alerta.msg}</div>}

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-6 mb-6">
        <h3 className="text-lg text-[#D8C08C] mb-4">Gestión de Servicios</h3>
        <form onSubmit={crearServicio} className="flex gap-4 mb-6 flex-wrap">
          <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="flex-1 min-w-[200px] p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm" placeholder="Nombre" required />
          <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="flex-1 min-w-[200px] p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm" placeholder="Descripción" />
          <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="w-[140px] p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm" placeholder="Precio" step="0.01" required />
          <button className="px-6 py-3 bg-[#C9A227] text-[#0D0D0D] font-semibold rounded-sm hover:bg-[#D4AF37]">Crear</button>
        </form>
        <table className="w-full text-left">
          <thead><tr className="border-b border-[#2A2A2A]"><th className="py-3 text-[#C9A227] text-xs uppercase">Nombre</th><th className="py-3 text-[#C9A227] text-xs uppercase">Precio</th><th className="py-3 text-[#C9A227] text-xs uppercase">Estado</th><th className="py-3 text-[#C9A227] text-xs uppercase">Acciones</th></tr></thead>
          <tbody>{servicios.map(s => (
            <tr key={s.id_servicio} className="border-b border-[#2A2A2A] hover:bg-[#1E1E1E]">
              <td className="py-3 text-[#A7A29A]">{s.nombre}</td>
              <td className="py-3 text-[#A7A29A]">${Number(s.precio).toFixed(2)}</td>
              <td className="py-3 text-[#A7A29A]">{s.estado}</td>
              <td className="py-3">{s.estado === 'activo' ? <button onClick={() => cambiarEstadoServicio(s.id_servicio, 'inactivo')} className="text-[#7A3030] text-sm">Desactivar</button> : <button onClick={() => cambiarEstadoServicio(s.id_servicio, 'activo')} className="text-[#315C4A] text-sm">Activar</button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-6 mb-6">
        <h3 className="text-lg text-[#D8C08C] mb-4">Clientes</h3>
        <table className="w-full text-left">
          <thead><tr className="border-b border-[#2A2A2A]"><th className="py-3 text-[#C9A227] text-xs uppercase">Nombre</th><th className="py-3 text-[#C9A227] text-xs uppercase">Correo</th><th className="py-3 text-[#C9A227] text-xs uppercase">Teléfono</th></tr></thead>
          <tbody>{clientes.map(c => (
            <tr key={c.id_cliente} className="border-b border-[#2A2A2A] hover:bg-[#1E1E1E]">
              <td className="py-3 text-[#A7A29A]">{c.nombre}</td>
              <td className="py-3 text-[#A7A29A]">{c.correo}</td>
              <td className="py-3 text-[#A7A29A]">{c.telefono || '-'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-6">
        <h3 className="text-lg text-[#D8C08C] mb-4">Reservas</h3>
        <table className="w-full text-left">
          <thead><tr className="border-b border-[#2A2A2A]"><th className="py-3 text-[#C9A227] text-xs uppercase">Cliente</th><th className="py-3 text-[#C9A227] text-xs uppercase">Servicio</th><th className="py-3 text-[#C9A227] text-xs uppercase">Fecha</th><th className="py-3 text-[#C9A227] text-xs uppercase">Estado</th><th className="py-3 text-[#C9A227] text-xs uppercase">Acciones</th></tr></thead>
          <tbody>{reservas.map(r => (
            <tr key={r.id_reserva} className="border-b border-[#2A2A2A] hover:bg-[#1E1E1E]">
              <td className="py-3 text-[#A7A29A]">{r.nombre_cliente}</td>
              <td className="py-3 text-[#A7A29A]">{r.nombre_servicio}</td>
              <td className="py-3 text-[#A7A29A]">{r.fecha}</td>
              <td className="py-3 text-[#A7A29A]">{r.estado}</td>
              <td className="py-3">{r.estado === 'pendiente' && <><button onClick={() => actualizarReserva(r.id_reserva, 'confirmada')} className="text-[#315C4A] text-sm mr-2">Confirmar</button><button onClick={() => actualizarReserva(r.id_reserva, 'cancelada')} className="text-[#7A3030] text-sm">Cancelar</button></>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
