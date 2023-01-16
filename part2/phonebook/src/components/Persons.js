import PersonService from "./PersonService";

const Person = ({person, onDelete}) => {
    return (
        <div>
            {person.name} {person.number} <button onClick={() => onDelete(person)}>delete</button>
        </div>
    );
}

const Persons = ({persons, filter, setPersons}) => {
    const onDelete = (person) => {
        if (window.confirm(`Delete ${person.name}?`)) {
            PersonService.remove(person.id);
            setPersons(persons.filter(x => x.id !== person.id));
        }
    }

    return (
        <div>
            {persons.filter(x => new RegExp(filter, "i").test(x.name))
                .map(x => <Person key={x.id} person={x} onDelete={onDelete}/>)}
        </div>
    );
}

export default Persons;