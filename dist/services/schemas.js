import { z } from "zod";
// User Schemas
export const CreateUserSchema = z.object({
    name: z.string().describe("The name of the user"),
    email: z.string().email().describe("The email of the user"),
    password: z.string().min(6).describe("The password (will be hashed)"),
    role: z.string().optional().describe("The role of the user (default: user)"),
});
export const UpdateUserSchema = z.object({
    name: z.string().optional().describe("The name of the user"),
    email: z.string().email().optional().describe("The email of the user"),
    password: z.string().min(6).optional().describe("The password (will be hashed if provided)"),
    role: z.string().optional().describe("The role of the user"),
});
export const GetUserBySubSchema = z.object({
    sub: z.string().describe("The unique sub identifier for JWT. MUST be extracted from the token."),
});
// Author Schemas
export const CreateAuthorSchema = z.object({
    firstName: z.string().describe("The first name of the author"),
    lastName: z.string().describe("The last name of the author"),
    birthDate: z.string().optional().describe("The birth date of the author in ISO format"),
    biography: z.string().optional().describe("Biography of the author"),
    nationality: z.string().optional().describe("Nationality of the author"),
});
export const UpdateAuthorSchema = z.object({
    firstName: z.string().optional().describe("The first name of the author"),
    lastName: z.string().optional().describe("The last name of the author"),
    birthDate: z.string().optional().describe("The birth date of the author in ISO format"),
    biography: z.string().optional().describe("Biography of the author"),
    nationality: z.string().optional().describe("Nationality of the author"),
});
export const GetAuthorSchema = z.object({
    authorId: z.number().describe("The unique numeric ID of the author. MUST be extracted from the user request."),
});
export const SearchAuthorsSchema = z.object({
    query: z.string().describe("Search query for author name"),
});
// Publisher Schemas
export const CreatePublisherSchema = z.object({
    name: z.string().describe("The name of the publisher"),
    address: z.string().optional().describe("Address of the publisher"),
    city: z.string().optional().describe("City where the publisher is located"),
    country: z.string().optional().describe("Country where the publisher is located"),
    website: z.string().optional().describe("Website URL of the publisher"),
});
export const UpdatePublisherSchema = z.object({
    name: z.string().optional().describe("The name of the publisher"),
    address: z.string().optional().describe("Address of the publisher"),
    city: z.string().optional().describe("City where the publisher is located"),
    country: z.string().optional().describe("Country where the publisher is located"),
    website: z.string().optional().describe("Website URL of the publisher"),
});
export const GetPublisherSchema = z.object({
    publisherId: z.number().describe("The unique numeric ID of the publisher. MUST be extracted from the user request."),
});
export const SearchPublishersSchema = z.object({
    query: z.string().describe("Search query for publisher name"),
});
// Category Schemas
export const CreateCategorySchema = z.object({
    name: z.string().describe("The name of the category"),
    description: z.string().optional().describe("Optional description of the category"),
});
export const UpdateCategorySchema = z.object({
    name: z.string().optional().describe("The name of the category"),
    description: z.string().optional().describe("Optional description of the category"),
});
export const GetCategorySchema = z.object({
    categoryId: z.number().describe("The unique numeric ID of the category. MUST be extracted from the user request."),
});
export const SearchCategoriesSchema = z.object({
    query: z.string().describe("Search query for category name"),
});
// Book Schemas
export const CreateBookSchema = z.object({
    title: z.string().describe("The title of the book"),
    isbn: z.string().optional().describe("The ISBN of the book (13 characters)"),
    publicationDate: z.string().optional().describe("The publication date in ISO format"),
    price: z.string().optional().describe("The price of the book as a string (numeric with 2 decimal places)"),
    description: z.string().optional().describe("Description of the book"),
    pageCount: z.number().optional().describe("Number of pages in the book"),
    language: z.string().optional().describe("Language of the book"),
    publisherId: z.number().optional().describe("The ID of the publisher"),
    authorIds: z.array(z.number()).optional().describe("Array of author IDs for the book"),
    categoryIds: z.array(z.number()).optional().describe("Array of category IDs for the book"),
});
export const UpdateBookSchema = z.object({
    title: z.string().optional().describe("The title of the book"),
    isbn: z.string().optional().describe("The ISBN of the book (13 characters)"),
    publicationDate: z.string().optional().describe("The publication date in ISO format"),
    price: z.string().optional().describe("The price of the book as a string (numeric with 2 decimal places)"),
    description: z.string().optional().describe("Description of the book"),
    pageCount: z.number().optional().describe("Number of pages in the book"),
    language: z.string().optional().describe("Language of the book"),
    publisherId: z.number().optional().describe("The ID of the publisher"),
    authorIds: z.array(z.number()).optional().describe("Array of author IDs for the book"),
    categoryIds: z.array(z.number()).optional().describe("Array of category IDs for the book"),
});
export const GetBookSchema = z.object({
    bookId: z.number().describe("The unique numeric ID of the book. MUST be extracted from the user request."),
});
export const SearchBooksSchema = z.object({
    query: z.string().describe("Search query for book title, ISBN, or description"),
});
export const AddAuthorsToBookSchema = z.object({
    bookId: z.number().describe("The unique numeric ID of the book. MUST be extracted from the user request."),
    authorIds: z.array(z.number()).describe("Array of author IDs to add to the book"),
});
export const RemoveAuthorsFromBookSchema = z.object({
    bookId: z.number().describe("The unique numeric ID of the book. MUST be extracted from the user request."),
    authorIds: z.array(z.number()).describe("Array of author IDs to remove from the book"),
});
export const AddCategoriesToBookSchema = z.object({
    bookId: z.number().describe("The unique numeric ID of the book. MUST be extracted from the user request."),
    categoryIds: z.array(z.number()).describe("Array of category IDs to add to the book"),
});
export const RemoveCategoriesFromBookSchema = z.object({
    bookId: z.number().describe("The unique numeric ID of the book. MUST be extracted from the user request."),
    categoryIds: z.array(z.number()).describe("Array of category IDs to remove from the book"),
});
//# sourceMappingURL=schemas.js.map