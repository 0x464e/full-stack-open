const SearchResults = ({countries, setSelectedCountry}) => (
    <div>
        {countries.map(x => <div key={x.cca3}>{x.name.common}{' '}
            <button onClick={() => setSelectedCountry(x)}>show</button>
        </div>)}
    </div>
);

const CountrySearch = ({countries, filter, setSelectedCountry}) => {
    const filteredCountries = countries.filter(x => new RegExp(filter, 'i').test(x.name.common));

    return (
        <div>
            {filteredCountries.length > 10 ? 'Too many matches, specify another filter' :
                <SearchResults countries={filteredCountries} setSelectedCountry={setSelectedCountry}/>}
        </div>
    )
}

export default CountrySearch;