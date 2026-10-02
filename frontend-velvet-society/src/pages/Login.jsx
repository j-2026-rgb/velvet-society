import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [alerta, setAlerta] = useState({ msg: '', tipo: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ correo, contraseña })
      })
      const data = await res.json()
      if (res.ok) {
        setAlerta({ msg: 'Inicio de sesión exitoso', tipo: 'success' })
        setTimeout(() => navigate(data.usuario?.rol === 'administrador' ? '/admin' : '/'), 1000)
      } else {
        setAlerta({ msg: data.error || 'Error al iniciar sesión', tipo: 'error' })
      }
    } catch {
      setAlerta({ msg: 'Error de conexión', tipo: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] grid grid-cols-1 md:grid-cols-2">
      {/* Left - Imagen */}
      <div className="hidden md:block relative">
        <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop" alt="Salón de eventos" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-end p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D8C08C] mb-2">Comienza con nosotros</p>
            <h2 className="text-3xl font-light text-[#F5F1E8] tracking-wider leading-snug">Cuidamos cada momento para que brille con elegancia.</h2>
          </div>
        </div>
      </div>

      {/* Right - Formulario */}
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-light text-[#F5F1E8] tracking-widest mb-2">Bienvenido de nuevo</h2>
          <p className="text-[#A7A29A] text-sm mb-8">Accede a tu espacio personal Velvet Society</p>

          {alerta.msg && <div className={`p-3 text-sm mb-4 ${alerta.tipo === 'success' ? 'bg-[#315C4A] text-[#F5F1E8]' : 'bg-[#7A3030] text-[#F5F1E8]'}`}>{alerta.msg}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-2">Correo electrónico</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full bg-[#181818] border border-[#2A2A2A] text-[#F5F1E8] p-3 text-sm focus:border-[#C9A227] outline-none" placeholder="tu@correo.com" required />
            </div>
            <div>
              <label className="block text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-2">Contraseña</label>
              <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} className="w-full bg-[#181818] border border-[#2A2A2A] text-[#F5F1E8] p-3 text-sm focus:border-[#C9A227] outline-none" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full py-3 bg-[#C9A227] text-[#0D0D0D] text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-colors">Ingresar</button>
          </form>

          <p className="mt-6 text-[#A7A29A] text-sm">¿No tienes cuenta? <Link to="/registro" className="text-[#C9A227]">Crear cuenta</Link></p>
        </div>
      </div>
    </div>
  )
}
