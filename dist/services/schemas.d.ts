import { z } from "zod";
export declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GetUserBySubSchema: z.ZodObject<{
    sub: z.ZodString;
}, z.core.$strip>;
export declare const CreateAuthorSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    birthDate: z.ZodOptional<z.ZodString>;
    biography: z.ZodOptional<z.ZodString>;
    nationality: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateAuthorSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    birthDate: z.ZodOptional<z.ZodString>;
    biography: z.ZodOptional<z.ZodString>;
    nationality: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GetAuthorSchema: z.ZodObject<{
    authorId: z.ZodNumber;
}, z.core.$strip>;
export declare const SearchAuthorsSchema: z.ZodObject<{
    query: z.ZodString;
}, z.core.$strip>;
export declare const CreatePublisherSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdatePublisherSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GetPublisherSchema: z.ZodObject<{
    publisherId: z.ZodNumber;
}, z.core.$strip>;
export declare const SearchPublishersSchema: z.ZodObject<{
    query: z.ZodString;
}, z.core.$strip>;
export declare const CreateCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GetCategorySchema: z.ZodObject<{
    categoryId: z.ZodNumber;
}, z.core.$strip>;
export declare const SearchCategoriesSchema: z.ZodObject<{
    query: z.ZodString;
}, z.core.$strip>;
export declare const CreateBookSchema: z.ZodObject<{
    title: z.ZodString;
    isbn: z.ZodOptional<z.ZodString>;
    publicationDate: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    pageCount: z.ZodOptional<z.ZodNumber>;
    language: z.ZodOptional<z.ZodString>;
    publisherId: z.ZodOptional<z.ZodNumber>;
    authorIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export declare const UpdateBookSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodString>;
    publicationDate: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    pageCount: z.ZodOptional<z.ZodNumber>;
    language: z.ZodOptional<z.ZodString>;
    publisherId: z.ZodOptional<z.ZodNumber>;
    authorIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export declare const GetBookSchema: z.ZodObject<{
    bookId: z.ZodNumber;
}, z.core.$strip>;
export declare const SearchBooksSchema: z.ZodObject<{
    query: z.ZodString;
}, z.core.$strip>;
export declare const AddAuthorsToBookSchema: z.ZodObject<{
    bookId: z.ZodNumber;
    authorIds: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export declare const RemoveAuthorsFromBookSchema: z.ZodObject<{
    bookId: z.ZodNumber;
    authorIds: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export declare const AddCategoriesToBookSchema: z.ZodObject<{
    bookId: z.ZodNumber;
    categoryIds: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export declare const RemoveCategoriesFromBookSchema: z.ZodObject<{
    bookId: z.ZodNumber;
    categoryIds: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map