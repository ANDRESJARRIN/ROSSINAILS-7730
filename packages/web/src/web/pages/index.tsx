import { useEffect, useMemo, useState } from "react";
import { SiteNav } from "../components/site-nav";
import {
  categories,
  decorations,
  decorationImage,
  allServices,
  heroImage,
  schedule,
  timeSlots,
  WHATSAPP_NUMBER,
  SALON_NAME,
  type Category,
} from "../lib/catalog";

interface FormState {
  name: string;
  phone: string;
  address: string;
  reference: string;
  date: string;
  time: string;
  notes: string;
  services: string[];
  decos: string[];
}

const emptyForm: FormState = {
  name: "",
  phone: "",
  address: "",
  reference: "",
  date: "",
  time: "",
  notes: "",
  services: [],
  decos: [],
};


function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 text-gold ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.7 3 5 6.6 5c2.1 0 3.6 1.2 5.4 3 1.8-1.8 3.3-3 5.4-3C21 5 23.1 8.7 21.6 11.9 19.5 16.4 12 21 12 21z" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
      {children}
    </p>
  );
}

function Hero() {
  return (
    <header id="top" className="relative flex min-h-[92vh] items-end overflow-hidden">
      <img
        src={heroImage}
        alt="Salón Rossi Nails"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:px-10 md:pb-28">
        <div className="max-w-2xl animate-[fadeUp_1s_ease-out_both]">
          <img
            src="/logo.png"
            alt="Rossi Nails"
            className="mb-10 h-44 w-auto drop-shadow-[0_0_40px_rgba(201,162,75,0.35)] md:h-60"
          />
          <Eyebrow>Atención a domicilio · Ecuador</Eyebrow>
          <h1 className="font-display text-6xl font-medium leading-[0.95] text-cream md:text-8xl">
            El arte de <em className="text-gold-light">cuidar</em> tus manos
          </h1>
          <p className="mt-8 max-w-lg font-sans text-base leading-relaxed text-cream/70">
            Polygel, esmaltado semipermanente, pedicura y decoraciones. Atención a domicilio.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <a
              href="#agendar"
              className="rounded-full bg-gold px-10 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.25em] text-ink transition hover:bg-gold-light"
            >
              Agendar cita
            </a>
            <a
              href="#servicios"
              className="font-sans text-[13px] font-medium uppercase tracking-[0.2em] text-cream underline-offset-8 transition hover:text-gold hover:underline"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function ServiceRow({ cat, index }: { cat: Category; index: number }) {
  const reversed = index % 2 === 1;
  return (
    <article className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
      <div className={`md:col-span-6 ${reversed ? "md:order-2" : ""}`}>
        <div className="group relative overflow-hidden rounded-[28px]">
          <img
            src={cat.image}
            alt={cat.title}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-gold/25" />
          <span className="absolute left-6 top-6 font-display text-6xl italic text-cream/90 drop-shadow">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className={`md:col-span-6 ${reversed ? "md:order-1" : ""}`}>
        <Eyebrow>Servicio {String(index + 1).padStart(2, "0")}</Eyebrow>
        <h3 className="font-display text-4xl font-medium text-cream md:text-5xl">{cat.title}</h3>

        <ul className="mt-8 space-y-0">
          {cat.items.map((s) => (
            <li key={s.name} className="group flex items-baseline gap-3 border-b border-gold/10 py-4">
              <span className="font-sans text-[15px] text-cream/90">{s.name}</span>
              <span className="mb-1 flex-1 border-b border-dotted border-gold/30" />
              <span className="font-display text-2xl font-semibold text-gold-light">${s.price}</span>
            </li>
          ))}
        </ul>

        {cat.includes && (
          <div className="mt-8">
            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.3em] text-rose">Incluye</p>
            <div className="flex flex-wrap gap-2">
              {cat.includes.map((i) => (
                <span
                  key={i}
                  className="rounded-full border border-gold/20 px-4 py-1.5 font-sans text-[11px] tracking-wide text-cream/70"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Decorations() {
  return (
    <section id="decoraciones" className="relative overflow-hidden bg-carbon px-6 py-32 md:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <div className="relative">
          <img
            src={decorationImage}
            alt="Decoraciones de uñas"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-[28px] object-cover"
          />
          <div className="absolute -bottom-6 -right-6 hidden h-40 w-40 rounded-full border border-gold/30 md:block" />
        </div>
        <div>
          <Eyebrow>Extras</Eyebrow>
          <h2 className="font-display text-5xl font-medium text-cream md:text-6xl">Decoraciones</h2>
          <div className="mt-6 max-w-md">
            <Ornament />
          </div>
          <ul className="mt-10 divide-y divide-gold/10">
            {decorations.map((d) => (
              <li key={d.name} className="flex items-baseline justify-between py-4">
                <span className="font-sans text-[15px] text-cream/90">{d.name}</span>
                <span className="font-display text-xl font-semibold text-rose">{d.price}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}

function Booking() {
  const [form, setForm] = useState<FormState>({ ...emptyForm, date: todayISO() });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const total = useMemo(
    () =>
      form.services.reduce((sum, name) => {
        const s = allServices.find((x) => x.name === name);
        return sum + (s?.price ?? 0);
      }, 0),
    [form.services],
  );

  const toggleDeco = (name: string) =>
    setForm((f) => ({
      ...f,
      decos: f.decos.includes(name) ? f.decos.filter((d) => d !== name) : [...f.decos, name],
    }));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleService = (name: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(name)
        ? f.services.filter((s) => s !== name)
        : [...f.services, name],
    }));

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("ok");
      },
      () => setLocStatus("error"),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.services.length === 0) e.services = "Elige al menos un servicio";
    if (!form.date) e.date = "Elige una fecha";
    if (!form.time) e.time = "Elige una hora";
    if (form.name.trim().length < 2) e.name = "Escribe tu nombre";
    if (form.phone.replace(/\D/g, "").length < 9) e.phone = "Escribe un teléfono válido";
    if (form.address.trim().length < 5) e.address = "Escribe la dirección donde te atendemos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildMessage = () => {
    const lines = [
      `Hola ${SALON_NAME}, quiero agendar una cita a domicilio.`,
      "",
      "*Servicios:*",
      ...form.services.map((s) => {
        const price = allServices.find((x) => x.name === s)?.price;
        return `- ${s} ($${price})`;
      }),
      `*Total servicios:* $${total}`,
      ...(form.decos.length
        ? ["*Decoraciones:*", ...form.decos.map((d) => `- ${d} (${decorations.find((x) => x.name === d)?.price})`)]
        : []),
      "",
      `*Fecha:* ${formatDate(form.date)}`,
      `*Hora:* ${form.time}`,
      "",
      `*Nombre:* ${form.name.trim()}`,
      `*Teléfono:* ${form.phone.trim()}`,
      `*Dirección:* ${form.address.trim()}`,
    ];
    if (form.reference.trim()) lines.push(`*Referencia:* ${form.reference.trim()}`);
    if (coords) lines.push(`*Mi ubicación:* https://maps.google.com/?q=${coords.lat},${coords.lng}`);
    if (form.notes.trim()) lines.push("", `*Notas:* ${form.notes.trim()}`);
    return lines.join("\n");
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const field =
    "w-full border-0 border-b border-gold/30 bg-transparent px-0 py-3 font-sans text-[15px] text-cream placeholder:text-warm-gray/50 transition focus:border-gold focus:outline-none";
  const label = "mb-1 block font-sans text-[10px] uppercase tracking-[0.3em] text-gold/90";
  const err = "mt-2 font-sans text-xs text-rose";
  const legend = "mb-8 flex items-center gap-4 font-display text-3xl text-cream";

  return (
    <section id="agendar" className="px-6 py-32 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <Eyebrow>Reserva</Eyebrow>
          <h2 className="font-display text-5xl font-medium text-cream md:text-6xl">Agenda tu cita</h2>
          <div className="mx-auto mt-6 max-w-xs">
            <Ornament />
          </div>
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="grid gap-16 rounded-[32px] border border-gold/15 bg-carbon p-8 md:p-14"
        >
          {/* 1. Servicios */}
          <fieldset>
            <legend className={legend}>
              <span className="font-display italic text-gold">01</span> Elige tus servicios
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {allServices.map((s) => {
                const checked = form.services.includes(s.name);
                return (
                  <label
                    key={s.name}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 font-sans text-sm transition ${
                      checked
                        ? "border-gold bg-gold/10 text-cream"
                        : "border-gold/15 text-cream/70 hover:border-gold/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="accent-[#C9A24B]"
                        checked={checked}
                        onChange={() => toggleService(s.name)}
                      />
                      {s.name}
                    </span>
                    <span className="font-display text-lg text-gold-light">${s.price}</span>
                  </label>
                );
              })}
            </div>
            {errors.services && <p className={err}>{errors.services}</p>}

            <p className="mb-4 mt-10 font-sans text-[10px] uppercase tracking-[0.3em] text-rose">
              Decoraciones (opcional)
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {decorations.map((d) => {
                const checked = form.decos.includes(d.name);
                return (
                  <label
                    key={d.name}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 font-sans text-sm transition ${
                      checked
                        ? "border-rose bg-rose/10 text-cream"
                        : "border-gold/15 text-cream/70 hover:border-gold/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="accent-[#E9B7BD]"
                        checked={checked}
                        onChange={() => toggleDeco(d.name)}
                      />
                      {d.name}
                    </span>
                    <span className="font-display text-lg text-rose">{d.price}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex items-baseline justify-end gap-4">
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-warm-gray">
                Total estimado
              </span>
              <span className="font-display text-4xl text-gold-light">${total}</span>
            </div>
            {form.decos.length > 0 && (
              <p className="mt-2 text-right font-sans text-xs text-warm-gray">
                Las decoraciones se suman al total según el diseño.
              </p>
            )}
          </fieldset>

          {/* 2. Fecha y hora */}
          <fieldset>
            <legend className={legend}>
              <span className="font-display italic text-gold">02</span> Fecha y hora
            </legend>
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className={label}>
                  Fecha
                </label>
                <input
                  id="date"
                  type="date"
                  min={todayISO()}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className={`${field} [color-scheme:dark]`}
                />
                {errors.date && <p className={err}>{errors.date}</p>}
              </div>
              <div>
                <label htmlFor="time" className={label}>
                  Hora
                </label>
                <select
                  id="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className={`${field} bg-carbon`}
                >
                  <option value="">Selecciona una hora</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.time && <p className={err}>{errors.time}</p>}
              </div>
            </div>
            <p className="mt-6 font-sans text-xs text-warm-gray">
              Atendemos todos los días de 08:00 a 17:00, incluidos feriados.
            </p>
          </fieldset>

          {/* 3. Datos */}
          <fieldset>
            <legend className={legend}>
              <span className="font-display italic text-gold">03</span> Tus datos y dirección
            </legend>
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={label}>
                  Nombre
                </label>
                <input id="name" className={field} value={form.name} onChange={(e) => update("name", e.target.value)} />
                {errors.name && <p className={err}>{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={label}>
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={field}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
                {errors.phone && <p className={err}>{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className={label}>
                  Dirección a domicilio
                </label>
                <input
                  id="address"
                  placeholder="Calle, número, barrio, ciudad"
                  className={field}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
                {errors.address && <p className={err}>{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="reference" className={label}>
                  Referencia (opcional)
                </label>
                <input
                  id="reference"
                  placeholder="Casa blanca con portón negro, frente al parque"
                  className={field}
                  value={form.reference}
                  onChange={(e) => update("reference", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-dashed border-gold/30 p-6">
              <div>
                <p className="font-sans text-sm font-medium text-cream">Compartir mi ubicación</p>
                <p className="mt-1 font-sans text-xs text-warm-gray">
                  Usa el GPS de tu celular para llegar con exactitud.
                </p>
                {locStatus === "ok" && (
                  <p className="mt-2 font-sans text-xs text-gold-light">Ubicación lista para enviar.</p>
                )}
                {locStatus === "error" && (
                  <p className={err}>No pudimos obtener tu ubicación. Revisa permisos o escribe tu dirección.</p>
                )}
              </div>
              <button
                type="button"
                onClick={shareLocation}
                className="rounded-full border border-gold px-6 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-gold-light transition hover:bg-gold hover:text-ink"
              >
                {locStatus === "loading" ? "Obteniendo..." : coords ? "Actualizar" : "Compartir"}
              </button>
            </div>
          </fieldset>

          <div>
            <label htmlFor="notes" className={label}>
              Notas (opcional)
            </label>
            <textarea id="notes" rows={2} className={field} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-full bg-gold py-5 font-sans text-[12px] font-semibold uppercase tracking-[0.3em] text-ink transition hover:bg-gold-light"
            >
              Confirmar por WhatsApp
            </button>
            <p className="mt-4 text-center font-sans text-xs text-warm-gray">
              Se abrirá WhatsApp con el resumen de tu cita para enviarlo al salón.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contacto" className="border-t border-gold/15 bg-carbon px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl italic text-gold-light">Rossi Nails</p>
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-cream/60">
            Servicio de uñas a domicilio.
          </p>
        </div>
        <div>
          <p className="mb-5 font-sans text-[10px] uppercase tracking-[0.3em] text-gold">Horario</p>
          <ul className="space-y-3">
            {schedule.map((s) => (
              <li key={s.days} className="flex justify-between gap-6 border-b border-gold/10 pb-3 font-sans text-sm">
                <span className="text-cream/70">{s.days}</span>
                <span className="text-gold-light">{s.hours}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-5 font-sans text-[10px] uppercase tracking-[0.3em] text-gold">Contacto</p>
          <p className="font-display text-2xl text-cream">+593 96 889 4235</p>
          <p className="mt-2 font-sans text-sm text-cream/60">WhatsApp · Servicio a domicilio</p>
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-7xl">
        <Ornament />
        <p className="mt-8 text-center font-sans text-[11px] uppercase tracking-[0.25em] text-warm-gray">
          © {new Date().getFullYear()} {SALON_NAME}
        </p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-ink font-sans text-cream antialiased">
      <SiteNav home />
      <Hero />

      <section id="servicios" className="px-6 py-32 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-24 max-w-2xl">
            <Eyebrow>Catálogo</Eyebrow>
            <h2 className="font-display text-5xl font-medium leading-tight text-cream md:text-6xl">
              Nuestros servicios
            </h2>
          </div>
          <div className="space-y-32">
            {categories.map((cat, i) => (
              <ServiceRow key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Decorations />
      <Booking />
      <Footer />
    </div>
  );
}

export default Index;
