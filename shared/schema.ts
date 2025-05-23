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
  custoCompra: numeric("custo_compra", { precision: 10, scale: 2 }).notNull(),
  precoVenda: numeric("preco_venda", { precision: 10, scale: 2 }).notNull(),
  dataCadastro: timestamp("data_cadastro").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProdutoSchema = createInsertSchema(produtos).pick({
  nome: true,
  marca: true,
  referencia: true,
  custoCompra: true,
  precoVenda: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduto = z.infer<typeof insertProdutoSchema>;
export type Produto = typeof produtos.$inferSelect;
