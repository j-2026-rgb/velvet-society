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
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-8">
        <h2 className="text-2xl text-center text-[#C9A227] mb-2">Iniciar Sesión</h2>
        <p className="text-center text-[#A7A29A] mb-6">Accede a tu cuenta Velvet Society</p>

        {alerta.msg && (
          <div className={`p-3 rounded-sm mb-4 text-sm ${alerta.tipo === 'success' ? 'bg-[#315C4A]' : 'bg-[#7A3030]'}`}>{alerta.msg}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#D8C08C] text-xs uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm focus:border-[#C9A227] outline-none" placeholder="tu@correo.com" required />
          </div>
          <div className="mb-6">
            <label className="block text-[#D8C08C] text-xs uppercase tracking-wider mb-2">Contraseña</label>
            <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} className="w-full p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm focus:border-[#C9A227] outline-none" placeholder="••••••••" required />
          </div>
          <button type="submit" className="w-full py-3 bg-[#C9A227] text-[#0D0D0D] font-semibold uppercase tracking-widest rounded-sm hover:bg-[#D4AF37] transition-colors">Ingresar</button>
        </form>
        <p className="text-center mt-4 text-[#A7A29A]">¿No tienes cuenta? <Link to="/registro" className="text-[#C9A227]">Regístrate</Link></p>
      </div>
    </div>
  )
}
