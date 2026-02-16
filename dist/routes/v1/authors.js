import { AuthorService } from "../../services/AuthorService.js";
import { CreateAuthorSchema, GetAuthorSchema, SearchAuthorsSchema, UpdateAuthorSchema, } from "../../services/schemas.js";
export function getAuthors(_req, res) {
    AuthorService.getAllAuthors()
        .then((authors) => res.json(authors))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function getAuthorById(req, res) {
    const parsed = GetAuthorSchema.safeParse({ authorId: Number(req.params.id) });
    if (!parsed.success) {
        return res.status(400).json({ error: "ID inválido", details: parsed.error.flatten() });
    }
    AuthorService.getAuthor(parsed.data)
        .then((author) => (author ? res.json(author) : res.status(404).json({ error: "Autor não encontrado" })))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function searchAuthors(req, res) {
    const query = req.query.q;
    const parsed = SearchAuthorsSchema.safeParse({ query: typeof query === "string" ? query : "" });
    if (!parsed.success) {
        return res.status(400).json({ error: "Query de busca inválida", details: parsed.error.flatten() });
    }
    AuthorService.searchAuthors(parsed.data)
        .then((authors) => res.json(authors))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function createAuthor(req, res) {
    const parsed = CreateAuthorSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    AuthorService.createAuthor(parsed.data)
        .then((author) => res.status(201).json(author))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function updateAuthor(req, res) {
    const id = Number(req.params.id);
    const parsed = UpdateAuthorSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    AuthorService.updateAuthor(id, parsed.data)
        .then((author) => res.json(author))
        .catch((err) => {
        if (err.message.includes("not found"))
            return res.status(404).json({ error: err.message });
        return res.status(500).json({ error: err.message });
    });
}
//# sourceMappingURL=authors.js.map