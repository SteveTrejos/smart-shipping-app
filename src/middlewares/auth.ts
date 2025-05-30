import type {Request, Response, NextFunction } from "express";


export function injectUserId(req: Request, res: Response, next: NextFunction) {
  if (
    req.user &&
    typeof req.user !== "string" &&
    req.body &&
    !req.body.id
  ) {
    req.body.id = req.user.id;
  }
  next();
}