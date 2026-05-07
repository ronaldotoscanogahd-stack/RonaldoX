const socials = [
  { label: "Instagram", href: "#", icon: "📸" },
  { label: "Facebook", href: "#", icon: "👤" },
  { label: "TripAdvisor", href: "#", icon: "⭐" },
];

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Cardápio", href: "#cardapio" },
  { label: "Galeria", href: "#galeria" },
  { label: "Reservas", href: "#reservas" },
];

export default function Footer() {
  return (
    <footer id="contato" className="bg-stone-950 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-400 text-2xl">✦</span>
              <span className="text-white font-bold text-xl tracking-widest uppercase">
                Casa do Sabor
              </span>
            </div>
            <p className="text-stone-500 leading-relaxed mb-6 max-w-sm">
              Uma experiência gastronômica única que celebra os ingredientes brasileiros com
              técnicas contemporâneas e muito amor.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 bg-stone-800 hover:bg-amber-500 rounded-xl flex items-center justify-center transition-colors duration-200 text-lg"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Navegação
            </h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-stone-500 hover:text-amber-400 text-sm transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Contato
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-stone-600 text-xs uppercase tracking-wider mb-1">Endereço</p>
                <p className="text-stone-400">Rua das Flores, 120 – Jardins</p>
                <p className="text-stone-400">São Paulo – SP, 01427-000</p>
              </li>
              <li>
                <p className="text-stone-600 text-xs uppercase tracking-wider mb-1">Telefone</p>
                <p className="text-stone-400">(11) 3456-7890</p>
              </li>
              <li>
                <p className="text-stone-600 text-xs uppercase tracking-wider mb-1">E-mail</p>
                <p className="text-stone-400">contato@casadosabor.com.br</p>
              </li>
              <li>
                <p className="text-stone-600 text-xs uppercase tracking-wider mb-1">Horário</p>
                <p className="text-stone-400">Seg–Sex: 12h–15h | 19h–23h</p>
                <p className="text-stone-400">Sáb–Dom: 12h–23h</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <p>© 2024 Casa do Sabor. Todos os direitos reservados.</p>
          <p>Feito com ❤️ em São Paulo</p>
        </div>
      </div>
    </footer>
  );
}
