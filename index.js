import express from 'express';
import cors from 'cors'
import "dotenv/config";
import petRouter from './routes/pets.routes.js'
import userRouter from './routes/users.routes.js';
import requestRouter from './routes/request.routes.js';

export const app = express(); //Export para que funcione Jest

app.use(cors({}));
app.use(express.json())
app.use('/pets', petRouter);
app.use('/users', userRouter)
app.use('/request', requestRouter)
app.use('/uploads', express.static('uploads'));


// Esto es para capturar los errores de subida de fotos
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'La imagen no puede superar los 5MB' });
    }
    return res.status(400).json({ message: 'Error de subida: ' + err.message });
  }

  return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Escuchando puerto ${PORT}`);
});