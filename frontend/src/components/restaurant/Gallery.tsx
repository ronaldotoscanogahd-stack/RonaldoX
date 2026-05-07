const photos = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    alt: "Ambiente do restaurante",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
    alt: "Prato especial",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80",
    alt: "Mesa posta",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    alt: "Chef cozinhando",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80",
    alt: "Sobremesa artística",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
    alt: "Prato colorido",
    span: "col-span-2",
  },
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-500 tracking-[0.3em] uppercase text-sm font-medium mb-3">
            Galeria
          </p>
          <h2 className="text-stone-900 font-bold text-4xl md:text-5xl leading-tight">
            Momentos que ficam na memória
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-48">
          {photos.map((photo) => (
            <div
              key={photo.alt}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${photo.span}`}
              style={{ height: photo.span.includes("row-span-2") ? "auto" : "200px" }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                style={{ minHeight: "200px" }}
              />
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">+</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
