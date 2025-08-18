import express from 'express';
import cors from 'cors'
import "dotenv/config";
import petRouter from './routes/pets.routes.js'
import userRouter from './routes/users.routes.js';
import requestRouter from './routes/request.routes.js';


app.use(cors({
  origin: 'https://uhm-front.netlify.app', // o '*' si estás en desarrollo
  credentials: true
}));


app.use(express.json())
app.use('/pets', petRouter);
app.use('/users', userRouter)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://uhm-front.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Responde al preflight
  }

  next();
});
const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
  console.log(`Escuchando puerto ${PORT}`);
});
export default app;