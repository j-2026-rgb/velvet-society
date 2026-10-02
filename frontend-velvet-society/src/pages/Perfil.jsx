import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [alerta, setAlerta] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/usuarios/perfil', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.error) setAlerta(data.error); else setPerfil(data) })
      .catch(() => setAlerta('Error al cargar perfil'))
  }, [])

  const handleLogout = async () => {
    await fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/auth/logout', { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#181818] border-r border-[#2A2A2A] p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h2 className="text-[#C9A227] text-xs uppercase tracking-[0.3em]">Velvet Society</h2>
        </div>
        <nav className="space-y-3">
          <a href="/" className="block text-[#A7A29A] text-sm hover:text-[#F5F1E8]">Inicio</a>
          <a href="/servicios" className="block text-[#A7A29A] text-sm hover:text-[#F5F1E8]">Servicios</a>
          <a href="/reservas" className="block text-[#A7A29A] text-sm hover:text-[#F5F1E8]">Reservas</a>
          <a href="/perfil" className="block text-[#C9A227] text-sm">Perfil</a>
          <a href="/admin" className="block text-[#A7A29A] text-sm hover:text-[#F5F1E8]">Admin</a>
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-light tracking-widest text-[#F5F1E8] mb-2">Mi perfil</h1>
        <p className="text-[#A7A29A] text-sm mb-8">Gestiona tu información personal</p>

        {alerta && <div className="bg-[#7A3030] p-3 text-sm mb-4">{alerta}</div>}

        {perfil ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#181818] border border-[#2A2A2A] p-6">
              <h3 className="text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-4">Información personal</h3>
              <div className="space-y-3">
                <div><span className="text-[#A7A29A] text-xs">Nombre</span><p className="text-[#F5F1E8] text-sm">{perfil.nombre}</p></div>
                <div><span className="text-[#A7A29A] text-xs">Correo</span><p className="text-[#F5F1E8] text-sm">{perfil.correo}</p></div>
                <div><span className="text-[#A7A29A] text-xs">Teléfono</span><p className="text-[#F5F1E8] text-sm">{perfil.telefono || 'No especificado'}</p></div>
                <div><span className="text-[#A7A29A] text-xs">Dirección</span><p className="text-[#F5F1E8] text-sm">{perfil.direccion || 'No especificada'}</p></div>
                <div><span className="text-[#A7A29A] text-xs">Rol</span><p className="text-[#F5F1E8] text-sm">{perfil.rol}</p></div>
              </div>
            </div>
            <div className="bg-[#181818] border border-[#2A2A2A] p-6">
              <h3 className="text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-4">Suscripción</h3>
              <div className="space-y-3">
                <div><span className="text-[#A7A29A] text-xs">Cuenta</span><p className="text-[#F5F1E8] text-sm">Free</p></div>
                <div><span className="text-[#A7A29A] text-xs">Próximo vencimiento</span><p className="text-[#F5F1E8] text-sm">20 mayo 2026</p></div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[#A7A29A]">Cargando perfil...</p>
        )}

        <button onClick={handleLogout} className="mt-8 px-6 py-3 bg-[#7A3030] text-[#F5F1E8] text-xs uppercase tracking-[0.2em] hover:bg-[#8B3A3A]">Cerrar sesión</button>
      </div>
    </div>
  )
}
