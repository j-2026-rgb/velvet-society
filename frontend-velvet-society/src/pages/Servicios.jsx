import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Servicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('Todos')

  useEffect(() => {
    fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/servicios')
      .then(res => res.json())
      .then(data => { setServicios(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categorias = ['Todos', ...new Set(servicios.map(s => s.categoria || 'General'))].map(c => c === 'Todos' ? 'Todos' : c)
  const filtrados = categoria === 'Todos' ? servicios : servicios.filter(s => (s.categoria || 'General') === categoria)

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar filtros */}
      <aside className="w-64 bg-[#181818] border-r border-[#2A2A2A] p-6 hidden md:block">
        <h3 className="text-xs uppercase tracking-[0.3em] text-[#D8C08C] mb-6">Categorías</h3>
        <div className="space-y-3">
          {['Todos', 'Bodas', 'Corporativos', 'Intimos', 'Corporativo', 'Gala'].map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)} className={`block w-full text-left text-sm ${categoria === cat ? 'text-[#C9A227]' : 'text-[#A7A29A] hover:text-[#F5F1E8]'}`}>{cat}</button>
          ))}
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-light tracking-widest text-[#F5F1E8] mb-2">Nuestros servicios</h1>
        <p className="text-[#A7A29A] text-sm mb-8">Descubre nuestra selección exclusiva</p>

        {loading ? (
          <p className="text-[#A7A29A]">Cargando servicios...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map(s => (
              <div key={s.id_servicio} className="bg-[#181818] border border-[#2A2A2A] p-5 hover:border-[#C9A227] transition-colors">
                <div className="aspect-video bg-[#2A2A2A] mb-4 flex items-center justify-center">
                  <span className="text-[#2A2A2A] text-xs">Imagen</span>
                </div>
                <h3 className="text-[#F5F1E8] font-light text-sm mb-1">{s.nombre}</h3>
                <p className="text-[#A7A29A] text-xs mb-3">{s.descripcion || 'Servicio premium'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A227] text-sm">${Number(s.precio).toFixed(2)}</span>
                  <Link to="/reservas" className="text-[#C9A227] text-xs uppercase tracking-[0.2em] border border-[#C9A227] px-3 py-1 hover:bg-[#C9A227] hover:text-[#0D0D0D] transition-colors">Reservar ahora</Link>
                </div>
              </div>
            ))}
            {filtrados.length === 0 && <p className="text-[#A7A29A]">No hay servicios en esta categoría.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
