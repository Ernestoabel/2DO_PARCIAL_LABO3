const cors = require('cors'); // Importa el paquete cors
const express = require('express');
const app = express();
const port = 3000;
 
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

let planetas = [
    { id: 1, nombre: 'Planeta Blanco', tamanio: 250000, masa: 150000, tipo: 'Rocoso', distancia: 50000, anillo: true, vida: false },
    { id: 2, nombre: 'Planeta Rojo', tamanio: 120000, masa: 80000, tipo: 'Gaseoso', distancia: 100000, anillo: false, vida: true },
    { id: 3, nombre: 'Planeta Gris', tamanio: 150000, masa: 120000, tipo: 'Helado', distancia: 200000, anillo: true, vida: false }
];

// Middleware para simular una demora de 3 segundos
const simulateDelay = (req, res, next) => {
    setTimeout(next, 2500);
};

/**
 * Obtiene todos los Planetas
 */
app.get('/planetas', simulateDelay, (req, res) => {
    res.json(planetas);
});

/**
 * Crea un nuevo Planeta
 */
app.post('/planetas', simulateDelay, (req, res) => {
    const { nombre, tamanio, masa, tipo, distancia, anillo, vida } = req.body;
    const nuevoPlaneta = {
        id: planetas.length + 1,
        nombre,
        tamanio,
        masa,
        tipo,
        distancia,
        anillo,
        vida
    };
    planetas.push(nuevoPlaneta);
    res.status(200).json(nuevoPlaneta);
});
/**
 * Obtiene Planeta por ID
 */
app.get('/planetas/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const planeta = planetas.find(p => p.id === id);
    if (planeta) {
        res.json(planeta);
    } else {
        res.status(404).send('Planeta no encontrado');
    }
});

/**
 * Edita Planeta por ID
 */
app.put('/planetas/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const index = planetas.findIndex(p => p.id === id);
    if (index !== -1) {
        const { nombre, tamanio, masa, tipo, distancia, anillo, vida } = req.body;
        const updatedPlaneta = {
            id,
            nombre,
            tamanio,
            masa,
            tipo,
            distancia,
            anillo,
            vida
        };
        planetas[index] = updatedPlaneta;
        res.json(updatedPlaneta);
    } else {
        res.status(404).send('Planeta no encontrado');
    }
});

/**
 * Elimina Planeta por ID
 */
app.delete('/planetas/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const index = planetas.findIndex(p => p.id === id);
    if (index !== -1) {
        planetas.splice(index, 1);
        res.status(200).send();
    } else {
        res.status(404).send('Planeta no encontrado');
    }
});

/**
 * Elimina todos los Planetas
 */
app.delete('/planetas', simulateDelay, (req, res) => {
    planetas = [];
    res.status(200).send('Todos los planetas han sido eliminados');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});