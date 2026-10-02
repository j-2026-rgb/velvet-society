import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [alerta, setAlerta] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://backend-velvet-society.onrender.com/api/usuarios/perfil', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.error) setAlerta(data.error); else setPerfil(data) })
      .catch(() => setAlerta('Error al cargar perfil'))
  }, [])

  const handleLogout = async () => {
    await fetch('https://backend-velvet-society.onrender.com/api/auth/logout', { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-light tracking-widest text-center text-[#F5F1E8] mb-8">Mi Perfil</h1>
      {alerta && <div className="bg-[#7A3030] p-3 rounded-sm mb-4 text-sm">{alerta}</div>}
      {perfil ? (
        <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-6">
          <h3 className="text-xl text-[#C9A227] mb-4">{perfil.nombre}</h3>
          <p className="text-[#A7A29A] mb-1"><span className="text-[#D8C08C]">Correo:</span> {perfil.correo}</p>
          <p className="text-[#A7A29A] mb-1"><span className="text-[#D8C08C]">Rol:</span> {perfil.rol}</p>
          <p className="text-[#A7A29A] mb-1"><span className="text-[#D8C08C]">Teléfono:</span> {perfil.telefono || 'No especificado'}</p>
          <p className="text-[#A7A29A] mb-1"><span className="text-[#D8C08C]">Dirección:</span> {perfil.direccion || 'No especificada'}</p>
          <button onClick={handleLogout} className="mt-6 px-6 py-2 bg-[#7A3030] text-[#F5F1E8] rounded-sm hover:bg-[#8B3A3A] transition-colors">Cerrar Sesión</button>
        </div>
      ) : (
        <p className="text-center text-[#A7A29A]">Cargando perfil...</p>
      )}
    </div>
  )
}
