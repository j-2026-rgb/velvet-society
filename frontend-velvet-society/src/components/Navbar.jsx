import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/auth/logout', { method: 'POST' })
      if (res.ok) navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <nav className="bg-[#181818] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-[#C9A227] text-xl font-light tracking-widest uppercase">
        Velvet <span className="text-[#F5F1E8] font-semibold">Society</span>
      </Link>

      <div className="flex gap-6 text-sm uppercase tracking-wider">
        <Link to="/" className="text-[#A7A29A] hover:text-[#C9A227] transition-colors">Inicio</Link>
        <Link to="/servicios" className="text-[#A7A29A] hover:text-[#C9A227] transition-colors">Servicios</Link>
        <Link to="/reservas" className="text-[#A7A29A] hover:text-[#C9A227] transition-colors">Reservas</Link>
        <Link to="/perfil" className="text-[#A7A29A] hover:text-[#C9A227] transition-colors">Perfil</Link>
        <Link to="/admin" className="text-[#A7A29A] hover:text-[#C9A227] transition-colors">Admin</Link>
        <button onClick={handleLogout} className="text-[#A7A29A] hover:text-[#C9A227] transition-colors">Cerrar Sesión</button>
      </div>
    </nav>
  )
}
