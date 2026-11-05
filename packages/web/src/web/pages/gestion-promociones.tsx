import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/api";
import { resizeImage } from "../lib/resize-image";
import { useAdminPromotions } from "../queries/promotions";

// Hidden page: not linked from the site. Requires PROMO_ADMIN_KEY.
const KEY_STORAGE = "rossi-promo-key";

type Promo = {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  active: boolean;
};

export default function GestionPromocionesPage() {
  const qc = useQueryClient();
  const [key, setKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE);
    if (saved) setKey(saved);
  }, []);

  const { data, isLoading, isError, error: listError } = useAdminPromotions(key);

  useEffect(() => {
    if (isError) {
      sessionStorage.removeItem(KEY_STORAGE);
      setKey("");
      setError((listError as Error)?.message || "Clave incorrecta");
    }
  }, [isError, listError]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["promotions"] });
  };

  if (!key) {
    return (
      <Shell>
        <form
          className="mx-auto mt-40 max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            sessionStorage.setItem(KEY_STORAGE, keyInput);
            setKey(keyInput);
          }}
        >
          <label className="mb-2 block font-sans text-[11px] uppercase tracking-[0.3em] text-gold">
            Clave
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full border border-gold/30 bg-carbon px-4 py-3 font-sans text-cream outline-none focus:border-gold"
          />
          {error && <p className="mt-3 font-sans text-sm text-rose">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-full border border-gold py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-gold hover:text-ink"
          >
            Entrar
          </button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <UploadForm adminKey={key} onDone={refresh} />

      <h2 className="mt-16 font-display text-3xl text-cream">Promociones cargadas</h2>
      {isLoading && <p className="mt-4 font-sans text-sm text-cream/60">Cargando…</p>}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {(data ?? []).map((p) => (
          <PromoRow key={p.id} promo={p} adminKey={key} onChange={refresh} />
        ))}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-12 font-sans text-cream md:px-10">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
}

function UploadForm({ adminKey, onDone }: { adminKey: string; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMsg("Elige una imagen");
    setBusy(true);
    setMsg("");
    try {
      const { base64, contentType } = await resizeImage(file);
      await client.promotions.create({ key: adminKey, title, body, contentType, imageBase64: base64 });
      setFile(null);
      setTitle("");
      setBody("");
      setMsg("Promoción publicada");
      onDone();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full border border-gold/30 bg-carbon px-4 py-3 font-sans text-cream outline-none focus:border-gold";

  return (
    <form onSubmit={submit} className="grid gap-5 border border-gold/20 p-6 md:grid-cols-2">
      <h2 className="font-display text-3xl text-cream md:col-span-2">Nueva promoción</h2>
      <div>
        <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-gold">Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full font-sans text-sm text-cream/80 file:mr-4 file:rounded-full file:border file:border-gold file:bg-transparent file:px-4 file:py-2 file:text-gold-light"
        />
      </div>
      <div>
        <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-gold">Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-gold">Texto</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className={input}
        />
      </div>
      <div className="md:col-span-2 flex items-center gap-6">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full border border-gold px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-gold hover:text-ink disabled:opacity-50"
        >
          {busy ? "Subiendo…" : "Publicar"}
        </button>
        {msg && <p className="text-sm text-cream/70">{msg}</p>}
      </div>
    </form>
  );
}

function PromoRow({ promo, adminKey, onChange }: { promo: Promo; adminKey: string; onChange: () => void }) {
  const [title, setTitle] = useState(promo.title);
  const [body, setBody] = useState(promo.body);
  const [busy, setBusy] = useState(false);
  const dirty = title !== promo.title || body !== promo.body;

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      onChange();
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full border border-gold/30 bg-carbon px-3 py-2 font-sans text-sm text-cream outline-none focus:border-gold";

  return (
    <div className={`border p-5 ${promo.active ? "border-gold/30" : "border-cream/10 opacity-60"}`}>
      <div className="aspect-[4/5] overflow-hidden bg-carbon">
        <img src={promo.imageUrl} alt="" className="h-full w-full object-cover" />
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className={`mt-4 ${input}`} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Texto" className={`mt-3 ${input}`} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          disabled={busy || !dirty}
          onClick={() => run(() => client.promotions.update({ key: adminKey, id: promo.id, title, body }))}
          className="rounded-full border border-gold px-4 py-1.5 text-[12px] uppercase tracking-[0.2em] text-gold-light disabled:opacity-40"
        >
          Guardar texto
        </button>
        <button
          disabled={busy}
          onClick={() => run(() => client.promotions.update({ key: adminKey, id: promo.id, active: !promo.active }))}
          className="rounded-full border border-cream/30 px-4 py-1.5 text-[12px] uppercase tracking-[0.2em] text-cream/80 disabled:opacity-40"
        >
          {promo.active ? "Desactivar" : "Activar"}
        </button>
        <button
          disabled={busy}
          onClick={() => {
            if (window.confirm("¿Borrar esta promoción?")) {
              run(() => client.promotions.remove({ key: adminKey, id: promo.id }));
            }
          }}
          className="rounded-full px-4 py-1.5 text-[12px] uppercase tracking-[0.2em] text-rose disabled:opacity-40"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
