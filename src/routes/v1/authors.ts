import type { Request, Response } from "express";
import { AuthorService } from "../../services/AuthorService.js";
import {
  CreateAuthorSchema,
  GetAuthorSchema,
  SearchAuthorsSchema,
  UpdateAuthorSchema,
} from "../../services/schemas.js";

export function getAuthors(_req: Request, res: Response) {
  AuthorService.getAllAuthors()
    .then((authors) => res.json(authors))
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function getAuthorById(req: Request, res: Response) {
  const parsed = GetAuthorSchema.safeParse({ authorId: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "ID inválido", details: parsed.error.flatten() });
  }
  AuthorService.getAuthor(parsed.data)
    .then((author) => (author ? res.json(author) : res.status(404).json({ error: "Autor não encontrado" })))
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function searchAuthors(req: Request, res: Response) {
  const query = req.query.q;
  const parsed = SearchAuthorsSchema.safeParse({ query: typeof query === "string" ? query : "" });
  if (!parsed.success) {
    return res.status(400).json({ error: "Query de busca inválida", details: parsed.error.flatten() });
  }
  AuthorService.searchAuthors(parsed.data)
    .then((authors) => res.json(authors))
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function createAuthor(req: Request, res: Response) {
  const parsed = CreateAuthorSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
  }
  AuthorService.createAuthor(parsed.data)
    .then((author) => res.status(201).json(author))
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function updateAuthor(req: Request, res: Response) {
  const id = Number(req.params.id);
  const parsed = UpdateAuthorSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
  }
  AuthorService.updateAuthor(id, parsed.data)
    .then((author) => res.json(author))
    .catch((err) => {
      if (err.message.includes("not found")) return res.status(404).json({ error: err.message });
      return res.status(500).json({ error: err.message });
    });
}
