const stats = [
  { value: "15+", label: "Anos de experiência" },
  { value: "200+", label: "Pratos no cardápio" },
  { value: "50k+", label: "Clientes satisfeitos" },
  { value: "12", label: "Premiações recebidas" },
];

export default function About() {
  return (
    <section id="sobre" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-56 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                    alt="Prato principal"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-40 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
                    alt="Ambiente do restaurante"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-40 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80"
                    alt="Chef preparando prato"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-56 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80"
                    alt="Mesa posta"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            {/* Badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-900 rounded-2xl px-6 py-4 shadow-xl text-center">
              <p className="font-bold text-2xl">2009</p>
              <p className="text-xs font-medium tracking-wider uppercase">Fundado em</p>
            </div>
          </div>

          {/* Text */}
          <div className="lg:pl-8 pt-8 lg:pt-0">
            <p className="text-amber-500 tracking-[0.3em] uppercase text-sm font-medium mb-3">
              Nossa história
            </p>
            <h2 className="text-stone-900 font-bold text-4xl md:text-5xl leading-tight mb-6">
              Tradição e sabor em cada prato
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-4">
              Há mais de 15 anos, o Casa do Sabor é referência em culinária brasileira
              contemporânea. Nossa cozinha celebra os ingredientes locais com técnicas modernas,
              criando experiências gastronômicas inesquecíveis.
            </p>
            <p className="text-stone-600 leading-relaxed mb-10">
              Sob o comando do Chef Ricardo Mendes, formado na École Ducasse em Paris, nosso
              cardápio muda sazonalmente para oferecer sempre o melhor que a natureza tem a
              oferecer — frescos, locais e sustentáveis.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="border-l-4 border-amber-400 pl-4">
                  <p className="text-stone-900 font-bold text-3xl">{s.value}</p>
                  <p className="text-stone-500 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <a
              href="#reservas"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white font-semibold px-7 py-3.5 rounded-full text-sm tracking-wider uppercase transition-colors duration-200"
            >
              Faça sua reserva
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
