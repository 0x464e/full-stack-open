require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(morgan((tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"), "-",
    tokens["response-time"](req, res), "ms",
    Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : ""
].join(" ")));

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (request, response) =>
    Person.find({}).then(persons => response.json(persons)));

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

    const newPerson = new Person({
        name: person.name,
        number: person.number
    });

    newPerson.save().then(x => response.json(x));
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));