import jwt from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader:  string | undefined = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token: string | undefined = authHeader.split(' ')[1];

  if(!token || token.length === 0) return res.status(401).json({message: 'No token found'});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if(!decoded || decoded.length === 0) return res.status(401).json({message: `Couldn't decode the token`});
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
