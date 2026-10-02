export default function Home() {
  return (
    <div>
      <section className="text-center py-24 bg-[#181818] border-b border-[#2A2A2A]">
        <h1 className="text-5xl font-light tracking-widest uppercase text-[#F5F1E8] mb-4">Velvet Society</h1>
        <p className="text-lg text-[#D8C08C] max-w-xl mx-auto mb-8">Donde la exclusividad se convierte en experiencia. Servicios premium diseñados para quienes buscan lo extraordinario.</p>
        <a href="/servicios" className="inline-block px-8 py-3 bg-[#C9A227] text-[#0D0D0D] font-semibold text-sm uppercase tracking-widest rounded-sm hover:bg-[#D4AF37] transition-colors">Descubrir Servicios</a>
      </section>
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[#181818] border border-[#2A2A2A] rounded-sm p-8">
          <h2 className="text-2xl font-light tracking-widest text-[#C9A227] mb-4">Bienvenido a Velvet Society</h2>
          <p className="text-[#A7A29A] mb-4">Somos una plataforma dedicada a ofrecer servicios exclusivos con los más altos estándares de calidad.</p>
          <p className="text-[#A7A29A]">Explora nuestro catálogo de servicios y descubre todo lo que tenemos para ofrecerte.</p>
        </div>
      </div>
    </div>
  )
}
