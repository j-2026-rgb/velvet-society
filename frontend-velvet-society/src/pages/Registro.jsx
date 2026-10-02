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
      const res = await fetch('https://backend-velvet-society.onrender.com/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-8">
        <h2 className="text-2xl text-center text-[#C9A227] mb-2">Crear Cuenta</h2>
        <p className="text-center text-[#A7A29A] mb-6">Únete a Velvet Society</p>
        {alerta.msg && <div className={`p-3 rounded-sm mb-4 text-sm ${alerta.tipo === 'success' ? 'bg-[#315C4A]' : 'bg-[#7A3030]'}`}>{alerta.msg}</div>}
        <form onSubmit={handleSubmit}>
          {['nombre', 'correo', 'contraseña', 'telefono', 'direccion'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-[#D8C08C] text-xs uppercase tracking-wider mb-2">{field === 'contraseña' ? 'Contraseña' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type={field === 'contraseña' ? 'password' : 'text'} name={field} value={form[field]} onChange={handleChange} className="w-full p-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#F5F1E8] rounded-sm focus:border-[#C9A227] outline-none" placeholder={field === 'contraseña' ? '••••••••' : ''} required={field !== 'telefono' && field !== 'direccion'} />
            </div>
          ))}
          <button type="submit" className="w-full py-3 bg-[#C9A227] text-[#0D0D0D] font-semibold uppercase tracking-widest rounded-sm hover:bg-[#D4AF37] transition-colors">Registrarse</button>
        </form>
        <p className="text-center mt-4 text-[#A7A29A]">¿Ya tienes cuenta? <Link to="/login" className="text-[#C9A227]">Inicia Sesión</Link></p>
      </div>
    </div>
  )
}
