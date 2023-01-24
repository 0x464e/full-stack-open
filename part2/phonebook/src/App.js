import {useState, useEffect} from 'react'
import Filter from "./components/Filter";
import AddNewPerson from "./components/AddNewPerson";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import axios from "axios";
import personService from "./components/PersonService";

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        axios.get("/api/persons")
            .then(x => setPersons(x.data))
    }, []);

    // I'm supposed to keep this event handler here according to the instructions
    // but I don't really see why? I'd like to have it in the AddNewPerson component
    const addPerson = (event) => {
        event.preventDefault();
        if (newName === '' || newNumber === '') {
            alert('Name and number are required');
            return;
        }

        if (persons.find(person => person.name === newName)) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const person = persons.find(person => person.name === newName);
                personService.update(person.id, {name: newName, number: newNumber})
                    .then(x => {
                        setPersons(persons.map(y => y.id === x.id ? x : y))
                        setNotification({message: `Updated ${x.name}'s phone number`, color: "green"});
                        setTimeout(() => setNotification(null), 5000);
                    });
            }
            return;
        }

        const newPerson = {name: newName, number: newNumber};
        personService.add(newPerson).then(x => {
            setPersons(persons.concat(x));
            setNotification({message: `Added ${newPerson.name}`, color: "green"});
            setTimeout(() => setNotification(null), 5000);
        });

        setNewName('');
        setNewNumber('');
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification notification={notification}/>
            <Filter setFilter={setFilter}/>

            <h2>Add a new</h2>
            <AddNewPerson newName={newName}
                          newNumber={newNumber}
                          setNewName={setNewName}
                          setNewNumber={setNewNumber}
                          addPerson={addPerson}
            />

            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} setPersons={setPersons} setNotification={setNotification}/>
        </div>
    );
}

export default App