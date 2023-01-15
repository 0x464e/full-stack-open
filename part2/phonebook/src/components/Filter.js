const Filter = ({ setFilter }) => {
    return (
        <div>
            filter shown with <input
            onChange={(event) => setFilter(event.target.value)}/>
        </div>
    );
}

export default Filter;