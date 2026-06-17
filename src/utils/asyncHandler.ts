import { Request, Response, NextFunction, RequestHandler } from "express";

function asyncHandler(func: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export default asyncHandler;