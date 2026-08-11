"use client";
import { useState } from "react";

export default function Reservation() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const times = [
    "12:00", "12:30", "13:00", "13:30", "14:00",
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
  ];

  return (
    <section id="reservas" className="py-24 bg-stone-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-amber-400 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-amber-400 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div>
            <p className="text-amber-400 tracking-[0.3em] uppercase text-sm font-medium mb-3">
              Reservas
            </p>
            <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight mb-6">
              Reserve sua mesa agora
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-10">
              Garanta seu lugar e prepare-se para uma experiência gastronômica inesquecível.
              Confirmamos sua reserva em até 24 horas.
            </p>

            <div className="space-y-6">
              {[
                { icon: "🕐", title: "Horário de funcionamento", text: "Seg–Sex: 12h–15h | 19h–23h\nSáb–Dom: 12h–23h" },
                { icon: "📍", title: "Localização", text: "Rua das Flores, 120 – Jardins\nSão Paulo – SP" },
                { icon: "📞", title: "Telefone", text: "(11) 3456-7890\nWhatsApp: (11) 99876-5432" },
              ].map((info) => (
                <div key={info.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">{info.title}</p>
                    <p className="text-stone-400 text-sm whitespace-pre-line">{info.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-stone-800 rounded-3xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-white font-bold text-2xl mb-3">Reserva realizada!</h3>
                <p className="text-stone-400 leading-relaxed">
                  Obrigado, <strong className="text-amber-400">{form.name}</strong>! Confirmaremos
                  sua reserva em breve pelo e-mail <strong className="text-amber-400">{form.email}</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-amber-400 text-sm underline underline-offset-4"
                >
                  Fazer nova reserva
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-stone-300 text-sm font-medium mb-2">Nome completo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 text-sm font-medium mb-2">Telefone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 text-sm font-medium mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-stone-300 text-sm font-medium mb-2">Data</label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={form.date}
                      onChange={handleChange}
                      className="w-full bg-stone-700 border border-stone-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 text-sm font-medium mb-2">Horário</label>
                    <select
                      name="time"
                      required
                      value={form.time}
                      onChange={handleChange}
                      className="w-full bg-stone-700 border border-stone-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">--</option>
                      {times.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-300 text-sm font-medium mb-2">Pessoas</label>
                    <select
                      name="guests"
                      value={form.guests}
                      onChange={handleChange}
                      className="w-full bg-stone-700 border border-stone-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      {[1,2,3,4,5,6,7,8].map((n) => (
                        <option key={n} value={n}>{n} pessoa{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 text-sm font-medium mb-2">
                    Observações <span className="text-stone-500 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Alergias, ocasião especial, preferências de mesa..."
                    className="w-full bg-stone-700 border border-stone-600 text-white placeholder-stone-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-4 rounded-xl text-sm tracking-wider uppercase transition-colors duration-200"
                >
                  Confirmar Reserva
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
