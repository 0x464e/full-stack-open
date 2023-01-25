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

app.get("/api/persons/:id", (request, response, next) =>
    Person.findById(request.params.id).then(person => {
        if (person)
            response.json(person);
        else
            response.status(404).end();
    }).catch(error => next(error)));

app.get("/info", (request, response) =>
    Person.countDocuments({}).then(count =>
        response.send(`<p>Phonebook has info for ${count} people</p> <p>${new Date()}</p>`)));

app.delete("/api/persons/:id", (request, response, next) =>
    Person.findByIdAndRemove(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error)));

app.post("/api/persons", (request, response, next) => {
    const person = request.body;

    if (!person.name || !person.number)
        return response.status(400).json({ error: "missing name or number" });

    const newPerson = new Person({
        name: person.name,
        number: person.number
    });

    newPerson.save().then(x => response.json(x)).catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const newPerson = {
        name: request.body.name,
        number: request.body.number
    };

    Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
    console.error(error);

    if (error.name === "CastError")
        return response.status(400).send({ error: "malformatted id" });

    if (error.name === "ValidationError")
        return response.status(400).json({ error: error.message });

    next(error);
};

app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));