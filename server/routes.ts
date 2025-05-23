import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProdutoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());
  
  // Rotas para produtos
  app.get("/api/produtos", async (_req: Request, res: Response) => {
    try {
      const produtos = await storage.getProdutos();
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  app.get("/api/produtos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      
      const produto = await storage.getProduto(id);
      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      
      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  });

  app.post("/api/produtos", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertProdutoSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          error: "Dados de produto inválidos", 
          details: parsedBody.error 
        });
      }
      
      const produto = await storage.createProduto(parsedBody.data);
      res.status(201).json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  });

  app.delete("/api/produtos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      
      const deleted = await storage.deleteProduto(id);
      if (!deleted) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir produto" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
