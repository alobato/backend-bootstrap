import { CategoryService } from "../../services/CategoryService.js";
import { CreateCategorySchema, GetCategorySchema, SearchCategoriesSchema, UpdateCategorySchema, } from "../../services/schemas.js";
export function getCategories(_req, res) {
    CategoryService.getAllCategories()
        .then((categories) => res.json(categories))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function getCategoryById(req, res) {
    const parsed = GetCategorySchema.safeParse({ categoryId: Number(req.params.id) });
    if (!parsed.success) {
        return res.status(400).json({ error: "ID inválido", details: parsed.error.flatten() });
    }
    CategoryService.getCategory(parsed.data)
        .then((category) => category ? res.json(category) : res.status(404).json({ error: "Categoria não encontrada" }))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function searchCategories(req, res) {
    const query = req.query.q;
    const parsed = SearchCategoriesSchema.safeParse({ query: typeof query === "string" ? query : "" });
    if (!parsed.success) {
        return res.status(400).json({ error: "Query de busca inválida", details: parsed.error.flatten() });
    }
    CategoryService.searchCategories(parsed.data)
        .then((categories) => res.json(categories))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function createCategory(req, res) {
    const parsed = CreateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    CategoryService.createCategory(parsed.data)
        .then((category) => res.status(201).json(category))
        .catch((err) => res.status(500).json({ error: err.message }));
}
export function updateCategory(req, res) {
    const id = Number(req.params.id);
    const parsed = UpdateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    CategoryService.updateCategory(id, parsed.data)
        .then((category) => res.json(category))
        .catch((err) => {
        if (err.message.includes("not found"))
            return res.status(404).json({ error: err.message });
        return res.status(500).json({ error: err.message });
    });
}
//# sourceMappingURL=categories.js.map