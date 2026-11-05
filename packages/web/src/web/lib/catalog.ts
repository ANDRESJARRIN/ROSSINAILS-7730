export interface Service {
  name: string;
  price: number;
  detail?: string;
}

export interface Category {
  id: string;
  image: string;
  title: string;
  items: Service[];
  includes?: string[];
}

export const categories: Category[] = [
  {
    id: "polygel",
    image: "/images/polygel.jpg",
    title: "Uñas polygel y acrílico",
    includes: ["Aplicación de polygel", "Extensiones", "Relleno", "Mantenimiento"],
    items: [
      { name: "Uñas acrílicas cortas", price: 15 },
      { name: "Soft gel", price: 15 },
      { name: "Polygel", price: 18 },
      { name: "Baño de acrílico", price: 18 },
      { name: "Baño de gel", price: 18 },
      { name: "Base Rubber", price: 18 },
      { name: "Builder Gel", price: 22 },
      { name: "Relleno de acrílico", price: 15 },
      { name: "Mantenimiento de uñas", price: 15 },
      { name: "Retiro de acrílico", price: 8 },
      { name: "Retiro de gel", price: 5 },
      { name: "Reparación de una uña", price: 2 },
    ],
  },
  {
    id: "semipermanente",
    image: "/images/semipermanente.jpg",
    title: "Esmaltado semipermanente",
    includes: ["Esmaltado en gel", "Colores variados", "Francesa", "Efecto cromado", "Efecto ojo de gato"],
    items: [{ name: "Semipermanente", price: 10 }],
  },
  {
    id: "manicure",
    image: "/images/manicure.jpg",
    title: "Manicure",
    items: [
      { name: "Manicure tradicional", price: 5 },
      { name: "Manicure con esmaltado", price: 10 },
    ],
  },
  {
    id: "pedicura",
    image: "/images/pedicura.jpg",
    title: "Pedicura",
    includes: ["Limpieza de pies", "Corte y limado", "Cuidado de cutículas", "Exfoliación", "Hidratación", "Esmaltado semipermanente"],
    items: [
      { name: "Pedicura tradicional", price: 5 },
      { name: "Pedicura semipermanente", price: 12 },
      { name: "Pedicura con diseño", price: 18 },
      { name: "Manicure y pedicure", price: 20 },
    ],
  },
];

export const decorationImage = "/images/decoracion.jpg";

export const decorations: { name: string; price: string }[] = [
  { name: "Francesa", price: "$3" },
  { name: "Efecto cromado", price: "$3" },
  { name: "Ojo de gato", price: "$3" },
  { name: "Piedras y cristales", price: "$2 – $5" },
  { name: "Encapsulados", price: "$3 – $8" },
  { name: "Diseños a mano alzada", price: "$1 – $3 por uña" },
  { name: "Diseños 3D", price: "$3 – $8" },
];

export const WHATSAPP_NUMBER = "593968894235";
export const SALON_NAME = "Rossi Nails";

export const heroImage = "/images/hero.jpg";

export const schedule = [
  { days: "Lunes a domingo", hours: "08:00 – 17:00" },
  { days: "Feriados", hours: "Atendemos con el mismo horario" },
];

// Start times every 30 minutes, last start 16:30 (service ends by 17:00)
export const timeSlots: string[] = (() => {
  const out: string[] = [];
  for (let m = 8 * 60; m <= 16 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60).toString().padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    out.push(`${h}:${mm}`);
  }
  return out;
})();

export const allServices: { name: string; price: number }[] = categories.flatMap((c) => c.items);
