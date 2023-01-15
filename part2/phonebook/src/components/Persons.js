const Person = ({name, number}) => {
    return (
        <div>
            {name} {number}
        </div>
    );
}

const Persons = ({persons, filter}) => {
    return (
        <div>
            {persons.filter(x => new RegExp(filter, "i").test(x.name))
                .map(x => <Person key={x.name} name={x.name} number={x.number}/>)}
        </div>
    );
}

export default Persons;