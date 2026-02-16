import type { Request, Response } from "express";
export declare function getCategories(_req: Request, res: Response): void;
export declare function getCategoryById(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function searchCategories(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function createCategory(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function updateCategory(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=categories.d.ts.map