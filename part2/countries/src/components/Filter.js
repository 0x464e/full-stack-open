const Filter = ({setFilter, setSelectedCountry, setWeather}) => {
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setSelectedCountry(null);
        setWeather(null);
    }

    return (
        <div>
            find countries <input onChange={event => handleFilterChange(event)}/>
        </div>
    );
}


export default Filter;