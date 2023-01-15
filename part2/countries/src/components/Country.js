const Country = ({country}) => (
    <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital[0]}</div>
        <div>area {country.area}</div>
        <h2>languages</h2>
        <ul>
            {Object.values(country.languages).map(x => <li key={x}>{x}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.name.common}/>
    </div>
)


export default Country;