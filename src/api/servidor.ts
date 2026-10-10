import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = 9000;

app.use(express.json());

app.get('/api/saludo', (req: Request, res: Response) => {
    const nombre = (req.query.nombre as string) || 'Equipo';
    res.send(`¡Hola, ${nombre}! Saludos desde la API de Dulce Hogar.`);
});

app.listen(PORT,() => {
    console.log(`[API Dulce Hogar] Servidor backend escuchando en http://localhost:${PORT}`);
});
