import {useState} from 'react'
import Filter from "./components/Filter";
import AddNewPerson from "./components/AddNewPerson";
import Persons from "./components/Persons";

const App = () => {
    const [persons, setPersons] = useState([
        {name: 'Arto Hellas', number: '123456789'}
    ])
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');

    // I'm supposed to keep this event handler here according to the instructions
    // but I don't really see why? I'd like to have it in the AddNewPerson component
    const addPerson = (event) => {
        event.preventDefault();
        if (newName === '' || newNumber === '') {
            alert('Name and number are required');
            return;
        }

        if (persons.find(person => person.name === newName)) {
            alert(`${newName} is already added to phonebook`);
            return;
        }

        setPersons(persons.concat({name: newName, number: newNumber}));
        setNewName('');
        setNewNumber('');
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter setFilter={setFilter}/>

            <h2>Add a new</h2>
            <AddNewPerson newName={newName}
                          newNumber={newNumber}
                          setNewName={setNewName}
                          setNewNumber={setNewNumber}
                          addPerson={addPerson}
            />

            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter}/>
        </div>
    );
}

export default App