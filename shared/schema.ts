import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const produtos = pgTable("produtos", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  marca: text("marca").notNull(),
  referencia: text("referencia").notNull(),
  custoCompra: text("custo_compra").notNull(),
  precoVenda: text("preco_venda").notNull(),
  dataCadastro: timestamp("data_cadastro").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProdutoSchema = z.object({
  nome: z.string(),
  marca: z.string(),
  referencia: z.string(),
  custoCompra: z.string(),
  precoVenda: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduto = z.infer<typeof insertProdutoSchema>;
export type Produto = typeof produtos.$inferSelect;
