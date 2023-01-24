const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan((tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"), "-",
    tokens["response-time"](req, res), "ms",
    Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : ""
].join(" ")));

app.use(express.json());

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => response.json(data));

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = data.find(person => person.id === id);

    if (person)
        response.json(person);
    else
        response.status(404).end();
});

app.get("/info", (request, response) =>
    response.send(`<p>Phonebook has info for ${data.length} people</p> <p>${new Date()}</p>`));

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    data = data.filter(person => person.id !== id);

    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const person = request.body;

    if (!person.name || !person.number)
        return response.status(400).json({error: "missing name or number"});

    if (data.find(p => p.name === person.name))
        return response.status(400).json({error: "name must be unique"});

    person.id = Math.floor(Math.random() * 1234567);
    data = data.concat(person);

    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));