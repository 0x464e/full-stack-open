const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGODB_URI);

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    number: {
        type: String,
        minlength: 8,
        validate: (inp) => /(^\d{2,3}-\d+$)|(^\d+$)/.test(inp)
    }
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model("Person", personSchema);
