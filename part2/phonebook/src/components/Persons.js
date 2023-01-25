import PersonService from "./PersonService";

const Person = ({person, onDelete}) => {
    return (
        <div>
            {person.name} {person.number} <button onClick={() => onDelete(person)}>delete</button>
        </div>
    );
}

const Persons = ({persons, filter, setPersons, setNotification}) => {
    const onDelete = (person) => {
        if (window.confirm(`Delete ${person.name}?`)) {
            setPersons(persons.filter(x => x.id !== person.id));
            PersonService.remove(person.id).then(() => {
                setNotification({message: `Information of ${person.name} has been removed from server`, color: "green"});
                setTimeout(() => setNotification(null), 5000);
            })
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