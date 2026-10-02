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
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#181818] border-r border-[#2A2A2A] p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h2 className="text-[#C9A227] text-xs uppercase tracking-[0.3em]">Velvet Society</h2>
        </div>
        <nav className="space-y-3">
          <a href="/admin" className="block text-[#C9A227] text-sm">Dashboard</a>
          <a href="/admin" className="block text-[#A7A29A] text-sm hover:text-[#F5F1E8]">Servicios</a>
          <a href="/admin" className="block text-[#A7A29A] text-sm hover:text-[#F5F1E8]">Clientes</a>
          <a href="/admin" className="block text-[#A7A29A] text-sm hover:text-[#F5F1E8]">Reservas</a>
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-light tracking-widest text-[#F5F1E8] mb-2">Dashboard</h1>
        <p className="text-[#A7A29A] text-sm mb-8">Resumen general de Velvet Society</p>
        {alerta.msg && <div className={`p-3 text-sm mb-4 ${alerta.tipo === 'success' ? 'bg-[#315C4A]' : 'bg-[#7A3030]'}`}>{alerta.msg}</div>}

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Reservas activas', value: reservas.filter(r => r.estado === 'pendiente').length, color: 'text-[#C9A227]' },
            { label: 'Clientes registrados', value: clientes.length, color: 'text-[#D8C08C]' },
            { label: 'Servicios activos', value: servicios.filter(s => s.estado === 'activo').length, color: 'text-[#F5F1E8]' },
            { label: 'Ventas totales', value: '$12,340', color: 'text-[#C9A227]' },
          ].map((m, i) => (
            <div key={i} className="bg-[#181818] border border-[#2A2A2A] p-4">
              <p className="text-[#A7A29A] text-xs uppercase tracking-[0.2em] mb-1">{m.label}</p>
              <p className={`text-2xl font-light ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Servicios */}
        <div className="bg-[#181818] border border-[#2A2A2A] p-6 mb-6">
          <h3 className="text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-4">Gestión de Servicios</h3>
          <form onSubmit={crearServicio} className="flex gap-3 mb-4 flex-wrap">
            <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="flex-1 min-w-[200px] p-2 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] text-sm" placeholder="Nombre" required />
            <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="flex-1 min-w-[200px] p-2 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] text-sm" placeholder="Descripción" />
            <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="w-[120px] p-2 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] text-sm" placeholder="Precio" step="0.01" required />
            <button className="px-4 py-2 bg-[#C9A227] text-[#0D0D0D] text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37]">Crear</button>
          </form>
          <table className="w-full">
            <thead><tr className="border-b border-[#2A2A2A]"><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Nombre</th><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Precio</th><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Estado</th><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Acciones</th></tr></thead>
            <tbody>{servicios.map(s => (
              <tr key={s.id_servicio} className="border-b border-[#2A2A2A]">
                <td className="py-2 text-[#A7A29A] text-sm">{s.nombre}</td>
                <td className="py-2 text-[#A7A29A] text-sm">${Number(s.precio).toFixed(2)}</td>
                <td className="py-2 text-[#A7A29A] text-sm">{s.estado}</td>
                <td className="py-2">{s.estado === 'activo' ? <button onClick={() => cambiarEstadoServicio(s.id_servicio, 'inactivo')} className="text-[#7A3030] text-xs">Desactivar</button> : <button onClick={() => cambiarEstadoServicio(s.id_servicio, 'activo')} className="text-[#315C4A] text-xs">Activar</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Reservas */}
        <div className="bg-[#181818] border border-[#2A2A2A] p-6">
          <h3 className="text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-4">Próximas reservas</h3>
          <table className="w-full">
            <thead><tr className="border-b border-[#2A2A2A]"><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Cliente</th><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Servicio</th><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Fecha</th><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Estado</th><th className="py-2 text-[#C9A227] text-xs uppercase text-left">Acciones</th></tr></thead>
            <tbody>{reservas.map(r => (
              <tr key={r.id_reserva} className="border-b border-[#2A2A2A]">
                <td className="py-2 text-[#A7A29A] text-sm">{r.nombre_cliente}</td>
                <td className="py-2 text-[#A7A29A] text-sm">{r.nombre_servicio}</td>
                <td className="py-2 text-[#A7A29A] text-sm">{r.fecha}</td>
                <td className="py-2 text-[#A7A29A] text-sm">{r.estado}</td>
                <td className="py-2">{r.estado === 'pendiente' && <><button onClick={() => actualizarReserva(r.id_reserva, 'confirmada')} className="text-[#315C4A] text-xs mr-2">Confirmar</button><button onClick={() => actualizarReserva(r.id_reserva, 'cancelada')} className="text-[#7A3030] text-xs">Cancelar</button></>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
