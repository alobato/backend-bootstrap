import type { Request, Response } from "express";
import { PublisherService } from "../../services/PublisherService.js";
import {
  CreatePublisherSchema,
  GetPublisherSchema,
  SearchPublishersSchema,
  UpdatePublisherSchema,
} from "../../services/schemas.js";

export function getPublishers(_req: Request, res: Response) {
  PublisherService.getAllPublishers()
    .then((publishers) => res.json(publishers))
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function getPublisherById(req: Request, res: Response) {
  const parsed = GetPublisherSchema.safeParse({ publisherId: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "ID inválido", details: parsed.error.flatten() });
  }
  PublisherService.getPublisher(parsed.data)
    .then((publisher) =>
      publisher ? res.json(publisher) : res.status(404).json({ error: "Editora não encontrada" }),
    )
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function searchPublishers(req: Request, res: Response) {
  const query = req.query.q;
  const parsed = SearchPublishersSchema.safeParse({ query: typeof query === "string" ? query : "" });
  if (!parsed.success) {
    return res.status(400).json({ error: "Query de busca inválida", details: parsed.error.flatten() });
  }
  PublisherService.searchPublishers(parsed.data)
    .then((publishers) => res.json(publishers))
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function createPublisher(req: Request, res: Response) {
  const parsed = CreatePublisherSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
  }
  PublisherService.createPublisher(parsed.data)
    .then((publisher) => res.status(201).json(publisher))
    .catch((err) => res.status(500).json({ error: err.message }));
}

export function updatePublisher(req: Request, res: Response) {
  const id = Number(req.params.id);
  const parsed = UpdatePublisherSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
  }
  PublisherService.updatePublisher(id, parsed.data)
    .then((publisher) => res.json(publisher))
    .catch((err) => {
      if (err.message.includes("not found")) return res.status(404).json({ error: err.message });
      return res.status(500).json({ error: err.message });
    });
}
