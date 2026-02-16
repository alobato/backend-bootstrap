import type { Request, Response } from "express";
export declare function getPublishers(_req: Request, res: Response): void;
export declare function getPublisherById(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function searchPublishers(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function createPublisher(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function updatePublisher(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=publishers.d.ts.map