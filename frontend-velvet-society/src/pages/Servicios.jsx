import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Servicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://backend-velvet-society.onrender.com/api/servicios')
      .then(res => res.json())
      .then(data => { setServicios(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-light tracking-widest text-center text-[#F5F1E8] mb-2">Nuestros Servicios</h1>
      <p className="text-center text-[#A7A29A] mb-10">Descubre nuestra selección exclusiva de servicios premium</p>
      {loading ? (
        <p className="text-center text-[#A7A29A]">Cargando servicios...</p>
      ) : servicios.length === 0 ? (
        <p className="text-center text-[#A7A29A]">No hay servicios disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicios.map(s => (
            <div key={s.id_servicio} className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-6 hover:border-[#C9A227] transition-colors">
              <h3 className="text-lg text-[#C9A227] font-light tracking-wider mb-2">{s.nombre}</h3>
              <p className="text-[#A7A29A] text-sm mb-4">{s.descripcion || 'Sin descripción'}</p>
              <div className="text-xl text-[#D8C08C] font-semibold mb-4">${Number(s.precio).toFixed(2)}</div>
              <Link to="/reservas" className="inline-block px-4 py-2 border border-[#D8C08C] text-[#D8C08C] text-sm uppercase tracking-wider rounded-sm hover:bg-[#D8C08C] hover:text-[#0D0D0D] transition-colors">Reservar</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
