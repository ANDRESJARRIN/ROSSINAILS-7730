import { SiteNav } from "../components/site-nav";
import { usePromotions } from "../queries/promotions";

export default function PromocionesPage() {
  const { data, isLoading } = usePromotions();

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 md:px-10">
        <h1 className="font-display text-5xl font-medium text-cream md:text-6xl">Promociones</h1>
        <div className="mt-6 h-px w-24 bg-gold" />

        {isLoading && <p className="mt-12 font-sans text-sm text-cream/60">Cargando…</p>}

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((p) => (
            <article key={p.id} className="group">
              <div className="aspect-[4/5] overflow-hidden border border-gold/20 bg-carbon">
                <img
                  src={p.imageUrl}
                  alt={p.title || "Promoción"}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              {p.title && (
                <h2 className="mt-6 font-display text-3xl font-medium text-cream">{p.title}</h2>
              )}
              {p.body && (
                <p className="mt-3 whitespace-pre-line font-sans text-base leading-relaxed text-cream/75">
                  {p.body}
                </p>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
