"use client";
import { useState, useEffect } from "react";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Cardápio", href: "#cardapio" },
  { label: "Galeria", href: "#galeria" },
  { label: "Reservas", href: "#reservas" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-stone-900/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#inicio" className="flex items-center gap-2">
            <span className="text-amber-400 text-3xl">✦</span>
            <span className="text-white font-bold text-xl tracking-widest uppercase">
              Casa do Sabor
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-stone-300 hover:text-amber-400 text-sm tracking-wider uppercase transition-colors duration-200"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#reservas"
            className="hidden md:inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200"
          >
            Reservar Mesa
          </a>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-stone-900/98 backdrop-blur-sm border-t border-stone-700">
          <ul className="px-6 py-4 space-y-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block text-stone-300 hover:text-amber-400 text-sm tracking-wider uppercase transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#reservas"
                className="inline-flex bg-amber-500 text-stone-900 font-semibold text-sm px-5 py-2.5 rounded-full"
                onClick={() => setMenuOpen(false)}
              >
                Reservar Mesa
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
