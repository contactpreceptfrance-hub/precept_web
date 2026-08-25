import Image from 'next/image'

export function ShopHero() {
  return (
    <section className="relative min-h-[320px] flex items-center overflow-hidden bg-[#0c1f3f]">
      {/* Background — same image as landing page hero */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero_section_precept.png"
          alt=""
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        {/* Same dual-layer overlay as Hero component */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071d45]/82 via-[#071d45]/55 to-[#071d45]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1830]/75 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-6 sm:px-12 py-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#46c4c0]/15 border border-[#46c4c0]/35 text-[#46c4c0] rounded-full text-xs font-semibold uppercase tracking-widest mb-5">
          📚 Notre Boutique
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-[0_3px_14px_rgba(4,18,38,0.55)]">
          Livres &amp; <span className="text-[#46c4c0]">Formations</span>
        </h1>
        <p className="text-white text-lg font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(2,15,34,0.45)]">
          Des ressources pour approfondir votre connaissance de la Parole de Dieu.
          Étudiez les Écritures avec clarté et conviction.
        </p>
      </div>
    </section>
  )
}
