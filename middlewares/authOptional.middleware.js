import jwt from 'jsonwebtoken';

export const authOptionalMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; 
    } catch (err) {
      console.warn('Token inválido, se continúa sin usuario');
    }
  }

  // Si no hay token o es inválido, simplemente continúa
  next();
};
