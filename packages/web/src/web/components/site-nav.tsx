import { useEffect, useState } from "react";

// `home` = true on the catalog page, where section links are in-page anchors.
// On other pages they jump back to the catalog first.
export function SiteNav({ home = false }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = home ? "" : "/";
  const links = [
    { href: `${base}#servicios`, label: "Servicios" },
    { href: `${base}#decoraciones`, label: "Decoraciones" },
    { href: "/promociones", label: "Promociones" },
    { href: `${base}#contacto`, label: "Contacto" },
  ];

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || !home ? "border-b border-gold/15 bg-ink/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <span className="flex-1" />
        <ul className="hidden items-center gap-6 xl:gap-8 md:flex">
          {links.map((n) => (
            <li key={n.label}>
              <a
                href={n.href}
                className="font-sans text-[13px] font-medium uppercase tracking-[0.2em] text-cream transition hover:text-gold"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`${base}#agendar`}
          className="rounded-full border border-gold px-5 py-2 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-gold-light transition hover:bg-gold hover:text-ink"
        >
          Reservar
        </a>
      </div>
    </nav>
  );
}
