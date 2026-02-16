import { Router } from "express";
import * as authors from "./authors.js";
import * as books from "./books.js";
import * as categories from "./categories.js";
import * as publishers from "./publishers.js";
const router = Router();
// Authors
router.get("/authors", authors.getAuthors);
router.get("/authors/search", authors.searchAuthors);
router.get("/authors/:id", authors.getAuthorById);
router.post("/authors", authors.createAuthor);
router.patch("/authors/:id", authors.updateAuthor);
// Publishers
router.get("/publishers", publishers.getPublishers);
router.get("/publishers/search", publishers.searchPublishers);
router.get("/publishers/:id", publishers.getPublisherById);
router.post("/publishers", publishers.createPublisher);
router.patch("/publishers/:id", publishers.updatePublisher);
// Categories
router.get("/categories", categories.getCategories);
router.get("/categories/search", categories.searchCategories);
router.get("/categories/:id", categories.getCategoryById);
router.post("/categories", categories.createCategory);
router.patch("/categories/:id", categories.updateCategory);
// Books
router.get("/books", books.getBooks);
router.get("/books/search", books.searchBooks);
router.get("/books/:id", books.getBookById);
router.get("/books/:id/authors", books.getBookAuthors);
router.get("/books/:id/categories", books.getBookCategories);
router.post("/books", books.createBook);
router.patch("/books/:id", books.updateBook);
router.post("/books/:id/authors", books.addAuthorsToBook);
router.delete("/books/:id/authors", books.removeAuthorsFromBook);
router.post("/books/:id/categories", books.addCategoriesToBook);
router.delete("/books/:id/categories", books.removeCategoriesFromBook);
export default router;
//# sourceMappingURL=index.js.map