import {useState, useEffect} from 'react'
import axios from "axios";
import Filter from "./components/Filter";
import CountrySearch from "./components/CountrySearch";
import Country from "./components/Country";

const API_KEY = process.env.REACT_APP_API_KEY;

const App = () => {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(x => setCountries(x.data));
    }, []);

    useEffect(() => {
        if (!selectedCountry)
            return;

        axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${selectedCountry.name.official}`)
            .then(x => setWeather(x.data));
    }, [selectedCountry]);

    return (
        <div>
            <Filter setFilter={setFilter} setSelectedCountry={setSelectedCountry} setWeather={setWeather}/>

            {!selectedCountry ?
                <CountrySearch countries={countries} filter={filter} setSelectedCountry={setSelectedCountry}/> :
                <Country country={selectedCountry}/>}

            {weather && <div>
                <h2>Weather in {selectedCountry.name.official}</h2>
                <div><b>temperature:</b> {weather.current.temp_c} °C</div>
                <img src={weather.current.condition.icon} alt={weather.current.condition.text}/>
                <div><b>wind:</b> {weather.current.wind_kph} km/h in direction {weather.current.wind_dir}</div>
            </div>}
        </div>
    );
}

export default App;
