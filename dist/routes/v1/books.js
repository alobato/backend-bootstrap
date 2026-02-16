import { BookService } from "../../services/BookService.js";
import { AddAuthorsToBookSchema, AddCategoriesToBookSchema, CreateBookSchema, GetBookSchema, RemoveAuthorsFromBookSchema, RemoveCategoriesFromBookSchema, SearchBooksSchema, UpdateBookSchema, } from "../../services/schemas.js";
export function getBooks(_req, res) {
    BookService.getAllBooks()
        .then((books) => res.json(books))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function getBookById(req, res) {
    const parsed = GetBookSchema.safeParse({ bookId: Number(req.params.id) });
    if (!parsed.success) {
        return res.status(400).json({ error: "ID inválido", details: parsed.error.flatten() });
    }
    BookService.getBook(parsed.data)
        .then((book) => (book ? res.json(book) : res.status(404).json({ error: "Livro não encontrado" })))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function searchBooks(req, res) {
    const query = req.query.q;
    const parsed = SearchBooksSchema.safeParse({ query: typeof query === "string" ? query : "" });
    if (!parsed.success) {
        return res.status(400).json({ error: "Query de busca inválida", details: parsed.error.flatten() });
    }
    BookService.searchBooks(parsed.data)
        .then((books) => res.json(books))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function createBook(req, res) {
    const parsed = CreateBookSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    BookService.createBook(parsed.data)
        .then((book) => res.status(201).json(book))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function updateBook(req, res) {
    const id = Number(req.params.id);
    const parsed = UpdateBookSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    BookService.updateBook(id, parsed.data)
        .then((book) => res.json(book))
        .catch((err) => {
        if (err.message.includes("not found"))
            return res.status(404).json({ error: err.message });
        return res.status(500).json({ error: err.message });
    });
}
export function getBookAuthors(req, res) {
    const bookId = Number(req.params.id);
    if (Number.isNaN(bookId)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    BookService.getBookAuthors(bookId)
        .then((authors) => res.json(authors))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function getBookCategories(req, res) {
    const bookId = Number(req.params.id);
    if (Number.isNaN(bookId)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    BookService.getBookCategories(bookId)
        .then((categories) => res.json(categories))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function addAuthorsToBook(req, res) {
    const parsed = AddAuthorsToBookSchema.safeParse({ ...req.body, bookId: Number(req.params.id) });
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    BookService.addAuthorsToBook(parsed.data)
        .then((result) => res.json(result))
        .catch((err) => {
        if (err.message.includes("not found"))
            return res.status(404).json({ error: err.message });
        return res.status(500).json({ error: err.message });
    });
}
export function removeAuthorsFromBook(req, res) {
    const parsed = RemoveAuthorsFromBookSchema.safeParse({ ...req.body, bookId: Number(req.params.id) });
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    BookService.removeAuthorsFromBook(parsed.data)
        .then((result) => res.json(result))
        .catch((err) => {
        if (err.message.includes("not found"))
            return res.status(404).json({ error: err.message });
        return res.status(500).json({ error: err.message });
    });
}
export function addCategoriesToBook(req, res) {
    const parsed = AddCategoriesToBookSchema.safeParse({ ...req.body, bookId: Number(req.params.id) });
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    BookService.addCategoriesToBook(parsed.data)
        .then((result) => res.json(result))
        .catch((err) => {
        if (err.message.includes("not found"))
            return res.status(404).json({ error: err.message });
        return res.status(500).json({ error: err.message });
    });
}
export function removeCategoriesFromBook(req, res) {
    const parsed = RemoveCategoriesFromBookSchema.safeParse({ ...req.body, bookId: Number(req.params.id) });
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    BookService.removeCategoriesFromBook(parsed.data)
        .then((result) => res.json(result))
        .catch((err) => {
        if (err.message.includes("not found"))
            return res.status(404).json({ error: err.message });
        return res.status(500).json({ error: err.message });
    });
}
//# sourceMappingURL=books.js.map