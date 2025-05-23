import { users, produtos, type User, type InsertUser, type Produto, type InsertProduto } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface com métodos CRUD para usuários e produtos
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Métodos para o inventário de produtos
  getProdutos(): Promise<Produto[]>;
  getProduto(id: number): Promise<Produto | undefined>;
  createProduto(produto: InsertProduto): Promise<Produto>;
  deleteProduto(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getProdutos(): Promise<Produto[]> {
    return await db.select().from(produtos).orderBy(produtos.dataCadastro);
  }
  
  async getProduto(id: number): Promise<Produto | undefined> {
    const [produto] = await db.select().from(produtos).where(eq(produtos.id, id));
    return produto || undefined;
  }
  
  async createProduto(insertProduto: InsertProduto): Promise<Produto> {
    const [produto] = await db
      .insert(produtos)
      .values(insertProduto)
      .returning();
    return produto;
  }
  
  async deleteProduto(id: number): Promise<boolean> {
    const result = await db
      .delete(produtos)
      .where(eq(produtos.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
