import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { uploadPublic } from "../lib/s3";

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Checks the admin key against PROMO_ADMIN_KEY from the root .env. */
function assertAdmin(key: string) {
  const expected = process.env.PROMO_ADMIN_KEY;
  if (!expected || key !== expected) {
    throw new ORPCError("UNAUTHORIZED", { message: "Clave incorrecta" });
  }
}

const keySchema = z.object({ key: z.string().min(1) });

export const promotions = {
  /** Public: active promotions only, newest first. */
  list: base.handler(() =>
    db
      .select()
      .from(schema.promotions)
      .where(eq(schema.promotions.active, true))
      .orderBy(desc(schema.promotions.createdAt)),
  ),

  /** Admin: every promotion, active or not. */
  adminList: base.input(keySchema).handler(async ({ input }) => {
    assertAdmin(input.key);
    return db.select().from(schema.promotions).orderBy(desc(schema.promotions.createdAt));
  }),

  /** Admin: upload an image (base64, already resized in the browser) and its text. */
  create: base
    .input(
      keySchema.extend({
        title: z.string().max(120),
        body: z.string().max(1000),
        contentType: z.string(),
        imageBase64: z.string().min(1),
      }),
    )
    .handler(async ({ input }) => {
      assertAdmin(input.key);
      const ext = IMAGE_TYPES[input.contentType];
      if (!ext) throw new ORPCError("BAD_REQUEST", { message: "Formato de imagen no válido" });

      const buffer = Buffer.from(input.imageBase64, "base64");
      if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
        throw new ORPCError("BAD_REQUEST", { message: "La imagen debe pesar menos de 6 MB" });
      }

      const key = `promociones/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const imageUrl = await uploadPublic(key, buffer, input.contentType);

      const [row] = await db
        .insert(schema.promotions)
        .values({ title: input.title.trim(), body: input.body.trim(), imageUrl, active: true })
        .returning();
      return row;
    }),

  /** Admin: edit text or switch a promotion on/off. */
  update: base
    .input(
      keySchema.extend({
        id: z.number(),
        title: z.string().max(120).optional(),
        body: z.string().max(1000).optional(),
        active: z.boolean().optional(),
      }),
    )
    .handler(async ({ input }) => {
      assertAdmin(input.key);
      const [row] = await db
        .update(schema.promotions)
        .set({
          ...(input.title !== undefined ? { title: input.title.trim() } : {}),
          ...(input.body !== undefined ? { body: input.body.trim() } : {}),
          ...(input.active !== undefined ? { active: input.active } : {}),
        })
        .where(eq(schema.promotions.id, input.id))
        .returning();
      if (!row) throw new ORPCError("NOT_FOUND", { message: "Promoción no encontrada" });
      return row;
    }),

  /** Admin: delete a promotion row. */
  remove: base
    .input(keySchema.extend({ id: z.number() }))
    .handler(async ({ input }) => {
      assertAdmin(input.key);
      await db.delete(schema.promotions).where(eq(schema.promotions.id, input.id));
      return { ok: true };
    }),
};
