export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />

      {/* Content */}
      <div className="relative text-center px-4 max-w-4xl mx-auto">
        <p className="text-amber-400 tracking-[0.4em] uppercase text-sm mb-4 font-light">
          Bem-vindo ao
        </p>
        <h1 className="text-white font-bold text-6xl md:text-8xl leading-none mb-6 tracking-tight">
          Casa do
          <span className="block text-amber-400">Sabor</span>
        </h1>
        <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Uma experiência gastronômica única no coração da cidade. Culinária
          brasileira contemporânea com ingredientes frescos e sazonais.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#reservas"
            className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold px-8 py-4 rounded-full text-sm tracking-wider uppercase transition-all duration-200 hover:scale-105"
          >
            Reservar Mesa
          </a>
          <a
            href="#cardapio"
            className="border border-white/40 hover:border-amber-400 text-white hover:text-amber-400 font-medium px-8 py-4 rounded-full text-sm tracking-wider uppercase transition-all duration-200"
          >
            Ver Cardápio
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-stone-400 text-xs tracking-widest uppercase">Role para baixo</span>
        <div className="w-px h-12 bg-gradient-to-b from-stone-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
