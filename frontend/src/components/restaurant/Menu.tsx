"use client";
import { useState } from "react";

type MenuItem = {
  name: string;
  description: string;
  price: string;
  tag?: string;
  image: string;
};

type Category = {
  id: string;
  label: string;
  items: MenuItem[];
};

const categories: Category[] = [
  {
    id: "entradas",
    label: "Entradas",
    items: [
      {
        name: "Carpaccio de Carne",
        description: "Finas fatias de filé mignon com rúcula, parmesão e alcaparras",
        price: "R$ 48",
        tag: "Favorito",
        image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&q=80",
      },
      {
        name: "Ceviche Tropical",
        description: "Peixe fresco marinado em leite de tigre com manga e coentro",
        price: "R$ 52",
        image: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400&q=80",
      },
      {
        name: "Bruschetta da Casa",
        description: "Pão artesanal com tomate confit, manjericão e azeite trufado",
        price: "R$ 38",
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80",
      },
    ],
  },
  {
    id: "principais",
    label: "Pratos Principais",
    items: [
      {
        name: "Filé ao Molho de Funghi",
        description: "Medalhão de filé mignon com risoto de funghi secchi e molho de vinho tinto",
        price: "R$ 98",
        tag: "Chef recomenda",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
      },
      {
        name: "Salmão Grelhado",
        description: "Salmão norueguês com legumes salteados, purê de batata doce e dill",
        price: "R$ 85",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
      },
      {
        name: "Frango Caipira",
        description: "Coxa e sobrecoxa de frango caipira com farofa de castanhas e arroz negro",
        price: "R$ 72",
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
      },
    ],
  },
  {
    id: "sobremesas",
    label: "Sobremesas",
    items: [
      {
        name: "Petit Gâteau",
        description: "Bolinho de chocolate com centro quente e sorvete de baunilha",
        price: "R$ 38",
        tag: "Favorito",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
      },
      {
        name: "Pudim de Leite",
        description: "Clássico pudim de leite condensado com calda de caramelo artesanal",
        price: "R$ 28",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
      },
      {
        name: "Cheesecake de Maracujá",
        description: "Torta fria de cream cheese com geleia de maracujá fresco",
        price: "R$ 32",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80",
      },
    ],
  },
  {
    id: "bebidas",
    label: "Bebidas",
    items: [
      {
        name: "Caipirinha Premium",
        description: "Cachaça artesanal envelhecida, limão siciliano e açúcar demerara",
        price: "R$ 32",
        image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?w=400&q=80",
      },
      {
        name: "Vinho da Casa",
        description: "Seleção do sommelier — tinto, branco ou rosé. Taça 150ml",
        price: "R$ 28",
        tag: "Sommelier",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
      },
      {
        name: "Mocktail Tropical",
        description: "Mix de frutas tropicais, água de coco e hortelã. Sem álcool",
        price: "R$ 22",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
      },
    ],
  },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("entradas");
  const active = categories.find((c) => c.id === activeCategory)!;

  return (
    <section id="cardapio" className="py-24 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-amber-400 tracking-[0.3em] uppercase text-sm font-medium mb-3">
            Nosso cardápio
          </p>
          <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight">
            Sabores que encantam
          </h2>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-stone-900"
                  : "border border-stone-600 text-stone-400 hover:border-amber-400 hover:text-amber-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.items.map((item) => (
            <div
              key={item.name}
              className="group bg-stone-800 rounded-2xl overflow-hidden hover:bg-stone-750 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/20"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.tag && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-stone-900 text-xs font-bold px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                  <span className="text-amber-400 font-bold text-lg whitespace-nowrap">{item.price}</span>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-stone-500 text-sm">
            Cardápio completo disponível no restaurante · Informamos alérgenos sob consulta
          </p>
        </div>
      </div>
    </section>
  );
}
