import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const imagenesServicios = {
  'Bodas exclusivas': 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070',
  'Cumpleaños especiales': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070',
  'Eventos corporativos': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070',
  'Cenas íntimas': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070',
  'Banquetes privados': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070',
  'Sesiones fotográficas': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2069',
}

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

  const categoriasUnicas = ['Todos', ...new Set(servicios.map(s => {
    if (s.nombre.includes('Bodas')) return 'Bodas'
    if (s.nombre.includes('Cumpleaños')) return 'Cumpleaños'
    if (s.nombre.includes('Eventos')) return 'Eventos'
    if (s.nombre.includes('Cenas')) return 'Cenas'
    if (s.nombre.includes('Banquetes')) return 'Banquetes'
    if (s.nombre.includes('Fotográficas')) return 'Fotografía'
    return 'Otros'
  }))];

  const filtrar = (cat) => {
    if (cat === 'Todos') return servicios
    return servicios.filter(s => {
      if (cat === 'Bodas') return s.nombre.includes('Bodas')
      if (cat === 'Cumpleaños') return s.nombre.includes('Cumpleaños')
      if (cat === 'Eventos') return s.nombre.includes('Eventos')
      if (cat === 'Cenas') return s.nombre.includes('Cenas')
      if (cat === 'Banquetes') return s.nombre.includes('Banquetes')
      if (cat === 'Fotografía') return s.nombre.includes('Fotográficas')
      return false
    })
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar filtros */}
      <aside className="w-64 bg-[#181818] border-r border-[#2A2A2A] p-6 hidden md:block">
        <h3 className="text-xs uppercase tracking-[0.3em] text-[#D8C08C] mb-6">Categorías</h3>
        <div className="space-y-3">
          {categoriasUnicas.map(c => (
            <button key={c} onClick={() => setCategoria(c)} className={`block w-full text-left text-sm ${categoria === c ? 'text-[#C9A227]' : 'text-[#A7A29A] hover:text-[#F5F1E8]'}`}>{c}</button>
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
            {filtrar(categoria).map(s => (
              <div key={s.id_servicio} className="bg-[#181818] border border-[#2A2A2A] overflow-hidden hover:border-[#C9A227] transition-colors">
                <img src={imagenesServicios[s.nombre] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070'} alt={s.nombre} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="text-[#F5F1E8] font-light text-sm mb-1">{s.nombre}</h3>
                  <p className="text-[#A7A29A] text-xs mb-3">{s.descripcion || 'Servicio premium'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A227] text-sm">${Number(s.precio).toFixed(2)}</span>
                    <Link to="/reservas" className="text-[#C9A227] text-xs uppercase tracking-[0.2em] border border-[#C9A227] px-3 py-1 hover:bg-[#C9A227] hover:text-[#0D0D0D] transition-colors">Reservar</Link>
                  </div>
                </div>
              </div>
            ))}
            {filtrar(categoria).length === 0 && <p className="text-[#A7A29A] col-span-full text-center py-10">No hay servicios en esta categoría.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
