import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', correo: '', contraseña: '', telefono: '', direccion: '' })
  const [alerta, setAlerta] = useState({ msg: '', tipo: '' })
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('https://velvet-society-backend-velvet-socie.vercel.app/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setAlerta({ msg: 'Registro exitoso', tipo: 'success' })
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setAlerta({ msg: data.error || 'Error al registrar', tipo: 'error' })
      }
    } catch {
      setAlerta({ msg: 'Error de conexión', tipo: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] grid grid-cols-1 md:grid-cols-2">
      {/* Left - Imagen */}
      <div className="hidden md:block relative">
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070&auto=format&fit=crop" alt="Salón de eventos" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-end p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D8C08C] mb-2">Ven y encantate</p>
            <h2 className="text-3xl font-light text-[#F5F1E8] tracking-wider leading-snug">Celebra con elegancia cada momento que importa.</h2>
          </div>
        </div>
      </div>

      {/* Right - Formulario */}
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-light text-[#F5F1E8] tracking-widest mb-2">Crear cuenta gratuita</h2>
          <p className="text-[#A7A29A] text-sm mb-8">Únete a Velvet Society y comienza a organizar tus eventos</p>

          {alerta.msg && <div className={`p-3 text-sm mb-4 ${alerta.tipo === 'success' ? 'bg-[#315C4A] text-[#F5F1E8]' : 'bg-[#7A3030] text-[#F5F1E8]'}`}>{alerta.msg}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {['nombre', 'correo', 'contraseña', 'telefono', 'direccion'].map((field) => (
              <div key={field}>
                <label className="block text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-2">{field === 'contraseña' ? 'Contraseña' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input type={field === 'contraseña' ? 'password' : 'text'} name={field} value={form[field]} onChange={handleChange} className="w-full bg-[#181818] border border-[#2A2A2A] text-[#F5F1E8] p-3 text-sm focus:border-[#C9A227] outline-none" placeholder={field === 'contraseña' ? '••••••••' : ''} required={field !== 'telefono' && field !== 'direccion'} />
              </div>
            ))}
            <button type="submit" className="w-full py-3 bg-[#C9A227] text-[#0D0D0D] text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-colors">Crear cuenta</button>
          </form>

          <p className="mt-6 text-[#A7A29A] text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-[#C9A227]">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  )
}
