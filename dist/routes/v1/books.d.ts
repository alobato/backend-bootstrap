import type { Request, Response } from "express";
export declare function getBooks(_req: Request, res: Response): void;
export declare function getBookById(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function searchBooks(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function createBook(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function updateBook(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function getBookAuthors(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function getBookCategories(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function addAuthorsToBook(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function removeAuthorsFromBook(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function addCategoriesToBook(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function removeCategoriesFromBook(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=books.d.ts.map