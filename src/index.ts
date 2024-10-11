import express, {  Request, Response } from 'express';
import morgan from 'morgan';

type Datos = {
  id: number;
  name: string;
  number?: string;
};

let Datos=
[
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]
const app = express();
app.use(express.json());
//configurando morgan para que muestre el body al enviar un POST
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :ShowBody'));
morgan.token('ShowBody', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  } else {
    return ''
  }
})
// mostrando la lista de registros de mi agenda
app.get('/api/people', (req: Request, res: Response) => {
  res.json(Datos);
});

// mostrando la cantidad de registros de la agenda
app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`<p>Phonebook has info for ${Datos.length} people</p><p>${date.toString()}</p>`);
});

//mostrando datos de una persona de la agenda
app.get('/api/people/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const note = Datos.find((note) => note.id === Number(id));
  if (!note) {
    return res.status(404).json({
      message: `Note with id:${id} not found`,
    });
  }
  return res.json(note);
});
// eliminando una persona de la agenda
app.delete('/api/people/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  Datos = Datos.filter((dato) => dato.id !== Number(id));
  return res.status(204).end();
});

// creando un registro en la agenda
app.post('/api/people', (req, res) => {
  const dato = req.body;
  dato.id = Math.floor(Math.random()*1000 )+1;
 // condiciones de validacion
  if (!dato.name || !dato.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  }
  if (Datos.some((n) => n.name === dato.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
  Datos.push(dato);
  return res.status(201).json(dato);
});

// configurando puerto en 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
