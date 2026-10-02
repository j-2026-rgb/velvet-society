export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center text-center bg-black">
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        <div className="relative z-10 max-w-3xl px-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D8C08C] mb-4">Espacio creado para celebrar con elegancia</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-widest text-[#F5F1E8] mb-6 leading-tight">Donde la experiencia comienza con elegancia</h1>
          <p className="text-[#A7A29A] text-sm mb-8">Un refugio de sofisticación para bodas, reuniones íntimas y celebraciones memorables.</p>
          <a href="/servicios" className="inline-block px-8 py-3 border border-[#C9A227] text-[#C9A227] text-xs uppercase tracking-[0.2em] hover:bg-[#C9A227] hover:text-[#0D0D0D] transition-colors">Explorar experiencia</a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-xl font-light tracking-widest text-center text-[#F5F1E8] mb-12">Vive un evento memorable</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { num: '120+', label: 'Eventos realizados', desc: 'bodas, cenas y celebraciones únicas' },
            { num: '24/7', label: 'Atención privada', desc: 'asistencia constante para los detalles' },
            { num: '15+', label: 'Años de experiencia', desc: 'creando momentos inolvidables' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl text-[#C9A227] font-light mb-2">{s.num}</div>
              <div className="text-[#D8C08C] text-xs uppercase tracking-[0.2em] mb-1">{s.label}</div>
              <div className="text-[#A7A29A] text-xs">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-light tracking-widest text-[#F5F1E8]">Membresías premium</h2>
          <a href="/servicios" className="text-[#C9A227] text-xs uppercase tracking-[0.2em] border-b border-[#C9A227]">Ver todas</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Banquete exclusivo', price: '$1,200', desc: 'Catering de autor con maridaje de vinos.' },
            { name: 'Iluminación', price: '$850', desc: 'Ambientación con luz cálida y escénica.' },
            { name: 'Cena íntima', price: '$950', desc: 'Servicio a la mesa con menú degustación.' },
          ].map((s, i) => (
            <div key={i} className="bg-[#181818] border border-[#2A2A2A] p-6">
              <h3 className="text-[#F5F1E8] font-light tracking-widest mb-2">{s.name}</h3>
              <p className="text-[#A7A29A] text-xs mb-4">{s.desc}</p>
              <div className="text-[#C9A227] text-sm mb-4">{s.price}</div>
              <a href="/servicios" className="text-[#C9A227] text-xs uppercase tracking-[0.2em] border border-[#C9A227] px-4 py-2 hover:bg-[#C9A227] hover:text-[#0D0D0D] transition-colors">Ver servicio</a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-[#181818] border-t border-[#2A2A2A] text-center">
        <h2 className="text-2xl font-light tracking-widest text-[#F5F1E8] mb-4">¿Tu celebración merece un espacio especial?</h2>
        <p className="text-[#A7A29A] text-sm mb-8">Crea un ambiente memorable guiado por la elegancia</p>
        <a href="/registro" className="inline-block px-8 py-3 bg-[#C9A227] text-[#0D0D0D] text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-colors">Reservar ahora</a>
      </section>
    </div>
  )
}
