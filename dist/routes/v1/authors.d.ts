import type { Request, Response } from "express";
export declare function getAuthors(_req: Request, res: Response): void;
export declare function getAuthorById(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function searchAuthors(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function createAuthor(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function updateAuthor(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authors.d.ts.map