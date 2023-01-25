require("dotenv").config();
const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];


mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const noteSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Note = mongoose.model("Person", noteSchema)

if (!name)
{
    Note.find({}).then(result => {
        console.log("Phonebook:");
        result.forEach(note => console.log(note.name, note.number));
        mongoose.connection.close();
    });
}
else
{
    const note = new Note({
        name: name,
        number: number
    });

    note.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}